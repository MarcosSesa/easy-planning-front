import { ChangeDetectionStrategy, Component, effect, inject, input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TripUseCase } from 'app/domain/use-cases/trip.use-case';
import { TripDto } from 'app/data/dto/trip/trip.dto';
import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  TripDaysByIdResponseDto,
  TripDaysByTripIdResponseDto,
} from 'app/data/dto/trip-day/trip-days.dto';
import {
  TuiAlertService,
  TuiAutoColorPipe,
  TuiDialogService,
  TuiIcon,
  TuiInitialsPipe,
} from '@taiga-ui/core';
import { Router } from '@angular/router';
import { TUI_CONFIRM, TuiAvatar, TuiAvatarStack, TuiConfirmData } from '@taiga-ui/kit';
import { catchError, filter, switchMap } from 'rxjs';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { EditTripDialog } from './components/edit-trip-dialog/edit-trip-dialog.component';
import {
  ActivityFormData,
  ActivityFormDialog,
} from './components/actvity-form-dialog/actvity-form-dialog';
import { CreateTripFormInterface } from 'app/entities/interfaces/create-trip.interface';
import { ActivityDto } from 'app/data/dto/activity/activity.dto';
import { SortActivitiesByTimePipe } from 'app/presentation/pipes/sort-activities-by-time.pipe';
import { EncodeURIPipe } from 'app/presentation/pipes/encode-uri.pipe';
import { AddMemberDialog } from 'app/presentation/pages/trip-detail/components/add-member-dialog/add-member-dialog';
import { MemberRepository } from 'app/data/repositories/member.repository';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MemberUseCase } from 'app/domain/use-cases/member.use-case';
import { AuthUseCase } from 'app/domain/use-cases/auth.use-case';

@Component({
  selector: 'app-trip-detail-page.component',
  imports: [
    DatePipe,
    TitleCasePipe,
    TuiIcon,
    SortActivitiesByTimePipe,
    EncodeURIPipe,
    TuiAvatarStack,
    TuiAutoColorPipe,
    TuiAvatar,
    TuiAvatarStack,
    TuiInitialsPipe,
    TranslatePipe,
  ],
  templateUrl: './trip-detail-page.component.html',
  styleUrl: './trip-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripDetailPageComponent {
  readonly #tripUseCase = inject(TripUseCase);
  readonly #authUseCase = inject(AuthUseCase);
  readonly #memberUseCase = inject(MemberUseCase);
  readonly #alertService = inject(TuiAlertService);
  readonly #router = inject(Router);
  readonly #dialogService = inject(TuiDialogService);
  readonly #translate = inject(TranslateService);

  // This input came from route param. Is automatically bind by angular when we define the route with :tripId param
  tripId = input.required<string>();

  protected readonly userId: Signal<string | undefined> = toSignal(this.#authUseCase.userId$);
  protected readonly trip: Signal<TripDto | undefined> = toSignal(this.#tripUseCase.tripById$);
  protected readonly day: Signal<TripDaysByIdResponseDto | undefined> = toSignal(
    this.#tripUseCase.tripDayById$,
  );
  protected readonly tripDays: Signal<TripDaysByTripIdResponseDto[] | undefined> = toSignal(
    this.#tripUseCase.tripDaysByTripId$,
  );

  private readonly _onTripIdChange = effect(() => {
    const id = this.tripId();
    if (!id) {
      return;
    }
    this.#tripUseCase.setTripId(id);
  });

  protected setSelectedDay(id: string) {
    this.#tripUseCase.setTripDayId(id);
  }

  protected deleteTrip(tripId: string) {
    const data: TuiConfirmData = {
      yes: this.#translate.instant('PAGES.TRIP_DETAIL.DELETE_BUTTON'),
      no: this.#translate.instant('PAGES.TRIP_DETAIL.CANCEL_BUTTON_CONFIRM'),
    };

    this.#dialogService
      .open<boolean>(TUI_CONFIRM, {
        size: 's',
        label: this.#translate.instant('PAGES.TRIP_DETAIL.DELETE_TRIP_CONFIRM_LABEL'),
        data,
      })
      .pipe(filter(Boolean))
      .subscribe((_result) =>
        this.#tripUseCase.deleteTrip(tripId).subscribe({
          next: () => {
            this.#alertService
              .open('', {
                label: this.#translate.instant('PAGES.TRIP_DETAIL.TRIP_DELETED_SUCCESS'),
                autoClose: 3000,
                appearance: 'positive',
              })
              .subscribe();
            this.#router.navigate(['my-trips']);
          },
          error: (err) => {
            this.#alertService
              .open('', {
                label: err.message,
                autoClose: 3000,
                appearance: 'negative',
              })
              .subscribe();
          },
        }),
      );
  }

  protected editTrip(tripData: TripDto) {
    this.#dialogService
      .open<CreateTripFormInterface & { id: string }>(new PolymorpheusComponent(EditTripDialog), {
        size: 'm',
        data: tripData,
      })
      .pipe(
        switchMap((result) => this.#tripUseCase.updateTrip(result.id, result)),
        switchMap(() => {
          this.#tripUseCase.reloadTrip();
          return this.#alertService.open('', {
            label: this.#translate.instant('PAGES.TRIP_DETAIL.TRIP_UPDATED_SUCCESS'),
            autoClose: 3000,
            appearance: 'positive',
          });
        }),
        catchError((err) => {
          this.#alertService
            .open('', {
              label: err.message,
              autoClose: 3000,
              appearance: 'negative',
            })
            .subscribe();
          return [];
        }),
      )
      .subscribe();
  }

  protected createOrEditActivity(activity?: ActivityDto) {
    const selectedDay = this.day();
    const tripId = this.tripId();
    if (!selectedDay || !tripId) return;

    const mode = activity ? 'edit' : 'create';
    const dialogData = activity
      ? { mode, activity, selectedDayId: selectedDay.id, tripId }
      : { mode };

    this.#dialogService
      .open<ActivityFormData>(new PolymorpheusComponent(ActivityFormDialog), {
        size: 'l',
        data: dialogData,
      })
      .subscribe((data: ActivityFormData) => {
        this.#tripUseCase.createActivity(tripId, selectedDay, data).subscribe({
          next: () => {
            const labelKey = activity
              ? 'PAGES.TRIP_DETAIL.ACTIVITY_UPDATED_SUCCESS'
              : 'PAGES.TRIP_DETAIL.ACTIVITY_CREATED_SUCCESS';
            this.#alertService
              .open('', {
                label: this.#translate.instant(labelKey),
                autoClose: 3000,
                appearance: 'positive',
              })
              .subscribe();
          },
          error: (err) => {
            this.#alertService
              .open('', {
                label:
                  err.message || this.#translate.instant('PAGES.TRIP_DETAIL.ACTIVITY_CREATE_ERROR'),
                autoClose: 3000,
                appearance: 'negative',
              })
              .subscribe();
          },
        });
      });
  }

  protected addMember() {
    const tripId = this.tripId();
    if (!tripId) {
      return;
    }

    this.#dialogService
      .open<string>(new PolymorpheusComponent(AddMemberDialog))
      .subscribe((email) => {
        this.#memberUseCase.inviteMember({ email, tripId }).subscribe({
          next: () => {
            this.#alertService
              .open('', {
                label: this.#translate.instant('PAGES.TRIP_DETAIL.INVITATION_SENT_SUCCESS'),
                autoClose: 3000,
                appearance: 'positive',
              })
              .subscribe();
          },
          error: (error) => {
            console.log(error.status);
            this.#alertService
              .open('', {
                label:
                  error.status === 401
                    ? this.#translate.instant('PAGES.TRIP_DETAIL.EMAIL_NOT_PERMISION_ERROR')
                    : this.#translate.instant('PAGES.TRIP_DETAIL.EMAIL_NOT_EXISTS_ERROR'),
                autoClose: 3000,
                appearance: 'negative',
              })
              .subscribe();
          },
        });
      });
  }

  protected deleteActivity(activityId: string, clickEvent: PointerEvent) {
    clickEvent.stopPropagation();
    const selectedDay = this.day();
    const tripId = this.tripId();
    if (!selectedDay || !tripId) return;

    const data: TuiConfirmData = {
      yes: this.#translate.instant('PAGES.TRIP_DETAIL.DELETE_BUTTON'),
      no: this.#translate.instant('PAGES.TRIP_DETAIL.CANCEL_BUTTON_CONFIRM'),
    };

    this.#dialogService
      .open<boolean>(TUI_CONFIRM, {
        size: 's',
        label: this.#translate.instant('PAGES.TRIP_DETAIL.DELETE_ACTIVITY_CONFIRM_LABEL'),
        data,
      })
      .pipe(
        filter(Boolean),
        switchMap(() => this.#tripUseCase.deleteActivity(tripId, selectedDay.id, activityId)),
      )
      .subscribe({});
  }
}

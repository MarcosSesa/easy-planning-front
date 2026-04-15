import { injectContext } from '@taiga-ui/polymorpheus';
import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core/components/dialog';
import { ActivityDto } from 'app/data/dto/activity/activity.dto';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import {
  TuiButton,
  TuiDialogService,
  TuiIcon,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import { TuiTextarea, TuiTextareaLimit, TuiInputTime } from '@taiga-ui/kit';
import { TuiTime } from '@taiga-ui/cdk/date-time';
import { timeRangeValidator } from 'app/presentation/utils/time-range.validator';
import { TripUseCase } from 'app/domain/use-cases/trip.use-case';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Subscription, switchMap, tap } from 'rxjs';

interface ActivityDialogData {
  mode: 'create' | 'edit';
  activity?: ActivityDto;
  tripId: string;
  selectedDayId: string;
}

export interface ActivityFormData {
  id?: string;
  title: string;
  description: string;
  location: string;
  startTime: TuiTime;
  endTime: TuiTime;
}

@Component({
  selector: 'app-actvity-form-dialog',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    TuiTextfieldDirective,
    TuiTextfieldOptionsDirective,
    TuiButton,
    TuiTextarea,
    TuiTextfieldComponent,
    TuiTextareaLimit,
    TuiInputTime,
    TuiIcon,
  ],
  templateUrl: './actvity-form-dialog.html',
  styleUrl: './actvity-form-dialog.scss',
})
export class ActivityFormDialog implements OnInit {
  readonly #tripUseCase = inject(TripUseCase);
  readonly #dialogService = inject(TuiDialogService);

  #activityChangeSub: Subscription | null = null;

  protected readonly context =
    injectContext<TuiDialogContext<ActivityFormData, ActivityDialogData>>();
  protected data = this.context.data;

  protected readonly activityForm = new FormGroup(
    {
      title: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
      description: new FormControl<string>('', [Validators.maxLength(500)]),
      location: new FormControl<string>('', [Validators.maxLength(100)]),
      startTime: new FormControl<TuiTime | null>(null, [Validators.required]),
      endTime: new FormControl<TuiTime | null>(null, [Validators.required]),
    },
    { validators: timeRangeValidator },
  );

  protected readonly headerKey = computed(() =>
    this.data.mode === 'edit'
      ? 'PAGES.TRIP_DETAIL.ACTIVITY_DIALOG.TITLE_EDIT'
      : 'PAGES.TRIP_DETAIL.ACTIVITY_DIALOG.TITLE_CREATE',
  );

  protected readonly buttonKey = computed(() =>
    this.data.mode === 'edit'
      ? 'PAGES.TRIP_DETAIL.ACTIVITY_DIALOG.UPDATE_BUTTON'
      : 'PAGES.TRIP_DETAIL.ACTIVITY_DIALOG.CREATE_BUTTON',
  );

  ngOnInit() {
    const activity = this.data.activity;
    if (this.data.mode === 'edit' && activity) {
      this.#pathFormValue(activity);

      this.#activityChangeSub = this.#tripUseCase
        .listenToActivityIdChanges(this.data.tripId, this.data.selectedDayId, activity.id)
        .pipe(
          tap((updatedActivity) => {
            // Dont use the open() return observable because never emiting on close if no component is passed; TaigaUI ERROR;
            this.#dialogService
              .open(
                'Parece que alguien ha actualizado esta actividad mientras la editabas. ¿Quieres recargar los datos?',
                { label: 'Ups...', size: 's', data: { button: 'Actualizar' }, closeable: false },
              )
              .subscribe();
            this.#pathFormValue(updatedActivity);
          }),
        )
        .subscribe();
    }
  }

  protected onSubmit(event: Event) {
    event.preventDefault();
    this.activityForm.markAllAsTouched();

    if (this.activityForm.invalid) return;

    const formValue = this.activityForm.getRawValue() as ActivityFormData;
    if (this.data.activity) {
      formValue.id = this.data.activity.id;
    }
    if (this.#activityChangeSub) this.#activityChangeSub.unsubscribe();
    this.context.completeWith(formValue);
  }

  #pathFormValue(activity: ActivityDto) {
    const startDate = new Date(activity.startTime);
    const endDate = new Date(activity.endTime);
    this.activityForm.patchValue({
      title: activity.title,
      description: activity.description || '',
      location: activity.location || '',
      startTime: new TuiTime(startDate.getHours(), startDate.getMinutes()),
      endTime: new TuiTime(endDate.getHours(), endDate.getMinutes()),
    });
  }
}

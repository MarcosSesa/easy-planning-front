import { Component, effect, inject, input, Signal } from '@angular/core';
import { TripDayUseCase } from 'app/domain/use-cases/trip-day.use-case';
import { toSignal } from '@angular/core/rxjs-interop';
import { TripUseCase } from 'app/domain/use-cases/trip.use-case';
import { TripDto } from 'app/data/dto/trip/trip.dto';
import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  TripDaysByIdResponseDto,
  TripDaysByTripIdResponseDto,
} from 'app/data/dto/trip-day/trip-days.dto';
import { TuiAlertService, TuiDialogService, TuiIcon } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { TUI_CONFIRM, TuiConfirmData } from '@taiga-ui/kit';
import { filter } from 'rxjs';

@Component({
  selector: 'app-trip-detail-page.component',
  imports: [DatePipe, TitleCasePipe, TuiIcon],
  templateUrl: './trip-detail-page.component.html',
  styleUrl: './trip-detail-page.component.scss',
})
export class TripDetailPageComponent {
  readonly #tripDayUseCase = inject(TripDayUseCase);
  readonly #tripUseCase = inject(TripUseCase);
  readonly #alertService = inject(TuiAlertService);
  readonly #router = inject(Router);
  readonly #dialogService = inject(TuiDialogService);

  // This input came from route param. Is automatically bind by angular when we define the route with :tripId param
  tripId = input.required<string>();

  protected readonly trip: Signal<TripDto | undefined> = toSignal(this.#tripUseCase.tripById$);
  protected readonly day: Signal<TripDaysByIdResponseDto | undefined> = toSignal(
    this.#tripDayUseCase.tripDayById$,
  );
  protected readonly tripDays: Signal<TripDaysByTripIdResponseDto[] | undefined> = toSignal(
    this.#tripDayUseCase.tripDaysByTripId$,
  );

  private readonly _onTripIdChange = effect(() => {
    const id = this.tripId();
    if (!id) return; // Just to be sure, not strictly necessary
    this.#tripDayUseCase.setTripId(id);
    this.#tripUseCase.setTripId(id);
  });

  protected setSelectedDay(id: string) {
    this.#tripDayUseCase.setTripDayId(id);
  }

  protected deleteTrip(tripId: string) {
    const data: TuiConfirmData = {
      yes: 'Borrar',
      no: 'Cancelar',
    };

    this.#dialogService
      .open<boolean>(TUI_CONFIRM, {
        size: 's',
        label: '¿Estás seguro de que quieres borrar este viaje? Esta acción no se puede deshacer.',
        data,
      })
      .pipe(filter(Boolean))
      .subscribe((_result) =>
        this.#tripUseCase.deleteTrip(tripId).subscribe({
          next: () => {
            this.#alertService
              .open('', {
                label: `Viaje borrado`,
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
                appearance: 'positive',
              })
              .subscribe();
          },
        }),
      );
  }
}

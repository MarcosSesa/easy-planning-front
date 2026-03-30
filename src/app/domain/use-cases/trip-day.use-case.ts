import { inject, Injectable } from '@angular/core';
import { TripDayRepository } from 'app/data/repositories/trip-day.repository';
import { BehaviorSubject, combineLatest, filter, map, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripDayUseCase {
  readonly #tripDayRepository = inject(TripDayRepository);

  readonly #tripId = new BehaviorSubject<string | null>(null);
  readonly #tripDayId = new BehaviorSubject<string | null>(null);

  tripDaysByTripId$ = this.#tripId.asObservable().pipe(
    filter(Boolean),
    switchMap((tripId) => this.#tripDayRepository.getTripDaysByTripId(tripId)),
    map((tripDays) => tripDays.data),
    tap((tripDays) => this.setTripDayId(tripDays[0].id)),
  );

  tripDayById$ = combineLatest({
    tripId: this.#tripId.asObservable().pipe(filter(Boolean)),
    dayId: this.#tripDayId.asObservable().pipe(filter(Boolean)),
  }).pipe(
    switchMap(({ tripId, dayId }) => this.#tripDayRepository.getTripDayById(tripId, dayId)),
    map((day) => day.data),
  );

  setTripId(tripId: string) {
    this.#tripId.next(tripId);
  }

  setTripDayId(dayId: string) {
    this.#tripDayId.next(dayId);
  }
}

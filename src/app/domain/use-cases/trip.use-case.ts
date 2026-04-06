import { inject, Injectable } from '@angular/core';
import { TripRepository } from 'app/data/repositories/trip.repository';
import { CreateTripFormInterface } from 'app/entities/interfaces/create-trip.interface';
import {
  BehaviorSubject,
  filter,
  map,
  switchMap,
  combineLatest,
  tap,
  share,
  shareReplay,
} from 'rxjs';
import { TripStatus } from 'app/presentation/pages/my-trips/my-trips-page.component';
import { TripDayRepository } from 'app/data/repositories/trip-day.repository';

@Injectable({
  providedIn: 'root',
})
export class TripUseCase {
  readonly #tripRepository = inject(TripRepository);
  readonly #tripDayRepository = inject(TripDayRepository);

  readonly #tripStatusFilter = new BehaviorSubject<TripStatus | null>(null);
  readonly #tripId = new BehaviorSubject<string | null>(null);
  readonly #tripDayId = new BehaviorSubject<string | null>(null);
  readonly #realoadTrip = new BehaviorSubject<void>(undefined);

  userTrips$ = this.#tripStatusFilter.asObservable().pipe(
    switchMap((status) => this.#tripRepository.getUserTrips(status)),
    map((trips) => trips.data),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  tripById$ = combineLatest([this.#tripId.asObservable(), this.#realoadTrip.asObservable()]).pipe(
    filter(([tripId, _reaload]) => Boolean(tripId)),
    switchMap(([tripId, _reaload]) => this.#tripRepository.getTripById(tripId as string)),
    map((trip) => trip.data),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  tripDaysByTripId$ = combineLatest([
    this.#tripId.asObservable(),
    this.#realoadTrip.asObservable(),
  ]).pipe(
    filter(([tripId, _reaload]) => Boolean(tripId)),
    switchMap(([tripId, _reaload]) =>
      this.#tripDayRepository.getTripDaysByTripId(tripId as string),
    ),
    map((tripDays) => tripDays.data),
    tap((tripDays) => this.setTripDayId(tripDays[0].id)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  tripDayById$ = combineLatest({
    tripId: this.#tripId.asObservable().pipe(filter(Boolean)),
    dayId: this.#tripDayId.asObservable().pipe(filter(Boolean)),
  }).pipe(
    switchMap(({ tripId, dayId }) => this.#tripDayRepository.getTripDayById(tripId, dayId)),
    map((day) => day.data),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  createTrip(trip: CreateTripFormInterface) {
    const startDate = new Date(
      Date.UTC(trip.dateRange.from.year, trip.dateRange.from.month, trip.dateRange.from.day),
    );
    const endDate = new Date(
      Date.UTC(trip.dateRange.to.year, trip.dateRange.to.month, trip.dateRange.to.day),
    );

    return this.#tripRepository.createTrip({
      title: trip.location,
      description: trip.description,
      startDate,
      endDate,
    });
  }

  updateTrip(tripId: string, trip: CreateTripFormInterface) {
    const startDate = new Date(
      Date.UTC(trip.dateRange.from.year, trip.dateRange.from.month, trip.dateRange.from.day),
    );
    const endDate = new Date(
      Date.UTC(trip.dateRange.to.year, trip.dateRange.to.month, trip.dateRange.to.day),
    );

    return this.#tripRepository.updateTrip(tripId, {
      title: trip.location,
      description: trip.description,
      startDate,
      endDate,
    });
  }

  deleteTrip(tripId: string) {
    return this.#tripRepository.deleteTrip(tripId);
  }

  setTipStatusFilter(status: TripStatus | null) {
    this.#tripStatusFilter.next(status);
  }

  setTripId(tripId: string) {
    this.#tripId.next(tripId);
  }

  setTripDayId(dayId: string) {
    this.#tripDayId.next(dayId);
  }

  reloadTrip() {
    this.#realoadTrip.next();
  }
}

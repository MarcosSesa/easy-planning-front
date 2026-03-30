import { inject, Injectable } from '@angular/core';
import { TripRepository } from 'app/data/repositories/trip.repository';
import { CreateTripFormInterface } from 'app/entities/interfaces/create-trip.interface';
import { BehaviorSubject, filter, map, switchMap } from 'rxjs';
import { TripStatus } from 'app/presentation/pages/my-trips/my-trips-page.component';

@Injectable({
  providedIn: 'root',
})
export class TripUseCase {
  readonly #tripRepository = inject(TripRepository);

  readonly #tripStatusFilter = new BehaviorSubject<TripStatus | null>(null);
  readonly #tripId = new BehaviorSubject<string | null>(null);

  userTrips$ = this.#tripStatusFilter.asObservable().pipe(
    switchMap((status) => this.#tripRepository.getUserTrips(status)),
    map((trips) => trips.data),
  );

  tripById$ = this.#tripId.asObservable().pipe(
    filter(Boolean),
    switchMap((tripId) => this.#tripRepository.getTripById(tripId)),
    map((trip) => trip.data),
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

  deleteTrip(tripId: string) {
    return this.#tripRepository.deleteTrip(tripId);
  }

  setTipStatusFilter(status: TripStatus | null) {
    this.#tripStatusFilter.next(status);
  }

  setTripId(tripId: string) {
    this.#tripId.next(tripId);
  }
}

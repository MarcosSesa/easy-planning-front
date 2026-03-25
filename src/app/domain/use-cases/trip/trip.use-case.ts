import { inject, Injectable } from '@angular/core';
import { TripRepository } from 'app/data/repositories/trip/trip.repository';
import { CreateTripFormInterface } from 'app/entities/interfaces/create-trip.interface';

@Injectable({
  providedIn: 'root',
})
export class TripUseCase {
  readonly #tripRepository = inject(TripRepository);

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
}

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
  shareReplay,
  Subject,
} from 'rxjs';
import { TripStatus } from 'app/presentation/pages/my-trips/my-trips-page.component';
import { TripDayRepository } from 'app/data/repositories/trip-day.repository';
import { formatDayToDate } from 'app/presentation/utils/format-date';
import { ActivityRepository } from 'app/data/repositories/activity.repository';
import type { ActivityFormData } from 'app/presentation/pages/trip-detail/components/actvity-form-dialog/actvity-form-dialog';
import { UpdateActivityDto } from 'app/data/dto/activity/update-activity.dto';
import { TripDaysByIdResponseDto } from 'app/data/dto/trip-day/trip-days.dto';
import { GeminiRepository } from 'app/data/repositories/gemini.repository';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class TripUseCase {
  readonly #tripRepository = inject(TripRepository);
  readonly #tripDayRepository = inject(TripDayRepository);
  readonly #activityRepository = inject(ActivityRepository);
  readonly #geminiRepository = inject(GeminiRepository);

  readonly #tripStatusFilter = new Subject<TripStatus | null>();
  readonly #tripId = new Subject<string | null>();
  readonly #tripDayId = new Subject<string | null>();
  readonly #reloadTrip = new BehaviorSubject<void>(undefined);
  readonly #reloadDay = new BehaviorSubject<void>(undefined);
  readonly #reloadUserTrips = new BehaviorSubject<void>(undefined);

  userTrips$ = combineLatest([
    this.#tripStatusFilter.asObservable(),
    this.#reloadUserTrips.asObservable(),
  ]).pipe(
    switchMap(([status, _]) => this.#tripRepository.getUserTrips(status)),
    map((trips) => trips.data),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  tripById$ = combineLatest([this.#tripId.asObservable(), this.#reloadTrip.asObservable()]).pipe(
    filter(([tripId, _reaload]) => Boolean(tripId)),
    switchMap(([tripId, _reaload]) => this.#tripRepository.getTripById(tripId as string)),
    map((trip) => trip.data),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  tripDaysByTripId$ = combineLatest([
    this.#tripId.asObservable(),
    this.#reloadTrip.asObservable(),
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
    reload: this.#reloadDay.asObservable(),
  }).pipe(
    switchMap(({ tripId, dayId }) => this.#tripDayRepository.getTripDayById(tripId, dayId)),
    map((day) => day.data),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private readonly _onDayChangeListenEffect$ = toSignal(
    combineLatest({
      tripId: this.#tripId.asObservable().pipe(filter(Boolean)),
      dayId: this.#tripDayId.asObservable().pipe(filter(Boolean)),
    }).pipe(
      switchMap(({ tripId, dayId }) => this.#tripDayRepository.listenToDayUpdates(tripId, dayId)),
      tap(() => this.reloadDay()),
    ),
  );

  createTrip(trip: CreateTripFormInterface) {
    const startDate = formatDayToDate(trip.dateRange.from);
    const endDate = formatDayToDate(trip.dateRange.to);
    return this.#tripRepository.createTrip({
      title: trip.location,
      description: trip.description,
      startDate,
      endDate,
    });
  }

  generateTrip(trip: CreateTripFormInterface) {
    const startDate = formatDayToDate(trip.dateRange.from);
    const endDate = formatDayToDate(trip.dateRange.to);
    return this.#geminiRepository.createTripByAi({
      title: trip.location,
      description: trip.description,
      startDate,
      endDate,
    });
  }

  updateTrip(tripId: string, trip: CreateTripFormInterface) {
    const startDate = formatDayToDate(trip.dateRange.from);
    const endDate = formatDayToDate(trip.dateRange.to);
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

  deleteActivity(tripId: string, dayId: string, activityId: string) {
    return this.#activityRepository
      .deleteActivity(tripId, dayId, activityId)
      .pipe(tap(() => this.reloadDay()));
  }

  createActivity(tripId: string, tripDay: TripDaysByIdResponseDto, activityData: ActivityFormData) {
    const date = new Date(tripDay.date);
    const startDate = new Date(date);
    startDate.setHours(activityData.startTime.hours, activityData.startTime.minutes, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(activityData.endTime.hours, activityData.endTime.minutes, 0, 0);
    const body: UpdateActivityDto = {
      ...(activityData.id && { activityId: activityData.id }),
      title: activityData.title,
      description: activityData.description || '',
      location: activityData.location || '',
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    };
    return this.#activityRepository
      .createOrUpdateActivity(tripId, tripDay.id, body)
      .pipe(tap(() => this.reloadDay()));
  }

  listenToActivityIdChanges(tripId: string, dayId: string, activityId: string) {
    return this.#activityRepository.listenToActivityUpdates(tripId, dayId, activityId);
  }

  // SETTERS

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
    this.#reloadTrip.next();
  }
  reloadDay() {
    this.#reloadDay.next();
  }
  reloadUserTrips() {
    this.#reloadUserTrips.next();
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment';
import { BaseResponse } from 'app/data/dto/common/base-response.dto';
import {
  TripDaysByIdResponseDto,
  TripDaysByTripIdResponseDto,
} from 'app/data/dto/trip-day/trip-days.dto';
import { of } from 'rxjs';
import { createEventStream } from 'app/presentation/utils/observable-event-source';
import { ActivityDto } from 'app/data/dto/activity/activity.dto';

@Injectable({
  providedIn: 'root',
})
export class TripDayRepository {
  readonly #url = environment.easyPlaningsBackUrl;
  readonly #httpClient = inject(HttpClient);

  getTripDaysByTripId(tripId: string) {
    return this.#httpClient.get<BaseResponse<TripDaysByTripIdResponseDto[]>>(
      `${this.#url}/${tripId}/days`,
    );
  }

  getTripDayById(tripId: string, dayId: string) {
    return this.#httpClient.get<BaseResponse<TripDaysByIdResponseDto>>(
      `${this.#url}/${tripId}/days/${dayId}`,
    );
  }

  listenToDayUpdates(tripId: string, dayId: string) {
    const url = `${this.#url}/${tripId}/days/${dayId}/stream`;
    return createEventStream<ActivityDto>(url, 'tripDayUpdated');
  }
}

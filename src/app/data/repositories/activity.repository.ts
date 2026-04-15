import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { BaseResponse } from '../dto/common/base-response.dto';
import { UpdateActivitiesBodyDto, UpdateActivityDto } from '../dto/activity/update-activity.dto';
import { Observable } from 'rxjs';
import { ActivityDto } from 'app/data/dto/activity/activity.dto';
import { EventSourcePolyfill } from 'event-source-polyfill';

@Injectable({
  providedIn: 'root',
})
export class ActivityRepository {
  readonly #url = environment.easyPlaningsBackUrl;
  readonly #httpClient = inject(HttpClient);

  createOrUpdateActivities(tripId: string, dayId: string, body: UpdateActivitiesBodyDto) {
    return this.#httpClient.post<BaseResponse<any>>(
      `${this.#url}/${tripId}/days/${dayId}/activities/update-activities`,
      body,
    );
  }

  createOrUpdateActivity(tripId: string, dayId: string, body: UpdateActivityDto) {
    return this.#httpClient.post<BaseResponse<any>>(
      `${this.#url}/${tripId}/days/${dayId}/activities/upsert-activity`,
      body,
    );
  }

  deleteActivity(tripId: string, dayId: string, activityId: string) {
    return this.#httpClient.delete<BaseResponse<any>>(
      `${this.#url}/${tripId}/days/${dayId}/activities/${activityId}/delete-activity`,
    );
  }

  listenToActivityUpdates(tripId: string, dayId: string, activityId: string) {
    const url = `${this.#url}/${tripId}/days/${dayId}/activities/${activityId}/stream`;
    const token = localStorage.getItem('token');

    return new Observable<ActivityDto>((observer) => {
      const eventSource = new EventSourcePolyfill(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      eventSource.addEventListener('activityUpdated' as any, (event: MessageEvent) =>
        observer.next(JSON.parse(event.data)),
      );

      eventSource.onerror = (error) => observer.error(error);

      return () => eventSource.close();
    });
  }
}

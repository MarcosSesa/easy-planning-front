import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { BaseResponse } from '../dto/common/base-response.dto';
import { LoginUserBodyDto } from '../dto/user/login-user.dto';
import { RegisterUserBodyDto } from '../dto/user/register-user.dto';
import { UpdateActivitiesBodyDto, UpdateActivityDto } from '../dto/activity/update-activity.dto';

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
      `${this.#url}/${tripId}/days/${dayId}/activities/${activityId}`,
    );
  }
}

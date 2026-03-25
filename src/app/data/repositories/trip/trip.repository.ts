import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment';
import { UpdateCreateTripBodyDto } from 'app/data/dto/trip/update-create-trip.dto';
import { BaseResponse } from 'app/data/dto/common/base-response.dto';
import { TripDto } from 'app/data/dto/trip/trip.dto';

@Injectable({
  providedIn: 'root',
})
export class TripRepository {
  readonly #url = environment.easyPlaningsBackUrl;
  readonly #httpClient = inject(HttpClient);

  createTrip(body: UpdateCreateTripBodyDto) {
    return this.#httpClient.post<BaseResponse<TripDto>>(`${this.#url}/trip/create`, body);
  }
}

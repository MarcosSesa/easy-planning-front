import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment';
import { LoginUserBodyDto } from 'app/data/dto/user/login-user.dto';
import { BaseResponse } from 'app/data/dto/common/base-response.dto';
import { RegisterUserBodyDto } from 'app/data/dto/user/register-user.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  readonly #url = environment.easyPlaningsBackUrl;
  readonly #httpClient = inject(HttpClient);

  getUserLogged(body: LoginUserBodyDto) {
    return this.#httpClient.post<BaseResponse<string>>(`${this.#url}/auth/login`, body);
  }

  getUserRegister(body: RegisterUserBodyDto) {
    return this.#httpClient.post<BaseResponse<string>>(`${this.#url}/auth/register`, body);
  }
}

import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginUserBodyInterface } from 'app/entities/interfaces/login.interface';
import { AuthRepository } from 'app/data/repositories/auth/auth.repository';
import { RegisterUserBodyInterface } from 'app/entities/interfaces/register.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthUseCase {
  readonly #authRepository = inject(AuthRepository);

  readonly #isLogged = new BehaviorSubject<boolean>(Boolean(this.token));

  isLogged = this.#isLogged.asObservable();

  get token() {
    return localStorage.getItem('token');
  }

  get tokenClaims() {
    return this.token ? jwtDecode(this.token) : null;
  }

  logout() {
    this.#setToken(null);
    this.#isLogged.next(false);
  }

  login = (user: LoginUserBodyInterface) =>
    this.#authRepository.getUserLogged(user).pipe(tap((response) => this.#setToken(response.data)));

  register = (user: RegisterUserBodyInterface) =>
    this.#authRepository
      .getUserRegister(user)
      .pipe(tap((response) => this.#setToken(response.data)));

  #setToken(token: string | null) {
    if (token) {
      localStorage.setItem('token', token);
      this.#isLogged.next(true);
    } else {
      localStorage.removeItem('token');
    }
  }
}

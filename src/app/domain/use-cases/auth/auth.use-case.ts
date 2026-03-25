import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginUserBodyInterface } from 'app/entities/interfaces/login.interface';
import { AuthRepository } from 'app/data/repositories/auth/auth.repository';
import { RegisterUserBodyInterface } from 'app/entities/interfaces/register.interface';
import { Router } from '@angular/router';
import { JwtDecodedInterface } from 'app/entities/interfaces/jwt-decoded.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthUseCase {
  readonly #authRepository = inject(AuthRepository);
  readonly #router = inject(Router);

  readonly #isLogged = new BehaviorSubject<boolean>(Boolean(this.token));
  readonly #tokenClaims = new BehaviorSubject(this.tokenClaims);

  isLogged$ = this.#isLogged.asObservable();
  tokenClaims$ = this.#tokenClaims.asObservable();
  isLogged = this.#isLogged.getValue();

  get token() {
    return localStorage.getItem('token');
  }

  get tokenClaims() {
    return this.token ? jwtDecode<JwtDecodedInterface>(this.token) : null;
  }

  logout() {
    this.#setToken(null);
    this.#isLogged.next(false);
    this.#router.navigate(['/']);
  }

  login(user: LoginUserBodyInterface) {
    return this.#authRepository.getUserLogged(user).pipe(
      tap((response) => this.#setToken(response.data)),
      map((response) => jwtDecode<JwtDecodedInterface>(response.data)),
    );
  }

  register(user: RegisterUserBodyInterface) {
    return this.#authRepository.getUserRegister(user).pipe(
      tap((response) => this.#setToken(response.data)),
      map((response) => jwtDecode<JwtDecodedInterface>(response.data)),
    );
  }

  #setToken(token: string | null) {
    if (token) {
      localStorage.setItem('token', token);
      this.#isLogged.next(true);
    } else {
      localStorage.removeItem('token');
    }
  }
}

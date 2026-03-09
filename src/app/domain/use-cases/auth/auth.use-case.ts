import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthUseCase {
  #isLogged = new BehaviorSubject<boolean>(Boolean(this.token));
  isLogged = this.#isLogged.asObservable();

  get token() {
    return localStorage.getItem('token');
  }

  get tokenClaims() {
    return this.token ? jwtDecode(this.token): null;
  }

  logout() {
    this.#setToken(null);
    this.#isLogged.next(false);
  }

  #setToken(token: string | null) {
    if (!token) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', token);
    }
  }
}

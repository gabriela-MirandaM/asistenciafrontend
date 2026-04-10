import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthStore } from './auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.API_URL || 'http://localhost:8000';
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authStore: AuthStore
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<any>(`${this.API_URL}/api/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          this.storeTokens(response.accessToken, response.refreshToken);
        })
      );
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<any>(`${this.API_URL}/api/auth/refresh`, { refreshToken })
      .pipe(
        tap((response) => {
          this.storeTokens(response.accessToken, response.refreshToken);
        })
      );
  }

  logoutFromBackend() {
    return this.http.post(`${this.API_URL}/api/auth/logout`, {
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
    });
  }

  logout(): void {
    this.logoutFromBackend().subscribe({
      next: () => {
        this.clearSession();
      },
      error: (err) => {
        console.warn('Error al hacer logout en backend', err);
        this.clearSession(); // igual limpiamos localmente
      },
    });
  }

  private clearSession(): void {
    this.authStore.clearTokens();
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  storeTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}

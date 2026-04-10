import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private accessToken = signal<string | null>(
    sessionStorage.getItem(this.ACCESS_TOKEN_KEY)
  );
  private refreshToken = signal<string | null>(
    sessionStorage.getItem(this.REFRESH_TOKEN_KEY)
  );

  readonly isLoggedIn = computed(() => !!this.accessToken());

  setTokens(access: string, refresh: string) {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, access);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refresh);
    this.accessToken.set(access);
    this.refreshToken.set(refresh);
  }

  clearTokens() {
    sessionStorage.clear();
    this.accessToken.set(null);
    this.refreshToken.set(null);
  }

  getAccessToken() {
    return this.accessToken();
  }

  getRefreshToken() {
    return this.refreshToken();
  }
}

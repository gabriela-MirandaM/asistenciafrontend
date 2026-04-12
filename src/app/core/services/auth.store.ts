import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private accessToken = signal<string | null>(null);
  private refreshToken = signal<string | null>(null);

  readonly isLoggedIn = computed(() => !!this.accessToken());

  constructor() {
    this.syncTokensFromStorage();
  }

  private syncTokensFromStorage() {
    this.accessToken.set(sessionStorage.getItem(this.ACCESS_TOKEN_KEY));
    this.refreshToken.set(sessionStorage.getItem(this.REFRESH_TOKEN_KEY));
  }

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
    const token = this.accessToken() ?? sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (token && token !== this.accessToken()) {
      this.accessToken.set(token);
    }
    return token;
  }

  getRefreshToken() {
    const token = this.refreshToken() ?? sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (token && token !== this.refreshToken()) {
      this.refreshToken.set(token);
    }
    return token;
  }
}

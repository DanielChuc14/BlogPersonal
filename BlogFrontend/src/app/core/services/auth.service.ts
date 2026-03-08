import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResult, LoginRequest, RegisterRequest } from '../models/auth.model';
import { SecureStorageService } from './secure-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';

  private _token: string | null = null;

  constructor(
    private http: HttpClient,
    private secureStorage: SecureStorageService
  ) {
    this.restoreToken();
  }

  login(payload: LoginRequest): Observable<AuthResult> {
    return this.http
      .post<AuthResult>(`${environment.apiBaseUrl}/Account/Login`, payload)
      .pipe(
        switchMap(res => {
          if (res.result && res.token) {
            return from(this.saveToken(res.token)).pipe(switchMap(() => of(res)));
          }
          return of(res);
        })
      );
  }

  register(payload: RegisterRequest): Observable<AuthResult> {
    return this.http
      .post<AuthResult>(`${environment.apiBaseUrl}/Account/Register`, payload)
      .pipe(
        switchMap(res => {
          if (res.result && res.token) {
            return from(this.saveToken(res.token)).pipe(switchMap(() => of(res)));
          }
          return of(res);
        })
      );
  }

  forgotPassword(email: string): Observable<{ message: string; token?: string; email?: string }> {
    return this.http.post<{ message: string; token?: string; email?: string }>(
      `${environment.apiBaseUrl}/Account/ForgotPassword`,
      { email }
    );
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<AuthResult> {
    return this.http.post<AuthResult>(
      `${environment.apiBaseUrl}/Account/ResetPassword`,
      { email, token, newPassword }
    );
  }

  getToken(): string | null {
    return this._token;
  }

  isLoggedIn(): boolean {
    return this._token !== null;
  }

  logout(): void {
    this._token = null;
    this.secureStorage.removeItem(this.TOKEN_KEY);
  }

  private async saveToken(token: string): Promise<void> {
    this._token = token;
    await this.secureStorage.setItem(this.TOKEN_KEY, token);
  }

  private restoreToken(): void {
    const stored = localStorage.getItem(this.TOKEN_KEY);
    if (stored) {
      this._token = stored;
    }
  }
}

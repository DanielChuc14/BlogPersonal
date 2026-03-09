import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResult, LoginRequest, RegisterRequest } from '../models/auth.model';
import { SecureStorageService } from './secure-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_token';
  private readonly EMAIL_KEY = 'email_token';

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
        tap(res => {
          console.log(res);
          if (res.result && res.token) this.saveToken(res.token);
          if (res.result && res.user) this.saveUserToken(res.user);
          if (res.result && res.userEmail) this.saveEmailToken(res.userEmail);
        })
      );
  }

  register(payload: RegisterRequest): Observable<AuthResult> {
    return this.http
      .post<AuthResult>(`${environment.apiBaseUrl}/Account/Register`, payload)
      .pipe(
        tap(res => {
          if (res.result && res.token) this.saveToken(res.token);
          if (res.result && res.user) this.saveUserToken(res.user);
          if (res.result && res.userEmail) this.saveEmailToken(res.userEmail);
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
    this.secureStorage.clear();
  }

  private saveToken(token: string): void {
    this._token = token;
    this.secureStorage.setItem(this.TOKEN_KEY, token);
  }
  private saveUserToken(token: string): void {
    this.secureStorage.setItem(this.USER_KEY, token);
  }
  private saveEmailToken(token: string): void {
    this.secureStorage.setItem(this.EMAIL_KEY, token);
  }

  private restoreToken(): void {
    const token = this.secureStorage.getItem<string>(this.TOKEN_KEY);
    if (token) this._token = token;
  }
}

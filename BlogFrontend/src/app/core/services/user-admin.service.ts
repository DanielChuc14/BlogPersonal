import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserSummary, UserDetail, PagedUsers } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  private readonly url = `${environment.apiBaseUrl}/Users`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, pageSize = 20): Observable<PagedUsers> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<PagedUsers>(this.url, { params });
  }

  getById(id: string): Observable<UserDetail> {
    return this.http.get<UserDetail>(`${this.url}/${id}`);
  }

  create(body: { email: string; password: string; roles?: string[] }): Observable<any> {
    return this.http.post(this.url, body);
  }

  update(id: string, body: { email?: string; userName?: string }): Observable<any> {
    return this.http.put(`${this.url}/${id}`, body);
  }

  lock(id: string, body?: { until?: string; reason?: string }): Observable<any> {
    return this.http.post(`${this.url}/${id}/lock`, body ?? {});
  }

  unlock(id: string): Observable<any> {
    return this.http.post(`${this.url}/${id}/unlock`, {});
  }

  resetPassword(id: string): Observable<any> {
    return this.http.post(`${this.url}/${id}/password/reset`, {});
  }

  assignRoles(id: string, roles: string[]): Observable<any> {
    return this.http.post(`${this.url}/${id}/roles`, { roles });
  }

  removeRole(id: string, role: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}/roles/${role}`);
  }
}

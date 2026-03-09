import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Permission } from '../models/permission.model';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly url = `${environment.apiBaseUrl}/Permissions`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.url);
  }

  getById(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.url}/${id}`);
  }

  create(body: { name: string; description?: string }): Observable<Permission> {
    return this.http.post<Permission>(this.url, body);
  }

  update(id: number, body: { name?: string; description?: string }): Observable<Permission> {
    return this.http.put<Permission>(`${this.url}/${id}`, body);
  }

  delete(id: number, force = false): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, { params: { force: String(force) } });
  }

  assign(body: { permissionName: string; targetType: string; targetId: string }): Observable<any> {
    return this.http.post(`${this.url}/assign`, body);
  }

  unassign(body: { permissionName: string; targetType: string; targetId: string }): Observable<any> {
    return this.http.post(`${this.url}/unassign`, body);
  }
}

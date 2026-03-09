import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly url = `${environment.apiBaseUrl}/Roles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(this.url);
  }

  getById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.url}/${id}`);
  }

  create(name: string): Observable<Role> {
    return this.http.post<Role>(this.url, { name });
  }

  update(id: string, name: string): Observable<Role> {
    return this.http.put<Role>(`${this.url}/${id}`, { name });
  }

  delete(id: string, force = false): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, { params: { force: String(force) } });
  }

  getPermissions(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/${id}/permissions`);
  }

  addPermissions(id: string, permissions: string[]): Observable<any> {
    return this.http.post(`${this.url}/${id}/permissions`, { permissions });
  }

  removePermission(id: string, permissionName: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}/permissions/${permissionName}`);
  }
}

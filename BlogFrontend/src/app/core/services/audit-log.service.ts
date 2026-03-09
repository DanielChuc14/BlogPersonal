import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuditLog, PagedResult } from '../models/audit-log.model';

export interface AuditFilters {
  actorUserId?: string;
  action?: string;
  targetType?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly url = `${environment.apiBaseUrl}/Audit`;

  constructor(private http: HttpClient) {}

  getAll(filters: AuditFilters = {}): Observable<PagedResult<AuditLog>> {
    let params = new HttpParams();
    if (filters.actorUserId) params = params.set('actorUserId', filters.actorUserId);
    if (filters.action) params = params.set('action', filters.action);
    if (filters.targetType) params = params.set('targetType', filters.targetType);
    if (filters.from) params = params.set('from', filters.from);
    if (filters.to) params = params.set('to', filters.to);
    if (filters.page != null) params = params.set('page', filters.page);
    if (filters.pageSize != null) params = params.set('pageSize', filters.pageSize);
    return this.http.get<PagedResult<AuditLog>>(this.url, { params });
  }

  getById(id: number): Observable<AuditLog> {
    return this.http.get<AuditLog>(`${this.url}/${id}`);
  }
}

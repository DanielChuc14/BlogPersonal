import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tag } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagService {
  private readonly url = `${environment.apiBaseUrl}/Tags`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.url);
  }

  getById(id: number): Observable<Tag> {
    return this.http.get<Tag>(`${this.url}/${id}`);
  }

  create(tag: Partial<Tag>): Observable<Tag> {
    return this.http.post<Tag>(this.url, tag);
  }

  update(id: number, tag: Partial<Tag>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, { ...tag, id });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

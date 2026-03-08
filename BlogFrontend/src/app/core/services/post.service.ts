import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post, PostCategory, PostTag } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly url = `${environment.apiBaseUrl}/Posts`;
  private readonly categoriesUrl = `${environment.apiBaseUrl}/PostCategories`;
  private readonly tagsUrl = `${environment.apiBaseUrl}/PostTags`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.url);
  }

  getById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.url}/${id}`);
  }

  create(post: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(this.url, post);
  }

  update(id: number, post: Partial<Post>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, { ...post, id });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // PostCategories
  getPostCategories(): Observable<PostCategory[]> {
    return this.http.get<PostCategory[]>(this.categoriesUrl);
  }

  addCategory(postId: number, categoryId: number): Observable<PostCategory> {
    return this.http.post<PostCategory>(this.categoriesUrl, { postId, categoryId });
  }

  removeCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoriesUrl}/${id}`);
  }

  // PostTags
  getPostTags(): Observable<PostTag[]> {
    return this.http.get<PostTag[]>(this.tagsUrl);
  }

  addTag(postId: number, tagId: number): Observable<PostTag> {
    return this.http.post<PostTag>(this.tagsUrl, { postId, tagId });
  }

  removeTag(id: number): Observable<void> {
    return this.http.delete<void>(`${this.tagsUrl}/${id}`);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { CategoryService } from '../../core/services/category.service';
import { TagService } from '../../core/services/tag.service';
import { Post, PostCategory, PostTag } from '../../core/models/post.model';
import { Category } from '../../core/models/category.model';
import { Tag } from '../../core/models/tag.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-posts',
  standalone: false,
  templateUrl: './posts.component.html'
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  categories: Category[] = [];
  tags: Tag[] = [];
  postCategories: PostCategory[] = [];
  postTags: PostTag[] = [];
  displayedColumns = ['title', 'status', 'categories', 'tags', 'actions'];
  loading = false;

  constructor(
    private postService: PostService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    forkJoin({
      posts: this.postService.getAll(),
      categories: this.categoryService.getAll(),
      tags: this.tagService.getAll(),
      postCategories: this.postService.getPostCategories(),
      postTags: this.postService.getPostTags()
    }).subscribe({
      next: ({ posts, categories, tags, postCategories, postTags }) => {
        this.posts = posts;
        this.categories = categories;
        this.tags = tags;
        this.postCategories = postCategories;
        this.postTags = postTags;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getCategoryNames(postId: number): string {
    const ids = this.postCategories.filter(pc => pc.postId === postId).map(pc => pc.categoryId);
    return this.categories.filter(c => ids.includes(c.id)).map(c => c.name).join(', ') || '-';
  }

  getTagNames(postId: number): string {
    const ids = this.postTags.filter(pt => pt.postId === postId).map(pt => pt.tagId);
    return this.tags.filter(t => ids.includes(t.id)).map(t => t.name).join(', ') || '-';
  }

  newPost(): void {
    this.router.navigate(['/admin/posts/new']);
  }

  editPost(id: number): void {
    this.router.navigate(['/admin/posts/edit', id]);
  }

  deletePost(id: number): void {
    if (!confirm('¿Eliminar este post?')) return;
    this.postService.delete(id).subscribe(() => this.loadAll());
  }

  getStatusLabel(status?: number): string {
    switch (status) {
      case 1: return 'Publicado';
      case 0: return 'Borrador';
      default: return '-';
    }
  }
}

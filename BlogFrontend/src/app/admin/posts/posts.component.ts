import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { CategoryService } from '../../core/services/category.service';
import { TagService } from '../../core/services/tag.service';
import { Post, PostCategory, PostTag } from '../../core/models/post.model';
import { Category } from '../../core/models/category.model';
import { Tag } from '../../core/models/tag.model';
import { forkJoin } from 'rxjs';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

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
  alertMessage = '';
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'info';

  constructor(
    private postService: PostService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private router: Router,
    private confirm: ConfirmDialogService
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
      error: () => {
        this.loading = false;
        this.alertType = 'danger';
        this.alertMessage = 'Failed to load posts.';
      }
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

  deletePost(post: Post): void {
    this.confirm.open({
      title: 'Delete Post',
      message: `Delete post <strong>${post.title}</strong>? This cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      icon: 'delete_forever'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.postService.delete(post.id).subscribe({
        next: () => {
          this.alertType = 'success';
          this.alertMessage = `Post "${post.title}" deleted successfully.`;
          this.loadAll();
        },
        error: () => {
          this.alertType = 'danger';
          this.alertMessage = 'Failed to delete post.';
        }
      });
    });
  }

  getStatusLabel(status?: number): string {
    switch (status) {
      case 1: return 'Published';
      case 0: return 'Draft';
      default: return '-';
    }
  }
}

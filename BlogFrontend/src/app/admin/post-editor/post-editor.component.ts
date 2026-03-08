import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PostService } from '../../core/services/post.service';
import { Post } from '../../core/models/post.model';

@Component({
  selector: 'app-post-editor',
  standalone: false,
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.scss'
})
export class PostEditorComponent implements OnInit {
  posts: Post[] = [];
  form: FormGroup;
  loading = false;
  saving = false;
  editingId: number | null = null;
  displayedColumns = ['id', 'title', 'actions'];

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void { this.loadPosts(); }

  loadPosts(): void {
    this.loading = true;
    this.postService.getAll().subscribe({
      next: (posts) => { this.posts = posts; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const data: Post = { id: this.editingId ?? 0, ...this.form.value };

    const action: Observable<unknown> = this.editingId
      ? this.postService.update(this.editingId, data)
      : this.postService.create(data);

    action.subscribe({
      next: () => { this.resetForm(); this.loadPosts(); this.saving = false; },
      error: () => { this.saving = false; }
    });
  }

  edit(post: Post): void {
    this.editingId = post.id;
    this.form.patchValue({ title: post.title, content: post.content });
  }

  delete(id: number): void {
    if (!confirm('Delete this post?')) return;
    this.postService.delete(id).subscribe(() => this.loadPosts());
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset();
  }
}

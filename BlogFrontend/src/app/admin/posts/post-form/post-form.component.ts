import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PostService } from '../../../core/services/post.service';
import { CategoryService } from '../../../core/services/category.service';
import { TagService } from '../../../core/services/tag.service';
import { Post, PostCategory, PostTag } from '../../../core/models/post.model';
import { Category } from '../../../core/models/category.model';
import { Tag } from '../../../core/models/tag.model';
import { SecureStorageService } from '../../../core/services/secure-storage.service';

@Component({
  selector: 'app-post-form',
  standalone: false,
  templateUrl: './post-form.component.html'
})
export class PostFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  postId?: number;
  loading = false;
  saving = false;
  errorMessage = '';
  IdUser : string = "";
  categories: Category[] = [];
  tags: Tag[] = [];
  existingPostCategories: PostCategory[] = [];
  existingPostTags: PostTag[] = [];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private route: ActivatedRoute,
    private router: Router,
    private secureStorage: SecureStorageService 
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      extract: [''],
      content: ['', [Validators.required, Validators.minLength(10)]],
      status: [0],
      categoryIds: [[]],
      tagIds: [[]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.IdUser = this.secureStorage.getItem("user_token") ?? "";
    forkJoin({
      categories: this.categoryService.getAll(),
      tags: this.tagService.getAll(),
      postCategories: this.postService.getPostCategories(),
      postTags: this.postService.getPostTags()
    }).pipe(
      switchMap(({ categories, tags, postCategories, postTags }) => {
        this.categories = categories;
        this.tags = tags;
        this.existingPostCategories = postCategories;
        this.existingPostTags = postTags;

        if (id) {
          this.isEdit = true;
          this.postId = +id;
          return this.postService.getById(this.postId);
        }
        return of(null);
      })
    ).subscribe({
      next: (post: Post | null) => {
        if (post && this.postId) {
          const catIds = this.existingPostCategories
            .filter(pc => pc.postId === this.postId)
            .map(pc => pc.categoryId);
          const tagIds = this.existingPostTags
            .filter(pt => pt.postId === this.postId)
            .map(pt => pt.tagId);

          this.form.patchValue({
            title: post.title,
            extract: post.extract ?? '',
            content: post.content ?? '',
            status: post.status ?? 0,
            categoryIds: catIds,
            tagIds: tagIds
          });
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load post data. Please go back and try again.';
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.errorMessage = '';

    const { title, extract, content, status, categoryIds, tagIds } = this.form.value;
    const postData: Partial<Post> = { title, extract, content, status,userId: this.IdUser };
    
    const savePost$: Observable<any> = this.isEdit && this.postId
      ? this.postService.update(this.postId, postData)
      : this.postService.create(postData);

    savePost$.pipe(
      switchMap((result: any) => {
        const savedId: number = this.isEdit ? this.postId! : result?.id;

        if (!savedId) return of(null);

        // Sync categories
        const currentCatRelations = this.existingPostCategories.filter(pc => pc.postId === savedId);
        const currentCatIds = currentCatRelations.map(pc => pc.categoryId);
        const toAddCats = (categoryIds as number[]).filter(id => !currentCatIds.includes(id));
        const toRemoveCats = currentCatRelations.filter(pc => !(categoryIds as number[]).includes(pc.categoryId));

        // Sync tags
        const currentTagRelations = this.existingPostTags.filter(pt => pt.postId === savedId);
        const currentTagIds = currentTagRelations.map(pt => pt.tagId);
        const toAddTags = (tagIds as number[]).filter(id => !currentTagIds.includes(id));
        const toRemoveTags = currentTagRelations.filter(pt => !(tagIds as number[]).includes(pt.tagId));

        const catAdds$ = toAddCats.map(catId => this.postService.addCategory(savedId, catId));
        const catRemoves$ = toRemoveCats.map(pc => this.postService.removeCategory(pc.id));
        const tagAdds$ = toAddTags.map(tagId => this.postService.addTag(savedId, tagId));
        const tagRemoves$ = toRemoveTags.map(pt => this.postService.removeTag(pt.id));

        const ops = [...catAdds$, ...catRemoves$, ...tagAdds$, ...tagRemoves$];
        return ops.length > 0 ? forkJoin(ops) : of(null);
      })
    ).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/posts']);
      },
      error: () => {
        this.saving = false;
        this.errorMessage = this.isEdit ? 'Failed to update post.' : 'Failed to create post.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/posts']);
  }
}

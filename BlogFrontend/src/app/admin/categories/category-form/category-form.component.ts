import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: false,
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  categoryId?: number;
  loading = false;
  saving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.categoryId = +id;
      this.loading = true;
      this.categoryService.getById(this.categoryId).subscribe({
        next: cat => {
          this.form.patchValue({ name: cat.name, description: cat.description ?? '' });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Failed to load category data. Please go back and try again.';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.errorMessage = '';

    const save$: Observable<any> = this.isEdit && this.categoryId
      ? this.categoryService.update(this.categoryId, this.form.value)
      : this.categoryService.create(this.form.value);

    save$.subscribe({
      next: () => { this.saving = false; this.router.navigate(['/admin/categories']); },
      error: () => {
        this.saving = false;
        this.errorMessage = this.isEdit ? 'Failed to update category.' : 'Failed to create category.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/categories']);
  }
}

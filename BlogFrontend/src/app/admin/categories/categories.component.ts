import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns = ['name', 'description', 'actions'];
  loading = false;
  alertMessage = '';
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'info';

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private confirm: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: cats => { this.categories = cats; this.loading = false; },
      error: () => {
        this.loading = false;
        this.alertType = 'danger';
        this.alertMessage = 'Failed to load categories.';
      }
    });
  }

  newCategory(): void {
    this.router.navigate(['/admin/categories/new']);
  }

  editCategory(id: number): void {
    this.router.navigate(['/admin/categories/edit', id]);
  }

  deleteCategory(category: Category): void {
    this.confirm.open({
      title: 'Delete Category',
      message: `Delete category <strong>${category.name}</strong>? This cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      icon: 'delete_forever'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.categoryService.delete(category.id).subscribe({
        next: () => {
          this.alertType = 'success';
          this.alertMessage = `Category "${category.name}" deleted successfully.`;
          this.load();
        },
        error: () => {
          this.alertType = 'danger';
          this.alertMessage = 'Failed to delete category.';
        }
      });
    });
  }
}

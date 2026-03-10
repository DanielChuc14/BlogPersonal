import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TagService } from '../../core/services/tag.service';
import { Tag } from '../../core/models/tag.model';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-tags',
  standalone: false,
  templateUrl: './tags.component.html'
})
export class TagsComponent implements OnInit {
  tags: Tag[] = [];
  displayedColumns = ['name', 'description', 'actions'];
  loading = false;
  alertMessage = '';
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'info';

  constructor(
    private tagService: TagService,
    private router: Router,
    private confirm: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.tagService.getAll().subscribe({
      next: tags => { this.tags = tags; this.loading = false; },
      error: () => {
        this.loading = false;
        this.alertType = 'danger';
        this.alertMessage = 'Failed to load tags.';
      }
    });
  }

  newTag(): void {
    this.router.navigate(['/admin/tags/new']);
  }

  editTag(id: number): void {
    this.router.navigate(['/admin/tags/edit', id]);
  }

  deleteTag(tag: Tag): void {
    this.confirm.open({
      title: 'Delete Tag',
      message: `Delete tag <strong>${tag.name}</strong>? This cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      icon: 'delete_forever'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.tagService.delete(tag.id).subscribe({
        next: () => {
          this.alertType = 'success';
          this.alertMessage = `Tag "${tag.name}" deleted successfully.`;
          this.load();
        },
        error: () => {
          this.alertType = 'danger';
          this.alertMessage = 'Failed to delete tag.';
        }
      });
    });
  }
}

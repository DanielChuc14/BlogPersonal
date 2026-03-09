import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../../../core/services/permission.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-permission-form',
  standalone: false,
  templateUrl: './permission-form.component.html'
})
export class PermissionFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  permissionId?: number;
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotificationService
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
      this.permissionId = +id;
      this.loading = true;
      this.permissionService.getById(this.permissionId).subscribe({
        next: p => {
          this.form.patchValue({ name: p.name, description: p.description ?? '' });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.notify.danger('Could not load permission.');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const { name } = this.form.value;

    const save$: Observable<any> = this.isEdit && this.permissionId
      ? this.permissionService.update(this.permissionId, this.form.value)
      : this.permissionService.create(this.form.value);

    save$.subscribe({
      next: () => {
        this.saving = false;
        this.notify.success(this.isEdit ? `Permission "${name}" updated.` : `Permission "${name}" created.`);
        this.router.navigate(['/admin/permissions']);
      },
      error: err => {
        this.saving = false;
        const msg = err?.error?.message ?? (this.isEdit ? 'Failed to update permission.' : 'Failed to create permission.');
        this.notify.danger(msg);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/permissions']);
  }
}

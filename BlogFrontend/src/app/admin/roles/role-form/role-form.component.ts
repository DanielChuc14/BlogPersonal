import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../../core/services/role.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-role-form',
  standalone: false,
  templateUrl: './role-form.component.html'
})
export class RoleFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  roleId?: string;
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotificationService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.roleId = id;
      this.loading = true;
      this.roleService.getById(id).subscribe({
        next: role => { this.form.patchValue({ name: role.name }); this.loading = false; },
        error: () => {
          this.loading = false;
          this.notify.danger('Could not load role.');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const name: string = this.form.value.name;

    const save$: Observable<any> = this.isEdit && this.roleId
      ? this.roleService.update(this.roleId, name)
      : this.roleService.create(name);

    save$.subscribe({
      next: () => {
        this.saving = false;
        this.notify.success(this.isEdit ? `Role "${name}" updated.` : `Role "${name}" created.`);
        this.router.navigate(['/admin/roles']);
      },
      error: err => {
        this.saving = false;
        const msg = err?.error?.message ?? (this.isEdit ? 'Failed to update role.' : 'Failed to create role.');
        this.notify.danger(msg);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/roles']);
  }
}

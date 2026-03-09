import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '../../core/services/permission.service';
import { Permission } from '../../core/models/permission.model';

@Component({
  selector: 'app-permissions',
  standalone: false,
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent implements OnInit {
  permissions: Permission[] = [];
  loading = false;
  displayedColumns = ['name', 'description', 'actions'];

  constructor(private permissionService: PermissionService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.permissionService.getAll().subscribe({
      next: perms => { this.permissions = perms; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  newPermission(): void {
    this.router.navigate(['/admin/permissions/new']);
  }

  editPermission(id: number): void {
    this.router.navigate(['/admin/permissions/edit', id]);
  }

  deletePermission(id: number): void {
    if (!confirm('Delete this permission?')) return;
    this.permissionService.delete(id).subscribe({
      next: () => this.load(),
      error: err => {
        if (err.status === 400) {
          if (confirm('Permission is in use. Force delete?')) {
            this.permissionService.delete(id, true).subscribe({ next: () => this.load() });
          }
        }
      }
    });
  }
}

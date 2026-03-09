import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '../../core/services/permission.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
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

  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private notify: NotificationService,
    private confirm: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.permissionService.getAll().subscribe({
      next: perms => { this.permissions = perms; this.loading = false; },
      error: () => {
        this.loading = false;
        this.notify.danger('Failed to load permissions.');
      }
    });
  }

  newPermission(): void {
    this.router.navigate(['/admin/permissions/new']);
  }

  editPermission(id: number): void {
    this.router.navigate(['/admin/permissions/edit', id]);
  }

  deletePermission(permission: Permission): void {
    this.confirm.open({
      title: 'Delete Permission',
      message: `Delete permission <strong>${permission.name}</strong>? This cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      icon: 'delete_forever'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.permissionService.delete(permission.id).subscribe({
        next: () => {
          this.notify.success(`Permission "${permission.name}" deleted.`);
          this.load();
        },
        error: err => {
          if (err.status === 400) {
            this.confirm.open({
              title: 'Permission in Use',
              message: `Permission <strong>${permission.name}</strong> is assigned to roles or users. Force delete it?`,
              confirmText: 'Force Delete',
              cancelText: 'Cancel',
              icon: 'warning'
            }).subscribe(force => {
              if (!force) return;
              this.permissionService.delete(permission.id, true).subscribe({
                next: () => {
                  this.notify.success(`Permission "${permission.name}" force-deleted.`);
                  this.load();
                },
                error: () => this.notify.danger('Failed to force-delete permission.')
              });
            });
          } else {
            this.notify.danger('Failed to delete permission.');
          }
        }
      });
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '../../core/services/role.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { Role } from '../../core/models/role.model';

@Component({
  selector: 'app-roles',
  standalone: false,
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  loading = false;
  displayedColumns = ['name', 'actions'];

  constructor(
    private roleService: RoleService,
    private router: Router,
    private notify: NotificationService,
    private confirm: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.roleService.getAll().subscribe({
      next: roles => { this.roles = roles; this.loading = false; },
      error: () => {
        this.loading = false;
        this.notify.danger('Failed to load roles.');
      }
    });
  }

  newRole(): void {
    this.router.navigate(['/admin/roles/new']);
  }

  editRole(id: string): void {
    this.router.navigate(['/admin/roles/edit', id]);
  }

  deleteRole(role: Role): void {
    this.confirm.open({
      title: 'Delete Role',
      message: `Delete role <strong>${role.name}</strong>? This cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      icon: 'delete_forever'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.roleService.delete(role.id).subscribe({
        next: () => {
          this.notify.success(`Role "${role.name}" deleted.`);
          this.load();
        },
        error: err => {
          if (err.status === 400) {
            this.confirm.open({
              title: 'Role in Use',
              message: `Role <strong>${role.name}</strong> is assigned to users. Force delete and remove it from all users?`,
              confirmText: 'Force Delete',
              cancelText: 'Cancel',
              icon: 'warning'
            }).subscribe(force => {
              if (!force) return;
              this.roleService.delete(role.id, true).subscribe({
                next: () => {
                  this.notify.success(`Role "${role.name}" force-deleted.`);
                  this.load();
                },
                error: () => this.notify.danger('Failed to force-delete role.')
              });
            });
          } else {
            this.notify.danger('Failed to delete role.');
          }
        }
      });
    });
  }
}

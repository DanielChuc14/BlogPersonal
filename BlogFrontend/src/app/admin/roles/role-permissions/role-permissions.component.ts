import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RoleService } from '../../../core/services/role.service';
import { PermissionService } from '../../../core/services/permission.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { Permission } from '../../../core/models/permission.model';

@Component({
  selector: 'app-role-permissions',
  standalone: false,
  templateUrl: './role-permissions.component.html'
})
export class RolePermissionsComponent implements OnInit {
  roleId!: string;
  roleName = '';
  assigned: string[] = [];
  allPermissions: Permission[] = [];
  available: Permission[] = [];
  loading = false;
  searchTerm = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private notify: NotificationService,
    private confirm: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id')!;
    this.load();
  }

  load(): void {
    this.loading = true;
    forkJoin({
      role: this.roleService.getById(this.roleId),
      assigned: this.roleService.getPermissions(this.roleId),
      all: this.permissionService.getAll()
    }).subscribe({
      next: ({ role, assigned, all }) => {
        this.roleName = role.name;
        this.assigned = assigned;
        this.allPermissions = all;
        this.computeAvailable();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify.danger('Failed to load role permissions.');
      }
    });
  }

  private computeAvailable(): void {
    this.available = this.allPermissions.filter(p => !this.assigned.includes(p.name));
  }

  get filteredAvailable(): Permission[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.available;
    return this.available.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  }

  addPermission(p: Permission): void {
    this.roleService.addPermissions(this.roleId, [p.name]).subscribe({
      next: () => {
        this.assigned = [...this.assigned, p.name];
        this.computeAvailable();
        this.notify.success(`Permission "${p.name}" added to role.`);
      },
      error: () => this.notify.danger(`Failed to add permission "${p.name}".`)
    });
  }

  removePermission(permName: string): void {
    this.confirm.open({
      title: 'Remove Permission',
      message: `Remove <strong>${permName}</strong> from role <strong>${this.roleName}</strong>?`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      icon: 'vpn_key'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.roleService.removePermission(this.roleId, permName).subscribe({
        next: () => {
          this.assigned = this.assigned.filter(a => a !== permName);
          this.computeAvailable();
          this.notify.success(`Permission "${permName}" removed.`);
        },
        error: () => this.notify.danger(`Failed to remove permission "${permName}".`)
      });
    });
  }

  back(): void {
    this.router.navigate(['/admin/roles']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '../../core/services/role.service';
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

  constructor(private roleService: RoleService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.roleService.getAll().subscribe({
      next: roles => { this.roles = roles; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  newRole(): void {
    this.router.navigate(['/admin/roles/new']);
  }

  editRole(id: string): void {
    this.router.navigate(['/admin/roles/edit', id]);
  }

  deleteRole(id: string): void {
    if (!confirm('Delete this role?')) return;
    this.roleService.delete(id).subscribe({
      next: () => this.load(),
      error: err => {
        if (err.status === 400) {
          if (confirm('Role has users. Force delete (remove from all users)?')) {
            this.roleService.delete(id, true).subscribe({ next: () => this.load() });
          }
        }
      }
    });
  }
}

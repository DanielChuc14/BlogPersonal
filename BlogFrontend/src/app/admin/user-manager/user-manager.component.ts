import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UserAdminService } from '../../core/services/user-admin.service';
import { UserSummary } from '../../core/models/user.model';

@Component({
  selector: 'app-user-manager',
  standalone: false,
  templateUrl: './user-manager.component.html'
})
export class UserManagerComponent implements OnInit {
  users: UserSummary[] = [];
  total = 0;
  page = 1;
  pageSize = 20;
  loading = false;
  actionLoading: { [id: string]: boolean } = {};

  displayedColumns = ['email', 'userName', 'roles', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserAdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.userService.getAll(this.page, this.pageSize).subscribe({
      next: result => {
        this.users = result.items;
        this.total = result.total;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }

  isLocked(user: UserSummary): boolean {
    if (!user.lockoutEnabled || !user.lockoutEnd) return false;
    return new Date(user.lockoutEnd) > new Date();
  }

  lock(user: UserSummary): void {
    this.actionLoading[user.id] = true;
    this.userService.lock(user.id).subscribe({
      next: () => { this.actionLoading[user.id] = false; this.load(); },
      error: () => { this.actionLoading[user.id] = false; }
    });
  }

  unlock(user: UserSummary): void {
    this.actionLoading[user.id] = true;
    this.userService.unlock(user.id).subscribe({
      next: () => { this.actionLoading[user.id] = false; this.load(); },
      error: () => { this.actionLoading[user.id] = false; }
    });
  }

  resetPassword(user: UserSummary): void {
    this.actionLoading[user.id] = true;
    this.userService.resetPassword(user.id).subscribe({
      next: (res: any) => {
        this.actionLoading[user.id] = false;
        alert(`Reset token for ${res.email}:\n${res.token}`);
      },
      error: () => { this.actionLoading[user.id] = false; }
    });
  }
}

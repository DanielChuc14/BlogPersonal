import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UserAdminService } from '../../core/services/user-admin.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
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

  constructor(
    private userService: UserAdminService,
    private notify: NotificationService,
    private confirm: ConfirmDialogService
  ) {}

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
      error: () => {
        this.loading = false;
        this.notify.danger('Failed to load users.');
      }
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
    this.confirm.open({
      title: 'Lock User',
      message: `Lock <strong>${user.email}</strong>? They will not be able to log in.`,
      confirmText: 'Lock',
      cancelText: 'Cancel',
      icon: 'lock'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.actionLoading[user.id] = true;
      this.userService.lock(user.id).subscribe({
        next: () => {
          this.actionLoading[user.id] = false;
          this.notify.warning(`User ${user.email} has been locked.`);
          this.load();
        },
        error: () => {
          this.actionLoading[user.id] = false;
          this.notify.danger('Failed to lock user.');
        }
      });
    });
  }

  unlock(user: UserSummary): void {
    this.confirm.open({
      title: 'Unlock User',
      message: `Unlock <strong>${user.email}</strong>?`,
      confirmText: 'Unlock',
      cancelText: 'Cancel',
      icon: 'lock_open'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.actionLoading[user.id] = true;
      this.userService.unlock(user.id).subscribe({
        next: () => {
          this.actionLoading[user.id] = false;
          this.notify.success(`User ${user.email} has been unlocked.`);
          this.load();
        },
        error: () => {
          this.actionLoading[user.id] = false;
          this.notify.danger('Failed to unlock user.');
        }
      });
    });
  }

  resetPassword(user: UserSummary): void {
    this.confirm.open({
      title: 'Reset Password',
      message: `Generate a password reset token for <strong>${user.email}</strong>?`,
      confirmText: 'Reset',
      cancelText: 'Cancel',
      icon: 'key'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.actionLoading[user.id] = true;
      this.userService.resetPassword(user.id).subscribe({
        next: (res: any) => {
          this.actionLoading[user.id] = false;
          this.notify.info(`Reset token generated for ${res.email}.`);
        },
        error: () => {
          this.actionLoading[user.id] = false;
          this.notify.danger('Failed to generate reset token.');
        }
      });
    });
  }
}

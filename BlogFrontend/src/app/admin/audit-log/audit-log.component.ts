import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { AuditLogService } from '../../core/services/audit-log.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuditLog, PagedResult } from '../../core/models/audit-log.model';

@Component({
  selector: 'app-audit-log',
  standalone: false,
  templateUrl: './audit-log.component.html'
})
export class AuditLogComponent implements OnInit {
  logs: AuditLog[] = [];
  total = 0;
  page = 1;
  pageSize = 20;
  loading = false;

  filterForm: FormGroup;
  displayedColumns = ['timestamp', 'actor', 'action', 'target', 'details'];

  constructor(
    private auditService: AuditLogService,
    private fb: FormBuilder,
    private notify: NotificationService
  ) {
    this.filterForm = this.fb.group({
      action: [''],
      targetType: [''],
      actorUserId: [''],
      from: [''],
      to: ['']
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const f = this.filterForm.value;
    this.auditService.getAll({
      action: f.action || undefined,
      targetType: f.targetType || undefined,
      actorUserId: f.actorUserId || undefined,
      from: f.from || undefined,
      to: f.to || undefined,
      page: this.page,
      pageSize: this.pageSize
    }).subscribe({
      next: (result: PagedResult<AuditLog>) => {
        this.logs = result.items;
        this.total = result.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify.danger('Failed to load audit log.');
      }
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.load();
  }

  clearFilters(): void {
    this.filterForm.reset({ action: '', targetType: '', actorUserId: '', from: '', to: '' });
    this.page = 1;
    this.load();
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }
}

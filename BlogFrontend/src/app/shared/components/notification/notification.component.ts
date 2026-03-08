import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification, NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  notifications$: Observable<Notification[]>;

  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$;
  }

  dismiss(id: number): void {
    this.notificationService.dismiss(id);
  }

  getConfig(type: string): { icon: string; containerClass: string; iconClass: string } {
    switch (type) {
      case 'success':
        return { icon: 'check_circle', containerClass: 'bg-green-50 border-green-200 text-green-900', iconClass: 'text-green-600' };
      case 'warning':
        return { icon: 'warning', containerClass: 'bg-amber-50 border-amber-200 text-amber-900', iconClass: 'text-amber-500' };
      case 'info':
        return { icon: 'info', containerClass: 'bg-blue-50 border-blue-200 text-blue-900', iconClass: 'text-blue-600' };
      case 'danger':
        return { icon: 'error', containerClass: 'bg-red-50 border-red-200 text-red-900', iconClass: 'text-red-600' };
      default:
        return { icon: 'info', containerClass: 'bg-gray-50 border-gray-200 text-gray-900', iconClass: 'text-gray-500' };
    }
  }

  trackById(_: number, n: Notification): number {
    return n.id;
  }
}

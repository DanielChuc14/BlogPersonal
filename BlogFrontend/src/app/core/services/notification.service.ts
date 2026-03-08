import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'warning' | 'info' | 'danger';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _counter = 0;
  private _notifications$ = new BehaviorSubject<Notification[]>([]);

  readonly notifications$ = this._notifications$.asObservable();

  success(message: string, duration = 4000): void {
    this.add('success', message, duration);
  }

  warning(message: string, duration = 4000): void {
    this.add('warning', message, duration);
  }

  info(message: string, duration = 4000): void {
    this.add('info', message, duration);
  }

  danger(message: string, duration = 4000): void {
    this.add('danger', message, duration);
  }

  dismiss(id: number): void {
    this._notifications$.next(
      this._notifications$.value.filter(n => n.id !== id)
    );
  }

  private add(type: NotificationType, message: string, duration: number): void {
    const id = ++this._counter;
    const notification: Notification = { id, type, message };
    this._notifications$.next([...this._notifications$.value, notification]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }
}

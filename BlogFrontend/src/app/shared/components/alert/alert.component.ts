import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * ## AlertComponent — `<app-alert>`
 *
 * Inline Flowbite-style alert banner.
 *
 * ### Inputs
 * | Input       | Type                                          | Default  |
 * |-------------|-----------------------------------------------|----------|
 * | type        | `'success' \| 'danger' \| 'warning' \| 'info'` | `'info'` |
 * | message     | `string`                                      | `''`     |
 * | dismissible | `boolean`                                     | `false`  |
 *
 * ### Outputs
 * | Output    | Description              |
 * |-----------|--------------------------|
 * | dismissed | Emitted on close button click |
 *
 * ### Usage
 * ```html
 * <!-- With string input -->
 * <app-alert type="danger" [message]="errorMessage" />
 *
 * <!-- With projected content -->
 * <app-alert type="warning" [dismissible]="true" (dismissed)="clearWarning()">
 *   Your session expires in 5 minutes.
 * </app-alert>
 * ```
 */
@Component({
  selector: 'app-alert',
  standalone: false,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  @Input() type: 'success' | 'danger' | 'warning' | 'info' = 'info';
  @Input() message = '';
  @Input() dismissible = false;
  @Output() dismissed = new EventEmitter<void>();

  visible = true;

  get icon(): string {
    return { success: 'check_circle', danger: 'error_outline', warning: 'warning_amber', info: 'info' }[this.type];
  }

  dismiss(): void {
    this.visible = false;
    this.dismissed.emit();
  }
}

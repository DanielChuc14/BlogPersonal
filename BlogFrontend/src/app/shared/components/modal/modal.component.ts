import { Component, Input } from '@angular/core';

/**
 * ## ModalComponent — `<app-modal>`
 *
 * Flowbite-style modal content shell. Designed to be placed inside
 * Angular Material's `MatDialog` or any container. Provides a header
 * with icon + title, a body slot, and a footer actions slot.
 *
 * ### Inputs
 * | Input     | Type                                             | Default           |
 * |-----------|--------------------------------------------------|-------------------|
 * | title     | `string`                                         | `''`              |
 * | icon      | `string` (Material icon name)                    | `'delete_forever'`|
 * | iconColor | `'danger' \| 'warning' \| 'info' \| 'success'`  | `'danger'`        |
 *
 * ### Slots (via `ng-content` select)
 * - `[modal-body]` — main body content
 * - `[modal-footer]` — action buttons row
 *
 * ### Usage (inside MatDialog)
 * ```html
 * <app-modal [title]="data.title" [icon]="data.icon ?? 'delete_forever'" iconColor="danger">
 *   <p modal-body class="m-0">{{ data.message }}</p>
 *   <ng-container modal-footer>
 *     <app-btn variant="ghost" (btnClick)="cancel()">Cancel</app-btn>
 *     <app-btn variant="danger" (btnClick)="confirm()">Delete</app-btn>
 *   </ng-container>
 * </app-modal>
 * ```
 */
@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() title = '';
  @Input() icon = 'delete_forever';
  @Input() iconColor: 'danger' | 'warning' | 'info' | 'success' = 'danger';
}

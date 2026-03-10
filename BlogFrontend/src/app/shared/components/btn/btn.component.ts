import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * ## BtnComponent — `<app-btn>`
 *
 * Reusable Flowbite-aesthetic button.
 *
 * ### Inputs
 * | Input       | Type                                                   | Default     |
 * |-------------|--------------------------------------------------------|-------------|
 * | variant     | `'primary' \| 'secondary' \| 'danger' \| 'ghost' \| 'icon'` | `'primary'` |
 * | size        | `'sm' \| 'md' \| 'lg'`                               | `'md'`      |
 * | type        | `'button' \| 'submit'`                                | `'button'`  |
 * | loading     | `boolean`                                              | `false`     |
 * | disabled    | `boolean`                                              | `false`     |
 *
 * ### Outputs
 * | Output   | Payload | Description              |
 * |----------|---------|--------------------------|
 * | btnClick | `void`  | Emitted on button click  |
 *
 * ### Usage
 * ```html
 * <app-btn variant="primary" (btnClick)="save()">Save</app-btn>
 * <app-btn variant="danger" size="sm" (btnClick)="delete()">
 *   <mat-icon>delete</mat-icon> Delete
 * </app-btn>
 * <app-btn variant="primary" type="submit" [loading]="saving" [disabled]="form.invalid">
 *   Submit
 * </app-btn>
 * ```
 */
@Component({
  selector: 'app-btn',
  standalone: false,
  templateUrl: './btn.component.html',
  styleUrl: './btn.component.scss',
})
export class BtnComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() loading = false;
  @Input() disabled = false;
  @Output() btnClick = new EventEmitter<void>();

  get btnClass(): string {
    return `btn btn--${this.variant} btn--${this.size}`;
  }
}

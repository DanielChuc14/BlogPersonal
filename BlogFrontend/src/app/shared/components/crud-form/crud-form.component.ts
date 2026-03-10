import { Component, Input } from '@angular/core';

/**
 * ## CrudFormComponent — `<app-crud-form>`
 *
 * Flowbite-style card shell for CRUD forms. Renders a white card with an
 * optional titled header and an indeterminate loading bar. Project your
 * `<form>` element as `ng-content`.
 *
 * ### Inputs
 * | Input    | Type      | Default |
 * |----------|-----------|---------|
 * | title    | `string`  | `''`    |
 * | subtitle | `string`  | `''`    |
 * | loading  | `boolean` | `false` |
 *
 * ### Usage
 * ```html
 * <app-crud-form title="New Post" [loading]="saving" class="max-w-[720px] block">
 *   <form [formGroup]="form" (ngSubmit)="onSubmit()">
 *     <!-- mat-form-fields -->
 *     <div class="flex gap-3 justify-end mt-6">
 *       <app-btn variant="ghost" type="button" (btnClick)="cancel()">Cancel</app-btn>
 *       <app-btn variant="primary" type="submit" [loading]="saving">Save</app-btn>
 *     </div>
 *   </form>
 * </app-crud-form>
 * ```
 */
@Component({
  selector: 'app-crud-form',
  standalone: false,
  templateUrl: './crud-form.component.html',
  styleUrl: './crud-form.component.scss',
})
export class CrudFormComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() loading = false;
}

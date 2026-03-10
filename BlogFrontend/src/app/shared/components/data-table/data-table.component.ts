import { Component, Input } from '@angular/core';

/**
 * ## DataTableComponent — `<app-data-table>`
 *
 * Flowbite-style data table wrapper with loading bar and empty state.
 * Project `<tr>` row elements as `ng-content` — the component renders
 * the `<thead>` from `columns` and wraps the body automatically.
 *
 * ### Inputs
 * | Input        | Type       | Default          |
 * |--------------|------------|------------------|
 * | columns      | `string[]` | `[]`             |
 * | loading      | `boolean`  | `false`          |
 * | isEmpty      | `boolean`  | `false`          |
 * | emptyIcon    | `string`   | `'table_rows'`   |
 * | emptyMessage | `string`   | `'No items found.'` |
 *
 * ### Usage
 * ```html
 * <app-data-table
 *   [columns]="['Name', 'Description', 'Actions']"
 *   [loading]="loading"
 *   [isEmpty]="!loading && items.length === 0"
 *   emptyIcon="category"
 *   emptyMessage="No categories yet.">
 *
 *   @for (item of items; track item.id) {
 *     <tr class="tbl-row">
 *       <td class="tbl-cell font-medium">{{ item.name }}</td>
 *       <td class="tbl-cell text-sm text-gray-500">{{ item.description }}</td>
 *       <td class="tbl-cell-actions">
 *         <app-btn variant="icon" (btnClick)="edit(item.id)">
 *           <mat-icon class="!text-blue-500">edit</mat-icon>
 *         </app-btn>
 *       </td>
 *     </tr>
 *   }
 * </app-data-table>
 * ```
 */
@Component({
  selector: 'app-data-table',
  standalone: false,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent {
  @Input() columns: string[] = [];
  @Input() loading = false;
  @Input() isEmpty = false;
  @Input() emptyIcon = 'table_rows';
  @Input() emptyMessage = 'No items found.';
}

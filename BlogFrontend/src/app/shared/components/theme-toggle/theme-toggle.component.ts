import { Component, Input } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

/**
 * Reusable theme toggle button.
 *
 * @Input variant
 *   'ghost-light' — for dark backgrounds (navbar, dark sidebars).
 *   'ghost-dark'  — for light backgrounds (light toolbars, cards).
 */
@Component({
  selector: 'app-theme-toggle',
  standalone: false,
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  @Input() variant: 'ghost-light' | 'ghost-dark' = 'ghost-light';

  constructor(public themeService: ThemeService) {}

  get buttonClass(): string {
    return this.variant === 'ghost-light'
      ? 'text-white/70 hover:text-white hover:bg-white/10 focus:ring-white/25'
      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-200 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 dark:focus:ring-slate-600';
  }
}

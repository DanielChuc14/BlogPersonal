import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'blog-theme';
  private _isDark = new BehaviorSubject<boolean>(this.resolveInitialTheme());

  isDark$ = this._isDark.asObservable();

  constructor() {
    this.applyTheme(this._isDark.value);
  }

  get isDark(): boolean {
    return this._isDark.value;
  }

  toggle(): void {
    this.setTheme(!this._isDark.value);
  }

  setTheme(dark: boolean): void {
    this._isDark.next(dark);
    this.applyTheme(dark);
    localStorage.setItem(this.STORAGE_KEY, dark ? 'dark' : 'light');
  }

  private resolveInitialTheme(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }
}

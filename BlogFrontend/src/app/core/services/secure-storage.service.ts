import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

@Injectable({ providedIn: 'root' })
export class SecureStorageService {

  constructor(private crypto: CryptoService) {}

  setItem(key: string, value: unknown): void {
    const encrypted = this.crypto.encrypt(value);
    localStorage.setItem(key, encrypted);
  }

  getItem<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return this.crypto.decrypt<T>(raw);
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

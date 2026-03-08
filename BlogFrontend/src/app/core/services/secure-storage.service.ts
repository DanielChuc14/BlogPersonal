import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {

  constructor(private crypto: CryptoService) {}

  async setItem(key: string, value: unknown): Promise<void> {
    const encrypted = await this.crypto.encrypt(value);
    localStorage.setItem(key, encrypted);
  }

  async getItem<T>(key: string): Promise<T | null> {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      return await this.crypto.decrypt<T>(raw);
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

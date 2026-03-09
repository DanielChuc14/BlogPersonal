import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CryptoService {

  private readonly SECRET = 'myblog-secure-key-v1';

  encrypt(value: unknown): string {
    const json = JSON.stringify(value);
    const key = this.SECRET;
    let xored = '';
    for (let i = 0; i < json.length; i++) {
      xored += String.fromCharCode(json.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(xored);
  }

  decrypt<T>(encoded: string): T {
    const raw = atob(encoded);
    const key = this.SECRET;
    let json = '';
    for (let i = 0; i < raw.length; i++) {
      json += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return JSON.parse(json) as T;
  }
}

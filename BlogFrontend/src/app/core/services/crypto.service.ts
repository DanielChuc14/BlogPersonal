import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private readonly SECRET = 'myblog-secure-key-v1';
  private readonly SALT   = 'myblog-crypto-salt';

  private _key: CryptoKey | null = null;

  private async getKey(): Promise<CryptoKey> {
    if (this._key) return this._key;

    const enc = new TextEncoder();

    const raw = await crypto.subtle.importKey(
      'raw',
      enc.encode(this.SECRET),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    this._key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: enc.encode(this.SALT),
        iterations: 100_000,
        hash: 'SHA-256',
      },
      raw,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    return this._key;
  }

  async encrypt(value: unknown): Promise<string> {
    const key     = await this.getKey();
    const iv      = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(value));

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const payload = {
      iv:   Array.from(iv),
      data: Array.from(new Uint8Array(ciphertext)),
    };

    return btoa(JSON.stringify(payload));
  }

  async decrypt<T>(encoded: string): Promise<T> {
    const payload = JSON.parse(atob(encoded)) as { iv: number[]; data: number[] };
    const key     = await this.getKey();
    const iv      = new Uint8Array(payload.iv);
    const data    = new Uint8Array(payload.data);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return JSON.parse(new TextDecoder().decode(decrypted)) as T;
  }
}

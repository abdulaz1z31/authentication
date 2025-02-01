import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CustomCacheService {
  constructor(private readonly cache: Cache) {}

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  async get(key: string): Promise<string | null> {
    return this.cache.get(key);
  }
}

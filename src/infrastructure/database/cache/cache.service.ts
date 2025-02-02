import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CustomCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.cache.set(key, value, ttl);
    } else {
      await this.cache.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return (await this.cache.get<string>(key)) || null;
  }
}

import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CustomCacheService } from './cache.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  providers: [CustomCacheService],
  exports: [CustomCacheService],
})
export class CustomCacheModule {}

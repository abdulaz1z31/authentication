import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule, UserModule } from './application';
import {
  CustomCacheModule,
  DbModule,
  GuardService,
  MailModule,
} from './infrastructure';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomCacheModule,
    DbModule,
    MailModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GuardService,
    },
  ],
})
export class AppModule {}

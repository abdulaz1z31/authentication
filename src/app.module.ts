import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule, UserModule } from './application';
import {
  RedisModuleCustom,
  DbModule,
  CustomJwtService,
  MailModule,
} from './infrastructure';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModuleCustom,
    DbModule,
    MailModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomJwtService,
    },
  ],
})
export class AppModule {}

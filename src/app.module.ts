import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, UserModule } from './application';
import {
  RedisModuleCustom,
  DbModule,
  MailModule,
  CustomJwtModule,
} from './infrastructure';
import { RolesModule } from './infrastructure/security/guards/roles.module';

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
    RolesModule,
    CustomJwtModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

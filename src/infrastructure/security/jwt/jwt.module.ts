import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomJwtService } from './customjwt.service';
import { TokenService } from './jwt.service';
import { config } from 'src/infrastructure/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: config.accessSecret,
        signOptions: {
          expiresIn: config.accessTime,
        },
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: config.refreshSecret,
        signOptions: {
          expiresIn: config.refreshTime,
        },
      }),
    }),
  ],
  providers: [
    CustomJwtService,
    TokenService,
    {
      provide: APP_GUARD,
      useClass: CustomJwtService,
    },
  ],
  exports: [CustomJwtService, TokenService],
})
export class CustomJwtModule {}

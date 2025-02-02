import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GuardService } from './guard.service';
import { TokenService } from './jwt.service';
import { config } from 'src/infrastructure/config';

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
  providers: [GuardService, TokenService],
  exports: [GuardService, TokenService],
})
export class GuardModule {}

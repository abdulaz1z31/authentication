import { Module } from '@nestjs/common';
import { AuthService } from 'src/domain/auth';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../user/user.module';
import {
  CustomCacheModule,
  HashingService,
  MailModule,
} from 'src/infrastructure';

@Module({
  imports: [UserModule, CustomCacheModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, HashingService],
})
export class AuthModule {}

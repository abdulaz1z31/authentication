import { Module } from '@nestjs/common';
import { AdminController } from './controller/admin.controller';
import { AdminService } from 'src/domain';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

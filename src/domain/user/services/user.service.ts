import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { BaseService } from 'src/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService extends BaseService<
  CreateUserDto,
  DeepPartial<UserEntity>
> {
  constructor(@InjectRepository(UserEntity) userRepository: UserRepository) {
    super(userRepository);
  }
}

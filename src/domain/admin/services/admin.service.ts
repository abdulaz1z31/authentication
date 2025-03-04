import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { UpdateAdminDto } from '../dtos/update-admin.dto';
import { UserRoles, UserService } from 'src/domain/user';

@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) {}
  async create(dto: CreateAdminDto) {
    const [exitingUsername, exitingEmail] = await Promise.all([
      this.userService.isUsernameExists(dto.username),
      this.userService.isEmailExists(dto.email),
    ]);
    if (exitingUsername) {
      throw new ConflictException('Username already exists');
    }
    if (exitingEmail) {
      throw new ConflictException('Email already exists');
    }
    const user = await this.userService.create(dto);
    return {
      message: 'Created',
      statusCode: 201,
      data: {
        id: user.id,
        created_at: user.created_at,
      },
    };
  }

  async findAll() {
    const admins = await this.userService.findByRole(UserRoles.admin);
    return {
      message: 'success',
      statusCode: 200,
      data: admins,
    };
  }

  async findOne(id: string) {
    const admin = await this.userService.findById(id);
    return {
      message: 'Success',
      statusCode: 200,
      data: admin,
    };
  }

  async update(id: string, dto: UpdateAdminDto) {
    const admin = await this.userService.update(id, dto);
    return {
      message: 'Updated',
      statusCode: 200,
      data: admin,
    };
  }

  async remove(id: string) {
    await this.userService.delete(id);
    return {
      message: 'Deleted',
      statusCode: 200,
      data: {},
    };
  }
}

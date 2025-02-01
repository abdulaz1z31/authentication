import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from '../dtos/register.dto';
import { LoginAuthDto } from '../dtos/login.dto';

@Injectable()
export class AuthService {
  constructor() {}
  async register(data: RegisterAuthDto) {}
  async login(data: LoginAuthDto) {}
}

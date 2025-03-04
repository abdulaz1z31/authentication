import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  username: string;
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
}

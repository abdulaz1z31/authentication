import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { UserID, Public } from 'src/common/decorators';
import {
  AuthService,
  LoginAuthDto,
  RegisterAuthDto,
  VerifyDto,
} from 'src/domain/auth';
import { ForgetPasswordDto } from 'src/domain/auth/dtos/forget.dto';
import { ResetPasswordDto } from 'src/domain/auth/dtos/reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  async register(@Body() userData: RegisterAuthDto) {
    return await this.authService.register(userData);
  }

  @Public()
  @Post('verify')
  async verify(@Body() verifyData: VerifyDto) {
    return await this.authService.verify(verifyData);
  }

  @Public()
  @Post('login')
  async login(@Body() loginData: LoginAuthDto) {
    return await this.authService.login(loginData);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @UserID() id: string) {
    return await this.authService.resetPassword(dto, id);
  }

  @Post('forget-password')
  async forgetPassword(dto: ForgetPasswordDto) {
    return await this.authService.forgetPassword(dto);
  }

  @Post('change-password')
  async changePassword(@Param('token') token: string, dto: ResetPasswordDto) {
    return await this.authService.changePassword(token, dto);
  }

  @Delete('delete/me')
  async deleteAccount(@UserID() id: string) {
    return await this.authService.deleteAccount(id);
  }

  @Post('resend-otp')
  async resendOtp(@Body('email') email: string) {
    return await this.authService.resendOtp(email);
  }

  @Post('refresh-tokens')
  async refreshTokens(@Body('refresh_token') token: string) {
    return await this.authService.refreshTokens(token);
  }
}

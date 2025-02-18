import { Controller, Post, Body } from '@nestjs/common';
import {
  AuthService,
  LoginAuthDto,
  RegisterAuthDto,
  VerifyDto,
} from 'src/domain/auth';
import { Public } from 'src/infrastructure';

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

  // @Post('forget-password')
  // async forgetPassword() {}

  // @Post('change-password')
  // async changePassword() {}

  // @Post('reset-password')
  // async resetPassword() {}

  // @Post('resend-otp')
  // async resendOtp() {}

  // @Delete('delete')
  // async deleteAccount() {}

  // @Post('refresh-tokens')
  // async refreshTokens() {}

  // @Post('logout')
  // async logout() {}

  // @Post('singin/google')
  // async singInWithGoogle() {}

  // @Post('singup/google')
  // async singUpWithGoogle() {}
}

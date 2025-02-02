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
  // async forgetPassword(@Body() data: { email: string }) {
  //   return await this.authService.forgetPassword(data.email);
  // }

  // @Post('change-password')
  // async changePassword(@Body() newData: ChangePasswordDto) {
  //   return await this.authService.changePassword(newData);
  // }

  // @Post('reset-password')
  // async resetPassword(
  //   @Req() request: Request,
  //   @Body() data: { password: string },
  // ) {
  //   const payload = request.user;
  //   return await this.authService.resetPassword(payload, data.password);
  // }
  // @Post('resend-otp')
  // async resendOtp(@Body() data: { email: string }) {
  //   return await this.authService.resendOtp(data.email);
  // }

  // @Delete('delete')
  // async deleteAccount(@Req() request: Request) {
  //   const user = request.user;
  //   return await this.authService.deleteAccount(user);
  // }
  async refreshToken() {}
  async savetoken() {}
  async logout() {}
}

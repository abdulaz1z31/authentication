import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { RegisterAuthDto } from '../dtos/register.dto';
import { LoginAuthDto } from '../dtos/login.dto';
import { UserService } from 'src/domain/user';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { HashingService, MailService, TokenService } from 'src/infrastructure';
import { VerifyDto } from '../dtos/verify.dto';
import { ResetPasswordDto } from '../dtos/reset.dto';
import { ForgetPasswordDto } from '../dtos/forget.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly mailerService: MailService,
    private readonly hashingService: HashingService,
    private readonly jwtService: TokenService,
  ) {}
  async register(data: RegisterAuthDto) {
    const [exitingUsername, exitingEmail] = await Promise.all([
      this.userService.isUsernameExists(data.username),
      this.userService.isEmailExists(data.email),
    ]);
    if (exitingUsername) {
      throw new ConflictException('Username already exists');
    }
    if (exitingEmail) {
      throw new ConflictException('Email already exists');
    }
    const otp = this.otpGenerator();
    await Promise.all([
      this.redisService.set(data.username, otp, 240),
      this.mailerService.sendOtp(data.email, otp),
    ]);

    const user = await this.userService.create(data);
    return {
      message: 'Created',
      statusCode: 201,
      data: {
        id: user.id,
        created_at: user.created_at,
      },
    };
  }
  async verify(data: VerifyDto) {
    const user = await this.userService.findById(data.id);
    const otpCode = await this.redisService.get(user.username);
    if (!otpCode) {
      throw new BadRequestException('Time expired');
    }
    if (otpCode != data.otp) {
      throw new BadRequestException('Otp not valid');
    }
    const updateData = {
      is_active: true,
    };
    await this.userService.update(data.id, updateData);
    return {
      statusCode: 200,
      message: 'Activated successfully',
      data: {},
    };
  }
  async login(data: LoginAuthDto) {
    const user = await this.userService.findByEmail(data.email);
    if (!user.is_active) {
      throw new BadRequestException('User not activated');
    }
    const checkPassword = await this.hashingService.compare(
      data.password,
      user.password,
    );
    if (!checkPassword) {
      throw new BadRequestException('Invalid credentials');
    }
    const payload = {
      id: user.id,
      role: user.role,
    };
    const accessToken = this.jwtService.createAccessToken(payload);
    const refreshToken = this.jwtService.createRefreshToken(payload);
    return {
      statusCode: 200,
      message: 'Logged in',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }
  async resetPassword(dto: ResetPasswordDto, id: string) {
    const hashPassword = await this.hashingService.encrypt(dto.password);
    dto.password = hashPassword;
    await this.userService.update(id, dto);
    return {
      message: 'Password updated',
      statusCode: 200,
      data: {},
    };
  }
  async forgetPassword(dto: ForgetPasswordDto) {
    const user = await this.userService.findByEmail(dto.email);
    const payload = {
      id: user.id,
    };
    const forgetToken = this.jwtService.createForgetToken(payload);
    return {
      message: 'Success',
      status: 200,
      data: { forgetToken },
    };
  }
  async changePassword(token: string, dto: ResetPasswordDto) {
    const decode = await this.jwtService.verifyForgetToken(token);
    const hashPassword = await this.hashingService.encrypt(dto.password);
    dto.password = hashPassword;
    await this.userService.update(decode.id, dto);
    return {
      message: 'Updated',
      statusCode: 200,
      data: {},
    };
  }
  async deleteAccount(id: string) {
    await this.userService.delete(id);
    return {
      message: 'Success',
      statusCode: 200,
      data: {},
    };
  }
  async refreshTokens(refresh_token: string) {
    const decode = await this.jwtService.verifyRefreshToken(refresh_token);
    const payload = {
      id: decode.id,
      role: decode.role,
    };
    const accessToken = this.jwtService.createAccessToken(payload);
    return {
      message: 'success',
      statusCode: 200,
      data: { accessToken },
    };
  }

  async resendOtp(email: string) {
    const user = await this.userService.findByEmail(email);
    const otp = this.otpGenerator();
    await Promise.all([
      this.redisService.set(user.username, otp, 240),
      this.mailerService.sendOtp(user.email, otp),
    ]);
    return {
      message: 'Success',
      status: 200,
      data: {},
    };
  }

  private otpGenerator(): string {
    const otp = Math.floor((Math.random() * 10 ** 6 * 1.145) % 10 ** 6);
    return String(otp);
  }
}

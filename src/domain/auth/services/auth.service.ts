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
      this.hashingService.generate(data.password).then((hash) => {
        data.password = hash;
      }),
    ]);

    const user = await this.userService.save(data);
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
    const user = await this.userService.getRepository.findOneBy({
      id: data.id,
    });
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
    await this.userService.getRepository.update(data.id, updateData);
    return {
      statusCode: 200,
      message: 'Activated successfully',
      data: {},
    };
  }
  async login(data: LoginAuthDto) {
    const user = await this.userService.getRepository.findOneBy({
      email: data.email,
    });
    if (!user.is_active) {
      throw new BadRequestException('User not activated');
    }
    const matchPassword = this.hashingService.compare(
      data.password,
      user.password,
    );
    if (!matchPassword) {
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
  // async singUpWithGoogle() {}
  // async singInWithGoogle() {}
  // async resetPassword() {}
  // async forgetPassword() {}
  // async changePassword() {}
  // async resendOtp() {}
  // async refreshTokens() {}
  // async logout() {}
  // async deleteAccount() {}

  private otpGenerator(): string {
    const otp = Math.floor((Math.random() * 10 ** 6 * 1.145) % 10 ** 6);
    return String(otp);
  }
}

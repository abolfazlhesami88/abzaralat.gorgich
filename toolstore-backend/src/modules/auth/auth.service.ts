import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto, res: Response) {
    // بررسی تکراری نبودن ایمیل
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('این ایمیل قبلاً ثبت شده است');
    }

    // ساخت کاربر
    const user = await this.usersService.create({
      email: dto.email.toLowerCase().trim(),
      passwordHash: dto.password, // BeforeInsert در Entity hash میکند
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    // صدور token ها
    return this.generateTokensAndSetCookie(user, res);
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.usersService.findByEmail(dto.email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('حساب کاربری شما غیرفعال شده است');
    }

    const isValid = await user.validatePassword(dto.password);
    if (!isValid) {
      throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
    }

    return this.generateTokensAndSetCookie(user, res);
  }

  async logout(userId: string, res: Response) {
    // invalidate کردن refresh token در دیتابیس
    await this.usersService.clearRefreshToken(userId);

    // پاک کردن کوکی
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
    });

    return { message: 'خروج با موفقیت انجام شد' };
  }

  async refreshTokens(userId: string, refreshToken: string, res: Response) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('نشست منقضی شده است، لطفاً دوباره وارد شوید');
    }

    // بررسی تاریخ انقضا
    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
      await this.usersService.clearRefreshToken(userId);
      throw new UnauthorizedException('نشست منقضی شده است، لطفاً دوباره وارد شوید');
    }

    // اعتبارسنجی refresh token
    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      // احتمال سرقت token — همه نشستها را ببند
      await this.usersService.clearRefreshToken(userId);
      throw new UnauthorizedException('نشست نامعتبر است');
    }

    return this.generateTokensAndSetCookie(user, res);
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('کاربر یافت نشد');
    }
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }

  // ─── Private Helpers ────────────────────────────────────────────

  private async generateTokensAndSetCookie(user: any, res: Response) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    // Access Token (15 دقیقه)
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    // Refresh Token (7 روز)
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    // ذخیره hash شده refresh token در دیتابیس
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.usersService.updateRefreshToken(
      user.id,
      hashedRefreshToken,
      expiresAt,
    );

    // ست کردن HttpOnly Cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز به ms
      path: '/api/auth/refresh',
    });

    return {
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      },
      message: 'خوش آمدید',
    };
  }
}

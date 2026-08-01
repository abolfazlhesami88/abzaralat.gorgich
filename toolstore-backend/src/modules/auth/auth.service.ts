import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpCode } from './entities/otp-code.entity';
import { KavenegarService } from './kavenegar.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly kavenegarService: KavenegarService,
    @InjectRepository(OtpCode)
    private readonly otpRepository: Repository<OtpCode>,
  ) {}

  // ─── OTP Request (ارسال کد پیامکی) ─────────────────────────────

  async requestOtp(dto: RequestOtpDto) {
    const normalizedPhone = this.normalizePhone(dto.phone);

    // ۱. بررسی محدودیت ارسال (Rate limit: حداکثر ۱ درخواست در هر ۶۰ ثانیه)
    const existingOtp = await this.otpRepository.findOne({
      where: { phone: normalizedPhone },
      order: { createdAt: 'DESC' },
    });

    if (existingOtp && existingOtp.lastSentAt) {
      const secondsSinceLastSent = (Date.now() - new Date(existingOtp.lastSentAt).getTime()) / 1000;
      if (secondsSinceLastSent < 60) {
        const remainingSeconds = Math.ceil(60 - secondsSinceLastSent);
        throw new BadRequestException(`لطفاً ${remainingSeconds} ثانیه دیگر برای دریافت کد جدید شکیبا باشید`);
      }
    }

    // ۲. تولید کد تصادفی ۶ رقمی با crypto منبع امن
    const randomCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // ۲ دقیقه انقضا

    // ۳. ذخیره یا آپدیت رکورد OTP
    if (existingOtp) {
      existingOtp.code = randomCode;
      existingOtp.expiresAt = expiresAt;
      existingOtp.attempts = 0;
      existingOtp.lastSentAt = new Date();
      await this.otpRepository.save(existingOtp);
    } else {
      const newOtp = this.otpRepository.create({
        phone: normalizedPhone,
        code: randomCode,
        expiresAt,
        attempts: 0,
        lastSentAt: new Date(),
      });
      await this.otpRepository.save(newOtp);
    }

    // ۴. ارسال کد از طریق SDK کاوهنگار
    await this.kavenegarService.sendOtp(normalizedPhone, randomCode);

    return {
      message: 'کد تأیید با موفقیت ارسال شد',
    };
  }

  // ─── OTP Verify & Login/Register (تأیید کد و ورود/ثبت‌نام) ─────

  async verifyOtp(dto: VerifyOtpDto, res: Response) {
    const normalizedPhone = this.normalizePhone(dto.phone);
    const inputCode = dto.code.trim();

    // ۱. جستجوی رکورد OTP مربوط به شماره
    const otpRecord = await this.otpRepository.findOne({
      where: { phone: normalizedPhone },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord) {
      throw new BadRequestException('کد تأیید معتبر یافت نشد. لطفاً مجدداً درخواست کد دهید.');
    }

    // ۲. بررسی تاریخ انقضا (۲ دقیقه)
    if (new Date() > new Date(otpRecord.expiresAt)) {
      await this.otpRepository.remove(otpRecord);
      throw new BadRequestException('کد تأیید منقضی شده است. لطفاً کد جدید دریافت کنید.');
    }

    // ۳. بررسی محدودیت ۵ بار تلاش اشتباه
    if (otpRecord.attempts >= 5) {
      await this.otpRepository.remove(otpRecord);
      throw new BadRequestException('تعداد تلاش‌های اشتباه بیش از حد مجاز است. لطفاً کد جدید دریافت کنید.');
    }

    // ۴. بررسی مطابقت کد وارد شده
    if (otpRecord.code !== inputCode) {
      otpRecord.attempts += 1;
      await this.otpRepository.save(otpRecord);
      const remainingAttempts = 5 - otpRecord.attempts;
      throw new BadRequestException(`کد وارد شده اشتباه است. (امکان ${remainingAttempts} تلاش دیگر)`);
    }

    // ۵. کد صحیح است — بلافاصله رکورد OTP حذف شود (یک‌بارمصرف واقعی)
    await this.otpRepository.remove(otpRecord);

    // ۶. چک تکراری بودن کاربر / ساخت کاربر جدید به صورت خودکار
    let user = await this.usersService.findByPhone(normalizedPhone);
    if (!user) {
      user = await this.usersService.createByPhone(normalizedPhone);
    }

    if (!user.isActive) {
      throw new UnauthorizedException('حساب کاربری شما غیرفعال شده است');
    }

    // ۷. صدور توکن و کوکی ورود
    return this.generateTokensAndSetCookie(user, res);
  }

  // ─── فرم ثبت‌نام سنتی با ایمیل (قبلی) ──────────────────────────

  async register(dto: RegisterDto, res: Response) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('این ایمیل قبلاً ثبت شده است');
    }

    const user = await this.usersService.create({
      email: dto.email.toLowerCase().trim(),
      passwordHash: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    return this.generateTokensAndSetCookie(user, res);
  }

  // ─── فرم ورود سنتی با ایمیل/رمز (قبلی) ─────────────────────────

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
    await this.usersService.clearRefreshToken(userId);

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

    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
      await this.usersService.clearRefreshToken(userId);
      throw new UnauthorizedException('نشست منقضی شده است، لطفاً دوباره وارد شوید');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
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

  private normalizePhone(phone: string): string {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    let str = phone.trim();
    for (let i = 0; i < 10; i++) {
      str = str.replace(new RegExp(persianDigits[i], 'g'), String(i));
    }
    return str;
  }

  private async generateTokensAndSetCookie(user: any, res: Response) {
    const payload = { sub: user.id, email: user.email, phone: user.phone, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.usersService.updateRefreshToken(
      user.id,
      hashedRefreshToken,
      expiresAt,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth/refresh',
    });

    return {
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      },
      message: 'ورود با موفقیت انجام شد',
    };
  }
}

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

// FIX [Pillar 4 — Input Validation]: regex برای شماره موبایل ایرانی
const IRANIAN_PHONE_REGEX = /^09[0-9]{9}$/;

// حداقل فاصله بین دو درخواست OTP (ثانیه)
const OTP_COOLDOWN_SECONDS = 60;
// زمان انقضای OTP (ثانیه)
const OTP_EXPIRE_SECONDS = 120;
// حداکثر تلاش نادرست
const OTP_MAX_ATTEMPTS = 5;

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

  // ─── OTP Request (ارسال کد پیامکی) ─────────────────────────────────────────

  async requestOtp(dto: RequestOtpDto) {
    const normalizedPhone = this.normalizeAndValidatePhone(dto.phone);

    const existingOtp = await this.otpRepository.findOne({
      where: { phone: normalizedPhone },
      order: { createdAt: 'DESC' },
    });

    if (existingOtp && existingOtp.lastSentAt) {
      const secondsSinceLastSent = (Date.now() - new Date(existingOtp.lastSentAt).getTime()) / 1000;
      if (secondsSinceLastSent < OTP_COOLDOWN_SECONDS) {
        const remainingSeconds = Math.ceil(OTP_COOLDOWN_SECONDS - secondsSinceLastSent);
        throw new BadRequestException(
          `لطفاً ${remainingSeconds} ثانیه دیگر برای دریافت کد جدید شکیبا باشید`,
        );
      }
    }

    const randomCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRE_SECONDS * 1000);

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

    const smsSent = await this.kavenegarService.sendOtp(normalizedPhone, randomCode);
    if (!smsSent) {
      return { message: 'کد تأیید ثبت شد اما ارسال پیامک با مشکل مواجه شد. لطفاً چند لحظه صبر کرده و دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.' }; // FIX: Warn if OTP is saved but SMS sending fails
    }

    return {
      message: 'کد تأیید با موفقیت ارسال شد',
    };
  }

  // ─── OTP Verify & Login/Register (تأیید کد و ورود/ثبت‌نام) ─────────────────

  async verifyOtp(dto: VerifyOtpDto, res: Response) {
    const normalizedPhone = this.normalizeAndValidatePhone(dto.phone);
    const inputCode = dto.code.trim();

    const otpRecord = await this.otpRepository.findOne({
      where: { phone: normalizedPhone },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord) {
      throw new BadRequestException('کد تأیید معتبر یافت نشد. لطفاً مجدداً درخواست کد دهید.');
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      await this.otpRepository.remove(otpRecord);
      throw new BadRequestException('کد تأیید منقضی شده است. لطفاً کد جدید دریافت کنید.');
    }

    if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
      await this.otpRepository.remove(otpRecord);
      throw new BadRequestException('تعداد تلاش‌های اشتباه بیش از حد مجاز است. لطفاً کد جدید دریافت کنید.');
    }

    const isCodeMatch = crypto.timingSafeEqual(
      Buffer.from(otpRecord.code.padEnd(10, ' ')),
      Buffer.from(inputCode.padEnd(10, ' ')),
    );

    if (!isCodeMatch) {
      otpRecord.attempts += 1;
      await this.otpRepository.save(otpRecord);
      const remainingAttempts = OTP_MAX_ATTEMPTS - otpRecord.attempts;
      throw new BadRequestException(`کد وارد شده اشتباه است. (امکان ${remainingAttempts} تلاش دیگر)`);
    }

    await this.otpRepository.remove(otpRecord);

    let user = await this.usersService.findByPhone(normalizedPhone);
    if (!user) {
      user = await this.usersService.createByPhone(normalizedPhone);
    }

    if (!user.isActive) {
      throw new UnauthorizedException('حساب کاربری شما غیرفعال شده است');
    }

    return this.generateTokensAndSetCookie(user, res);
  }

  // ─── فرم ثبت‌نام یکپارچه با ایمیل یا شماره موبایل ──────────────────────────────

  async register(dto: RegisterDto, res: Response) {
    const rawIdentifier = dto.identifier.trim();
    const isEmailInput = this.isEmail(rawIdentifier);

    let email: string | null = null;
    let phone: string | null = null;

    if (isEmailInput) {
      email = rawIdentifier.toLowerCase();
      const existing = await this.usersService.findByEmail(email);
      if (existing) {
        throw new ConflictException('این ایمیل قبلاً ثبت شده است');
      }
    } else {
      phone = this.normalizeAndValidatePhone(rawIdentifier);
      const existing = await this.usersService.findByPhone(phone);
      if (existing) {
        throw new ConflictException('این شماره موبایل قبلاً ثبت شده است');
      }
    }

    const user = await this.usersService.create({
      email,
      phone,
      passwordHash: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    return this.generateTokensAndSetCookie(user, res);
  }

  // ─── فرم ورود یکپارچه با ایمیل یا شماره موبایل ───────────────────────────────

  async login(dto: LoginDto, res: Response) {
    const rawIdentifier = dto.identifier.trim();
    const isEmailInput = this.isEmail(rawIdentifier);

    let user: any = null;

    if (isEmailInput) {
      user = await this.usersService.findByEmail(rawIdentifier.toLowerCase());
    } else {
      const normalizedPhone = this.normalizeAndValidatePhone(rawIdentifier);
      user = await this.usersService.findByPhone(normalizedPhone);
    }

    if (!user) {
      throw new UnauthorizedException('ایمیل/شماره موبایل یا رمز عبور اشتباه است');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('حساب کاربری شما غیرفعال شده است');
    }

    const isValid = await user.validatePassword(dto.password);
    if (!isValid) {
      throw new UnauthorizedException('ایمیل/شماره موبایل یا رمز عبور اشتباه است');
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

  // ─── Private Helpers ─────────────────────────────────────────────────────────

  private isEmail(identifier: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  }

  private normalizeAndValidatePhone(phone: string): string {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicDigits  = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

    let str = phone.trim();
    for (let i = 0; i < 10; i++) {
      str = str.replace(new RegExp(persianDigits[i], 'g'), String(i));
      str = str.replace(new RegExp(arabicDigits[i], 'g'), String(i));
    }

    if (str.startsWith('+98')) str = '0' + str.slice(3);
    if (str.startsWith('0098')) str = '0' + str.slice(4);
    if (str.startsWith('98') && str.length === 12) str = '0' + str.slice(2);

    if (!IRANIAN_PHONE_REGEX.test(str)) {
      throw new BadRequestException(
        'شماره موبایل نامعتبر است. شماره باید ۱۱ رقم و با ۰۹ شروع شود (مثال: 09121234567)',
      );
    }

    return str;
  }

  private async generateTokensAndSetCookie(user: any, res: Response) {
    const payload = { sub: user.id, email: user.email, phone: user.phone, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret') as string, // FIX [Pillar 3 — Security]: Removed hardcoded JWT secret fallback
      expiresIn: (this.configService.get('jwt.accessExpires') || '15m') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshSecret') as string, // FIX [Pillar 3 — Security]: Removed hardcoded JWT refresh secret fallback
      expiresIn: (this.configService.get('jwt.refreshExpires') || '7d') as any,
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

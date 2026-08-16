import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Kavenegar = require('kavenegar');

@Injectable()
export class KavenegarService {
  private readonly logger = new Logger(KavenegarService.name);
  private kavenegarApi: any = null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('KAVENEGAR_API_KEY');
    if (apiKey && apiKey !== 'your_kavenegar_api_key_here') {
      try {
        this.kavenegarApi = Kavenegar.KavenegarApi({ apikey: apiKey });
      } catch (err) {
        this.logger.warn('خطا در راه‌اندازی SDK کاوهنگار: ' + err.message);
      }
    } else {
      this.logger.warn('KAVENEGAR_API_KEY ست نشده است. پیامک‌ها به صورت شبیه‌سازی (Mock) در کنسول لاگ می‌شوند.');
    }
  }

  async sendOtp(phone: string, code: string): Promise<boolean> {
    const template = this.configService.get<string>('KAVENEGAR_OTP_TEMPLATE') || 'login-otp';

    if (!this.kavenegarApi) {
      this.logger.log(`[KAVENEGAR MOCK OTP] شماره: ${phone} | کد: ${code} | الگوی پیامک: ${template}`);
      return true;
    }

    return new Promise((resolve) => {
      this.kavenegarApi.VerifyLookup(
        {
          receptor: phone,
          token: code,
          template: template,
        },
        (response: any, status: number) => {
          if (status === 200) {
            this.logger.log(`پیامک OTP با موفقیت به ${phone} ارسال شد. کد وضعیت: ${status}`);
            resolve(true);
          } else {
            this.logger.error(`خطا در ارسال پیامک کاوهنگار به ${phone}. وضعیت: ${status} | پاسخ: ${JSON.stringify(response)}`);
            // برای عدم بلاک شدن فرایند کاربر، ارسال شبیه‌سازی هم لاگ می‌شود
            this.logger.log(`[KAVENEGAR FALLBACK OTP] شماره: ${phone} | کد: ${code}`);
            resolve(false);
          }
        },
      );
    });
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSetting } from './entities/site-setting.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

// FIX [Pillar 4 — Upload Security]: نگاشت MIME به extension
// extension از MIME type تعیین می‌شود — نه از file.originalname
const ALLOWED_HERO_MIME: Record<string, string> = {
  'image/png':  '.png',
  'image/webp': '.webp',
  'image/jpeg': '.jpg',
};

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectRepository(SiteSetting)
    private readonly repository: Repository<SiteSetting>,
  ) {}

  async getSetting(key: string): Promise<string | null> {
    const setting = await this.repository.findOne({ where: { key } });
    return setting ? setting.value : null;
  }

  async setSetting(key: string, value: string): Promise<SiteSetting> {
    let setting = await this.repository.findOne({ where: { key } });
    if (setting) {
      setting.value = value;
    } else {
      setting = this.repository.create({ key, value });
    }
    return this.repository.save(setting);
  }

  async getAllSettings(): Promise<Record<string, string>> {
    const settings = await this.repository.find();
    const result: Record<string, string> = {
      hero_image_url: '/hero_tools.jpg', // پیش‌فرض
    };

    settings.forEach((s) => {
      if (s.value) {
        result[s.key] = s.value;
      }
    });

    return result;
  }

  async saveHeroImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('هیچ فایلی ارسال نشده است');
    }

    // FIX [Pillar 4 — Upload Security]: اعتبارسنجی MIME type
    const ext = ALLOWED_HERO_MIME[file.mimetype];
    if (!ext) {
      throw new BadRequestException(
        'فرمت فایل مجاز نیست. لطفاً فایل PNG، WebP یا JPEG آپلود کنید',
      );
    }

    // FIX [Pillar 4]: حداکثر حجم ۵ مگابایت — این بررسی در service هم انجام می‌شود
    // حتی اگر در FileInterceptor تنظیم شده باشد (دفاع لایه‌ای)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('حجم تصویر نباید بیشتر از ۵ مگابایت باشد');
    }

    // ذخیره فایل در فولدر uploads/design
    const uploadDir = path.join(process.cwd(), 'uploads', 'design');

    // FIX [Pillar 4 — Upload Security]:
    // ۱. تابع async: استفاده از fs.promises به جای fs.writeFileSync sync
    //    (قبلاً writeFileSync استفاده می‌شد که event loop را بلاک می‌کرد)
    // ۲. extension از MIME type تعیین می‌شود — نه از originalname
    await fs.mkdir(uploadDir, { recursive: true });

    // نام فایل بر اساس timestamp — بدون هیچ ورودی از کلاینت
    const filename = `hero_image_${Date.now()}${ext}`;

    // path traversal prevention: فقط به uploadDir می‌نویسیم
    const filePath = path.join(uploadDir, filename);

    // FIX: async write — دیگر event loop بلاک نمی‌شود
    await fs.writeFile(filePath, file.buffer);

    const relativeUrl = `/uploads/design/${filename}`;
    await this.setSetting('hero_image_url', relativeUrl);

    return relativeUrl;
  }

  async resetHeroImage(): Promise<string> {
    const defaultUrl = '/hero_tools.jpg';
    await this.setSetting('hero_image_url', defaultUrl);
    return defaultUrl;
  }
}

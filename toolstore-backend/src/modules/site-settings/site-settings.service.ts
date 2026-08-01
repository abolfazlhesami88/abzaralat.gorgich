import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSetting } from './entities/site-setting.entity';
import * as fs from 'fs';
import * as path from 'path';

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

    // اعتبارسنجی فرمت شفاف (فقط PNG یا WebP)
    const allowedMimeTypes = ['image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'این فرمت از پس‌زمینه شفاف پشتیبانی نمی‌کند، لطفاً فایل PNG یا WebP آپلود کنید',
      );
    }

    // حداکثر حجم ۵ مگابایت
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('حجم تصویر نباید بیشتر از ۵ مگابایت باشد');
    }

    // ذخیره فایل در فولدر uploads/design
    const uploadDir = path.join(process.cwd(), 'uploads', 'design');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `hero_image_${Date.now()}${path.extname(file.originalname).toLowerCase()}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, file.buffer);

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

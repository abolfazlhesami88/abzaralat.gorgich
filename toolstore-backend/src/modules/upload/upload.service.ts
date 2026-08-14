import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { processProductImage } from './utils/image-processor';
import { UPLOAD } from '../../common/constants/app.constants';
import { v4 as uuid } from 'uuid';

// FIX [Pillar 4 — Upload Security]:
// نگاشت دقیق MIME type به extension — هرگز به file.originalname اعتماد نکنید.
// یک فایل .php می‌تواند با Content-Type: image/jpeg آپلود شود اگر extension
// از originalname گرفته شود. ما extension را فقط از MIME تعیین می‌کنیم.
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg':  '.jpg',
  'image/png':  '.png',
  'image/webp': '.webp',
};

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async uploadProductImage(file: Express.Multer.File, productId: string) {
    this.validateFile(file);

    const uploadDir = this.configService.get('UPLOAD_DIR', './uploads');
    // FIX [Pillar 4]: filename از uuid تولید می‌شود — نه از originalname
    const filename = `${Date.now()}_${uuid()}`;

    const processed = await processProductImage(file.buffer, filename, uploadDir, productId);

    return {
      url: processed.medium,
      thumbnailUrl: processed.thumbnail,
      originalUrl: processed.original,
      filename: processed.filename,
      // FIX: originalName حذف شد از response چون ارزش امنیتی منفی دارد
      // (اطلاعات محرمانه مسیر فایل سرور را leak نمی‌کنیم)
      path: processed.path,
    };
  }

  async uploadAvatarImage(file: Express.Multer.File) {
    this.validateFile(file);
    const uploadDir = this.configService.get('UPLOAD_DIR', './uploads');
    const filename = `${Date.now()}_${uuid()}`;
    const processed = await processProductImage(file.buffer, filename, uploadDir, 'avatars');
    return { url: processed.medium };
  }

  // FIX [Pillar 4 — Upload Security]:
  // ۱. MIME type را در ALLOWED_TYPES بررسی کن
  // ۲. اطمینان حاصل کن که MIME در نگاشت MIME_TO_EXT وجود دارد
  // ۳. حجم را بررسی کن
  // extension هرگز از originalname گرفته نمی‌شود
  private validateFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('فایلی ارسال نشده است');
    }

    if (!UPLOAD.ALLOWED_TYPES.includes(file.mimetype as any)) {
      throw new BadRequestException(
        'فرمت فایل مجاز نیست. فقط JPG، PNG، WebP پذیرفته می‌شود',
      );
    }

    // اطمینان از اینکه MIME در نگاشت ما وجود دارد (دفاع لایه‌ای)
    if (!MIME_TO_EXT[file.mimetype]) {
      throw new BadRequestException(
        'نوع فایل ارسالی پشتیبانی نمی‌شود',
      );
    }

    if (file.size > UPLOAD.MAX_SIZE) {
      throw new BadRequestException('حجم فایل نباید بیشتر از ۵ مگابایت باشد');
    }
  }
}

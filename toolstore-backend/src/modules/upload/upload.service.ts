import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { processProductImage } from './utils/image-processor';
import { UPLOAD } from '../../common/constants/app.constants';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async uploadProductImage(file: Express.Multer.File, productId: string) {
    this.validateFile(file);

    const uploadDir = this.configService.get('UPLOAD_DIR', './uploads');
    const random8 = Math.random().toString(36).substring(2, 10);
    const filename = `${Date.now()}_${random8}`;

    const processed = await processProductImage(file.buffer, filename, uploadDir, productId);

    return {
      url: processed.medium,
      thumbnailUrl: processed.thumbnail,
      originalUrl: processed.original,
      filename: processed.filename,
      originalName: processed.originalName,
      path: processed.path,
    };
  }

  async uploadAvatarImage(file: Express.Multer.File) {
    this.validateFile(file);
    const uploadDir = this.configService.get('UPLOAD_DIR', './uploads');
    const random8 = Math.random().toString(36).substring(2, 10);
    const filename = `${Date.now()}_${random8}`;
    const processed = await processProductImage(file.buffer, filename, uploadDir, 'avatars');
    return { url: processed.medium };
  }

  private validateFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('فایلی ارسال نشده است');
    }

    if (!UPLOAD.ALLOWED_TYPES.includes(file.mimetype as any)) {
      throw new BadRequestException('فرمت فایل مجاز نیست. فقط JPG، PNG، WebP پذیرفته میشود');
    }

    if (file.size > UPLOAD.MAX_SIZE) {
      throw new BadRequestException('حجم فایل نباید بیشتر از ۵ مگابایت باشد');
    }
  }
}

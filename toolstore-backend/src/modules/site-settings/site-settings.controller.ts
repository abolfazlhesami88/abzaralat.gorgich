import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { SiteSettingsService } from './site-settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../common/constants/app.constants';

const MAX_HERO_FILE_SIZE = 5 * 1024 * 1024; // ۵ مگابایت

@ApiTags('Site Settings')
@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'دریافت تمامی تنظیمات عمومی سایت' })
  async getSettings() {
    return this.siteSettingsService.getAllSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('admin/hero-image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'آپلود تصویر هیروی جدید (ادمین)' })
  @ApiConsumes('multipart/form-data')
  // FIX [Pillar 4 — Upload Security]:
  // قبلاً FileInterceptor بدون limits تعریف شده بود.
  // حالا fileSize محدود می‌شود تا فایل‌های بزرگ حتی
  // قبل از رسیدن به service رد شوند (جلوگیری از OOM).
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: MAX_HERO_FILE_SIZE },
    fileFilter: (_req, file, cb) => {
      // FIX: فقط MIME type های تأییدشده — نه بر اساس extension
      const allowedMimes = ['image/png', 'image/webp', 'image/jpeg'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException(
            'فرمت فایل مجاز نیست. فقط PNG، WebP و JPEG پذیرفته می‌شود',
          ),
          false,
        );
      }
    },
  }))
  async uploadHeroImage(@UploadedFile() file: Express.Multer.File) {
    const heroImageUrl = await this.siteSettingsService.saveHeroImage(file);
    return {
      message: 'تصویر هیرو با موفقیت بروزرسانی شد',
      data: { hero_image_url: heroImageUrl },
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('admin/hero-image/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'بازگشت تصویر هیرو به حالت پیش‌فرض (ادمین)' })
  async resetHeroImage() {
    const heroImageUrl = await this.siteSettingsService.resetHeroImage();
    return {
      message: 'تصویر هیرو به حالت پیش‌فرض بازگشت',
      data: { hero_image_url: heroImageUrl },
    };
  }
}

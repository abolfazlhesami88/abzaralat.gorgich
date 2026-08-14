import {
  Controller, Post, UseInterceptors, UploadedFile,
  UseGuards, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, UPLOAD } from '../../common/constants/app.constants';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

// FIX [Pillar 4 — Upload Security]:
// fileFilter بر اساس MIME type — نه file extension یا originalname
// این جلوگیری می‌کند از آپلود فایل‌های مخرب با extension تغییریافته
const imageFileFilter = (_req: any, file: Express.Multer.File, cb: Function) => {
  if (UPLOAD.ALLOWED_TYPES.includes(file.mimetype as any)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(
        'فرمت فایل مجاز نیست. فقط JPG، PNG، WebP پذیرفته می‌شود',
      ),
      false,
    );
  }
};

@ApiTags('Upload')
@ApiBearerAuth()
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // فقط ادمین می‌تواند تصویر آپلود کند
  @Roles(UserRole.ADMIN)
  @Post('product-image')
  @ApiOperation({ summary: 'آپلود تصویر محصول (فقط ادمین)' })
  @ApiConsumes('multipart/form-data')
  // FIX [Pillar 4]: هم fileSize limit و هم fileFilter بر اساس MIME
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: UPLOAD.MAX_SIZE },
    fileFilter: imageFileFilter,
  }))
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('فایلی ارسال نشده است');
    }
    return { data: await this.uploadService.uploadProductImage(file, 'temp') };
  }
}

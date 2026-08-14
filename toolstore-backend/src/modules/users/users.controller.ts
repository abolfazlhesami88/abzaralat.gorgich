import {
  Controller, Get, Patch, Post, Body, UseGuards, UploadedFile, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UploadService } from '../upload/upload.service';
import { UPLOAD } from '../../common/constants/app.constants';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser('sub') userId: string) {
    return { data: await this.usersService.getDashboardStats(userId) };
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return { data: await this.usersService.updateProfile(userId, dto) };
  }

  @Post('profile/avatar')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: UPLOAD.MAX_SIZE },
    fileFilter: (req, file, cb) => {
      if (!UPLOAD.ALLOWED_TYPES.includes(file.mimetype as any)) {
        return cb(new BadRequestException('فرمت فایل نامعتبر است'), false);
      }
      cb(null, true);
    },
  }))
  async uploadAvatar(
    @CurrentUser('sub') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { url } = await this.uploadService.uploadAvatarImage(file);
    await this.usersService.updateProfile(userId, { avatarUrl: url } as any);
    return { data: { avatarUrl: url } };
  }

  @Post('change-password')
  async changePassword(
    @CurrentUser('sub') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(userId, dto);
    return { data: null, message: 'رمز عبور با موفقیت تغییر یافت' };
  }
}

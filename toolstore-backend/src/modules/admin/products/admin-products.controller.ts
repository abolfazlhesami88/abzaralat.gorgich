import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UseGuards, UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminProductsService } from './admin-products.service';
import type { AdminProductQuery } from './admin-products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { BulkEditDto } from './dto/bulk-update.dto';
import { UploadService } from '../../upload/upload.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole, UPLOAD } from '../../../common/constants/app.constants';

// FIX [Pillar 4 — Upload Security]: fileFilter بر اساس MIME — نه extension
const imageFileFilter = (_req: any, file: Express.Multer.File, cb: Function) => {
  if (UPLOAD.ALLOWED_TYPES.includes(file.mimetype as any)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException('فرمت فایل مجاز نیست. فقط JPG، PNG، WebP پذیرفته می‌شود'),
      false,
    );
  }
};

@ApiTags('Admin — Products')
@Controller('admin/products')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminProductsController {
  constructor(
    private readonly adminProductsService: AdminProductsService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  async findAll(@Query() query: AdminProductQuery) {
    return { data: await this.adminProductsService.findAll(query) };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { data: await this.adminProductsService.findOne(id) };
  }

  @Post()
  async create(@Body() dto: CreateProductDto) {
    return { data: await this.adminProductsService.create(dto) };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
    return { data: await this.adminProductsService.update(id, dto) };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.adminProductsService.remove(id);
    return { data: null, message: 'محصول حذف شد' };
  }

  // FIX [Pillar 4 — Upload Security]:
  // قبلاً FileInterceptor بدون limits و fileFilter بود.
  // حالا: fileSize محدود + MIME-based fileFilter
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: UPLOAD.MAX_SIZE },
    fileFilter: imageFileFilter,
  }))
  async addImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('primary') primary?: string,
  ) {
    if (!file) {
      throw new BadRequestException('فایلی ارسال نشده است');
    }
    const imageData = await this.uploadService.uploadProductImage(file, id);
    return { data: await this.adminProductsService.addImage(id, imageData, primary === 'true') };
  }

  @Delete(':id/images/:imageId')
  async removeImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    await this.adminProductsService.removeImage(imageId);
    return { data: null };
  }

  @Post(':id/images/reorder')
  async reorderImages(@Param('id') id: string, @Body('imageIds') imageIds: string[]) {
    await this.adminProductsService.reorderImages(id, imageIds);
    return { data: null };
  }

  @Post('bulk-status')
  async bulkUpdateStatus(@Body('ids') ids: string[], @Body('status') status: string) {
    return { data: await this.adminProductsService.bulkUpdateStatus(ids, status) };
  }

  @Post('bulk-edit')
  async bulkEdit(@Body() dto: BulkEditDto) {
    return { data: await this.adminProductsService.bulkEdit(dto) };
  }
}

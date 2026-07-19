import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminProductsService } from './admin-products.service';
import type { AdminProductQuery, CreateProductDto } from './admin-products.service';
import { UploadService } from '../../upload/upload.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/constants/app.constants';

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

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file'))
  async addImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('primary') primary?: string,
  ) {
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
}

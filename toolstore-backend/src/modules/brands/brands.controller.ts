import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'لیست تمام برندهای فعال' })
  async findAll() {
    return { data: await this.brandsService.findAll() };
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'جزئیات یک برند' })
  async findBySlug(@Param('slug') slug: string) {
    return { data: await this.brandsService.findBySlug(slug) };
  }
}

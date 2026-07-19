import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'ساختار درختی دستهبندیها' })
  async findTree() {
    return { data: await this.categoriesService.findTree() };
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'جزئیات یک دستهبندی' })
  async findBySlug(@Param('slug') slug: string) {
    return { data: await this.categoriesService.findBySlug(slug) };
  }
}

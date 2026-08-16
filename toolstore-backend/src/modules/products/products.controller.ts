import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { QueryProductsDto } from './dto/query-products.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'لیست محصولات با فیلتر و جستجو' })
  async findAll(@Query() query: QueryProductsDto) {
    return { data: await this.productsService.findAll(query) };
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'محصولات ویژه' })
  async findFeatured(@Query('limit') limit?: number) {
    return { data: await this.productsService.findFeatured(limit) };
  }

  @Public()
  @Get('new-arrivals')
  @ApiOperation({ summary: 'جدیدترین محصولات' })
  async findNewArrivals(@Query('limit') limit?: number) {
    return { data: await this.productsService.findNewArrivals(limit) };
  }

  @Public()
  @Get('best-sellers')
  @ApiOperation({ summary: 'پرفروشترین محصولات' })
  async findBestSellers(@Query('limit') limit?: number) {
    return { data: await this.productsService.findBestSellers(limit) };
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'جزئیات یک محصول' })
  async findBySlug(@Param('slug') slug: string) {
    return { data: await this.productsService.findBySlug(slug) };
  }

  @Public()
  @Get(':slug/related')
  @ApiOperation({ summary: 'محصولات مرتبط' })
  async findRelated(@Param('slug') slug: string, @Query('limit') limit?: number) {
    return { data: await this.productsService.findRelated(slug, limit) };
  }
}

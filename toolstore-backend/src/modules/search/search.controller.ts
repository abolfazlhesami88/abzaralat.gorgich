import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'جستجوی کامل محصولات' })
  async search(
    @Query('q') q: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return { data: await this.searchService.search(q, page, limit) };
  }

  @Public()
  @Get('suggestions')
  @ApiOperation({ summary: 'پیشنهاد جستجوی خودکار' })
  async suggestions(@Query('q') q: string) {
    return { data: await this.searchService.suggestions(q) };
  }
}

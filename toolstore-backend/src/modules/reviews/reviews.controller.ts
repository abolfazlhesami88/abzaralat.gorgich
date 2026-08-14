import {
  Controller, Get, Post, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get('products/:slug/reviews')
  @ApiOperation({ summary: 'لیست نظرات یک محصول' })
  async findByProduct(
    @Param('slug') slug: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return { data: await this.reviewsService.findByProductSlug(slug, page, limit) };
  }

  @Public()
  @Get('products/:slug/reviews/summary')
  @ApiOperation({ summary: 'خلاصه امتیازات محصول' })
  async getRatingSummary(@Param('slug') slug: string) {
    return { data: await this.reviewsService.getRatingSummary(slug) };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('products/:slug/reviews')
  @ApiOperation({ summary: 'ثبت نظر جدید برای محصول' })
  async create(
    @CurrentUser('sub') userId: string,
    @Param('slug') slug: string,
    @Body() dto: Omit<CreateReviewDto, 'productId'> & { productId?: string },
  ) {
    return { data: await this.reviewsService.create(userId, dto as CreateReviewDto) };
  }

  // FIX [Pillar 3 — Authentication]:
  // markHelpful حالا نیازمند JwtAuthGuard است — قبلاً Public بود و هر کسی
  // می‌توانست بی‌نهایت بار helpfulCount را افزایش دهد.
  // علاوه بر این، userId به service پاس می‌شود تا self-vote جلوگیری شود.
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('reviews/:id/helpful')
  @ApiOperation({ summary: 'علامت‌گذاری نظر به‌عنوان مفید (نیازمند لاگین)' })
  async markHelpful(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return { data: await this.reviewsService.markHelpful(id, userId) };
  }
}

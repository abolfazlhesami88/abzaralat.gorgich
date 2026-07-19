import { Controller, Get, Patch, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../../reviews/entities/review.entity';
import { Repository } from 'typeorm';
import { ReviewsService } from '../../reviews/reviews.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/constants/app.constants';
import { paginate } from '../../../common/dto/pagination.dto';

@ApiTags('Admin — Reviews')
@Controller('admin/reviews')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminReviewsController {
  constructor(
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('approved') approved?: string,
  ) {
    const qb = this.reviewRepo
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.product', 'product')
      .orderBy('review.createdAt', 'DESC');

    if (approved !== undefined) {
      qb.andWhere('review.isApproved = :approved', { approved: approved === 'true' });
    }

    const [items, total] = await qb
      .skip((Number(page) - 1) * Number(limit))
      .take(Number(limit))
      .getManyAndCount();

    return { data: paginate(items, total, Number(page), Number(limit)) };
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    await this.reviewRepo.update(id, { isApproved: true });
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (review?.productId) {
      await this.reviewsService.recalculateProductRating(review.productId);
    }
    return { data: null, message: 'نظر تأیید شد' };
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string) {
    await this.reviewRepo.update(id, { isApproved: false });
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (review?.productId) {
      await this.reviewsService.recalculateProductRating(review.productId);
    }
    return { data: null, message: 'نظر رد شد' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    await this.reviewRepo.delete(id);
    if (review?.productId) {
      await this.reviewsService.recalculateProductRating(review.productId);
    }
    return { data: null };
  }
}

import {
  Injectable, NotFoundException, ConflictException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { OrderStatus } from '../../common/constants/app.constants';
import { paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  // لیست نظرات تأییدشده یک محصول — برای صفحه محصول
  async findByProductSlug(slug: string, page = 1, limit = 10) {
    const product = await this.productRepo.findOne({ where: { slug } });
    if (!product) throw new NotFoundException('محصول یافت نشد');

    const [items, total] = await this.reviewRepo.findAndCount({
      where: { productId: product.id, isApproved: true },
      relations: { user: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // فقط اطلاعات عمومی کاربر برمیگردد
    const sanitized = items.map((review) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      body: review.body,
      isVerifiedPurchase: review.isVerifiedPurchase,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt,
      userName: review.user
        ? `${review.user.firstName ?? ''} ${review.user.lastName?.[0] ?? ''}`.trim() || 'کاربر ToolStore'
        : 'کاربر حذفشده',
    }));

    return paginate(sanitized, total, page, limit);
  }

  // خلاصه امتیازات — برای نمایش نمودار توزیع ستاره در صفحه محصول
  async getRatingSummary(productSlug: string) {
    const product = await this.productRepo.findOne({ where: { slug: productSlug } });
    if (!product) throw new NotFoundException('محصول یافت نشد');

    const rows = await this.reviewRepo
      .createQueryBuilder('review')
      .select('review.rating', 'rating')
      .addSelect('COUNT(*)', 'count')
      .where('review.productId = :id', { id: product.id })
      .andWhere('review.isApproved = true')
      .groupBy('review.rating')
      .getRawMany();

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    rows.forEach((r) => { distribution[r.rating] = parseInt(r.count); });

    return {
      averageRating: product.averageRating,
      totalReviews: product.reviewCount,
      distribution,
    };
  }

  // ثبت نظر جدید — فقط کاربران لاگینکرده
  async create(userId: string, dto: CreateReviewDto) {
    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('محصول یافت نشد');

    // بررسی تکراری نبودن نظر
    const existing = await this.reviewRepo.findOne({
      where: { productId: dto.productId, userId },
    });
    if (existing) {
      throw new ConflictException('شما قبلاً برای این محصول نظر ثبت کردهاید');
    }

    // بررسی خرید واقعی برای تیک "خرید تأییدشده"
    let isVerifiedPurchase = false;
    let orderId: string | null = null;

    if (dto.orderId) {
      const order = await this.orderRepo.findOne({
        where: { id: dto.orderId, userId, status: OrderStatus.DELIVERED },
        relations: { items: true },
      });

      if (!order) {
        throw new ForbiddenException('سفارش معتبر برای ثبت نظر یافت نشد');
      }

      const hasProduct = order.items.some((item) => item.productId === dto.productId);
      if (!hasProduct) {
        throw new ForbiddenException('این محصول در سفارش انتخابی شما نیست');
      }

      isVerifiedPurchase = true;
      orderId = order.id;
    }

    const review = this.reviewRepo.create({
      productId: dto.productId,
      userId,
      orderId,
      rating: dto.rating,
      title: dto.title,
      body: dto.body,
      isVerifiedPurchase,
      isApproved: false, // باید توسط ادمین تأیید شود (مرحله ۸)
    });

    return this.reviewRepo.save(review);
  }

  async markHelpful(reviewId: string) {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('نظر یافت نشد');

    review.helpfulCount += 1;
    return this.reviewRepo.save(review);
  }

  // ─── این متد بعد از تأیید/رد نظر در مرحله ۸ صدا زده میشود ─────────
  // محاسبه مجدد averageRating و reviewCount محصول
  async recalculateProductRating(productId: string) {
    const result = await this.reviewRepo
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .where('review.productId = :productId', { productId })
      .andWhere('review.isApproved = true')
      .getRawOne();

    await this.productRepo.update(productId, {
      averageRating: parseFloat(result.avg) || 0,
      reviewCount: parseInt(result.count) || 0,
    });
  }
}

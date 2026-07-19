import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private readonly reviewRepo;
    private readonly productRepo;
    private readonly orderRepo;
    constructor(reviewRepo: Repository<Review>, productRepo: Repository<Product>, orderRepo: Repository<Order>);
    findByProductSlug(slug: string, page?: number, limit?: number): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
        id: string;
        rating: number;
        title: string;
        body: string;
        isVerifiedPurchase: boolean;
        helpfulCount: number;
        createdAt: Date;
        userName: string;
    }>>;
    getRatingSummary(productSlug: string): Promise<{
        averageRating: number;
        totalReviews: number;
        distribution: Record<number, number>;
    }>;
    create(userId: string, dto: CreateReviewDto): Promise<Review>;
    markHelpful(reviewId: string): Promise<Review>;
    recalculateProductRating(productId: string): Promise<void>;
}

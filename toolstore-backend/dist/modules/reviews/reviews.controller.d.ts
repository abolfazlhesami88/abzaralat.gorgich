import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findByProduct(slug: string, page?: number, limit?: number): Promise<{
        data: import("../../common/dto/pagination.dto").PaginatedResult<{
            id: string;
            rating: number;
            title: string;
            body: string;
            isVerifiedPurchase: boolean;
            helpfulCount: number;
            createdAt: Date;
            userName: string;
        }>;
    }>;
    getRatingSummary(slug: string): Promise<{
        data: {
            averageRating: number;
            totalReviews: number;
            distribution: Record<number, number>;
        };
    }>;
    create(userId: string, slug: string, dto: Omit<CreateReviewDto, 'productId'> & {
        productId?: string;
    }): Promise<{
        data: import("./entities/review.entity").Review;
    }>;
    markHelpful(id: string): Promise<{
        data: import("./entities/review.entity").Review;
    }>;
}

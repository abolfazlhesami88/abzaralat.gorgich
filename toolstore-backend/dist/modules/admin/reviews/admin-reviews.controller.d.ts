import { Review } from '../../reviews/entities/review.entity';
import { Repository } from 'typeorm';
import { ReviewsService } from '../../reviews/reviews.service';
export declare class AdminReviewsController {
    private readonly reviewRepo;
    private readonly reviewsService;
    constructor(reviewRepo: Repository<Review>, reviewsService: ReviewsService);
    findAll(page?: number, limit?: number, approved?: string): Promise<{
        data: import("../../../common/dto/pagination.dto").PaginatedResult<Review>;
    }>;
    approve(id: string): Promise<{
        data: null;
        message: string;
    }>;
    reject(id: string): Promise<{
        data: null;
        message: string;
    }>;
    remove(id: string): Promise<{
        data: null;
    }>;
}

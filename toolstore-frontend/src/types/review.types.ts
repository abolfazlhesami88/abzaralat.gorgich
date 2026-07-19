export interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  userName: string;
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

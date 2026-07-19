export declare enum UserRole {
    CUSTOMER = "customer",
    ADMIN = "admin"
}
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentStatus {
    UNPAID = "unpaid",
    PAID = "paid",
    REFUNDED = "refunded"
}
export declare enum CouponType {
    PERCENTAGE = "percentage",
    FIXED = "fixed",
    FREE_SHIPPING = "free_shipping"
}
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
};
export declare const UPLOAD: {
    readonly MAX_SIZE: number;
    readonly ALLOWED_TYPES: readonly ["image/jpeg", "image/png", "image/webp"];
    readonly MAX_IMAGES_PER_PRODUCT: 8;
};

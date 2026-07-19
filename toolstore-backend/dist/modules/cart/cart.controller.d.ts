import { CartService } from './cart.service';
import { AddToCartDto, ApplyCouponDto } from './dto/add-to-cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    private getIds;
    getCart(user: any, req: any): Promise<{
        data: {
            cartId: string;
            items: {
                id: string;
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    sku: string;
                    stock: number;
                    image: string;
                } | null;
                variant: {
                    id: string;
                    name: string;
                } | null;
                quantity: number;
                priceAtTime: number;
                totalPrice: number;
            }[];
            subtotal: number;
            shippingCost: number;
            freeShippingRemaining: number;
            total: number;
            itemCount: number;
        };
    }>;
    addItem(dto: AddToCartDto, user: any, req: any): Promise<{
        data: {
            cartId: string;
            items: {
                id: string;
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    sku: string;
                    stock: number;
                    image: string;
                } | null;
                variant: {
                    id: string;
                    name: string;
                } | null;
                quantity: number;
                priceAtTime: number;
                totalPrice: number;
            }[];
            subtotal: number;
            shippingCost: number;
            freeShippingRemaining: number;
            total: number;
            itemCount: number;
        };
    }>;
    updateItem(id: string, quantity: number, user: any, req: any): Promise<{
        data: {
            cartId: string;
            items: {
                id: string;
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    sku: string;
                    stock: number;
                    image: string;
                } | null;
                variant: {
                    id: string;
                    name: string;
                } | null;
                quantity: number;
                priceAtTime: number;
                totalPrice: number;
            }[];
            subtotal: number;
            shippingCost: number;
            freeShippingRemaining: number;
            total: number;
            itemCount: number;
        };
    }>;
    removeItem(id: string, user: any, req: any): Promise<{
        data: {
            cartId: string;
            items: {
                id: string;
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    sku: string;
                    stock: number;
                    image: string;
                } | null;
                variant: {
                    id: string;
                    name: string;
                } | null;
                quantity: number;
                priceAtTime: number;
                totalPrice: number;
            }[];
            subtotal: number;
            shippingCost: number;
            freeShippingRemaining: number;
            total: number;
            itemCount: number;
        };
    }>;
    applyCoupon(dto: ApplyCouponDto, user: any, req: any): Promise<{
        data: {
            coupon: {
                code: string;
                type: import("../../common/constants/app.constants").CouponType;
                value: number;
            };
            discountAmount: number;
            total: number;
            cartId: string;
            items: {
                id: string;
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    sku: string;
                    stock: number;
                    image: string;
                } | null;
                variant: {
                    id: string;
                    name: string;
                } | null;
                quantity: number;
                priceAtTime: number;
                totalPrice: number;
            }[];
            subtotal: number;
            shippingCost: number;
            freeShippingRemaining: number;
            itemCount: number;
        };
    }>;
    mergeGuest(sessionId: string, user: any): Promise<{
        data: null;
    } | {
        data: {
            cartId: string;
            items: {
                id: string;
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    sku: string;
                    stock: number;
                    image: string;
                } | null;
                variant: {
                    id: string;
                    name: string;
                } | null;
                quantity: number;
                priceAtTime: number;
                totalPrice: number;
            }[];
            subtotal: number;
            shippingCost: number;
            freeShippingRemaining: number;
            total: number;
            itemCount: number;
        };
    }>;
}

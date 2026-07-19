import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { CouponsService } from '../coupons/coupons.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
export declare class CartService {
    private readonly cartRepo;
    private readonly cartItemRepo;
    private readonly productRepo;
    private readonly variantRepo;
    private readonly couponsService;
    constructor(cartRepo: Repository<Cart>, cartItemRepo: Repository<CartItem>, productRepo: Repository<Product>, variantRepo: Repository<ProductVariant>, couponsService: CouponsService);
    getOrCreate(userId?: string, sessionId?: string): Promise<Cart>;
    getCartSummary(userId?: string, sessionId?: string): Promise<{
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
    }>;
    addItem(dto: AddToCartDto, userId?: string, sessionId?: string): Promise<{
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
    }>;
    updateItem(itemId: string, quantity: number, userId?: string, sessionId?: string): Promise<{
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
    }>;
    removeItem(itemId: string, userId?: string, sessionId?: string): Promise<{
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
    }>;
    clearCart(cartId: string): Promise<void>;
    applyCoupon(code: string, userId?: string, sessionId?: string): Promise<{
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
    }>;
    mergeGuestCart(sessionId: string, userId: string): Promise<void>;
    private buildSummary;
}

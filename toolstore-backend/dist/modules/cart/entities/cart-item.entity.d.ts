import { BaseEntity } from '../../../database/entities/base.entity';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
export declare class CartItem extends BaseEntity {
    cart: Cart;
    cartId: string;
    product: Product;
    productId: string;
    variant: ProductVariant;
    variantId: string | null;
    quantity: number;
    priceAtTime: number;
    get totalPrice(): number;
}

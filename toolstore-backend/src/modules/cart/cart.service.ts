import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { CouponsService } from '../coupons/coupons.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

const SHIPPING_THRESHOLD = 30_000_000; // ۳,۰۰۰,۰۰۰ تومان — ارسال رایگان
const SHIPPING_COST = 500_000;         // ۵۰,۰۰۰ تومان هزینه ارسال

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant) private readonly variantRepo: Repository<ProductVariant>,
    private readonly couponsService: CouponsService,
  ) {}

  // دریافت یا ساخت سبد خرید — برای هر دو حالت Guest و کاربر لاگینکرده
  async getOrCreate(userId?: string, sessionId?: string): Promise<Cart> {
    if (!userId && !sessionId) {
      throw new BadRequestException('شناسه کاربر یا نشست الزامی است');
    }

    const where = userId ? { userId } : { sessionId };

    let cart = await this.cartRepo.findOne({
      where,
      relations: { items: { product: { images: true }, variant: true } },
    });

    if (!cart) {
      cart = this.cartRepo.create(userId ? { userId } : { sessionId });
      cart = await this.cartRepo.save(cart);
      cart.items = [];
    }

    return cart;
  }

  // دریافت سبد با خلاصه محاسبات قیمت
  async getCartSummary(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreate(userId, sessionId);
    return this.buildSummary(cart);
  }

  async addItem(dto: AddToCartDto, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreate(userId, sessionId);

    const product = await this.productRepo.findOne({ where: { id: dto.productId, status: 'active' as any } });
    if (!product) throw new NotFoundException('محصول یافت نشد');

    // بررسی موجودی
    const availableStock = dto.variantId
      ? (await this.variantRepo.findOne({ where: { id: dto.variantId } }))?.stock ?? 0
      : product.stock;

    if (availableStock < dto.quantity) {
      throw new BadRequestException(`تنها ${availableStock} عدد از این محصول موجود است`);
    }

    // بررسی آیا این محصول/variant قبلاً در سبد است
    const existingItem = cart.items?.find(
      (item) => item.productId === dto.productId && item.variantId === (dto.variantId ?? null),
    );

    const unitPrice = dto.variantId
      ? product.price + ((await this.variantRepo.findOne({ where: { id: dto.variantId } }))?.priceModifier ?? 0)
      : product.price;

    if (existingItem) {
      const newQty = existingItem.quantity + dto.quantity;
      if (newQty > availableStock) {
        throw new BadRequestException(`حداکثر ${availableStock} عدد میتوانید سفارش دهید`);
      }
      existingItem.quantity = newQty;
      await this.cartItemRepo.save(existingItem);
    } else {
      const item = this.cartItemRepo.create({
        cartId: cart.id,
        productId: dto.productId,
        variantId: dto.variantId ?? null,
        quantity: dto.quantity,
        priceAtTime: unitPrice,
      });
      await this.cartItemRepo.save(item);
    }

    return this.getCartSummary(userId, sessionId);
  }

  async updateItem(itemId: string, quantity: number, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreate(userId, sessionId);

    const item = cart.items?.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('آیتم در سبد خرید یافت نشد');

    if (quantity <= 0) {
      return this.removeItem(itemId, userId, sessionId);
    }

    // بررسی مجدد موجودی
    const product = await this.productRepo.findOne({ where: { id: item.productId } });
    const stock = item.variantId
      ? (await this.variantRepo.findOne({ where: { id: item.variantId } }))?.stock ?? 0
      : (product?.stock ?? 0);

    if (quantity > stock) {
      throw new BadRequestException(`تنها ${stock} عدد موجود است`);
    }

    item.quantity = quantity;
    await this.cartItemRepo.save(item);
    return this.getCartSummary(userId, sessionId);
  }

  async removeItem(itemId: string, userId?: string, sessionId?: string) {
    await this.cartItemRepo.delete(itemId);
    return this.getCartSummary(userId, sessionId);
  }

  async clearCart(cartId: string) {
    await this.cartItemRepo.delete({ cartId });
  }

  async applyCoupon(code: string, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreate(userId, sessionId);
    const summary = await this.buildSummary(cart);

    const { coupon, discountAmount } = await this.couponsService.validate(
      code, summary.subtotal,
    );

    return {
      ...summary,
      coupon: { code: coupon.code, type: coupon.type, value: coupon.value },
      discountAmount,
      total: summary.subtotal - discountAmount + summary.shippingCost,
    };
  }

  // همگامسازی سبد Guest با سبد کاربر بعد از لاگین
  // وقتی کاربر لاگین میکند، آیتمهای سبد Guest به سبد کاربر منتقل میشوند
  async mergeGuestCart(sessionId: string, userId: string) {
    const guestCart = await this.cartRepo.findOne({
      where: { sessionId },
      relations: { items: true },
    });

    if (!guestCart || !guestCart.items?.length) return;

    const userCart = await this.getOrCreate(userId);

    for (const guestItem of guestCart.items) {
      try {
        await this.addItem(
          { productId: guestItem.productId, variantId: guestItem.variantId ?? undefined, quantity: guestItem.quantity },
          userId,
        );
      } catch {
        // اگر محصول ناموجود شده، از آن بگذر
      }
    }

    // پاک کردن سبد Guest
    await this.clearCart(guestCart.id);
    await this.cartRepo.delete(guestCart.id);
  }

  // ─── Helper: محاسبه خلاصه سبد خرید ─────────────────────────────────
  private async buildSummary(cart: Cart) {
    const items = cart.items ?? [];
    const subtotal = items.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0);
    const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const freeShippingRemaining = subtotal < SHIPPING_THRESHOLD
      ? SHIPPING_THRESHOLD - subtotal
      : 0;

    return {
      cartId: cart.id,
      items: items.map((item) => ({
        id: item.id,
        product: item.product ? {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          sku: item.product.sku,
          stock: item.product.stock,
          image: item.product.images?.find((img) => img.isPrimary)?.url ?? item.product.images?.[0]?.url ?? null,
        } : null,
        variant: item.variant ? { id: item.variant.id, name: item.variant.name } : null,
        quantity: item.quantity,
        priceAtTime: item.priceAtTime,
        totalPrice: item.priceAtTime * item.quantity,
      })),
      subtotal,
      shippingCost,
      freeShippingRemaining,
      total: subtotal + shippingCost,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }
}

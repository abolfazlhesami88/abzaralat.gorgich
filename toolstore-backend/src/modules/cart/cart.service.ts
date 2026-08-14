import {
  Injectable, NotFoundException, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { CouponsService } from '../coupons/coupons.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CouponType } from '../../common/constants/app.constants';

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

  // دریافت یا ساخت سبد خرید — برای هر دو حالت Guest و کاربر لاگین‌کرده
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
    if (!product) throw new NotFoundException('محصول یافت نشد یا در دسترس نیست');

    // FIX [Pillar 5 — N+1]: در صورت وجود variantId، فقط یک بار variant را fetch کن
    // (قبلاً دو بار: یک بار برای stock، یک بار برای priceModifier)
    let variant: ProductVariant | null = null;
    if (dto.variantId) {
      variant = await this.variantRepo.findOne({ where: { id: dto.variantId, productId: product.id } });
      if (!variant) {
        throw new NotFoundException('تنوع انتخابی محصول یافت نشد');
      }
    }

    // بررسی موجودی
    const availableStock = variant ? variant.stock : product.stock;

    if (availableStock < dto.quantity) {
      throw new BadRequestException(`تنها ${availableStock} عدد از این محصول موجود است`);
    }

    const unitPrice = variant
      ? product.price + (variant.priceModifier ?? 0)
      : product.price;

    // بررسی آیا این محصول/variant قبلاً در سبد است
    const existingItem = cart.items?.find(
      (item) => item.productId === dto.productId && item.variantId === (dto.variantId ?? null),
    );

    if (existingItem) {
      const newQty = existingItem.quantity + dto.quantity;
      if (newQty > availableStock) {
        throw new BadRequestException(`حداکثر ${availableStock} عدد می‌توانید سفارش دهید`);
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

    // FIX [Pillar 3 — IDOR]: پیدا کردن آیتم از داخل cart کاربر (نه مستقیم از DB)
    // تضمین می‌کند که فقط آیتم‌های سبد خود کاربر قابل تغییر هستند
    const item = cart.items?.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('آیتم در سبد خرید یافت نشد');

    if (quantity <= 0) {
      return this.removeItem(itemId, userId, sessionId);
    }

    // بررسی مجدد موجودی — یک query برای هر دو حالت
    let availableStock: number;
    if (item.variantId) {
      const variant = await this.variantRepo.findOne({ where: { id: item.variantId } });
      availableStock = variant?.stock ?? 0;
    } else {
      const product = await this.productRepo.findOne({ where: { id: item.productId } });
      availableStock = product?.stock ?? 0;
    }

    if (quantity > availableStock) {
      throw new BadRequestException(`تنها ${availableStock} عدد موجود است`);
    }

    item.quantity = quantity;
    await this.cartItemRepo.save(item);
    return this.getCartSummary(userId, sessionId);
  }

  // FIX [Pillar 3 — IDOR]: قبلاً cartItemRepo.delete(itemId) مستقیم فراخوانی می‌شد
  // که هر کاربر می‌توانست آیتم هر سبد دیگری را پاک کند.
  // اکنون: آیتم فقط در صورتی حذف می‌شود که به سبد کاربر تعلق داشته باشد.
  async removeItem(itemId: string, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreate(userId, sessionId);

    const item = cart.items?.find((i) => i.id === itemId);
    if (!item) {
      // آیتم یا وجود ندارد یا به سبد این کاربر تعلق ندارد
      throw new ForbiddenException('آیتم در سبد خرید شما یافت نشد');
    }

    // حذف ایمن — فقط اگر cartId مطابقت داشته باشد
    await this.cartItemRepo.delete({ id: itemId, cartId: cart.id });

    return this.getCartSummary(userId, sessionId);
  }

  async clearCart(cartId: string) {
    await this.cartItemRepo.delete({ cartId });
  }

  async applyCoupon(code: string, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreate(userId, sessionId);
    const subtotal = (cart.items ?? []).reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0);

    // یادداشت: validate اینجا بدون manager فراخوانی می‌شود — این اعمال مشاور است،
    // قفل واقعی در checkout (داخل transaction) اعمال می‌شود.
    const { coupon } = await this.couponsService.validate(
      code, subtotal, cart.userId ?? userId,
    );

    cart.couponCode = coupon.code;
    await this.cartRepo.save(cart);

    return this.buildSummary(cart);
  }

  async removeCoupon(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreate(userId, sessionId);
    cart.couponCode = null;
    await this.cartRepo.save(cart);
    return this.buildSummary(cart);
  }

  // همگام‌سازی سبد Guest با سبد کاربر بعد از لاگین
  async mergeGuestCart(sessionId: string, userId: string) {
    const guestCart = await this.cartRepo.findOne({
      where: { sessionId },
      relations: { items: true },
    });

    if (!guestCart || !guestCart.items?.length) return;

    const userCart = await this.getOrCreate(userId);
    if (guestCart.couponCode && !userCart.couponCode) {
      userCart.couponCode = guestCart.couponCode;
      await this.cartRepo.save(userCart);
    }

    for (const guestItem of guestCart.items) {
      try {
        await this.addItem(
          { productId: guestItem.productId, variantId: guestItem.variantId ?? undefined, quantity: guestItem.quantity },
          userId,
        );
      } catch (error) {
        let availableStock = 0;
        if (guestItem.variantId) {
          const variant = await this.variantRepo.findOne({ where: { id: guestItem.variantId } });
          availableStock = variant?.stock ?? 0;
        } else {
          const product = await this.productRepo.findOne({ where: { id: guestItem.productId } });
          availableStock = product?.stock ?? 0;
        }
        
        if (availableStock > 0) {
          const existingItem = userCart.items?.find(
            (item) => item.productId === guestItem.productId && item.variantId === (guestItem.variantId ?? null)
          );
          const roomLeft = availableStock - (existingItem?.quantity || 0);

          if (roomLeft > 0) {
            try {
              await this.addItem(
                { productId: guestItem.productId, variantId: guestItem.variantId ?? undefined, quantity: roomLeft },
                userId,
              );
            } catch (e) {
              // ignore if still fails
            }
          }
        }
      }
    }

    await this.clearCart(guestCart.id);
    await this.cartRepo.delete(guestCart.id);
  }

  // ─── Helper: محاسبه خلاصه سبد خرید ─────────────────────────────────
  // FIX [Pillar 1 — Financial Integrity]:
  // total هرگز نمی‌تواند منفی باشد — Math.max(0, ...) اعمال شده
  private async buildSummary(cart: Cart) {
    const items = cart.items ?? [];
    
    let subtotal = 0;
    for (const item of items) {
      if (item.product) {
        let livePrice = item.product.price;
        if (item.variant) {
          livePrice += item.variant.priceModifier ?? 0;
        }

        if (item.priceAtTime !== livePrice) {
          item.priceAtTime = livePrice;
          await this.cartItemRepo.save(item);
        }
      }
      subtotal += item.priceAtTime * item.quantity;
    }

    let coupon: { code: string; type: string; value: number } | null = null;
    let discountAmount = 0;

    if (cart.couponCode) {
      try {
        const validated = await this.couponsService.validate(cart.couponCode, subtotal, cart.userId ?? undefined);
        coupon = { code: validated.coupon.code, type: validated.coupon.type, value: validated.coupon.value };
        discountAmount = validated.discountAmount;
      } catch {
        // اگر کد تخفیف دیگر معتبر نیست، آن را در نظر نگیر
        discountAmount = 0;
      }
    }

    let shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    if (coupon?.type === CouponType.FREE_SHIPPING) {
      shippingCost = 0;
    }

    const freeShippingRemaining = subtotal < SHIPPING_THRESHOLD && coupon?.type !== CouponType.FREE_SHIPPING
      ? SHIPPING_THRESHOLD - subtotal
      : 0;

    // FIX [Pillar 1 — Financial Integrity]: total هرگز نمی‌تواند منفی شود
    const rawTotal = subtotal - discountAmount + shippingCost;
    const total = Math.max(0, rawTotal);

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
      coupon,
      discountAmount,
      total,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }
}

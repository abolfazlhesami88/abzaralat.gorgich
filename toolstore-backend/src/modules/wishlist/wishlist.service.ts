import {
  Injectable, ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepo: Repository<Wishlist>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAll(userId: string) {
    const items = await this.wishlistRepo.find({
      where: { userId },
      relations: { product: { images: true, brand: true, category: true } },
      order: { createdAt: 'DESC' },
    });

    return items.map((item) => ({
      id: item.id,
      addedAt: item.createdAt,
      product: item.product,
    }));
  }

  async toggle(userId: string, productId: string) {
    const existing = await this.wishlistRepo.findOne({
      where: { userId, productId },
    });

    if (existing) {
      await this.wishlistRepo.remove(existing);
      return { isWishlisted: false };
    }

    const product = await this.productRepo.findOne({ where: { id: productId, status: 'active' as any } });
    if (!product) throw new ConflictException('محصول یافت نشد');

    await this.wishlistRepo.save(
      this.wishlistRepo.create({ userId, productId }),
    );

    return { isWishlisted: true };
  }

  async check(userId: string, productId: string) {
    const exists = await this.wishlistRepo.findOne({ where: { userId, productId } });
    return { isWishlisted: !!exists };
  }

  async getProductIds(userId: string): Promise<string[]> {
    const items = await this.wishlistRepo.find({
      where: { userId },
      select: { productId: true },
    });
    return items.map((i) => i.productId);
  }

  async remove(userId: string, productId: string) {
    await this.wishlistRepo.delete({ userId, productId });
    return { isWishlisted: false };
  }
}

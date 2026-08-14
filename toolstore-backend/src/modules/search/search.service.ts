import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // جستجوی کامل با pagination — استفاده از همان search_vector مرحله ۲
  async search(query: string, page = 1, limit = 20) {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.status = :status', { status: 'active' }) // FIX: Changed product.isActive to product.status
      .andWhere(`product.search_vector @@ plainto_tsquery('simple', :query)`, { query })
      .addSelect(`ts_rank(product.search_vector, plainto_tsquery('simple', :query))`, 'rank')
      .orderBy('rank', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      query,
    };
  }

  // برای autocomplete در SearchBar فرانت (مرحله ۴) — فقط نام و تصویر
  async suggestions(query: string, limit = 6) {
    if (!query || query.trim().length < 2) return [];

    const products = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.status = :status', { status: 'active' }) // FIX: Changed product.isActive to product.status
      .andWhere(`product.search_vector @@ plainto_tsquery('simple', :query)`, { query })
      .select(['product.id', 'product.name', 'product.slug', 'product.price', 'images'])
      .limit(limit)
      .getMany();

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      image: p.primaryImage?.url ?? null,
    }));
  }
}

import {
  Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './entities/product.entity';
import { QueryProductsDto, ProductSortBy } from './dto/query-products.dto';
import { paginate } from '../../common/dto/pagination.dto';

// FIX [Pillar 5 — Performance]: سقف‌های سخت برای جلوگیری از queries بی‌حد
const MAX_FEATURED_LIMIT = 20;
const MAX_RELATED_LIMIT  = 8;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // ─── لیست محصولات با فیلتر کامل ────────────────────────────────────────────
  async findAll(query: QueryProductsDto, includeInactive = false) {
    const qb = this.buildBaseQuery(includeInactive);

    if (query.categorySlug) {
      qb.leftJoin('category.parent', 'parentCategory');
      qb.andWhere('(category.slug = :categorySlug OR parentCategory.slug = :categorySlug)', { categorySlug: query.categorySlug });
    }

    if (query.brandSlug) {
      qb.andWhere('brand.slug = :brandSlug', { brandSlug: query.brandSlug });
    }

    if (query.minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (query.maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    if (query.minRating !== undefined) {
      qb.andWhere('product.averageRating >= :minRating', { minRating: query.minRating });
    }

    if (query.inStockOnly) {
      qb.andWhere('product.stock > 0');
    }

    if (query.search) {
      qb.andWhere(
        `product.search_vector @@ plainto_tsquery('simple', :search)`,
        { search: query.search },
      );
      qb.addSelect(
        `ts_rank(product.search_vector, plainto_tsquery('simple', :search))`,
        'search_rank',
      );
    }

    this.applySorting(qb, query.sortBy, !!query.search);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return paginate(items, total, page, limit);
  }

  // ─── جزئیات یک محصول با slug ───────────────────────────────────────────────
  async findBySlug(slug: string) {
    const product = await this.productRepo.findOne({
      where: { slug, status: 'active' as any },
      relations: { category: true, brand: true, images: true, variants: true, specs: true },
    });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    // افزایش بازدید — async بدون انتظار، تا response کند نشود
    this.incrementViewCount(product.id).catch(() => {});

    return product;
  }

  // FIX [Pillar 5 — Performance]:
  // در تمام find* endpoint ها:
  // ۱. limit به سقف MAX_FEATURED_LIMIT محدود شد — کلاینت نمی‌تواند limit=10000 بدهد
  // ۲. order اضافه شد به findRelated برای نتایج consistent

  async findFeatured(limit = 8) {
    const safeLimit = Math.min(Number(limit) || 8, MAX_FEATURED_LIMIT);
    return this.productRepo.find({
      where: { status: 'active' as any, isFeatured: true },
      relations: { category: true, brand: true, images: true },
      order: { createdAt: 'DESC' },
      take: safeLimit,
    });
  }

  async findNewArrivals(limit = 8) {
    const safeLimit = Math.min(Number(limit) || 8, MAX_FEATURED_LIMIT);
    return this.productRepo.find({
      where: { status: 'active' as any, isNew: true },
      relations: { category: true, brand: true, images: true },
      order: { createdAt: 'DESC' },
      take: safeLimit,
    });
  }

  async findBestSellers(limit = 8) {
    const safeLimit = Math.min(Number(limit) || 8, MAX_FEATURED_LIMIT);
    return this.productRepo.find({
      where: { status: 'active' as any },
      relations: { category: true, brand: true, images: true },
      order: { soldCount: 'DESC' },
      take: safeLimit,
    });
  }

  async findRelated(slug: string, limit = 4) {
    const safeLimit = Math.min(Number(limit) || 4, MAX_RELATED_LIMIT);

    const product = await this.productRepo.findOne({ where: { slug } });
    if (!product || !product.categoryId) return [];

    return this.productRepo.find({
      where: {
        categoryId: product.categoryId,
        status: 'active' as any,
      },
      relations: { category: true, brand: true, images: true },
      // FIX: اضافه کردن order برای نتایج consistent
      order: { soldCount: 'DESC' },
      take: safeLimit + 1,
    }).then((products) => products.filter((p) => p.id !== product.id).slice(0, safeLimit));
  }

  // ─── Helpers خصوصی ──────────────────────────────────────────────────────────

  private buildBaseQuery(includeInactive: boolean): SelectQueryBuilder<Product> {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.images', 'images');

    if (!includeInactive) {
      qb.where('product.status = :status', { status: 'active' });
    }

    return qb;
  }

  private applySorting(
    qb: SelectQueryBuilder<Product>,
    sortBy: ProductSortBy | undefined,
    hasSearch: boolean,
  ) {
    if (hasSearch && !sortBy) {
      qb.orderBy('search_rank', 'DESC');
      return;
    }

    switch (sortBy) {
      case ProductSortBy.PRICE_ASC:
        qb.orderBy('product.price', 'ASC');
        break;
      case ProductSortBy.PRICE_DESC:
        qb.orderBy('product.price', 'DESC');
        break;
      case ProductSortBy.BEST_SELLING:
        qb.orderBy('product.soldCount', 'DESC');
        break;
      case ProductSortBy.RATING:
        qb.orderBy('product.averageRating', 'DESC');
        break;
      case ProductSortBy.NAME_ASC:
        qb.orderBy('product.name', 'ASC');
        break;
      case ProductSortBy.NEWEST:
      default:
        qb.orderBy('product.createdAt', 'DESC');
        break;
    }
  }

  private async incrementViewCount(productId: string) {
    await this.productRepo.increment({ id: productId }, 'viewCount', 1);
  }
}

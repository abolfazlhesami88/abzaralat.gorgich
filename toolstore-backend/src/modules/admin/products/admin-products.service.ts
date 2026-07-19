import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { ProductImage } from '../../products/entities/product-image.entity';
import { ProductSpec } from '../../products/entities/product-spec.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import slugify from 'slugify';
import { paginate } from '../../../common/dto/pagination.dto';

export interface AdminProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: string;
  lowStock?: boolean;
}

export interface CreateProductDto {
  name: string;
  sku: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold?: number;
  weight?: number;
  categoryId?: string;
  brandId?: string;
  status?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  specs?: { specKey: string; specValue: string; sortOrder?: number }[];
  variants?: { name: string; sku?: string; priceModifier?: number; stock?: number; attributes?: Record<string, string> }[];
}

@Injectable()
export class AdminProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductImage) private readonly imageRepo: Repository<ProductImage>,
    @InjectRepository(ProductSpec) private readonly specRepo: Repository<ProductSpec>,
    @InjectRepository(ProductVariant) private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async findAll(query: AdminProductQuery) {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.images', 'images');

    if (query.search) {
      qb.andWhere('(product.name ILIKE :s OR product.sku ILIKE :s)', { s: `%${query.search}%` });
    }
    if (query.categoryId) qb.andWhere('product.categoryId = :cid', { cid: query.categoryId });
    if (query.status) qb.andWhere('product.status = :status', { status: query.status });
    if (query.lowStock) qb.andWhere('product.stock <= product.lowStockThreshold AND product.stock > 0');

    qb.orderBy('product.createdAt', 'DESC');

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [items, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();

    return paginate(items, total, page, limit);
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: { category: true, brand: true, images: true, specs: true, variants: true },
    });
    if (!product) throw new NotFoundException('محصول یافت نشد');
    return product;
  }

  async create(dto: CreateProductDto) {
    // بررسی تکراری نبودن SKU
    const existingSku = await this.productRepo.findOne({ where: { sku: dto.sku } });
    if (existingSku) throw new ConflictException('این کد محصول (SKU) قبلاً استفاده شده است');

    // تولید slug اگر داده نشده
    const slug = dto.slug ?? slugify(dto.name, { locale: 'fa', lower: true, strict: true });
    const existingSlug = await this.productRepo.findOne({ where: { slug } });
    if (existingSlug) throw new ConflictException('این slug قبلاً استفاده شده است');

    const { specs, variants, ...productData } = dto;
    const product = this.productRepo.create({ ...productData, status: productData.status as any, slug });
    const saved = await this.productRepo.save(product);

    // ذخیره specs
    if (specs?.length) {
      const specEntities = specs.map((s, i) =>
        this.specRepo.create({ ...s, productId: saved.id, sortOrder: s.sortOrder ?? i }),
      );
      await this.specRepo.save(specEntities);
    }

    // ذخیره variants
    if (variants?.length) {
      const variantEntities = variants.map((v) =>
        this.variantRepo.create({ ...v, productId: saved.id }),
      );
      await this.variantRepo.save(variantEntities);
    }

    return this.findOne(saved.id);
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    const product = await this.findOne(id);
    const { specs, variants, ...productData } = dto;

    // بررسی تکراری نبودن SKU جدید
    if (productData.sku && productData.sku !== product.sku) {
      const existing = await this.productRepo.findOne({ where: { sku: productData.sku } });
      if (existing) throw new ConflictException('این SKU قبلاً استفاده شده است');
    }

    Object.assign(product, productData);
    await this.productRepo.save(product);

    // اگر specs داده شده، همه قبلیها را پاک و دوباره ذخیره کن
    if (specs !== undefined) {
      await this.specRepo.delete({ productId: id });
      if (specs.length) {
        const specEntities = specs.map((s, i) =>
          this.specRepo.create({ ...s, productId: id, sortOrder: s.sortOrder ?? i }),
        );
        await this.specRepo.save(specEntities);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);

    try {
      const fs = require('fs/promises');
      const path = require('path');
      const uploadDir = process.env.UPLOAD_DIR || './uploads';
      const dir = path.join(uploadDir, 'products', id);
      await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
    } catch (e) {}
  }

  async addImage(productId: string, imageData: any, isPrimary = false) {
    await this.findOne(productId);

    if (isPrimary) {
      await this.imageRepo.update({ productId }, { isPrimary: false });
    }

    const image = this.imageRepo.create({ 
      productId, 
      url: imageData.url,
      filename: imageData.filename,
      originalName: imageData.originalName,
      path: imageData.path,
      isPrimary 
    });
    return this.imageRepo.save(image);
  }

  async removeImage(imageId: string) {
    const image = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!image) return;

    await this.imageRepo.delete(imageId);

    if (image.filename) {
      try {
        const fs = require('fs/promises');
        const path = require('path');
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        const baseName = path.parse(image.filename).name;
        const dir = path.join(uploadDir, 'products', image.productId);
        
        await fs.unlink(path.join(dir, `${baseName}-thumbnail.webp`)).catch(() => {});
        await fs.unlink(path.join(dir, `${baseName}-medium.webp`)).catch(() => {});
        await fs.unlink(path.join(dir, `${baseName}-original.webp`)).catch(() => {});
      } catch (e) {}
    }
  }

  async reorderImages(productId: string, imageIds: string[]) {
    for (let i = 0; i < imageIds.length; i++) {
      await this.imageRepo.update({ id: imageIds[i], productId }, { sortOrder: i, isPrimary: i === 0 });
    }
  }

  async bulkUpdateStatus(ids: string[], status: string) {
    await this.productRepo.update(ids, { status: status as any });
    return { updated: ids.length };
  }
}

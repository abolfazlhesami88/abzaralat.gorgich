import {
  Entity, Column, ManyToOne, OneToMany,
  JoinColumn, Index,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Category } from '../../categories/entities/category.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductSpec } from './product-spec.entity';
import { Review } from '../../reviews/entities/review.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  slug: string;

  @Index({ unique: true })
  @Column({ length: 100 })
  sku: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'short_description', length: 500, nullable: true })
  shortDescription: string;

  @Column({ type: 'bigint' })
  price: number;

  @Column({ name: 'compare_at_price', type: 'bigint', nullable: true })
  compareAtPrice: number | null;

  @Column({ name: 'cost_price', type: 'bigint', nullable: true })
  costPrice: number | null;

  @Column({ default: 0 })
  stock: number;

  @Column({ name: 'low_stock_threshold', default: 5 })
  lowStockThreshold: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'enum', enum: ['active', 'draft', 'archived'], default: 'draft' })
  status: 'active' | 'draft' | 'archived';

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'is_new', default: false })
  isNew: boolean;

  @Column({ name: 'meta_title', length: 255, nullable: true })
  metaTitle: string;

  @Column({ name: 'meta_description', type: 'text', nullable: true })
  metaDescription: string;

  @Column({ name: 'sold_count', default: 0 })
  soldCount: number;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({
    name: 'average_rating',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
  })
  averageRating: number;

  @Column({ name: 'review_count', default: 0 })
  reviewCount: number;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string | null;

  @ManyToOne(() => Brand, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ name: 'brand_id', type: 'uuid', nullable: true })
  brandId: string | null;

  @OneToMany(() => ProductImage, (img) => img.product, {
    cascade: true,
    eager: false,
  })
  images: ProductImage[];

  @OneToMany(() => ProductVariant, (v) => v.product, {
    cascade: true,
    eager: false,
  })
  variants: ProductVariant[];

  @OneToMany(() => ProductSpec, (s) => s.product, {
    cascade: true,
    eager: false,
  })
  specs: ProductSpec[];

  @OneToMany(() => Review, (r) => r.product)
  reviews: Review[];

  @OneToMany(() => CartItem, (ci) => ci.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (oi) => oi.product)
  orderItems: OrderItem[];

  @OneToMany(() => Wishlist, (w) => w.product)
  wishlistItems: Wishlist[];

  get isInStock(): boolean {
    return this.stock > 0;
  }

  get isLowStock(): boolean {
    return this.stock > 0 && this.stock <= this.lowStockThreshold;
  }

  get discountPercent(): number | null {
    if (!this.compareAtPrice || this.compareAtPrice <= this.price) return null;
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }

  get primaryImage(): ProductImage | null {
    if (!this.images || this.images.length === 0) return null;
    return this.images.find((img) => img.isPrimary) ?? this.images[0];
  }
}

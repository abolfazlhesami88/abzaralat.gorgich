import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant extends BaseEntity {
  @ManyToOne(() => Product, (p) => p.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ length: 150 })
  name: string;

  @Index({ unique: true })
  @Column({ nullable: true })
  sku: string;

  @Column({ name: 'price_modifier', type: 'bigint', default: 0 })
  priceModifier: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ type: 'jsonb', nullable: true })
  attributes: Record<string, string>;
}

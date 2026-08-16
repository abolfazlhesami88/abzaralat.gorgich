import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Product } from './product.entity';

@Entity('product_specs')
export class ProductSpec extends BaseEntity {
  @ManyToOne(() => Product, (p) => p.specs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'spec_key', length: 150 })
  specKey: string;

  @Column({ name: 'spec_value', length: 255 })
  specValue: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}

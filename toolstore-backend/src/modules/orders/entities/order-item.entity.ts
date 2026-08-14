import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Product, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId: string | null;

  @Column({ name: 'variant_id', type: 'uuid', nullable: true })
  variantId: string | null;

  @Column({ name: 'product_name', length: 255 })
  productName: string;

  @Column({ name: 'product_sku', length: 100 })
  productSku: string;

  @Column({ name: 'product_image', nullable: true })
  productImage: string;

  @Column({ name: 'variant_name', type: 'varchar', length: 150, nullable: true })
  variantName: string | null;

  @Column()
  quantity: number;

  @Column({ name: 'unit_price', type: 'bigint' })
  unitPrice: number;

  @Column({ name: 'total_price', type: 'bigint' })
  totalPrice: number;
}

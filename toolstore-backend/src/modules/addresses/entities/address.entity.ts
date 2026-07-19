import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 50, nullable: true })
  label: string;

  @Column({ name: 'full_name', length: 200 })
  fullName: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100 })
  province: string;

  @Column({ length: 100 })
  city: string;

  @Column({ name: 'address_line', type: 'text' })
  addressLine: string;

  @Column({ name: 'postal_code', length: 20 })
  postalCode: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;
}

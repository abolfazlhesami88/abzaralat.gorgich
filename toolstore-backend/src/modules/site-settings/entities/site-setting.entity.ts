import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('site_settings')
export class SiteSetting extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 100, unique: true })
  key: string;

  @Column({ type: 'text', nullable: true })
  value: string | null;
}

import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('otp_codes')
export class OtpCode extends BaseEntity {
  @Index()
  @Column({ length: 20 })
  phone: string;

  @Column({ length: 10 })
  code: string;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'timestamp', name: 'last_sent_at', nullable: true })
  lastSentAt: Date | null;
}

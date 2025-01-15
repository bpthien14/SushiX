import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CustomerAccount } from './customer-account.entity';

@Entity('customer_refresh_tokens')
export class CustomerRefreshToken {
  @PrimaryGeneratedColumn('increment')
  token_id: number;

  @Column()
  account_id: number;

  @Column()
  token: string;

  @Column()
  expires_at: Date;

  @Column({ default: false })
  is_revoked: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => CustomerAccount)
  @JoinColumn({ name: 'account_id' })
  customer: CustomerAccount;
} 
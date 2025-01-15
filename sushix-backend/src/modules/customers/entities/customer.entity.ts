import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { CustomerAccount } from '../../customer-auth/entities/customer-account.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('increment')
  customer_id: number;

  @Column()
  full_name: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  id_number: string;

  @Column({
    type: 'enum',
    enum: ['Nam', 'Nữ', 'Khác']
  })
  gender: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToOne(() => CustomerAccount, account => account.customer)
  account: CustomerAccount;
} 
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Employee } from '../../users/entities/employee.entity';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn('increment')
  branch_id: number;

  @Column()
  area_id: number;

  @Column()
  branch_name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ type: 'time' })
  opening_time: string;

  @Column({ type: 'time' })
  closing_time: string;

  @Column({ default: false })
  has_car_parking: boolean;

  @Column({ default: false })
  has_motorbike_parking: boolean;

  @Column({ default: false })
  is_delivery_supported: boolean;

  @Column({ nullable: true })
  manager_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'manager_id' })
  manager: Employee;
} 
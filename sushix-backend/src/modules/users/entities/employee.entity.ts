import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from '../../../common/enums/role.enum';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('increment')
  employee_id: number;

  @Column()
  department_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.BRANCH_STAFF
  })
  role: Role;

  @Column()
  birth_date: Date;

  @Column({
    type: 'enum',
    enum: ['Nam', 'Nữ', 'Khác'],
  })
  gender: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  hire_date: Date;

  @Column({ nullable: true })
  termination_date: Date;

  @Column()
  current_branch_id: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  last_login: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
} 
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  employee_id: number;

  @Column()
  department_id: number;

  @Column()
  full_name: string;

  @Column()
  birth_date: Date;

  @Column()
  gender: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  hire_date: Date;

  @Column({ nullable: true })
  termination_date: Date;

  @Column()
  current_branch_id: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
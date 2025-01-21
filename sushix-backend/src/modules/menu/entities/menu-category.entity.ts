import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Entity('menu_categories')
export class MenuCategory {
  @PrimaryGeneratedColumn('increment')
  category_id: number;

  @Column()
  category_name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  display_order: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => MenuItem, menuItem => menuItem.category)
  menu_items: MenuItem[];
} 
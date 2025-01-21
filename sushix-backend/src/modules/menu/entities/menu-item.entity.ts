import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { MenuCategory } from './menu-category.entity';
import { BranchMenuItem } from './branch-menu-item.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('increment')
  item_id: number;

  @Column()
  category_id: number;

  @Column()
  item_name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  is_deliverable: boolean;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => MenuCategory, category => category.menu_items)
  @JoinColumn({ name: 'category_id' })
  category: MenuCategory;

  @OneToMany(() => BranchMenuItem, branchMenuItem => branchMenuItem.menu_item)
  branch_menu_items: BranchMenuItem[];
} 
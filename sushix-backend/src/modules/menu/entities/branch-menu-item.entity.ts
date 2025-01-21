import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';
import { MenuItem } from './menu-item.entity';

@Entity('branch_menu_items')
export class BranchMenuItem {
  @PrimaryColumn()
  branch_id: number;

  @PrimaryColumn()
  item_id: number;

  @Column({ default: true })
  is_available: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ManyToOne(() => MenuItem, menuItem => menuItem.branch_menu_items)
  @JoinColumn({ name: 'item_id' })
  menu_item: MenuItem;
} 
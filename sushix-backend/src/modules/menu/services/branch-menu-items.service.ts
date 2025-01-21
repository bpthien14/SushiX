import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchMenuItem } from '../entities/branch-menu-item.entity';
import { UpdateBranchMenuItemDto } from '../dto/update-branch-menu-item.dto';

@Injectable()
export class BranchMenuItemsService {
  constructor(
    @InjectRepository(BranchMenuItem)
    private branchMenuItemRepository: Repository<BranchMenuItem>,
  ) {}

  async addItemToBranch(branchId: number, itemId: number): Promise<BranchMenuItem> {
    const branchMenuItem = this.branchMenuItemRepository.create({
      branch_id: branchId,
      item_id: itemId,
      is_available: true
    });
    return this.branchMenuItemRepository.save(branchMenuItem);
  }

  async findByBranch(branchId: number): Promise<BranchMenuItem[]> {
    return this.branchMenuItemRepository.find({
      where: { branch_id: branchId },
      relations: ['menu_item', 'menu_item.category']
    });
  }

  async updateAvailability(
    branchId: number, 
    itemId: number, 
    updateDto: UpdateBranchMenuItemDto
  ): Promise<BranchMenuItem> {
    const branchMenuItem = await this.branchMenuItemRepository.findOne({
      where: { branch_id: branchId, item_id: itemId }
    });

    if (!branchMenuItem) {
      throw new NotFoundException(`Menu item not found in this branch`);
    }

    branchMenuItem.is_available = updateDto.is_available;
    return this.branchMenuItemRepository.save(branchMenuItem);
  }

  async removeItemFromBranch(branchId: number, itemId: number): Promise<void> {
    const result = await this.branchMenuItemRepository.delete({
      branch_id: branchId,
      item_id: itemId
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Menu item not found in this branch`);
    }
  }

  async getAvailableItems(branchId: number): Promise<BranchMenuItem[]> {
    return this.branchMenuItemRepository.find({
      where: { 
        branch_id: branchId,
        is_available: true
      },
      relations: ['menu_item', 'menu_item.category']
    });
  }
} 
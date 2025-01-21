import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../entities/menu-item.entity';
import { CreateMenuItemDto } from '../dto/create-menu-item.dto';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    const existingItem = await this.menuItemRepository.findOne({
      where: { item_name: createMenuItemDto.item_name }
    });

    if (existingItem) {
      throw new ConflictException('Item name already exists');
    }

    const menuItem = this.menuItemRepository.create(createMenuItemDto);
    return this.menuItemRepository.save(menuItem);
  }

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      relations: ['category', 'branch_menu_items']
    });
  }

  async findOne(id: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { item_id: id },
      relations: ['category', 'branch_menu_items']
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return menuItem;
  }

  async findByCategory(categoryId: number): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      where: { category_id: categoryId },
      relations: ['category']
    });
  }

  async update(id: number, updateItemDto: Partial<CreateMenuItemDto>): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.preload({
      item_id: id,
      ...updateItemDto,
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return this.menuItemRepository.save(menuItem);
  }

  async remove(id: number): Promise<void> {
    const result = await this.menuItemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
  }
} 
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuCategory } from '../entities/menu-category.entity';
import { CreateMenuCategoryDto } from '../dto/create-menu-category.dto';

@Injectable()
export class MenuCategoriesService {
  constructor(
    @InjectRepository(MenuCategory)
    private menuCategoryRepository: Repository<MenuCategory>,
  ) {}

  async create(createMenuCategoryDto: CreateMenuCategoryDto): Promise<MenuCategory> {
    const existingCategory = await this.menuCategoryRepository.findOne({
      where: { category_name: createMenuCategoryDto.category_name }
    });

    if (existingCategory) {
      throw new ConflictException('Category name already exists');
    }

    const category = this.menuCategoryRepository.create(createMenuCategoryDto);
    return this.menuCategoryRepository.save(category);
  }

  async findAll(): Promise<MenuCategory[]> {
    return this.menuCategoryRepository.find({
      relations: ['menu_items'],
      order: { display_order: 'ASC' }
    });
  }

  async findOne(id: number): Promise<MenuCategory> {
    const category = await this.menuCategoryRepository.findOne({
      where: { category_id: id },
      relations: ['menu_items']
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: Partial<CreateMenuCategoryDto>): Promise<MenuCategory> {
    const category = await this.menuCategoryRepository.preload({
      category_id: id,
      ...updateCategoryDto,
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.menuCategoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.menuCategoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
} 
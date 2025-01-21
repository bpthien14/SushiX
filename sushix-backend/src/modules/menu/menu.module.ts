import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuCategoriesController } from './controllers/menu-categories.controller';
import { MenuItemsController } from './controllers/menu-items.controller';
import { BranchMenuItemsController } from './controllers/branch-menu-items.controller';
import { MenuCategoriesService } from './services/menu-categories.service';
import { MenuItemsService } from './services/menu-items.service';
import { BranchMenuItemsService } from './services/branch-menu-items.service';
import { MenuCategory } from './entities/menu-category.entity';
import { MenuItem } from './entities/menu-item.entity';
import { BranchMenuItem } from './entities/branch-menu-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MenuCategory,
      MenuItem,
      BranchMenuItem
    ])
  ],
  controllers: [
    MenuCategoriesController,
    MenuItemsController,
    BranchMenuItemsController
  ],
  providers: [
    MenuCategoriesService,
    MenuItemsService,
    BranchMenuItemsService
  ],
  exports: [
    MenuCategoriesService,
    MenuItemsService,
    BranchMenuItemsService
  ]
})
export class MenuModule {} 
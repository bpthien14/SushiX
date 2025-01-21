import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MenuItemsService } from '../services/menu-items.service';
import { CreateMenuItemDto } from '../dto/create-menu-item.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@ApiTags('menu-items')
@Controller('menu-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @Roles(Role.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Create new menu item' })
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menu items' })
  findAll() {
    return this.menuItemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu item by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.findOne(id);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get menu items by category' })
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.menuItemsService.findByCategory(categoryId);
  }

  @Patch(':id')
  @Roles(Role.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Update menu item' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: Partial<CreateMenuItemDto>
  ) {
    return this.menuItemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @Roles(Role.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Delete menu item' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.remove(id);
  }
} 
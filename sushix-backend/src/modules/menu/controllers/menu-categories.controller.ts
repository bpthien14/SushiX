import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MenuCategoriesService } from '../services/menu-categories.service';
import { CreateMenuCategoryDto } from '../dto/create-menu-category.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@ApiTags('menu-categories')
@Controller('menu-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenuCategoriesController {
  constructor(private readonly menuCategoriesService: MenuCategoriesService) {}

  @Post()
  @Roles(Role.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Create new menu category' })
  create(@Body() createMenuCategoryDto: CreateMenuCategoryDto) {
    return this.menuCategoriesService.create(createMenuCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menu categories' })
  findAll() {
    return this.menuCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu category by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuCategoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Update menu category' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: Partial<CreateMenuCategoryDto>
  ) {
    return this.menuCategoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Delete menu category' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuCategoriesService.remove(id);
  }
} 
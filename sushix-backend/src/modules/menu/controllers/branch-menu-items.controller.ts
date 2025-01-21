import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BranchMenuItemsService } from '../services/branch-menu-items.service';
import { UpdateBranchMenuItemDto } from '../dto/update-branch-menu-item.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@ApiTags('branch-menu-items')
@Controller('branch-menu-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BranchMenuItemsController {
  constructor(private readonly branchMenuItemsService: BranchMenuItemsService) {}

  @Post(':branchId/items/:itemId')
  @Roles(Role.SYSTEM_ADMIN, Role.BRANCH_MANAGER)
  @ApiOperation({ summary: 'Add menu item to branch' })
  addItemToBranch(
    @Param('branchId', ParseIntPipe) branchId: number,
    @Param('itemId', ParseIntPipe) itemId: number
  ) {
    return this.branchMenuItemsService.addItemToBranch(branchId, itemId);
  }

  @Get('branch/:branchId')
  @ApiOperation({ summary: 'Get all menu items in branch' })
  findByBranch(@Param('branchId', ParseIntPipe) branchId: number) {
    return this.branchMenuItemsService.findByBranch(branchId);
  }

  @Patch(':branchId/items/:itemId')
  @Roles(Role.SYSTEM_ADMIN, Role.BRANCH_MANAGER)
  @ApiOperation({ summary: 'Update menu item availability in branch' })
  updateAvailability(
    @Param('branchId', ParseIntPipe) branchId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateDto: UpdateBranchMenuItemDto
  ) {
    return this.branchMenuItemsService.updateAvailability(branchId, itemId, updateDto);
  }

  @Delete(':branchId/items/:itemId')
  @Roles(Role.SYSTEM_ADMIN, Role.BRANCH_MANAGER)
  @ApiOperation({ summary: 'Remove menu item from branch' })
  removeItemFromBranch(
    @Param('branchId', ParseIntPipe) branchId: number,
    @Param('itemId', ParseIntPipe) itemId: number
  ) {
    return this.branchMenuItemsService.removeItemFromBranch(branchId, itemId);
  }

  @Get('branch/:branchId/available')
  @ApiOperation({ summary: 'Get available menu items in branch' })
  getAvailableItems(@Param('branchId', ParseIntPipe) branchId: number) {
    return this.branchMenuItemsService.getAvailableItems(branchId);
  }
} 
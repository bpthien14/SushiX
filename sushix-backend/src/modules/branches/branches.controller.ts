import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, Query, ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { BranchRevenueDto } from './dto/branch-revenue.dto';
import { GetRevenueQueryDto } from './dto/get-revenue-query.dto';
import { GetRevenueByTimeDto } from './dto/get-revenue-by-time.dto';

@ApiTags('branches')
@Controller('branches')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles(Role.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Create new branch' })
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  @Roles(Role.SYSTEM_ADMIN, Role.BRANCH_MANAGER)
  @ApiOperation({ summary: 'Get all branches' })
  findAll() {
    return this.branchesService.findAll();
  }

  @Get(':id')
  @Roles(Role.SYSTEM_ADMIN, Role.BRANCH_MANAGER)
  @ApiOperation({ summary: 'Get branch by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Update branch' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateBranchDto: UpdateBranchDto
  ) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @Roles(Role.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Delete branch' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.remove(id);
  }

  @Get(':id/revenue')
  @Roles(Role.SYSTEM_ADMIN, Role.BRANCH_MANAGER)
  @ApiOperation({ summary: 'Get branch revenue' })
  async getBranchRevenue(
    @Param('id', ParseIntPipe) id: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.branchesService.getBranchRevenue(
      id,
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Get('revenue/all')
  @Roles(Role.SYSTEM_ADMIN, Role.BRANCH_MANAGER)
  @ApiOperation({ summary: 'Get revenue from all branches' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns revenue statistics for all branches',
    type: BranchRevenueDto
  })
  async getAllBranchesRevenue(
    @Query() query: GetRevenueQueryDto
  ): Promise<BranchRevenueDto> {
    return this.branchesService.getAllBranchesRevenue(
      query.startDate ? new Date(query.startDate) : undefined,
      query.endDate ? new Date(query.endDate) : undefined
    );
  }

  @Get('revenue/time-range')
  @Roles(Role.SYSTEM_ADMIN, Role.BRANCH_MANAGER)
  @ApiOperation({ summary: 'Get revenue by time range' })
  @ApiResponse({
    status: 200,
    description: 'Returns revenue statistics grouped by time period'
  })
  async getRevenueByTimeRange(@Query() query: GetRevenueByTimeDto) {
    const startDate = query.startDate ? new Date(query.startDate) : new Date();
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    
    return this.branchesService.getRevenueByTimeRange(
      startDate,
      endDate,
      query.interval
    );
  }
} 
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchRevenueDto } from './dto/branch-revenue.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    const existingBranch = await this.branchRepository.findOne({
      where: { branch_name: createBranchDto.branch_name }
    });

    if (existingBranch) {
      throw new ConflictException('Branch name already exists');
    }

    const branch = this.branchRepository.create(createBranchDto);
    return this.branchRepository.save(branch);
  }

  async findAll(): Promise<Branch[]> {
    return this.branchRepository.find({
      relations: ['manager']
    });
  }

  async findOne(id: number): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { branch_id: id },
      relations: ['manager']
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const branch = await this.branchRepository.preload({
      branch_id: id,
      ...updateBranchDto,
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    return this.branchRepository.save(branch);
  }

  async remove(id: number): Promise<void> {
    const result = await this.branchRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }
  }

  async getBranchRevenue(branchId: number, startDate: Date, endDate: Date) {
    const result = await this.branchRepository.query(
      `SELECT * FROM calculate_branch_revenue($1, $2, $3)`,
      [branchId, startDate, endDate]
    );
    return result[0];
  }

  async getAllBranchesRevenue(startDate?: Date, endDate?: Date): Promise<BranchRevenueDto> {
    try {
      // Xử lý ngày tháng mặc định
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      // Format ngày tháng cho PostgreSQL
      const formattedStartDate = startDate 
        ? startDate.toISOString().split('T')[0] 
        : firstDayOfMonth.toISOString().split('T')[0];
        
      const formattedEndDate = endDate 
        ? endDate.toISOString().split('T')[0] 
        : lastDayOfMonth.toISOString().split('T')[0];

      // Gọi function từ database
      const result = await this.branchRepository.query(
        `SELECT * FROM get_all_branches_revenue($1::DATE, $2::DATE)`,
        [formattedStartDate, formattedEndDate]
      );

      // Xử lý kết quả trống
      if (!result?.[0]) {
        return {
          total_revenue: 0,
          total_orders: 0,
          total_branches: 0,
          branches_data: []
        };
      }

      // Parse và format dữ liệu
      const { 
        total_revenue, 
        total_orders, 
        total_branches, 
        branches_data 
      } = result[0];

      return {
        total_revenue: Number(total_revenue),
        total_orders: Number(total_orders),
        total_branches: Number(total_branches),
        branches_data: Array.isArray(branches_data) 
          ? branches_data.map(branch => ({
              branch_id: Number(branch.branch_id),
              branch_name: String(branch.branch_name),
              address: String(branch.address),
              revenue: Number(branch.revenue),
              order_count: Number(branch.order_count),
              avg_order_value: Number(branch.avg_order_value)
            }))
          : []
      };
    } catch (error) {
      console.error('Error getting branches revenue:', error);
      throw error;
    }
  }

  async getRevenueByTimeRange(
    startDate: Date,
    endDate: Date,
    interval: 'day' | 'week' | 'month' | 'year' = 'day'
  ) {
    const result = await this.branchRepository.query(
      `SELECT * FROM get_revenue_by_time_range($1::DATE, $2::DATE, $3)`,
      [
        startDate.toISOString(),
        endDate.toISOString(),
        interval
      ]
    );

    // Format kết quả
    return result.map(item => ({
      time_period: new Date(item.time_period),
      total_revenue: Number(item.total_revenue) || 0,
      total_orders: Number(item.total_orders) || 0
    }));
  }
} 
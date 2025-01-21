import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

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
} 
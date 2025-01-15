import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ 
      where: { employee_id: id } 
    });
    
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    
    return employee;
  }

  async findByEmail(email: string): Promise<Employee> {
    const user = await this.employeeRepository.findOne({ 
      where: { email },
      select: {
        employee_id: true,
        email: true,
        password: true,
        role: true,
        first_name: true,
        last_name: true,
        is_active: true
      }
    });

    if (!user) {
      throw new NotFoundException(`User not found with email ${email}`);
    }

    if (!user.is_active) {
      throw new UnauthorizedException('User is inactive');
    }

    return user;
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);
    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      password: hashedPassword,
    });
    return this.employeeRepository.save(employee);
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.employeeRepository.preload({
      employee_id: id,
      ...updateEmployeeDto,
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    if (updateEmployeeDto.password) {
      employee.password = await bcrypt.hash(updateEmployeeDto.password, 10);
    }

    return this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const result = await this.employeeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  }
} 
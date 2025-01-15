import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Kiểm tra số điện thoại đã tồn tại
    const existingPhone = await this.customerRepository.findOne({
      where: { phone: createCustomerDto.phone }
    });
    if (existingPhone) {
      throw new ConflictException('Phone number already exists');
    }

    // Kiểm tra email nếu có
    if (createCustomerDto.email) {
      const existingEmail = await this.customerRepository.findOne({
        where: { email: createCustomerDto.email }
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Kiểm tra CCCD/CMND nếu có
    if (createCustomerDto.id_number) {
      const existingIdNumber = await this.customerRepository.findOne({
        where: { id_number: createCustomerDto.id_number }
      });
      if (existingIdNumber) {
        throw new ConflictException('ID number already exists');
      }
    }

    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { customer_id: id }
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async findByPhone(phone: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { phone }
    });

    if (!customer) {
      throw new NotFoundException(`Customer with phone ${phone} not found`);
    }

    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.customerRepository.preload({
      customer_id: id,
      ...updateCustomerDto,
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const result = await this.customerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }
} 
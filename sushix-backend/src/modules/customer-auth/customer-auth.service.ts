import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomerAccount } from './entities/customer-account.entity';
import { Customer } from '../../modules/customers/entities/customer.entity';
import { CustomerRegisterDto } from './dto/customer-register.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';

@Injectable()
export class CustomerAuthService {
  constructor(
    @InjectRepository(CustomerAccount)
    private customerAccountRepository: Repository<CustomerAccount>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: CustomerRegisterDto) {
    // Kiểm tra email đã tồn tại
    const existingAccount = await this.customerAccountRepository.findOne({
      where: { email: registerDto.email }
    });

    if (existingAccount) {
      throw new ConflictException('Email already exists');
    }

    // Tạo customer mới
    const customer = this.customerRepository.create({
      full_name: registerDto.full_name,
      phone: registerDto.phone,
      email: registerDto.email,
      id_number: registerDto.id_number,
      gender: registerDto.gender,
    });
    await this.customerRepository.save(customer);

    // Tạo account cho customer
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const customerAccount = this.customerAccountRepository.create({
      customer_id: customer.customer_id,
      email: registerDto.email,
      password: hashedPassword,
    });
    await this.customerAccountRepository.save(customerAccount);

    return {
      message: 'Registration successful',
      customer: {
        id: customer.customer_id,
        full_name: customer.full_name,
        email: customer.email,
      }
    };
  }

  async login(loginDto: CustomerLoginDto) {
    const account = await this.customerAccountRepository.findOne({
      where: { email: loginDto.email },
      relations: ['customer'],
    });

    if (!account || !account.is_active) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Cập nhật last_login
    account.last_login = new Date();
    await this.customerAccountRepository.save(account);

    const payload = {
      sub: account.customer_id,
      email: account.email,
      type: 'customer'
    };

    return {
      access_token: this.jwtService.sign(payload),
      customer: {
        id: account.customer_id,
        email: account.email,
        full_name: account.customer.full_name,
      }
    };
  }

  async getProfile(customerId: number) {
    const account = await this.customerAccountRepository.findOne({
      where: { customer_id: customerId },
      relations: ['customer'],
    });

    if (!account) {
      throw new UnauthorizedException('Customer not found');
    }

    return {
      id: account.customer_id,
      email: account.email,
      full_name: account.customer.full_name,
      phone: account.customer.phone,
      gender: account.customer.gender,
    };
  }

  async refreshToken(customerId: number) {
    const account = await this.customerAccountRepository.findOne({
      where: { customer_id: customerId },
      relations: ['customer'],
    });

    if (!account || !account.is_active) {
      throw new UnauthorizedException('Customer not found or inactive');
    }

    const payload = {
      sub: account.customer_id,
      email: account.email,
      type: 'customer'
    };

    return {
      access_token: this.jwtService.sign(payload),
      customer: {
        id: account.customer_id,
        email: account.email,
        full_name: account.customer.full_name,
      }
    };
  }
} 
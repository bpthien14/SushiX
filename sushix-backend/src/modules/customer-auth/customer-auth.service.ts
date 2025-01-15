import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomerAccount } from './entities/customer-account.entity';
import { Customer } from '../../modules/customers/entities/customer.entity';
import { CustomerRegisterDto } from './dto/customer-register.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { CustomerRefreshToken } from './entities/customer-refresh-token.entity';

@Injectable()
export class CustomerAuthService {
  constructor(
    @InjectRepository(CustomerAccount)
    private customerAccountRepository: Repository<CustomerAccount>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private jwtService: JwtService,
    @InjectRepository(CustomerRefreshToken)
    private refreshTokenRepository: Repository<CustomerRefreshToken>,
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

  private async generateTokens(customer: any) {
    const accessToken = this.jwtService.sign(
      { 
        sub: customer.customer_id,
        email: customer.email,
        type: 'customer'
      },
      { expiresIn: '15m' } // access token ngắn hạn
    );

    const refreshToken = this.jwtService.sign(
      { 
        sub: customer.customer_id,
        type: 'refresh'
      },
      { expiresIn: '7d' } // refresh token dài hạn
    );

    // Lưu refresh token vào database
    await this.refreshTokenRepository.save({
      customer_id: customer.customer_id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(loginDto: CustomerLoginDto) {
    const account = await this.validateCustomer(loginDto);
    const tokens = await this.generateTokens(account);

    return {
      ...tokens,
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

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);
      
      // Kiểm tra token trong database
      const savedToken = await this.refreshTokenRepository.findOne({
        where: { 
          token: refreshToken,
          is_revoked: false,
        }
      });

      if (!savedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Kiểm tra hết hạn
      if (savedToken.expires_at < new Date()) {
        throw new UnauthorizedException('Refresh token expired');
      }

      // Tạo token mới
      const account = await this.customerAccountRepository.findOne({
        where: { customer_id: payload.sub },
        relations: ['customer'],
      });

      // Revoke token cũ
      await this.refreshTokenRepository.update(
        savedToken.token_id,
        { is_revoked: true }
      );

      // Tạo cặp token mới
      const tokens = await this.generateTokens(account);

      return {
        ...tokens,
        customer: {
          id: account.customer_id,
          email: account.email,
          full_name: account.customer.full_name,
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(customerId: number) {
    // Revoke tất cả refresh token của user
    await this.refreshTokenRepository.update(
      { customer_id: customerId, is_revoked: false },
      { is_revoked: true }
    );
  }

  private async validateCustomer(loginDto: CustomerLoginDto) {
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

    return account;
  }
} 
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      console.log('Found user:', user);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch (error) {
      console.error('Authentication error:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async generateTokens(user: any) {
    const accessToken = this.jwtService.sign(
      { 
        sub: user.employee_id,
        email: user.email,
        roles: [user.role]
      },
      { expiresIn: '15m' }
    );

    const refreshToken = this.jwtService.sign(
      { 
        sub: user.employee_id,
        type: 'refresh'
      },
      { expiresIn: '7d' }
    );

    // Lưu refresh token vào database
    await this.refreshTokenRepository.save({
      employee_id: user.employee_id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const tokens = await this.generateTokens(user);
    
    return {
      ...tokens,
      user: {
        id: user.employee_id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      }
    };
  }

  async logout(userId: number) {
    // Xóa tất cả refresh token của user
    await this.refreshTokenRepository.delete({ employee_id: userId });
    
    return {
      message: 'Logged out successfully'
    };
  }

  async refreshToken(userId: number) {
    const user = await this.usersService.findOne(userId);
    return this.generateTokens(user);
  }
} 
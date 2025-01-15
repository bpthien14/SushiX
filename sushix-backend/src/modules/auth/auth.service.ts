import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async login(loginDto: LoginDto) {
    console.log('Login attempt:', loginDto.email);
    
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    const payload = { 
      sub: user.employee_id,
      email: user.email,
      roles: [user.role]
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.employee_id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      }
    };
  }

  async refreshToken(userId: number) {
    const user = await this.usersService.findOne(userId);
    const payload = { 
      sub: user.employee_id,
      email: user.email,
      role: user.role
    };

    return {
      access_token: this.jwtService.sign(payload)
    };
  }
} 
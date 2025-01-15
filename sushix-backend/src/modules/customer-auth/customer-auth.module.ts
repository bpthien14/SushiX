import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerAuthController } from './customer-auth.controller';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerAccount } from './entities/customer-account.entity';
import { Customer } from '../../modules/customers/entities/customer.entity';
import { CustomerJwtStrategy } from './strategies/customer-jwt.strategy';
import { CustomerRefreshToken } from './entities/customer-refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerAccount, 
      Customer, 
      CustomerRefreshToken
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h') 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CustomerAuthController],
  providers: [CustomerAuthService, CustomerJwtStrategy],
  exports: [CustomerAuthService],
})
export class CustomerAuthModule {} 
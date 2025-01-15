import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Anhthien0104@',
  database: process.env.DB_NAME || 'sushix',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false, // Không dùng synchronize trong production
  logging: true,
};
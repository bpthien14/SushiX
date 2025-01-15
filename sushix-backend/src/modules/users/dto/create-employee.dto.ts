import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsDate } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: 1, description: 'ID của phòng ban' })
  @IsNotEmpty()
  department_id: number;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Họ tên nhân viên' })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({ example: '1990-01-15', description: 'Ngày sinh' })
  @IsNotEmpty()
  birth_date: Date;

  @ApiProperty({ example: 'Nam', description: 'Giới tính (Nam/Nữ/Khác)' })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({ example: '0901234567', description: 'Số điện thoại' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'example@email.com', description: 'Email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '123 Nguyễn Huệ, Q1, TP.HCM', description: 'Địa chỉ', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '2023-01-01', description: 'Ngày vào làm' })
  @IsNotEmpty()
  hire_date: Date;

  @ApiProperty({ example: 1, description: 'ID chi nhánh hiện tại' })
  @IsNotEmpty()
  current_branch_id: number;
}
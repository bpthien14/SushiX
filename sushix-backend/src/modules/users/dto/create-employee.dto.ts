import { IsNotEmpty, IsString, IsEmail, IsEnum, IsDate, IsBoolean, IsOptional } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

export class CreateEmployeeDto {
  @IsNotEmpty()
  department_id: number;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.BRANCH_STAFF;

  @IsNotEmpty()
  @IsDate()
  birth_date: Date;

  @IsNotEmpty()
  @IsEnum(['Nam', 'Nữ', 'Khác'])
  gender: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsDate()
  hire_date: Date;

  @IsNotEmpty()
  current_branch_id: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
} 
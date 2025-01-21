import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsTime } from '../../../common/decorators/is-time.decorator';

export class CreateBranchDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  area_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  branch_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsTime()
  opening_time: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsTime()
  closing_time: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  has_car_parking?: boolean = false;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  has_motorbike_parking?: boolean = false;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  is_delivery_supported?: boolean = false;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  manager_id?: number;
} 
import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  category_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  item_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  is_deliverable?: boolean = true;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image_url?: string;
} 
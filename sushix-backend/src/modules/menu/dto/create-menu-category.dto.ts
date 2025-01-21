import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  display_order: number;
} 
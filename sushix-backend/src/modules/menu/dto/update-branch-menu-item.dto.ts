import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBranchMenuItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  is_available: boolean;
} 
import { ApiProperty } from '@nestjs/swagger';

export class BranchRevenueDto {
  @ApiProperty()
  total_revenue: number;

  @ApiProperty()
  total_orders: number;

  @ApiProperty()
  total_branches: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        branch_id: { type: 'number' },
        branch_name: { type: 'string' },
        address: { type: 'string' },
        revenue: { type: 'number' },
        order_count: { type: 'number' },
        avg_order_value: { type: 'number' }
      }
    }
  })
  branches_data: Array<{
    branch_id: number;
    branch_name: string;
    address: string;
    revenue: number;
    order_count: number;
    avg_order_value: number;
  }>;
} 
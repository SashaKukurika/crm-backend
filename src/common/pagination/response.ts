import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

import { Orders } from '../../orders/entitys/orders.entity';
import { User } from '../../users/entitys/user.entity';

export class PaginatedOrders {
  @ApiProperty({
    type: Number,
    description: 'number of all orders',
    example: 500,
  })
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    type: Orders,
    isArray: true,
    description: 'orders for one page',
  })
  orders: Orders[];
}
export class PaginatedUsers {
  @ApiProperty({
    type: Number,
    description: 'number of all users',
    example: 34,
  })
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    type: User,
    isArray: true,
    description: 'users for one page',
  })
  @IsArray()
  users: User[];
}

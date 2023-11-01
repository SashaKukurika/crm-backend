import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { Orders } from '../../orders/entitys/orders.entity';
import { User } from '../../users/entitys/user.entity';

export class PaginatedOrders {
  @ApiProperty()
  @IsNumber()
  totalCount: number;

  @ApiProperty()
  orders: Orders[];
}
export class PaginatedUsers {
  @ApiProperty()
  @IsNumber()
  totalCount: number;

  @ApiProperty()
  users: User[];
}

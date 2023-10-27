import { ApiProperty } from '@nestjs/swagger';

import { Orders } from '../../orders/entitys/orders.entity';

export class PaginatedOrders {
  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  orders: Orders[];
}

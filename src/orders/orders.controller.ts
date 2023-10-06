import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OrderQueryDto } from '../common/query/order.query.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  // @Role(UserRole.ADMIN, UserRole.MANAGER)
  // @UseGuards(AccessTokenGuard, RoleGuard)
  @Get()
  async getOrdersWithPagination(@Query() query: OrderQueryDto) {
    return await this.ordersService.getOrdersWithPagination(query);
  }
  // @Role(UserRole.ADMIN, UserRole.MANAGER)
  // @UseGuards(AccessTokenGuard, RoleGuard)
  @Get('/statistics')
  async getOrdersStatistics() {
    return await this.ordersService.getOrdersStatistics();
  }
  // todo add getExel endpoint '/exel'
}

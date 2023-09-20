import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Role } from '../auth/decorators/role';
import { UserRole } from '../auth/enums/user-role.enum';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/authorization.guard';
import { OrderQueryDto } from '../common/query/order.query.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Role(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Get()
  async getOrdersWithPagination(@Query() query: OrderQueryDto) {
    return await this.ordersService.getOrdersWithPagination(query);
  }
}

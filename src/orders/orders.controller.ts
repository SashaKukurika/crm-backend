import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OrderQueryDto } from '../common/query/order.query.dto';
import { CommentsCreateDto } from './dto/comments-create.dto';
import { OrderUpdateDto } from './dto/order-update.dto';
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

  @Patch(':orderId')
  async updateById(
    @Body() orderUpdateDto: OrderUpdateDto,
    @Param('orderId') orderId: string,
  ): Promise<void> {
    return await this.ordersService.updateById(orderUpdateDto, orderId);
  }

  @Post(':orderId/comments')
  async addComment(
    @Param('orderId') orderId: string,
    @Body() data: CommentsCreateDto,
  ) {
    return await this.ordersService.addComment(orderId, data);
  }
  // todo add getExel endpoint '/exel'
}

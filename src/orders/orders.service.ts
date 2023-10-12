import { Injectable } from '@nestjs/common';

import { OrderQueryDto } from '../common/query/order.query.dto';
import { OrderUpdateDto } from './dto/order-update.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getOrdersWithPagination(query: OrderQueryDto) {
    return await this.ordersRepository.getOrdersWithPagination(query);
  }
  async getOrdersStatistics() {
    return await this.ordersRepository.getOrdersStatistics();
  }

  async updateById(
    orderUpdateDto: OrderUpdateDto,
    orderId: string,
  ): Promise<void> {
    return await this.ordersRepository.updateById(orderUpdateDto, +orderId);
  }
}

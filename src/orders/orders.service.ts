import { Injectable } from '@nestjs/common';

import { OrderQueryDto } from '../common/query/order.query.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getOrdersWithPagination(query: OrderQueryDto) {
    return this.ordersRepository.getOrdersWithPagination(query);
  }
}

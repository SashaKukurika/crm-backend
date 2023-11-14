import { Injectable } from '@nestjs/common';

import { Orders } from '../entitys/orders.entity';

class OrderMapper {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  course: string;
  course_format: string;
  course_type: string;
  sum: number;
  alreadyPaid: number;
  created_at: Date;
  status: string;
  group: string;
  user: string;
}
@Injectable()
export class MapperService {
  createOrderMapper(order: Orders): OrderMapper {
    const orderMapper = new OrderMapper();
    orderMapper.group = order.group?.name;
    orderMapper.user = order.user?.name;
    delete order.comments;
    delete order.utm;
    delete order.msg;

    return { ...order, ...orderMapper };
  }
}

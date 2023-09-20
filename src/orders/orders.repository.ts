import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { OrderFieldEnum } from '../common/enums/order-field.enum';
import { OrderQueryDto } from '../common/query/order.query.dto';
import { Orders } from './entitys/orders.entity';

@Injectable()
export class OrdersRepository extends Repository<Orders> {
  constructor(private readonly dataSource: DataSource) {
    super(Orders, dataSource.manager);
  }
  async getOrdersWithPagination(query: OrderQueryDto) {
    const page = +query.page || 1;
    const limit = 25;
    query.fieldOrder = query.fieldOrder || 'ASC';

    const queryBuilder = await this.createQueryBuilder('orders');

    switch (query.field) {
      case OrderFieldEnum.NAME:
        queryBuilder.orderBy(`orders.${OrderFieldEnum.NAME}`, query.fieldOrder);
        break;
      case OrderFieldEnum.SURNAME:
        queryBuilder.orderBy(
          `orders.${OrderFieldEnum.SURNAME}`,
          query.fieldOrder,
        );
        break;
      case OrderFieldEnum.EMAIL:
        queryBuilder.orderBy(
          `orders.${OrderFieldEnum.EMAIL}`,
          query.fieldOrder,
        );
        break;
      case OrderFieldEnum.PHONE:
        queryBuilder.orderBy(
          `orders.${OrderFieldEnum.PHONE}`,
          query.fieldOrder,
        );
        break;
      case OrderFieldEnum.AGE:
        queryBuilder.orderBy(`orders.${OrderFieldEnum.AGE}`, query.fieldOrder);
        break;
      case OrderFieldEnum.COURSE:
        queryBuilder.orderBy(
          `orders.${OrderFieldEnum.COURSE}`,
          query.fieldOrder,
        );
        break;
      case OrderFieldEnum.COURSE_FORMAT:
        queryBuilder.orderBy(
          `orders.${OrderFieldEnum.COURSE_FORMAT}`,
          query.fieldOrder,
        );
        break;
      case OrderFieldEnum.COURSE_TYPE:
        queryBuilder.orderBy(
          `orders.${OrderFieldEnum.COURSE_TYPE}`,
          query.fieldOrder,
        );
        break;
      case OrderFieldEnum.STATUS:
        queryBuilder.orderBy(
          `orders.${OrderFieldEnum.STATUS}`,
          query.fieldOrder,
        );
        break;
      case OrderFieldEnum.SUM:
        queryBuilder.orderBy(`orders.${OrderFieldEnum.SUM}`, query.fieldOrder);
        break;
      case OrderFieldEnum.ALREADYPAID:
        queryBuilder.orderBy(
          `orders.${OrderFieldEnum.ALREADYPAID}`,
          query.fieldOrder,
        );
        break;
      case OrderFieldEnum.GROUP:
        queryBuilder.orderBy(
          `orders.${OrderFieldEnum.GROUP}`,
          query.fieldOrder,
        );
        break;
      case OrderFieldEnum.CREATED_AT:
        queryBuilder.orderBy(
          `orders.${OrderFieldEnum.CREATED_AT}`,
          query.fieldOrder,
        );
        break;
      case OrderFieldEnum.MANAGER:
        queryBuilder.orderBy(
          `orders.${OrderFieldEnum.MANAGER}`,
          query.fieldOrder,
        );
        break;
      default:
        queryBuilder.orderBy('orders.id', 'DESC');
    }

    if (query.name)
      await queryBuilder.andWhere(`orders.name LIKE :some`, {
        some: `%${query.name}%`,
      });

    if (query.course_type)
      await queryBuilder.andWhere(`orders.course_type LIKE :some2`, {
        some2: `%${query.course_type}%`,
      });

    const totalOrders = await queryBuilder.getCount();

    queryBuilder.offset((page - 1) * limit).limit(limit);

    return {
      data: await queryBuilder.getMany(),
      totalOrders,
      page,
      totalPage: Math.ceil(totalOrders / limit),
    };
  }
}

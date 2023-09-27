import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

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
    if (query.field)
      await queryBuilder.orderBy(`orders.${query.field}`, query.fieldOrder);
    // switch (query.field) {
    //   case OrderFieldEnum.NAME:
    //     queryBuilder.orderBy(`orders.${OrderFieldEnum.NAME}`, query.fieldOrder);
    //     break;
    //   case OrderFieldEnum.SURNAME:
    //     queryBuilder.orderBy(
    //       `orders.${OrderFieldEnum.SURNAME}`,
    //       query.fieldOrder,
    //     );
    //     break;
    //   case OrderFieldEnum.EMAIL:
    //     queryBuilder.orderBy(
    //       `orders.${OrderFieldEnum.EMAIL}`,
    //       query.fieldOrder,
    //     );
    //     break;
    //   case OrderFieldEnum.PHONE:
    //     queryBuilder.orderBy(
    //       `orders.${OrderFieldEnum.PHONE}`,
    //       query.fieldOrder,
    //     );
    //     break;
    //   case OrderFieldEnum.AGE:
    //     queryBuilder.orderBy(`orders.${OrderFieldEnum.AGE}`, query.fieldOrder);
    //     break;
    //   case OrderFieldEnum.COURSE:
    //     queryBuilder.orderBy(
    //       `orders.${OrderFieldEnum.COURSE}`,
    //       query.fieldOrder,
    //     );
    //     break;
    //   case OrderFieldEnum.COURSE_FORMAT:
    //     queryBuilder.orderBy(
    //       `orders.${OrderFieldEnum.COURSE_FORMAT}`,
    //       query.fieldOrder,
    //     );
    //     break;
    //   case OrderFieldEnum.COURSE_TYPE:
    //     queryBuilder.orderBy(
    //       `orders.${OrderFieldEnum.COURSE_TYPE}`,
    //       query.fieldOrder,
    //     );
    //     break;
    //   case OrderFieldEnum.STATUS:
    //     queryBuilder.orderBy(
    //       `orders.${OrderFieldEnum.STATUS}`,
    //       query.fieldOrder,
    //     );
    //     break;
    //   case OrderFieldEnum.SUM:
    //     queryBuilder.orderBy(`orders.${OrderFieldEnum.SUM}`, query.fieldOrder);
    //     break;
    //   case OrderFieldEnum.ALREADYPAID:
    //     queryBuilder.orderBy(
    //       `orders.${OrderFieldEnum.ALREADYPAID}`,
    //       query.fieldOrder,
    //     );
    //     break;
    //   case OrderFieldEnum.GROUP:
    //     queryBuilder.orderBy(
    //       `orders.${OrderFieldEnum.GROUP}`,
    //       query.fieldOrder,
    //     );
    //     break;
    //   case OrderFieldEnum.CREATED_AT:
    //     queryBuilder.orderBy(
    //       `orders.${OrderFieldEnum.CREATED_AT}`,
    //       query.fieldOrder,
    //     );
    //     break;
    //   case OrderFieldEnum.MANAGER:
    //     queryBuilder.orderBy(
    //       `orders.${OrderFieldEnum.MANAGER}`,
    //       query.fieldOrder,
    //     );
    //     break;
    //   default:
    //     queryBuilder.orderBy('orders.id', 'DESC');
    // }

    if (query.name)
      await queryBuilder.andWhere(`orders.name LIKE :some`, {
        some: `%${query.name}%`,
      });

    if (query.surname)
      await queryBuilder.andWhere(`orders.surname LIKE :some2`, {
        some2: `%${query.surname}%`,
      });

    if (query.email)
      await queryBuilder.andWhere(`orders.email LIKE :some3`, {
        some3: `%${query.email}%`,
      });

    if (query.phone)
      await queryBuilder.andWhere(`orders.phone LIKE :some4`, {
        some4: `%${query.phone}%`,
      });

    if (query.age)
      await queryBuilder.andWhere(`orders.age LIKE :some5`, {
        some5: `%${query.age}%`,
      });

    if (query.course)
      await queryBuilder.andWhere(`orders.course LIKE :some6`, {
        some6: `%${query.course}%`,
      });

    if (query.course_format)
      await queryBuilder.andWhere(`orders.course_format LIKE :some7`, {
        some7: `%${query.course_format}%`,
      });

    if (query.course_type)
      await queryBuilder.andWhere(`orders.course_type LIKE :some8`, {
        some8: `%${query.course_type}%`,
      });

    if (query.status)
      await queryBuilder.andWhere(`orders.status LIKE :some9`, {
        some9: `%${query.status}%`,
      });

    if (query.group)
      await queryBuilder.andWhere(`orders.group LIKE :some10`, {
        some10: `%${query.group}%`,
      });

    // for (const queryKey in query) {
    //   if (
    //     queryKey !== 'page' &&
    //     queryKey !== 'field' &&
    //     queryKey !== 'fieldOrder' &&
    //     // todo add group
    //     queryKey !== 'group'
    //   ) {
    //     queryBuilder.andWhere(`orders.${queryKey} LIKE :some11`, {
    //       some11: `%${query[queryKey]}%`,
    //     });
    //   }
    // }

    const totalOrders = await queryBuilder.getCount();

    queryBuilder.offset((page - 1) * limit).limit(limit);

    const totalPage = Math.ceil(totalOrders / limit);

    return {
      data: await queryBuilder.getMany(),
      page,
      totalPage,
      halfOfPages: Math.ceil(totalPage / 2),
      totalOrders,
    };
  }

  async getOrdersStatistics() {
    const queryBuilder = await this.createQueryBuilder('orders');
    // .select(['COUNT(orders.status) as total', 'orders.status as status'])
    // .groupBy('orders.status')
    // .getRawMany();
    const total = await queryBuilder.getCount();
    const inWork = await queryBuilder
      .where('orders.status = :status', {
        status: 'In work',
      })
      .getCount();
    const aggre = await queryBuilder
      .where('orders.status = :status', {
        status: 'Aggre',
      })
      .getCount();
    const disaggre = await queryBuilder
      .where('orders.status = :status', {
        status: 'Disaggre',
      })
      .getCount();
    const dubbing = await queryBuilder
      .where('orders.status = :status', {
        status: 'Dubbing',
      })
      .getCount();
    const nullOrders = await queryBuilder
      .where('orders.status IS NULL OR orders.status = :status', {
        status: 'New',
      })
      .getCount();

    return {
      total,
      inWork,
      aggre,
      disaggre,
      dubbing,
      nullOrders,
    };
  }
}

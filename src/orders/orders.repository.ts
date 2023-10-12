import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { OrderQueryDto } from '../common/query/order.query.dto';
import { Groups } from '../group/entitys/groups.entity';
import { OrderUpdateDto } from './dto/order-update.dto';
import { Orders } from './entitys/orders.entity';

@Injectable()
export class OrdersRepository extends Repository<Orders> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Groups)
    private readonly groupsRepository: Repository<Groups>,
  ) {
    super(Orders, dataSource.manager);
  }
  async getOrdersWithPagination(query: OrderQueryDto) {
    const page = +query.page || 1;
    const limit = 25;

    const queryBuilder = await this.createQueryBuilder('orders')
      .leftJoinAndSelect('orders.group', 'group')
      .orderBy('orders.id', 'DESC');

    if (query.order) {
      if (query.order.startsWith('-')) {
        await queryBuilder.orderBy(
          `orders.${query.order.substring(1)}`,
          'DESC',
        );
      } else {
        await queryBuilder.orderBy(`orders.${query.order}`, 'ASC');
      }
    }

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
      await queryBuilder.andWhere(`group.name = :groupName`, {
        groupName: query.group,
      });

    if (query.start_date)
      await queryBuilder.andWhere(`orders.created_at > :targetDate`, {
        targetDate: query.start_date,
      });

    if (query.end_date)
      await queryBuilder.andWhere(`orders.created_at < :targetDate2`, {
        targetDate2: query.end_date,
      });

    const totalOrders = await queryBuilder.getCount();

    queryBuilder.offset((page - 1) * limit).limit(limit);

    const pageCount = Math.ceil(totalOrders / limit);

    return {
      orders: await queryBuilder.getMany(),
      pageCount,
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
    const agree = await queryBuilder
      .where('orders.status = :status', {
        status: 'Agree',
      })
      .getCount();
    const disagree = await queryBuilder
      .where('orders.status = :status', {
        status: 'Disagree',
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
      agree,
      disagree,
      dubbing,
      nullOrders,
    };
  }

  async updateById(orderUpdateDto: OrderUpdateDto, id: number): Promise<void> {
    const order = await this.findOneBy({ id });
    const group = await this.groupsRepository.findOneBy({
      name: orderUpdateDto.group,
    });

    if (!order) {
      throw new HttpException(
        `Order with id=${id} do not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!group) {
      throw new HttpException(
        `Group with name=${orderUpdateDto.group} do not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.update({ id }, { ...orderUpdateDto, group });
  }
}

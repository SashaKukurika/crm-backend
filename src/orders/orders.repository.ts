import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { StatusEnum } from '../common/enums/status.enum';
import { OrderQueryDto } from '../common/query/order.query.dto';
import { Groups } from '../group/entitys/groups.entity';
import { User } from '../users/entitys/user.entity';
import { CommentsCreateDto } from './dto/comments-create.dto';
import { OrderUpdateDto } from './dto/order-update.dto';
import { Comment } from './entitys/comment.entity';
import { Orders } from './entitys/orders.entity';

@Injectable()
export class OrdersRepository extends Repository<Orders> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Groups)
    private readonly groupsRepository: Repository<Groups>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super(Orders, dataSource.manager);
  }
  async getOrdersWithPagination(query: OrderQueryDto) {
    const page = +query.page || 1;
    const limit = 25;

    const queryBuilder = await this.createQueryBuilder('orders')
      .leftJoinAndSelect('orders.comments', 'comments')
      .leftJoinAndSelect('orders.group', 'group')
      .leftJoinAndSelect('comments.user', 'user')
      .orderBy('orders.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .addOrderBy('comments.created_at', 'DESC');

    // const orders2 = await this.find({
    //   relations: ['group', 'comments'],
    //   skip: (page - 1) * limit,
    //   take: limit,
    //   order: { id: 'DESC' },
    // });

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
      await queryBuilder.andWhere(`orders.age = :age`, {
        age: query.age,
      });

    if (query.course)
      await queryBuilder.andWhere(`orders.course = :course`, {
        course: query.course,
      });

    if (query.course_format)
      await queryBuilder.andWhere(`orders.course_format = :course_format`, {
        course_format: query.course_format,
      });

    if (query.course_type)
      await queryBuilder.andWhere(`orders.course_type = :course_type`, {
        course_type: query.course_type,
      });

    if (query.status)
      await queryBuilder.andWhere(`orders.status = :status`, {
        status: query.status,
      });

    if (query.group)
      await queryBuilder.andWhere(`group.name = :group`, {
        group: query.group,
      });

    if (query.start_date)
      await queryBuilder.andWhere(`orders.created_at > :targetDate`, {
        targetDate: query.start_date,
      });

    if (query.end_date)
      await queryBuilder.andWhere(`orders.created_at < :targetDate2`, {
        targetDate2: query.end_date,
      });

    const totalCount = await queryBuilder.getCount();
    // queryBuilder.skip((page - 1) * limit).take(limit);

    // queryBuilder
    //   .leftJoinAndSelect('orders.comments', 'comments')
    //   .addOrderBy('comments.created_at', 'DESC');

    return {
      orders: await queryBuilder.getMany(),
      // orders: orders2,
      totalCount,
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

  async updateById(
    orderUpdateDto: OrderUpdateDto,
    id: number,
  ): Promise<Orders> {
    const order = await this.findOneBy({ id });
    if (!order) {
      throw new HttpException(
        `Order with id=${id} do not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const group = await this.groupsRepository.findOneBy({
      name: orderUpdateDto.group,
    });
    if (!group) {
      throw new HttpException(
        `Group with name=${orderUpdateDto.group} do not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    Object.assign(order, { ...orderUpdateDto, group });
    return await this.save(order);
  }

  async addComment(id: number, data: CommentsCreateDto) {
    const { text, userId } = data;
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException(
        `User with id=${userId} not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const order = await this.findOneBy({ id });
    if (!order) {
      throw new HttpException(
        `Order with id=${id} not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const comment = await this.commentsRepository.create({
      text,
      user: { ...user },
      order: { ...order },
    });

    await this.update(
      { id },
      {
        status: order.status ? order.status : StatusEnum.IN_WORK,
      },
    );
    const newComment = await this.commentsRepository.save(comment);
    delete newComment.order;

    return { ...newComment, orderId: id };
  }
}

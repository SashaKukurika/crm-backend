import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { StatusEnum } from '../common/enums/status.enum';
import { PaginatedOrders } from '../common/pagination/response';
import { OrderQueryDto } from '../common/query/order.query.dto';
import { Groups } from '../group/entitys/groups.entity';
import { User } from '../users/entitys/user.entity';
import { CommentsCreateDto } from './dto/comments-create.dto';
import { OrderUpdateDto } from './dto/order-update.dto';
import { Comment } from './entitys/comment.entity';
import { Orders } from './entitys/orders.entity';
import { IOrderStatistic } from './inretfaces/order-statistic.interface';

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
  async getOrdersWithPagination(
    query: OrderQueryDto,
  ): Promise<PaginatedOrders> {
    const page = +query.page || 1;
    const limit = 25;

    const searchedAndSortedOrders = await this.searchAndSortOrders(query);

    searchedAndSortedOrders.skip((page - 1) * limit).take(limit);

    const totalCount = await searchedAndSortedOrders.getCount();

    return {
      orders: await searchedAndSortedOrders.getMany(),
      totalCount,
    };
  }

  async getOrdersStatistics(): Promise<IOrderStatistic> {
    const queryBuilder = await this.createQueryBuilder('orders');

    const total = await queryBuilder.getCount();
    // групуємо по полю status та отримуємо їх кількість
    const statuses = await queryBuilder
      .select('COUNT(*)', 'count')
      .addSelect('orders.status', 'status')
      .groupBy('orders.status')
      .getRawMany();

    // робимо значення поля count числом
    statuses.forEach((value) => (value.count = Number(value.count)));
    // знаходимо де не вказаний статус і де статус = 'New'
    const nullStatus = statuses.find((value) => value.status === null);
    const newStatus = statuses.find((value) => value.status === StatusEnum.NEW);

    // якщо обидва є то додаємо їх значення і записуємо в newStatus
    if (nullStatus && newStatus)
      newStatus.count = nullStatus.count + newStatus.count;

    return {
      total,
      statuses: statuses.filter((value) => value.status !== null),
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

  async searchAndSortOrders(
    query: OrderQueryDto,
  ): Promise<SelectQueryBuilder<Orders>> {
    const {
      name,
      order,
      group,
      surname,
      course_type,
      course,
      course_format,
      age,
      status,
      start_date,
      end_date,
      phone,
      manager,
      email,
    } = query;

    const queryBuilder = await this.createQueryBuilder('orders')
      .leftJoinAndSelect('orders.comments', 'comments')
      .leftJoinAndSelect('orders.group', 'group')
      .leftJoinAndSelect('comments.user', 'user')
      .orderBy('orders.id', 'DESC')
      .addOrderBy('comments.created_at', 'DESC');

    if (order) {
      if (order.startsWith('-')) {
        await queryBuilder.orderBy(`orders.${order.substring(1)}`, 'DESC');
      } else {
        await queryBuilder.orderBy(`orders.${order}`, 'ASC');
      }
    }

    if (name)
      await queryBuilder.andWhere(`orders.name LIKE :name`, {
        name: `%${name}%`,
      });

    if (surname)
      await queryBuilder.andWhere(`orders.surname LIKE :surname`, {
        surname: `%${surname}%`,
      });

    if (email)
      await queryBuilder.andWhere(`orders.email LIKE :email`, {
        email: `%${email}%`,
      });

    if (phone)
      await queryBuilder.andWhere(`orders.phone LIKE :phone`, {
        phone: `%${phone}%`,
      });

    if (age)
      await queryBuilder.andWhere(`orders.age = :age`, {
        age,
      });

    if (course)
      await queryBuilder.andWhere(`orders.course = :course`, {
        course,
      });

    if (course_format)
      await queryBuilder.andWhere(`orders.course_format = :course_format`, {
        course_format,
      });

    if (course_type)
      await queryBuilder.andWhere(`orders.course_type = :course_type`, {
        course_type,
      });

    if (status)
      await queryBuilder.andWhere(`orders.status = :status`, {
        status,
      });

    if (group)
      await queryBuilder.andWhere(`group.name = :group`, {
        group,
      });
    // todo add manager
    if (start_date)
      await queryBuilder.andWhere(`orders.created_at > :start_date`, {
        start_date,
      });

    if (end_date)
      await queryBuilder.andWhere(`orders.created_at < :end_date`, {
        end_date,
      });

    return queryBuilder;
  }
}

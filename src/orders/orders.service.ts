import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';

import { PaginatedOrders } from '../common/pagination/response';
import { OrderQueryDto } from '../common/query/order.query.dto';
import { CommentsCreateDto } from './dto/comments-create.dto';
import { OrderUpdateDto } from './dto/order-update.dto';
import { Orders } from './entitys/orders.entity';
import { IAddCommentResponse } from './inretfaces/addComment-response.interface';
import { IOrderStatistic } from './inretfaces/order-statistic.interface';
import { MapperService } from './mappers/order.mapper';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly mapperService: MapperService,
  ) {}

  async getOrdersWithPagination(
    query: OrderQueryDto,
  ): Promise<PaginatedOrders> {
    return await this.ordersRepository.getOrdersWithPagination(query);
  }
  async getOrdersStatistics(): Promise<IOrderStatistic> {
    return await this.ordersRepository.getOrdersStatistics();
  }

  async getExel(query: OrderQueryDto): Promise<Workbook> {
    const searchedAndSortedOrders =
      await this.ordersRepository.searchAndSortOrders(query);
    const orders = await searchedAndSortedOrders.getMany();

    // інший варіант (треба змінити mapper)
    // const rows = [];
    // const orderMappers2 = orders.map((order) => {
    //   return this.mapperService.createOrderMapper(order);
    // });
    // // задаємо значення
    // orderMappers2.forEach((order) => {
    //   rows.push(Object.values(order));
    // });
    // // задаємо значення для першого рядка
    // rows.unshift(
    //   Object.keys(orderMappers2[0]).map(
    //     (value) => value[0].toUpperCase() + value.slice(1),
    //   ),
    // );

    // створюємо книгу, таблицю, та вносимо значення
    const book = new Workbook();
    const sheet = book.addWorksheet(`OrdersWithFilters`);
    // sheet.addRows(rows);

    sheet.columns = [
      { key: 'id', header: 'Id' },
      { key: 'name', header: 'Name' },
      { key: 'surname', header: 'Surname' },
      { key: 'email', header: 'Email' },
      { key: 'phone', header: 'Phone' },
      { key: 'age', header: 'Age' },
      { key: 'course', header: 'Course' },
      { key: 'course_format', header: 'Course format' },
      { key: 'course_type', header: 'Course type' },
      { key: 'status', header: 'Status' },
      { key: 'sum', header: 'Sum' },
      { key: 'alreadyPaid', header: 'AlreadyPaid' },
      { key: 'group', header: 'Group' },
      { key: 'created_at', header: 'Created at' },
      { key: 'user', header: 'Manager' },
    ];

    orders.forEach((order) => {
      const orderMapper = this.mapperService.createOrderMapper(order);
      sheet.addRow(orderMapper);
    });

    // стилізація першого рядка
    sheet.getRow(1).eachCell({ includeEmpty: false }, (cell) => {
      cell.font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '76B852' },
      };
    });

    // стилізація усіх клітинок
    sheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        // Задати межі для всіх сторін клітинки
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        // Вирівняти текст по центру горизонтально і вертикально
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
      });
    });

    // задаємо ширину колонок по індексу
    sheet.getColumn(1).width = 5; // id
    sheet.getColumn(2).width = 15; // name
    sheet.getColumn(3).width = 20; // surname
    sheet.getColumn(4).width = 20; // email
    sheet.getColumn(5).width = 20; // phone
    sheet.getColumn(6).width = 5; // age
    sheet.getColumn(7).width = 15; // course
    sheet.getColumn(8).width = 17; // course_format
    sheet.getColumn(9).width = 15; // course_type
    sheet.getColumn(10).width = 10; // status
    sheet.getColumn(11).width = 10; // sum
    sheet.getColumn(12).width = 15; // alreadyPaid
    sheet.getColumn(13).width = 15; // group
    sheet.getColumn(14).width = 15; // created_at
    sheet.getColumn(15).width = 15; // user

    return book;
  }

  async updateById(
    orderUpdateDto: OrderUpdateDto,
    orderId: string,
  ): Promise<Orders> {
    return await this.ordersRepository.updateById(orderUpdateDto, +orderId);
  }

  async addComment(
    orderId: string,
    data: CommentsCreateDto,
  ): Promise<IAddCommentResponse> {
    return await this.ordersRepository.addComment(+orderId, data);
  }
}

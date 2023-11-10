import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';

import { PaginatedOrders } from '../common/pagination/response';
import { OrderQueryDto } from '../common/query/order.query.dto';
import { CommentsCreateDto } from './dto/comments-create.dto';
import { OrderUpdateDto } from './dto/order-update.dto';
import { Orders } from './entitys/orders.entity';
import { IOrderStatistic } from './inretfaces/order-statistic.interface';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getOrdersWithPagination(
    query: OrderQueryDto,
  ): Promise<PaginatedOrders> {
    return await this.ordersRepository.getOrdersWithPagination(query);
  }
  async getOrdersStatistics(): Promise<IOrderStatistic> {
    return await this.ordersRepository.getOrdersStatistics();
  }

  async getExel(query: OrderQueryDto): Promise<Workbook> {
    // todo check exel for column
    const searchedAndSortedOrders =
      await this.ordersRepository.searchAndSortOrders(query);
    const orders = await searchedAndSortedOrders.getMany();
    const rows = [];

    // задаємо значення
    orders.forEach((order) => {
      rows.push(Object.values(order));
    });
    // задаємо значення для першого рядка
    rows.unshift(
      Object.keys(orders[0]).map(
        (value) => value[0].toUpperCase() + value.slice(1),
      ),
    );

    // створюємо книгу, таблицю, та вносимо значення
    const book = new Workbook();
    const sheet = book.addWorksheet(`OrdersWithFilters`);
    sheet.addRows(rows);

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
    sheet.getColumn(3).width = 15;
    sheet.getColumn(4).width = 20;
    sheet.getColumn(5).width = 15;
    sheet.getColumn(8).width = 15;
    sheet.getColumn(9).width = 15;
    sheet.getColumn(11).width = 15;
    sheet.getColumn(12).width = 15;

    return book;
  }

  async updateById(
    orderUpdateDto: OrderUpdateDto,
    orderId: string,
  ): Promise<Orders> {
    return await this.ordersRepository.updateById(orderUpdateDto, +orderId);
  }

  async addComment(orderId: string, data: CommentsCreateDto) {
    return await this.ordersRepository.addComment(+orderId, data);
  }
}

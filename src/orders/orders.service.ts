import { Injectable } from '@nestjs/common';
import excelJs from 'exceljs';

import { OrderQueryDto } from '../common/query/order.query.dto';
import { CommentsCreateDto } from './dto/comments-create.dto';
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

  async getExel(params: any, res: any) {
    const ordersWithPagination =
      await this.ordersRepository.getOrdersWithPagination(params);
    const workbook = new excelJs.Workbook();
    const sheet = workbook.addWorksheet('ordersWithFilters');
    sheet.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Name', key: 'name' },
      { header: 'Surname', key: 'surname' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
    ];

    ordersWithPagination.orders.map((order) => {
      const { id, name, surname, email, phone } = order;
      sheet.addRow({ id, name, surname, email, phone });
    });

    res.headers.set(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.headers.set('Content-Disposition', 'attachment; filename=orders.xlsx');

    workbook.xlsx.write(res);
  }

  async updateById(
    orderUpdateDto: OrderUpdateDto,
    orderId: string,
  ): Promise<any> {
    return await this.ordersRepository.updateById(orderUpdateDto, +orderId);
  }

  async addComment(orderId: string, data: CommentsCreateDto) {
    return await this.ordersRepository.addComment(+orderId, data);
  }
}

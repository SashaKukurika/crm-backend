import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';

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

  async getExel(params: any): Promise<Workbook> {
    const ordersWithPagination =
      await this.ordersRepository.getOrdersWithPagination(params);
    // const workbook = new excelJs.Workbook();
    // const sheet = workbook.addWorksheet('ordersWithFilters');
    // sheet.columns = [
    //   { header: 'ID', key: 'id' },
    //   { header: 'Name', key: 'name' },
    //   { header: 'Surname', key: 'surname' },
    //   { header: 'Email', key: 'email' },
    //   { header: 'Phone', key: 'phone' },
    //   { header: 'Age', key: 'age' },
    //   { header: 'Created At', key: 'created_at' },
    // ];
    //
    // ordersWithPagination.orders.map((order) => {
    //   const { id, name, surname, email, phone } = order;
    //   sheet.addRow({ id, name, surname, email, phone });
    // });
    //
    // res.headers.set(
    //   'Content-Type',
    //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // );
    // res.headers.set('Content-Disposition', 'attachment; filename=orders.xlsx');
    //
    // workbook.xlsx.write(res);

    // const rows = [];
    // ordersWithPagination.orders.forEach((value) => {
    //   console.log(Object.values(value));
    //   rows.push(Object.values(value));
    // });
    //
    // const book = new excelJs.Workbook();
    // const sheet = book.addWorksheet('ordersWithFilters');
    //
    // sheet.addRows(rows);
    //
    // const File = await new Promise((resolve, reject) => {
    //   tmp.file(
    //     {
    //       discardDescription: true,
    //       prefix: `MyExcelSheet`,
    //       postfix: '.xlsx',
    //       mode: parseInt('0600', 8),
    //     },
    //     async (err, file) => {
    //       if (err) {
    //         throw new BadRequestException(err);
    //       }
    //
    //       book.xlsx
    //         .writeFile(file)
    //         .then(() => {
    //           resolve(file);
    //         })
    //         .catch((err) => {
    //           throw new BadRequestException(err);
    //         });
    //     },
    //   );
    // });
    //
    // return File;

    const rows = [];

    ordersWithPagination.orders.forEach((order) => {
      rows.push(Object.values(order));
    });

    const book = new Workbook();
    const sheet = book.addWorksheet(`OrdersWithFilters`);

    rows.unshift(
      Object.keys(ordersWithPagination.orders[0]).map(
        (value) => value[0].toUpperCase() + value.slice(1),
      ),
    );
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

    sheet.getColumn(3).width = 15;
    sheet.getColumn(4).width = 20;
    sheet.getColumn(5).width = 15;
    sheet.getColumn(8).width = 15;
    sheet.getColumn(9).width = 15;
    sheet.getColumn(11).width = 15;
    sheet.getColumn(12).width = 15;

    // const File: string = await new Promise((resolve) => {
    //   tmp.file(
    //     {
    //       discardDescriptor: true,
    //       prefix: 'excel_sheet',
    //       postfix: '.xlsx',
    //       mode: parseInt(`0600`, 8),
    //     },
    //     async (err, file) => {
    //       if (err) throw new BadRequestException(err);
    //
    //       book.xlsx
    //         .writeFile(file)
    //         .then(() => {
    //           resolve(file);
    //         })
    //         .catch((err) => {
    //           throw new BadRequestException(err);
    //         });
    //     },
    //   );
    // });

    // const File = await book.xlsx.write(res).then(() => {
    //   res.status(200).end();
    // });
    // console.log(File);
    // res.download(`${File}`);
    return book;
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

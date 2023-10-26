import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { OrderQueryDto } from '../common/query/order.query.dto';
import { CommentsCreateDto } from './dto/comments-create.dto';
import { OrderUpdateDto } from './dto/order-update.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  // @Role(UserRole.ADMIN, UserRole.MANAGER)
  // @UseGuards(AccessTokenGuard, RoleGuard)
  @Get()
  async getOrdersWithPagination(@Query() query: OrderQueryDto) {
    return await this.ordersService.getOrdersWithPagination(query);
  }
  // @Role(UserRole.ADMIN, UserRole.MANAGER)
  // @UseGuards(AccessTokenGuard, RoleGuard)
  @Get('/statistics')
  async getOrdersStatistics() {
    return await this.ordersService.getOrdersStatistics();
  }

  @Get('/excel')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  // @Header('Content-Disposition', 'attachment; filename=exported-data.xlsx')
  async getExel(@Body() params: any, @Res() res: Response): Promise<void> {
    const book = await this.ordersService.getExel(params);
    await book.xlsx.write(res).then(() => {
      res.status(200).end();
    });
    // res.setHeader(
    //   'Content-Disposition',
    //   'attachment; filename=exported-data.xlsx',
    // );
    // const file = createReadStream(File);
    // return new StreamableFile(file);
    // res.end(File);
    // res.download(`${File}`);
  }

  @Patch(':orderId')
  async updateById(
    @Body() orderUpdateDto: OrderUpdateDto,
    @Param('orderId') orderId: string,
  ): Promise<any> {
    return await this.ordersService.updateById(orderUpdateDto, orderId);
  }

  @Post(':orderId/comments')
  async addComment(
    @Param('orderId') orderId: string,
    @Body() data: CommentsCreateDto,
  ) {
    return await this.ordersService.addComment(orderId, data);
  }
  // todo add getExel endpoint '/exel'
}

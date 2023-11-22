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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { Role } from '../auth/decorators/role';
import { UserRole } from '../auth/enums/user-role.enum';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/authorization.guard';
import { PaginatedOrders } from '../common/pagination/response';
import { OrderQueryDto } from '../common/query/order.query.dto';
import { CommentsCreateDto } from './dto/comments-create.dto';
import { OrderUpdateDto } from './dto/order-update.dto';
import { Orders } from './entitys/orders.entity';
import { IAddCommentResponse } from './inretfaces/addComment-response.interface';
import { IOrderStatistic } from './inretfaces/order-statistic.interface';
import { OrdersService } from './orders.service';

@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOkResponse({
    type: PaginatedOrders,
    description: 'orders with pagination',
  })
  @ApiOperation({ summary: 'get orders with pagination' })
  @Role(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Get()
  async getOrdersWithPagination(
    @Query() query: OrderQueryDto,
  ): Promise<PaginatedOrders> {
    return await this.ordersService.getOrdersWithPagination(query);
  }

  @ApiOkResponse({
    type: IOrderStatistic,
    description: 'orders statistic',
  })
  @ApiOperation({ summary: 'get orders statistic' })
  @Role(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Get('/statistic')
  async getOrdersStatistics(): Promise<IOrderStatistic> {
    return await this.ordersService.getOrdersStatistics();
  }

  @ApiResponse({
    status: 200,
    description: 'Success',
    headers: {
      'Content-Type': {
        description:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    },
  })
  @ApiOperation({
    summary: 'export orders to Excel',
    description: 'Endpoint to export orders data to an Excel file.',
  })
  @ApiConsumes(
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @UseGuards(AccessTokenGuard)
  @Get('/excel')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  async getExel(
    @Query() query: OrderQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    const book = await this.ordersService.getExel(query);
    book.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  }

  @ApiResponse({
    status: 200,
    type: OmitType(Orders, ['comments']),
    description: 'updated order info',
  })
  @ApiOperation({ summary: 'update order' })
  @UseGuards(AccessTokenGuard)
  @Patch(':orderId')
  async updateById(
    @Body() orderUpdateDto: OrderUpdateDto,
    @Param('orderId') orderId: string,
  ): Promise<Orders> {
    return await this.ordersService.updateById(orderUpdateDto, orderId);
  }

  @ApiResponse({
    status: 201,
    type: IAddCommentResponse,
    description: 'created comment info',
  })
  @ApiOperation({ summary: 'create comment' })
  @UseGuards(AccessTokenGuard)
  @Post(':orderId/comments')
  async addComment(
    @Param('orderId') orderId: string,
    @Body() data: CommentsCreateDto,
  ): Promise<IAddCommentResponse> {
    return await this.ordersService.addComment(orderId, data);
  }
}

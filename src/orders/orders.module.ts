import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Groups } from '../group/entitys/groups.entity';
import { User } from '../users/entitys/user.entity';
import { UsersModule } from '../users/users.module';
import { Comment } from './entitys/comment.entity';
import { Orders } from './entitys/orders.entity';
import { MapperService } from './mappers/order.mapper';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, MapperService],
  imports: [
    TypeOrmModule.forFeature([Orders, Groups, Comment, User]),
    AuthModule,
    UsersModule,
  ],
  exports: [],
})
export class OrdersModule {}

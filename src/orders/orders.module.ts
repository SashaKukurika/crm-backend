import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Groups } from '../group/entitys/groups.entity';
import { User } from '../users/entitys/user.entity';
import { UsersModule } from '../users/users.module';
import { Comment } from './entitys/comment.entity';
import { Orders } from './entitys/orders.entity';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  // imports some "AnimalsService" service to use his in this module, put all that we use inside module
  providers: [OrdersService, OrdersRepository],
  // imports some module to use his in this module
  imports: [
    TypeOrmModule.forFeature([Orders, Groups, Comment, User]),
    AuthModule,
    UsersModule,
  ],
  exports: [],
})
export class OrdersModule {}

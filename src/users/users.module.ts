import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Orders } from './entitys/orders.entity';
import { User } from './entitys/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  // imports some "AnimalsService" service to use his in this module, put all that we use inside module
  providers: [UsersService],
  // imports some module to use his in this module
  imports: [TypeOrmModule.forFeature([User, Orders])],
  exports: [],
})
export class UsersModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Groups } from './entitys/groups.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [TypeOrmModule.forFeature([Groups]), AuthModule],
  exports: [],
})
export class GroupsModule {}

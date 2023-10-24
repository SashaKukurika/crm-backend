import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GroupsCreateDto } from './dto/groups-create.dto';
import { Groups } from './entitys/groups.entity';
import { GroupsService } from './groups.service';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getAllGroups(): Promise<Groups[]> {
    return this.groupsService.getAllGroups();
  }
  @Post()
  async createGroups(@Body() groupsCreateDto: GroupsCreateDto): Promise<any> {
    return await this.groupsService.createGroups(groupsCreateDto);
  }
}

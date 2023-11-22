import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { GroupsCreateDto } from './dto/groups-create.dto';
import { Groups } from './entitys/groups.entity';
import { GroupsService } from './groups.service';

@ApiBearerAuth()
@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOkResponse({
    type: Groups,
    isArray: true,
    description: 'groups info',
  })
  @ApiOperation({ summary: 'get all groups' })
  @UseGuards(AccessTokenGuard)
  @Get()
  async getAllGroups(): Promise<Groups[]> {
    return this.groupsService.getAllGroups();
  }
  @ApiResponse({
    type: Groups,
    description: 'created group info',
  })
  @ApiOperation({ summary: 'create group' })
  @UseGuards(AccessTokenGuard)
  @Post()
  async createGroups(
    @Body() groupsCreateDto: GroupsCreateDto,
  ): Promise<Groups> {
    return await this.groupsService.createGroups(groupsCreateDto);
  }
}

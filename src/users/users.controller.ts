import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PaginatedUsers } from '../common/pagination/response';
import { CreateUserDto } from './dto/user-create.dto';
import { User } from './entitys/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // @Role(UserRole.ADMIN)
  // @UseGuards(AccessTokenGuard, RoleGuard)
  @Get()
  async getAllUsers(@Query() query: { page: string }): Promise<PaginatedUsers> {
    return this.userService.getAllUsers(query);
  }
  @Get('/statistic/:userId')
  async getUserStatistic(@Param('userId') userId: string): Promise<any> {
    return this.userService.getUserStatistic(+userId);
  }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }
  @Post('create/admin')
  async createAdmin() {
    return await this.userService.createAdmin();
  }
}

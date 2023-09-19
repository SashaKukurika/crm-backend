import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/user-create.dto';
import { User } from './entitys/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
  @Get('/orders')
  async getAllOrders(): Promise<any> {
    return this.userService.getAllOrders();
  }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.userService.createUser(createUserDto);
  }
  // @Get(':userId')
  // async getUserById(@Param('userId') userId: string): Promise<any> {
  //   return this.userService.getUserById(userId);
  // }
}

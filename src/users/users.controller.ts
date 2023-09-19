import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/user-create.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<any> {
    return this.userService.getAllUsers();
  }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.createUser(createUserDto);
  }
  @Get(':userId')
  async getUserById(@Param('userId') userId: string): Promise<any> {
    return this.userService.getUserById(userId);
  }
}

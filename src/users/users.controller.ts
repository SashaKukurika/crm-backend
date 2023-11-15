import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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
  @Get(':id/activateToken')
  async getActivateToken(@Param('id') id: string): Promise<string> {
    return this.userService.getActivateToken(+id);
  }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }
  @Post('create/admin')
  async createAdmin(): Promise<void> {
    return await this.userService.createAdmin();
  }
  @Patch(':id/ban')
  async ban(@Param('id') id: string): Promise<User> {
    return this.userService.ban(+id);
  }
  @Patch(':id/unban')
  async unban(@Param('id') id: string): Promise<User> {
    return this.userService.unban(+id);
  }
}

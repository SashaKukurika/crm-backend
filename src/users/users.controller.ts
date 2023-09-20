import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Role } from '../auth/decorators/role';
import { UserRole } from '../auth/enums/user-role.enum';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/authorization.guard';
import { CreateUserDto } from './dto/user-create.dto';
import { User } from './entitys/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Role(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.userService.createUser(createUserDto);
  }
  @Post('create/admin')
  async createAdmin() {
    return await this.userService.createAdmin();
  }
}

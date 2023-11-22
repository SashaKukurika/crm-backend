import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Role } from '../auth/decorators/role';
import { UserRole } from '../auth/enums/user-role.enum';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/authorization.guard';
import { PaginatedUsers } from '../common/pagination/response';
import { CreateUserDto } from './dto/user-create.dto';
import { User } from './entitys/user.entity';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({
    description: 'users with pagination.',
    type: PaginatedUsers,
  })
  @ApiOperation({ summary: 'get all users with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 2 })
  @Role(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Get()
  async getAllUsers(@Query() query: { page: string }): Promise<PaginatedUsers> {
    return this.userService.getAllUsers(query);
  }
  @ApiOkResponse({ type: String, description: 'activate token' })
  @ApiParam({
    name: 'id',
    description: 'A unique integer value identifying this user model.',
  })
  @ApiOperation({
    summary: 'get activate token',
    description: 'get some token: qwohoiboqiwbgieurbgbqierguqrbgoqbrubg',
  })
  @Role(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Get(':id/activateToken')
  async getActivateToken(@Param('id') id: string): Promise<string> {
    return this.userService.getActivateToken(+id);
  }
  @ApiOperation({ summary: 'created user info' })
  @ApiCreatedResponse({ type: User, description: 'created user info' })
  @Role(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  @ApiCreatedResponse()
  @ApiOperation({ summary: 'create admin' })
  @Post('create/admin')
  async createAdmin(): Promise<void> {
    return await this.userService.createAdmin();
  }

  @ApiResponse({ status: 201, type: User, description: 'banned user info' })
  @ApiOperation({ summary: 'ban user' })
  @Role(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Patch(':id/ban')
  async ban(@Param('id') id: string): Promise<User> {
    return this.userService.ban(+id);
  }

  @ApiResponse({ status: 201, type: User, description: 'unbanned user info' })
  @ApiOperation({ summary: 'unban user' })
  @Role(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Patch(':id/unban')
  async unban(@Param('id') id: string): Promise<User> {
    return this.userService.unban(+id);
  }
}

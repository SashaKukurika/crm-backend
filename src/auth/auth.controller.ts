import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { User } from '../users/entitys/user.entity';
import { AuthService } from './auth.service';
import { ActivateUserDto } from './dto/activate-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { JwtTokensInterface } from './interface/jwt-token.interface';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: User, description: 'logged-in user info' })
  @ApiOperation({ summary: 'get a logged-in user' })
  @UseGuards(AccessTokenGuard)
  @Get('/me')
  async me(@Request() req: Request): Promise<Partial<User>> {
    const accessToken: string = req.headers['authorization'];
    const splice = accessToken.split(' ');
    if (splice.length === 2 && splice[0] === 'Bearer') {
      const token = splice[1];
      return this.authService.me(token);
    } else {
      throw new UnauthorizedException('Invalid token format');
    }
  }

  @ApiResponse({
    status: 201,
    type: JwtTokensInterface,
    description: 'access and refresh tokens',
  })
  @ApiOperation({ summary: 'login and get tokens' })
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<JwtTokensInterface> {
    return await this.authService.login(loginDto);
  }

  @ApiResponse({
    status: 201,
    type: JwtTokensInterface,
    description: 'access and refresh tokens',
  })
  @ApiOperation({ summary: 'refresh the tokens' })
  @Post('/refresh')
  async refreshToken(
    @Body() { refreshToken }: RefreshTokenDto,
  ): Promise<JwtTokensInterface> {
    return await this.authService.refreshToken(refreshToken);
  }

  @ApiOkResponse()
  @ApiOperation({ summary: 'activate user' })
  @Patch('/activate/:activateToken')
  async activateUser(
    @Param('activateToken') activateToken: string,
    @Body() activateUserDto: ActivateUserDto,
  ): Promise<void> {
    return await this.authService.activateUser(activateToken, activateUserDto);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { User } from '../users/entitys/user.entity';
import { AuthService } from './auth.service';
import { ActivateUserDto } from './dto/activate-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtTokensInterface } from './interface/jwt-token.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<JwtTokensInterface> {
    return await this.authService.login(loginDto);
  }

  @Post('/refresh')
  async refreshToken(
    @Body() { refreshToken }: RefreshTokenDto,
  ): Promise<JwtTokensInterface> {
    return await this.authService.refreshToken(refreshToken);
  }

  @Patch('/activate/:activateToken')
  async activateUser(
    @Param('activateToken') activateToken: string,
    @Body() activateUserDto: ActivateUserDto,
  ): Promise<void> {
    return await this.authService.activateUser(activateToken, activateUserDto);
  }
}

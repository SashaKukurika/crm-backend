import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { ExtractJwt } from 'passport-jwt';

import { User } from '../../users/entitys/user.entity';
import { AuthService } from '../auth.service';
import { TokensTypeEnum } from '../enums/tokens-type.enum';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        configService.get<string>('JWT_ACCESS_TOKEN_SECRET') ?? 'Secret',
    });
  }

  async validate(token: string): Promise<User> {
    let user = null;
    try {
      const jwtPayload = await this.authService.verifyToken(
        token,
        TokensTypeEnum.ACCESS,
      );
      user = await this.authService.validateUser(jwtPayload);
      await this.authService.verifyTokenRedis(
        jwtPayload.email,
        TokensTypeEnum.ACCESS,
      );
    } catch (e) {
      console.log(
        new Date().toISOString(),
        ' [JWT USER VERIFY ERROR] ',
        JSON.stringify(e),
        ' [TOKEN] ',
        token,
      );
      throw new UnauthorizedException();
    }

    return user;
  }
}

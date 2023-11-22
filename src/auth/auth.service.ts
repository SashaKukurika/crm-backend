import { InjectRedis } from '@liaoliaots/nestjs-redis';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { Repository } from 'typeorm';

import { User } from '../users/entitys/user.entity';
import { ActivateUserDto } from './dto/activate-user.dto';
import { LoginDto } from './dto/login.dto';
import { TokensTypeEnum } from './enums/tokens-type.enum';
import { UserRole } from './enums/user-role.enum';
import { JWTPayload } from './interface/auth.interface';
import { JwtTokensInterface } from './interface/jwt-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async me(token: string): Promise<Partial<User>> {
    const { id, email } = await this.verifyToken(token, TokensTypeEnum.ACCESS);
    await this.verifyTokenRedis(email, TokensTypeEnum.ACCESS);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userRepository.findOneBy({ id });
    return user;
  }
  async login(loginDto: LoginDto): Promise<JwtTokensInterface> {
    const { password, email } = loginDto;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user.is_active) {
      throw new HttpException("User doesn't activated", HttpStatus.BAD_REQUEST);
    }

    const isMatched = await this.comparePasswords(password, user.password);

    if (!isMatched) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.getTokens(user);
  }

  async refreshToken(token: string): Promise<JwtTokensInterface> {
    try {
      const { email } = await this.verifyToken(token, TokensTypeEnum.REFRESH);
      await this.verifyTokenRedis(email, TokensTypeEnum.REFRESH);
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new HttpException(`User not exist`, HttpStatus.BAD_REQUEST);
      }

      return this.getTokens(user);
    } catch (e) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async activateUser(
    activateToken: string,
    { password }: ActivateUserDto,
  ): Promise<void> {
    try {
      const { id } = await this.verifyToken(
        activateToken,
        TokensTypeEnum.ACTIVATE,
      );
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new HttpException(
          `User with id=${id} doesn't exist`,
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.verifyTokenRedis(user.email, TokensTypeEnum.ACTIVATE);

      const hashedPassword = await this.hashPassword(password);

      await this.userRepository.update(
        { id },
        { is_active: true, password: hashedPassword },
      );
    } catch (e) {
      throw new HttpException(
        `User activation error: ${e.message}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async getTokens(user: User): Promise<JwtTokensInterface> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          email: user.email,
          id: user.id,
          role: user.role,
          type: TokensTypeEnum.ACCESS,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<number>(
            'JWT_ACCESS_TOKEN_EXPIRATION',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          email: user.email,
          id: user.id,
          role: user.role,
          type: TokensTypeEnum.REFRESH,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<number>(
            'JWT_REFRESH_TOKEN_EXPIRATION',
          ),
        },
      ),
    ]);
    this.redis.setex(
      `${TokensTypeEnum.ACCESS}:${user.email}`,
      this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION'),
      accessToken,
    );
    this.redis.setex(
      `${TokensTypeEnum.REFRESH}:${user.email}`,
      this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION'),
      refreshToken,
    );
    return { accessToken, refreshToken };
  }

  async getActivateToken(id: number): Promise<string> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        `User with id=${id} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const activateToken = await this.jwtService.signAsync(
      {
        id,
        role: UserRole.MANAGER,
        email: user.email,
        type: TokensTypeEnum.ACTIVATE,
      },
      {
        secret: this.configService.get<string>('JWT_ACTIVATE_TOKEN_SECRET'),
        expiresIn: this.configService.get<number>(
          'JWT_ACTIVATE_TOKEN_EXPIRATION',
        ),
      },
    );
    this.redis.setex(
      `${TokensTypeEnum.ACTIVATE}:${user.email}`,
      600,
      activateToken,
    );
    return activateToken;
  }
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      password,
      +this.configService.get<string>('BCRYPT_SALT'),
    );
  }
  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async validateUser(data: JWTPayload): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async verifyToken(token: string, type: TokensTypeEnum): Promise<JWTPayload> {
    try {
      switch (type) {
        case TokensTypeEnum.ACCESS:
          return await this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          });
        case TokensTypeEnum.REFRESH:
          return await this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          });
        case TokensTypeEnum.ACTIVATE:
          return await this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>('JWT_ACTIVATE_TOKEN_SECRET'),
          });
        default:
          throw new HttpException('No such token type', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new UnauthorizedException(err, { description: 'Invalid token' });
    }
  }
  async verifyTokenRedis(email: string, type: TokensTypeEnum): Promise<void> {
    const token = await this.redis.get(`${type}:${email}`);
    if (!token) {
      throw new Error(
        `${type[0].toUpperCase() + type.slice(1)} token not found`,
      );
    }
  }
}

import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
// import { RedisService } from 'nestjs-redis';
import { Repository } from 'typeorm';

import { User } from '../users/entitys/user.entity';
import { LoginDto } from './dto/login.dto';
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

  async login(loginDto: LoginDto): Promise<JwtTokensInterface> {
    const { password, email } = loginDto;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new HttpException(
        'Incorrect email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isMatched = await this.comparePasswords(password, user.password);

    if (!isMatched) {
      throw new HttpException(
        'Incorrect email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens = await this.getTokens(user);

    this.redis.setex(`accessToken:${user.email}`, 1000, tokens.accessToken);
    this.redis.setex(`refreshToken:${user.email}`, 10000, tokens.refreshToken);

    return tokens;
  }

  async refreshTokens(token: string): Promise<JwtTokensInterface> {
    try {
      const { sub: email } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new HttpException(
          `User with email = ${email} not exist`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.getTokens(user);
    } catch (e) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  private async getTokens(user: User): Promise<JwtTokensInterface> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION',
          ),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async getHashPassword(password: string): Promise<string> {
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
}

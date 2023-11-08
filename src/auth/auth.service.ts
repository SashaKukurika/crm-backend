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

  async me(token: string): Promise<User> {
    try {
      const { id, email } = await this.verifyAccessToken(token);
      await this.verifyAccessTokenFromRedis(email);
      return await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new UnauthorizedException('Invalid token or user not found');
    }
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
      const { email } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      await this.verifyRefreshTokenFromRedis(email);
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
      const { id }: JWTPayload = await this.jwtService.verifyAsync(
        activateToken,
        {
          secret: this.configService.get<string>('JWT_ACTIVATE_TOKEN_SECRET'),
        },
      );
      await this.userRepository.findOneByOrFail({ id });
      await this.verifyActivateTokenFromRedis(id.toString());

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
          email: user.email,
          id: user.id,
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
    this.redis.setex(`accessToken:${user.email}`, 86_400, accessToken);
    this.redis.setex(`refreshToken:${user.email}`, 86_400 * 7, refreshToken);
    return { accessToken, refreshToken };
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

  async verifyAccessToken(token: string): Promise<JWTPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      });
    } catch (err) {
      console.log(new Date().toISOString(), token);
      throw new UnauthorizedException();
    }
  }

  async verifyAccessTokenFromRedis(email: string): Promise<void> {
    try {
      const token = await this.redis.get(`accessToken:${email}`);
      if (!token) {
        throw new Error(`Access token not found`);
      }
    } catch (error) {
      console.error(`Error while getting access token: ${error.message}`);
      throw error;
    }
  }
  async verifyRefreshTokenFromRedis(email: string): Promise<void> {
    try {
      const token = await this.redis.get(`refreshToken:${email}`);
      if (!token) {
        throw new Error(`Refresh token not found`);
      }
    } catch (error) {
      console.error(`Error while getting refresh token: ${error.message}`);
      throw error;
    }
  }
  async verifyActivateTokenFromRedis(id: string): Promise<void> {
    try {
      const token = await this.redis.get(`activateToken:${id}`);
      if (!token) {
        throw new Error(`Refresh token not found`);
      }
    } catch (error) {
      console.error(`Error while getting refresh token: ${error.message}`);
      throw error;
    }
  }

  async getActivateToken(id: number): Promise<string> {
    const activateToken = await this.jwtService.signAsync(
      {
        id,
        role: UserRole.MANAGER,
      },
      {
        secret: this.configService.get<string>('JWT_ACTIVATE_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACTIVATE_TOKEN_EXPIRATION',
        ),
      },
    );
    this.redis.setex(`activateToken:${id}`, 600, activateToken);
    return activateToken;
  }
}

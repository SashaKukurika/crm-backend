import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/entitys/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BearerStrategy } from './passport-strategy/bearer.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'bearer',
      property: 'user',
      session: false,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      // якщо прописати тут то застосується до усіх токенів що ми створюємо, можна прокидати в signIn
      // {
      //   secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      //   expiresIn: this.configService.get<string>(
      //     'JWT_ACCESS_TOKEN_EXPIRATION',
      //   ),
    }),
  ],
  providers: [AuthService, BearerStrategy],
  exports: [PassportModule, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

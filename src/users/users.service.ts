import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { UserRole } from '../auth/enums/user-role.enum';
import { User } from './entitys/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
  async createUser(createUserDto): Promise<any> {
    const user = await this.userRepository.create({ ...createUserDto });
    await this.userRepository.save(user);
    return user;
  }

  async createAdmin() {
    const password = await bcrypt.hash(
      this.configService.get<string>('ADMIN_PASSWORD'),
      +this.configService.get<string>('BCRYPT_SALT'),
    );
    const admin = await this.userRepository.create({
      password,
      email: this.configService.get<string>('ADMIN_EMAIL'),
      role: UserRole.ADMIN,
    });
    await this.userRepository.save(admin);
  }
}

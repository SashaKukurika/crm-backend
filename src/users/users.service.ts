import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Orders } from './entitys/orders.entity';
import { User } from './entitys/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {}
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
  async getAllOrders(): Promise<any> {
    return this.ordersRepository.findAndCount({ take: 5, skip: 20 });
  }
  async createUser(createUserDto): Promise<any> {
    const user = await this.userRepository.create({ ...createUserDto });
    await this.userRepository.save(user);
    return user;
  }
  async getUserById(userId): Promise<any> {
    return userId;
  }
}

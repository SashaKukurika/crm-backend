import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { UserRole } from '../auth/enums/user-role.enum';
import { PaginatedUsers } from '../common/pagination/response';
import { Orders } from '../orders/entitys/orders.entity';
import { CreateUserDto } from './dto/user-create.dto';
import { User } from './entitys/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    private readonly configService: ConfigService,
  ) {}
  async getAllUsers(query: { page: string }): Promise<PaginatedUsers> {
    const page = +query.page || 1;
    const take = 5;
    const skip = (page - 1) * take;

    // Спочатку витягуємо користувачів з пагінацією
    const queryUsers = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.role =:role', { role: UserRole.MANAGER })
      .orderBy('user.created_at', 'DESC')
      .skip(skip)
      .take(take);

    const [users, totalCount] = await Promise.all([
      queryUsers.getMany(), // Отримуємо користувачів
      queryUsers.getCount(), // Отримуємо загальну кількість користувачів
    ]);

    // Формуємо статистику для кожного користувача
    const usersWithStatistic = await Promise.all(
      users.map(async (user) => {
        const userOrdersQuery = this.ordersRepository
          .createQueryBuilder('orders')
          .select('COUNT(*)', 'count')
          .addSelect('orders.status', 'status')
          .where('orders.userId = :id', { id: user.id })
          .groupBy('orders.status');

        const [total, statuses] = await Promise.all([
          userOrdersQuery.getCount(), // Отримуємо загальну кількість замовлень
          userOrdersQuery.getRawMany(), // Отримуємо статуси замовлень
        ]);

        return { ...user, statistic: { total, statuses } };
      }),
    );

    // Повертаємо результат разом із загальною кількістю користувачів
    return { users: usersWithStatistic, totalCount };
  }

  async getUserStatistic(id: number) {
    await this.findByIdOrThrow(id);

    const userOrders = await this.ordersRepository
      .createQueryBuilder('orders')
      .select('COUNT(*)', 'count')
      .addSelect('orders.status', 'status')
      .where('orders.userId =:id', { id });

    const total = await userOrders.getCount();
    const statuses = await userOrders.groupBy('orders.status').getRawMany();

    return { total, statuses };
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserDto,
      role: UserRole.MANAGER,
    });
    const newUser = await this.usersRepository.save(user);
    delete newUser.password;
    return newUser;
  }

  async createAdmin() {
    const password = await this.hashPassword(
      this.configService.get<string>('ADMIN_PASSWORD'),
    );
    const admin = await this.usersRepository.create({
      password,
      email: this.configService.get<string>('ADMIN_EMAIL'),
      role: UserRole.ADMIN,
    });
    await this.usersRepository.save(admin);
  }

  async ban(id: number): Promise<User> {
    const user = await this.findByIdOrThrow(id);
    user.is_active = false;

    return await this.usersRepository.save(user);
  }

  async unban(id: number): Promise<User> {
    const user = await this.findByIdOrThrow(id);
    user.is_active = true;

    return await this.usersRepository.save(user);
  }

  async findByIdOrThrow(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        `User with id=${id} do not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      password,
      +this.configService.get<string>('BCRYPT_SALT'),
    );
  }
  async comparePassword(password: string, hashedPassword): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

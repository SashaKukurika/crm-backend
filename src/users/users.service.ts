import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  users = [
    { name: 'asd', age: 22 },
    { name: 'svd', age: 21 },
    { name: 'asv', age: 23 },
    { name: 'asdgfbd', age: 25 },
  ];
  constructor() {}
  async getAllUsers(): Promise<any> {
    return this.users;
  }
  async createUser(createUserDto): Promise<any> {
    return this.users.push(createUserDto);
  }
  async getUserById(userId): Promise<any> {
    return userId;
  }
}

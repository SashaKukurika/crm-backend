import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Groups } from './entitys/groups.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Groups)
    private readonly groupsRepository: Repository<Groups>,
  ) {}

  async getAllGroups(): Promise<Groups[]> {
    return this.groupsRepository.find();
  }

  async createGroups(createGroupsDto): Promise<any> {
    const group = this.groupsRepository.create({ ...createGroupsDto });
    await this.groupsRepository.save(group);
    return group;
  }
}

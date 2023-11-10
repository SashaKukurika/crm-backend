import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupsCreateDto } from './dto/groups-create.dto';
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

  async createGroups(groupsCreateDto: GroupsCreateDto): Promise<Groups> {
    try {
      const finedGroup = await this.groupsRepository.findOneBy({
        name: groupsCreateDto.name,
      });
      if (finedGroup) {
        throw new HttpException(
          `Group with name=${finedGroup.name} already exist`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const group = this.groupsRepository.create({ ...groupsCreateDto });
      return await this.groupsRepository.save(group);
    } catch (error) {
      throw new Error(`Failed to create group: ${error.message}`);
    }
  }
}

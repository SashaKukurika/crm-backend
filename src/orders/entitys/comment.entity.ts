import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entitys/user.entity';
import { Orders } from './orders.entity';

@Entity()
export class Comment {
  @ApiProperty({
    type: Number,
    description: 'Comment id',
    required: true,
    example: 3,
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: String,
    description: 'Comment text',
    required: true,
    example: 'some text',
    maxLength: 100,
    minLength: 1,
  })
  @Column({ type: 'varchar', length: 100, nullable: false, unique: false })
  text: string;

  @ApiProperty({
    type: Date,
    description: 'When was created',
    required: true,
    example: '2023-11-13 15:24:51.834873',
  })
  @CreateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ManyToOne(() => Orders, (order) => order.comments)
  order: Orders;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.comments)
  user: User;
}

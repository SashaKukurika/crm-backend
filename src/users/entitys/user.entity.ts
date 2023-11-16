import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '../../auth/enums/user-role.enum';
import { Comment } from '../../orders/entitys/comment.entity';
import { Orders } from '../../orders/entitys/orders.entity';

@Entity()
export class User {
  @ApiProperty({
    type: Number,
    description: 'Order id',
    required: true,
    example: 3,
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: String,
    description: 'User name',
    example: 'kokos',
    maxLength: 25,
    minLength: 1,
    required: true,
  })
  @Column({ type: 'varchar', length: 25, nullable: false })
  @Matches(/^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$/, {
    message: 'Name must not contain special characters or digits',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'User surname',
    example: 'kokosovich',
    maxLength: 30,
    minLength: 1,
    required: true,
  })
  @Column({ type: 'varchar', length: 30, nullable: false })
  @Matches(/^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$/, {
    message: 'Surname must not contain special characters or digits',
  })
  surname: string;

  @ApiProperty({
    type: Boolean,
    description: 'Is user activated',
    example: false,
    default: false,
    required: true,
  })
  @Column({ type: 'boolean', nullable: false, default: false })
  is_active: boolean;

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

  @ApiProperty({
    type: Date,
    description: 'When was last login',
    required: true,
    example: '2023-11-13 15:24:51.834873',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  last_login: Date;

  @ApiProperty({
    type: String,
    pattern: '[w-.]+@([w-]+.)+[w-]{2,4}$',
    description: 'Client email',
    minLength: 1,
    maxLength: 254,
    uniqueItems: true,
    required: true,
    example: 'email@gmail.com',
  })
  @Column({ type: 'varchar', nullable: false, unique: true })
  @Matches(/[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Invalid email format',
  })
  email: string;

  @Column({ type: 'varchar', nullable: false, default: 'manager' })
  password: string;

  @ApiProperty({
    enum: Object.values(UserRole),
    description: 'User role',
    required: true,
  })
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}

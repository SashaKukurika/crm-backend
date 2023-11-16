import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Matches, Max, Min } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CoursesEnum } from '../../common/enums/courses.enum';
import { CoursesFormatEnum } from '../../common/enums/courses-format.enum';
import { CoursesStatusEnum } from '../../common/enums/courses-status.enum';
import { CoursesTypeEnum } from '../../common/enums/courses-type.enum';
import { Groups } from '../../group/entitys/groups.entity';
import { User } from '../../users/entitys/user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Orders {
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
    description: 'Client name',
    example: 'kokos',
    maxLength: 25,
  })
  @Column({ type: 'varchar', length: 25, nullable: true })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Client surname',
    example: 'kokosovich',
    maxLength: 25,
  })
  @Column({ type: 'varchar', length: 25, nullable: true })
  surname: string;

  @ApiProperty({
    type: String,
    pattern: '[w-.]+@([w-]+.)+[w-]{2,4}$',
    description: 'Client email',
    uniqueItems: true,
    minLength: 1,
    maxLength: 100,
    required: true,
    example: 'email@gmail.com',
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  @Matches(/[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Invalid email format',
  })
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  convertEmailToLowerCase() {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  }

  @ApiProperty({
    type: String,
    pattern: '^380\\d{9}$',
    description: 'Client phone',
    example: '380932922314',
    required: false,
  })
  @Column({ type: 'varchar', length: 12, nullable: true })
  phone: string;

  @ApiProperty({
    type: Number,
    description: 'Client age',
    example: 18,
    required: false,
    minimum: 16,
    maximum: 90,
  })
  @Column({ type: 'int', nullable: true })
  age: number;

  @ApiProperty({
    enum: Object.values(CoursesEnum),
    description: 'Course name',
    required: false,
  })
  @Column({ type: 'varchar', length: 10, nullable: true })
  @IsEnum(CoursesEnum, { message: 'Invalid course' })
  course: CoursesEnum;

  @ApiProperty({
    enum: Object.values(CoursesFormatEnum),
    description: 'Course format',
    required: false,
  })
  @Column({ type: 'varchar', length: 15, nullable: true })
  @IsEnum(CoursesFormatEnum, { message: 'Invalid course format' })
  course_format: CoursesFormatEnum;

  @ApiProperty({
    enum: Object.values(CoursesTypeEnum),
    description: 'Course type',
    required: false,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsEnum(CoursesTypeEnum, { message: 'Invalid course type' })
  course_type: CoursesTypeEnum;

  @ApiProperty({
    type: Number,
    description: 'Course cost',
    example: 30_000,
    required: false,
    minimum: 1,
    maximum: 1_000_000,
  })
  @Column({ type: 'int', nullable: true })
  @IsInt({ message: 'Sum must be an integer' })
  @Min(1, { message: 'Sum must be at least 1' })
  @Max(1_000_000, { message: 'Sum must not exceed 1 000 000' })
  sum: number;

  @ApiProperty({
    type: Number,
    description: 'Course cost',
    example: 30_000,
    required: false,
    minimum: 1,
    maximum: 1_000_000,
  })
  @Column({ type: 'int', nullable: true })
  @IsInt({ message: 'Already paid must be an integer' })
  @Min(1, { message: 'Already paid must be at least 1' })
  @Max(1_000_000, { message: 'Already paid must not exceed 1 000 000' })
  alreadyPaid: number;

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
    type: String,
    description: 'UTM',
    required: false,
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  utm: string;

  @ApiProperty({
    type: String,
    description: 'Message from client',
    required: false,
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  msg: string;

  @ApiProperty({
    enum: Object.values(CoursesStatusEnum),
    description: 'Status',
    required: false,
    maxLength: 15,
  })
  @Column({ type: 'varchar', length: 15, nullable: true })
  @IsEnum(CoursesStatusEnum, { message: 'Invalid course status' })
  status: CoursesStatusEnum;

  @ManyToOne(() => Groups, (group) => group.orders)
  group: Groups;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.order)
  comments: Comment[];
}

import { IsEnum, IsInt, Max, Min } from 'class-validator';
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
  @PrimaryGeneratedColumn()
  id: number;

  // nullable mean that it can't be empty when it's false
  @Column({ type: 'varchar', length: 25, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  surname: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  convertEmailToLowerCase() {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  }

  @Column({ type: 'varchar', length: 12, nullable: true })
  phone: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  @IsEnum(CoursesEnum, { message: 'Invalid course' })
  course: CoursesEnum;

  @Column({ type: 'varchar', length: 15, nullable: true })
  @IsEnum(CoursesFormatEnum, { message: 'Invalid course format' })
  course_format: CoursesFormatEnum;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsEnum(CoursesTypeEnum, { message: 'Invalid course type' })
  course_type: CoursesTypeEnum;

  @Column({ type: 'int', nullable: true })
  @IsInt({ message: 'Sum must be an integer' })
  @Min(1, { message: 'Sum must be at least 1' })
  @Max(1_000_000, { message: 'Sum must not exceed 1 000 000' })
  sum: number;

  @Column({ type: 'int', nullable: true })
  @IsInt({ message: 'Already paid must be an integer' })
  @Min(1, { message: 'Already paid must be at least 1' })
  @Max(1_000_000, { message: 'Already paid must not exceed 1 000 000' })
  alreadyPaid: number;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  utm: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  msg: string;

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

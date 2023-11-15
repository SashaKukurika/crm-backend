import { IsEmail, Matches } from 'class-validator';
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 25, nullable: false })
  @Matches(/^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$/, {
    message: 'Name must not contain special characters or digits',
  })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  @Matches(/^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$/, {
    message: 'Surname must not contain special characters or digits',
  })
  surname: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_active: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  last_login: Date;

  @Column({ type: 'varchar', nullable: false, unique: true })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Column({ type: 'varchar', nullable: false, default: 'manager' })
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}

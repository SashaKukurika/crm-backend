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

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
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

  // nullable mean that it can't be empty when it's false
  @Column({ type: 'varchar', nullable: false, unique: true })
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

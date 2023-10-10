import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Groups } from '../../group/entitys/groups.entity';

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

  @Column({ type: 'varchar', length: 12, nullable: true })
  phone: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  course: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  course_format: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  course_type: string;

  @Column({ type: 'int', nullable: true })
  sum: number;

  @Column({ type: 'int', nullable: true })
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
  status: string;

  @ManyToOne(() => Groups, (group) => group.orders)
  group: Groups;
}

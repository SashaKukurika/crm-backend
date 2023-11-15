import { Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Orders } from '../../orders/entitys/orders.entity';

@Entity()
export class Groups {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  @Length(1, 30, { message: 'Name length must be between 1 and 30 characters' })
  name: string;

  @OneToMany(() => Orders, (order) => order.group)
  orders: Orders[];
}

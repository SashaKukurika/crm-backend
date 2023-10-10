import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Orders } from '../../orders/entitys/orders.entity';

@Entity()
export class Groups {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @OneToMany(() => Orders, (order) => order.group)
  orders: Orders[];
}

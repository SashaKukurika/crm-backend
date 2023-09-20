import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  // nullable mean that it can't be empty when it's false
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  surname: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar', nullable: true })
  course: string;

  @Column({ type: 'varchar', nullable: true })
  course_format: string;

  @Column({ type: 'varchar', nullable: true })
  course_type: string;

  @Column({ type: 'int', nullable: true })
  sum: number | null;

  @Column({ type: 'int', nullable: true })
  alreadyPaid: number | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'varchar', nullable: true })
  utm: string;

  @Column({ type: 'varchar', nullable: true })
  msg: string | null;

  @Column({ type: 'varchar', nullable: true })
  status: string | null;
}

import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemEntity } from './item.entity';
import { StatusEnum } from './status.enum';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  grand_total: number;

  @Column()
  discount: number;

  @Column()
  delivery_date: string;

  @Column()
  visit_id: string;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.CREATED })
  status: StatusEnum;

  @OneToMany(() => ItemEntity, (item) => item.order)
  items: ItemEntity[];

  @BeforeInsert()
  generateDefaultValues() {
    this.discount = this.discount || 0;
    this.status = this.status || StatusEnum.CREATED;
  }
}

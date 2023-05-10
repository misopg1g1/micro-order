import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemEntity } from './item.entity';

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

  @OneToMany(() => ItemEntity, (item) => item.order)
  items: ItemEntity[];
}

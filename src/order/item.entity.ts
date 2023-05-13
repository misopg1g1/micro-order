import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity()
export class ItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_id: string;

  @Column()
  quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  order: OrderEntity;
}

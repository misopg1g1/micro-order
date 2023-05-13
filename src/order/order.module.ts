import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { ItemEntity } from './item.entity';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
  imports: [TypeOrmModule.forFeature([OrderEntity, ItemEntity])],
})
export class OrderModule {}

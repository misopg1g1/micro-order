import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { dbConfig } from './shared/config/dbconfig';
import { OrderModule } from './order/order.module';
import { ItemEntity } from './order/item.entity';
import { OrderEntity } from './order/order.entity';

function getDBConfig() {
  return {
    ...dbConfig,
    entities: [ItemEntity, OrderEntity],
  };
}
@Module({
  imports: [
    TypeOrmModule.forRoot(getDBConfig()),
    HealthcheckModule,
    OrderModule,
  ],
})
export class AppModule {}

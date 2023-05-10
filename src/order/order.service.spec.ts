import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';
import { ItemEntity } from './item.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('OrderService', () => {
  const entities = [OrderEntity, ItemEntity];
  let service: OrderService;
  let itemsList: ItemEntity[];
  let orderList: OrderEntity[];

  const seedDatabase = async () => {};

  beforeEach(async () => {
    const options = () => {
      return {
        ...TypeOrmTestingConfig(),
        entities: entities,
      };
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService],
      imports: [
        TypeOrmModule.forFeature(entities),
        TypeOrmModule.forRoot(options()),
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';
import { ItemEntity } from './item.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('OrderService', () => {
  const entities = [OrderEntity, ItemEntity];
  let service: OrderService;
  let itemsList: ItemEntity[];
  let orderList: OrderEntity[];
  let itemsRepository: Repository<ItemEntity>;
  let ordersRepository: Repository<OrderEntity>;

  const seedDatabase = async () => {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService],
      imports: [
        TypeOrmModule.forFeature(entities),
        TypeOrmModule.forRoot({
          ...TypeOrmTestingConfig(),
          entities,
        }),
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    itemsRepository = module.get<Repository<ItemEntity>>(
      getRepositoryToken(ItemEntity),
    );
    ordersRepository = module.get<Repository<OrderEntity>>(
      getRepositoryToken(OrderEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

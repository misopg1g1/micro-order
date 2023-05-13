import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';
import { ItemEntity } from './item.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { CreateOrderDto } from './order.dto';
import { ItemDto } from './item.dto';
import {StatusEnum} from "./status.enum";

describe('OrderService', () => {
  const entities = [OrderEntity, ItemEntity];
  let service: OrderService;
  let itemsList: ItemEntity[];
  let orderList: OrderEntity[];
  let itemsRepository: Repository<ItemEntity>;
  let ordersRepository: Repository<OrderEntity>;

  const creatItem = (): object => ({
    product_id: faker.datatype.uuid(),
    quantity: faker.datatype.number(),
  });

  const creatOrder = (): object => ({
    grand_total: faker.datatype.number(),
    discount: faker.datatype.string(),
    delivery_date: faker.datatype.datetime().toISOString(),
    visit_id: faker.datatype.uuid(),
    status: faker.helpers.arrayElement(Object.values(StatusEnum)),
  });
  const seedDatabase = async () => {
    for (let i = 0; i < 6; i++) {
      const newItem: ItemEntity = await itemsRepository.save(creatItem());
      itemsList.push(newItem);
    }

    for (let i = 0; i < 6; i++) {
      const rawNewOrder = plainToInstance(OrderEntity, creatOrder());
      rawNewOrder.items = [itemsList[i]];
      const newOrder: OrderEntity = await ordersRepository.save(rawNewOrder);
      itemsList[i] = await itemsRepository.findOne({
        where: { id: itemsList[i].id },
        relations: ['order'],
      });
      orderList.push(newOrder);
    }
  };

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
    await ordersRepository.clear();
    itemsList = [];
    orderList = [];
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order', async () => {
    const rawItems = Array.from({ length: 3 }, (_, i) =>
      plainToInstance(ItemDto, creatItem()),
    );
    const rawOrder = plainToInstance(CreateOrderDto, {
      ...creatOrder(),
      items: rawItems,
    });
    const order = await service.create(rawOrder);
    const storedOrders = await ordersRepository.find();
    expect(storedOrders.length).toEqual(7);
    expect(
      await ordersRepository.findOne({ where: { id: order.id } }),
    ).toBeDefined();
    expect((await itemsRepository.find()).length).toEqual(9);
  });

  it('should obtain partial order list', async () => {
    const storedOrders = await service.findAll(1, true);
    expect(storedOrders.length).toEqual(5);
  });

  it('should obtain one order', async () => {
    const targetOrder = orderList[2];
    const storedOrder = await service.findOne(targetOrder.id, true);
    expect(storedOrder).toBeDefined();
    expect(storedOrder.id).toEqual(targetOrder.id);
    expect(storedOrder.items.length).toEqual(1);
  });

  // it('should update order simple fields', async () => {
  //   const targetOrder = orderList[2];
  //   await service.update(targetOrder.id, { status: StatusEnum.DELIVERED });
  //   const modifiedOrder = await ordersRepository.findOne({
  //     where: { id: targetOrder.id },
  //   });
  //   expect(modifiedOrder.status).toBe('DELIVERED');
  // });
});

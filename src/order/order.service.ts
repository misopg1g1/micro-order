import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ItemEntity } from './item.entity';
import { CreateOrderDto } from './order.dto';
import { BusinessError, BusinessLogicException } from '../shared/errors';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ItemDto } from './item.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
  ) {}

  async create(newOrder: CreateOrderDto) {
    if (!newOrder.items) {
      throw new BusinessLogicException(
        'Debe existir al menos un item para crear la orden',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    const storedItems = [];
    type ItemObject = { [key: string]: ItemDto };
    const mergedItems: ItemObject = {};
    for (const item of newOrder.items) {
      if (mergedItems[item.product_id]) {
        mergedItems[item.product_id].quantity += item.quantity;
      } else {
        mergedItems[item.product_id] = item;
      }
    }
    for (const itemDto of Object.values(mergedItems)) {
      const itemEntity = this.itemRepository.save(itemDto);
      storedItems.push(itemEntity);
    }
    const orderEntity = plainToInstance(OrderEntity, newOrder);
    orderEntity.items = storedItems;
    return await this.orderRepository.save(storedItems);
  }

  async findAll(skip = 0, relations: boolean, take?: number) {
    let options: object = { skip, relations: relations ? ['items'] : [] };
    if (take) {
      options = { ...options, take: take };
    }
    return await this.orderRepository.find(options);
  }

  async findOne(id: string, relations = true) {
    let visit: OrderEntity | undefined = undefined;
    try {
      visit = await this.orderRepository.findOne({
        where: { id: id },
        relations: relations ? ['items'] : [],
      });
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new BusinessLogicException(e.message, BusinessError.BAD_REQUEST);
      }
    }
    if (!visit) {
      throw new BusinessLogicException(
        'La orden con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    return visit;
  }

  async update(id: string, obj: object) {
    const storedOrder: OrderEntity = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!storedOrder)
      throw new BusinessLogicException(
        'La orden con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const newObj = {};
    let orderItems = [...storedOrder.items];
    const visitKeys = ['grand_total', 'discount', 'delivery_date', 'items'];
    for (const key_present of Object.keys(obj)) {
      if (visitKeys.includes(key_present)) {
        if (key_present === 'items') {
          for (const newItem of obj[key_present]) {
            const rawItemEntity = plainToInstance(ItemEntity, newItem);
            const errors = await validate(rawItemEntity);
            if (errors.length > 0) {
              throw new BusinessLogicException(
                'La estructura de uno de los items no es válida',
                BusinessError.BAD_REQUEST,
              );
            } else {
              const existingItems = orderItems.filter(
                (item) => item.product_id === rawItemEntity.product_id,
              );
              rawItemEntity.quantity = [...existingItems, rawItemEntity].reduce(
                (total, itm) => {
                  return total + itm.quantity;
                },
                0,
              );
              const itemEntity = await this.itemRepository.save(rawItemEntity);
              orderItems = [
                ...orderItems.filter(
                  (itm) => itm.product_id !== itemEntity.product_id,
                ),
                itemEntity,
              ];
              for (const itemToRemove of existingItems) {
                await this.itemRepository.delete({ id: itemToRemove.id });
              }
            }
          }
          newObj[key_present] = orderItems;
        }
        newObj[key_present] = obj[key_present];
      }
    }
    if (Object.keys(newObj).length > 0) {
      await this.orderRepository.update(id, newObj);
    }

    return await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }
}

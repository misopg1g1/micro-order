import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';
import { ApiQuery } from '@nestjs/swagger';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'relations', required: false, type: Boolean })
  async getAllOrders(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('relations') relations: any = false,
  ) {
    let transformedRelations = relations;
    if (typeof relations === 'string') {
      transformedRelations = JSON.parse(relations.toLowerCase());
    }
    return await this.orderService.findAll(skip, transformedRelations, take);
  }

  @Get(':order_id')
  async getOrderById(
    @Param('order_id') order_id,
    @Query('relations') relations: any = false,
  ) {
    let transformedRelations = relations;
    if (typeof relations === 'string') {
      transformedRelations = JSON.parse(relations.toLowerCase());
    }
    return await this.orderService.findOne(order_id, transformedRelations);
  }

  @Put(':order_id')
  async updateOrderById(
    @Param('order_id') order_id,
    @Body() partialOrder: object,
  ) {
    return await this.orderService.update(order_id, partialOrder);
  }
}

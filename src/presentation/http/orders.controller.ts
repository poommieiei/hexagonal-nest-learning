import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateOrderUseCase } from '../../core/application/use-cases/create-order.use-case';
import { CREATE_ORDER_USE_CASE } from '../../config/providers';

type CreateOrderRequestDto = {
  customerName: string;
  totalAmount: number;
};

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(CREATE_ORDER_USE_CASE)
    private readonly createOrderUseCase: CreateOrderUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateOrderRequestDto) {
    const order = await this.createOrderUseCase.execute(body);

    return {
      id: order.id,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    };
  }
}

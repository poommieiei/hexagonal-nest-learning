import { Body, Controller, Inject, Post, Patch, Param } from "@nestjs/common";
import { CreateOrderUseCase } from "../../core/application/use-cases/create-order.use-case";
import { UpdateOrderUseCase } from "../../core/application/use-cases/update-order.use-case";
import { CREATE_ORDER_USE_CASE } from "../../config/providers";
import { UPDATE_ORDER_USE_CASE } from "../../config/providers";

type CreateOrderRequestDto = {
  customerName: string;
  totalAmount: number;
};

@Controller("orders")
export class OrdersController {
  constructor(
    @Inject(CREATE_ORDER_USE_CASE)
    private readonly createOrderUseCase: CreateOrderUseCase,
    @Inject(UPDATE_ORDER_USE_CASE)
    private readonly updateOrderUseCase: UpdateOrderUseCase,
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

  @Patch(":id")
  async update(
    @Body() body: Partial<CreateOrderRequestDto>,
    @Param("id") id: string,
  ) {
    const order = await this.updateOrderUseCase.execute(id, body);

    return {
      id: order.id,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    };
  }
}

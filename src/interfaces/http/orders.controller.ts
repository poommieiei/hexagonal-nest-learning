import { Body, Controller, Inject, Post, Patch, Param } from "@nestjs/common";
import { CompleteOrderUseCase } from "../../application/use-cases/complete-order.use-case";
import { CreateOrderUseCase } from "../../application/use-cases/create-order.use-case";
import { PublishOutboxEventsUseCase } from "../../application/use-cases/publish-outbox-events.use-case";
import { UpdateOrderUseCase } from "../../application/use-cases/update-order.use-case";
import {
  COMPLETE_ORDER_USE_CASE,
  CREATE_ORDER_USE_CASE,
  PUBLISH_OUTBOX_EVENTS_USE_CASE,
  UPDATE_ORDER_USE_CASE,
} from "../../config/providers";

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
    @Inject(COMPLETE_ORDER_USE_CASE)
    private readonly completeOrderUseCase: CompleteOrderUseCase,
    @Inject(PUBLISH_OUTBOX_EVENTS_USE_CASE)
    private readonly publishOutboxEventsUseCase: PublishOutboxEventsUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateOrderRequestDto) {
    const order = await this.createOrderUseCase.execute(body);

    return {
      id: order.id,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      status: order.status,
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
      status: order.status,
    };
  }

  @Post(":id/complete")
  async complete(@Param("id") id: string) {
    const order = await this.completeOrderUseCase.execute(id);

    return {
      id: order.id,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      status: order.status,
    };
  }

  @Post("outbox/publish")
  async publishOutbox() {
    const publishedCount = await this.publishOutboxEventsUseCase.execute();

    return { publishedCount };
  }
}

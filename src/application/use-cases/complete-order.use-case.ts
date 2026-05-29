import { Order, OrderStatus } from "../../domain/order.entity";
import { createOrderCompletedEvent } from "../../domain/events/order-completed.event";
import { OutboxRepositoryPort } from "../ports/outbox-repository.port";
import { OrderRepositoryPort } from "../ports/order-repository.port";

export class CompleteOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepositoryPort,
    private readonly outboxRepository: OutboxRepositoryPort,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw new Error("Order already completed");
    }

    const completedOrder = new Order(
      order.id,
      order.customerName,
      order.totalAmount,
      order.createdAt,
      OrderStatus.COMPLETED,
    );

    await this.orderRepository.update(completedOrder);
    await this.outboxRepository.append(createOrderCompletedEvent(completedOrder));

    return completedOrder;
  }
}

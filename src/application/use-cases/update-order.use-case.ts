import { Order } from "../../domain/order.entity";
import { createOrderUpdatedEvent } from "../../domain/events/order-updated.event";
import { OutboxRepositoryPort } from "../ports/outbox-repository.port";
import { OrderRepositoryPort } from "../ports/order-repository.port";

export type UpdateOrderInput = {
  customerName?: string;
  totalAmount?: number;
};

export class UpdateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepositoryPort,
    private readonly outboxRepository: OutboxRepositoryPort,
  ) {}

  async execute(
    id: string,
    input: UpdateOrderInput,
  ): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new Error("Order not found");
    }

    const updatedOrder = new Order(
      order.id,
      input.customerName ?? order.customerName,
      input.totalAmount ?? order.totalAmount,
      order.createdAt,
      order.status,
    );

    await this.orderRepository.update(updatedOrder);
    await this.outboxRepository.append(createOrderUpdatedEvent(updatedOrder));
    return updatedOrder;
  }
}

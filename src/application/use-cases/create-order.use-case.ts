import { randomUUID } from 'crypto';
import { Order } from '../../domain/order.entity';
import { createOrderCreatedEvent } from '../../domain/events/order-created.event';
import { OutboxRepositoryPort } from '../ports/outbox-repository.port';
import { OrderRepositoryPort } from '../ports/order-repository.port';

export type CreateOrderInput = {
  customerName: string;
  totalAmount: number;
};

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepositoryPort,
    private readonly outboxRepository: OutboxRepositoryPort,
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const order = new Order(
      randomUUID(),
      input.customerName,
      input.totalAmount,
      new Date(),
    );

    await this.orderRepository.save(order);
    await this.outboxRepository.append(createOrderCreatedEvent(order));
    return order;
  }
}

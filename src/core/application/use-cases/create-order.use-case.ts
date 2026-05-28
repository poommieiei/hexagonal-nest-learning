import { randomUUID } from 'node:crypto';
import { Order } from '../../domain/order.entity';
import { OrderRepositoryPort } from '../ports/order-repository.port';

export type CreateOrderInput = {
  customerName: string;
  totalAmount: number;
};

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepositoryPort) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const order = new Order(
      randomUUID(),
      input.customerName,
      input.totalAmount,
      new Date(),
    );

    await this.orderRepository.save(order);
    return order;
  }
}

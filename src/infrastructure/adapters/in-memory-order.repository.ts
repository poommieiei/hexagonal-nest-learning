import { OrderRepositoryPort } from '../../application/ports/order-repository.port';
import { Order } from '../../domain/order.entity';

export class InMemoryOrderRepository implements OrderRepositoryPort {
  private readonly orders = new Map<string, Order>();

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) ?? null;
  }

  async update(order: Order): Promise<void> {
    if (!this.orders.has(order.id)) {
      throw new Error('Order not found');
    }
    this.orders.set(order.id, order);
  }
}

import { Order } from "../../domain/order.entity";
import { OrderRepositoryPort } from "../ports/order-repository.port";

export type UpdateOrderInput = {
  customerName?: string;
  totalAmount?: number;
};

export class UpdateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepositoryPort) {}

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
    );

    await this.orderRepository.update(updatedOrder);
    return updatedOrder;
  }
}

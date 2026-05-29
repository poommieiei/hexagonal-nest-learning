import { OutboxRepositoryPort } from "../src/application/ports/outbox-repository.port";
import { CompleteOrderUseCase } from "../src/application/use-cases/complete-order.use-case";
import { CreateOrderUseCase } from "../src/application/use-cases/create-order.use-case";
import { OrderStatus } from "../src/domain/order.entity";
import { InMemoryOrderRepository } from "../src/infrastructure/adapters/in-memory-order.repository";

describe("CompleteOrderUseCase", () => {
  it("completes an existing pending order", async () => {
    const repository = new InMemoryOrderRepository();
    const outboxEvents: string[] = [];
    const outboxRepository: OutboxRepositoryPort = {
      async append(event) {
        outboxEvents.push(event.eventName);
      },
      async pullPending() {
        return [];
      },
      async markPublished() {},
    };

    const createUseCase = new CreateOrderUseCase(repository, outboxRepository);
    const completeUseCase = new CompleteOrderUseCase(repository, outboxRepository);

    const order = await createUseCase.execute({
      customerName: "Alice",
      totalAmount: 1250,
    });

    const completed = await completeUseCase.execute(order.id);

    expect(completed.status).toBe(OrderStatus.COMPLETED);

    const stored = await repository.findById(order.id);
    expect(stored?.status).toBe(OrderStatus.COMPLETED);
    expect(outboxEvents).toContain("orders.completed");
  });

  it("throws when order is already completed", async () => {
    const repository = new InMemoryOrderRepository();
    const outboxRepository: OutboxRepositoryPort = {
      async append() {},
      async pullPending() {
        return [];
      },
      async markPublished() {},
    };

    const createUseCase = new CreateOrderUseCase(repository, outboxRepository);
    const completeUseCase = new CompleteOrderUseCase(repository, outboxRepository);

    const order = await createUseCase.execute({
      customerName: "Alice",
      totalAmount: 1250,
    });

    await completeUseCase.execute(order.id);

    await expect(completeUseCase.execute(order.id)).rejects.toThrow(
      "Order already completed",
    );
  });
});

import { CreateOrderUseCase } from "../src/application/use-cases/create-order.use-case";
import { OutboxRepositoryPort } from "../src/application/ports/outbox-repository.port";
import { OrderStatus } from "../src/domain/order.entity";
import { InMemoryOrderRepository } from "../src/infrastructure/adapters/in-memory-order.repository";

describe("CreateOrderUseCase", () => {
  it("creates and stores a valid order", async () => {
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
    const useCase = new CreateOrderUseCase(repository, outboxRepository);

    const order = await useCase.execute({
      customerName: "Alice",
      totalAmount: 1250,
    });

    const stored = await repository.findById(order.id);

    expect(stored).not.toBeNull();
    expect(stored?.customerName).toBe("Alice");
    expect(stored?.totalAmount).toBe(1250);
    expect(stored?.status).toBe(OrderStatus.PENDING);
    expect(outboxEvents).toContain("orders.created");
  });

  it("throws when total amount is not positive", async () => {
    const repository = new InMemoryOrderRepository();
    const useCase = new CreateOrderUseCase(repository, {
      async append() {},
      async pullPending() {
        return [];
      },
      async markPublished() {},
    });

    await expect(
      useCase.execute({ customerName: "Alice", totalAmount: 0 }),
    ).rejects.toThrow("totalAmount must be greater than zero");
  });
});

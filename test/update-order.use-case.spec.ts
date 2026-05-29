import { UpdateOrderUseCase } from "../src/application/use-cases/update-order.use-case";
import { CreateOrderUseCase } from "../src/application/use-cases/create-order.use-case";
import { OutboxRepositoryPort } from "../src/application/ports/outbox-repository.port";
import { OrderStatus } from "../src/domain/order.entity";
import { InMemoryOrderRepository } from "../src/infrastructure/adapters/in-memory-order.repository";

describe("UpdateOrderUseCase", () => {
  it("updates an existing order", async () => {
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
    const updateUseCase = new UpdateOrderUseCase(repository, outboxRepository);

    const order = await createUseCase.execute({
      customerName: "Alice",
      totalAmount: 1250,
    });

    const updated = await updateUseCase.execute(order.id, {
      customerName: "Bob",
      totalAmount: 1500,
    });

    expect(updated.customerName).toBe("Bob");
    expect(updated.totalAmount).toBe(1500);
    expect(updated.status).toBe(OrderStatus.PENDING);

    const stored = await repository.findById(order.id);
    expect(stored?.customerName).toBe("Bob");
    expect(stored?.totalAmount).toBe(1500);
    expect(outboxEvents).toContain("orders.updated");
  });

  it("throws when order does not exist", async () => {
    const repository = new InMemoryOrderRepository();
    const updateUseCase = new UpdateOrderUseCase(repository, {
      async append() {},
      async pullPending() {
        return [];
      },
      async markPublished() {},
    });

    await expect(
      updateUseCase.execute("non-existent-id", {
        customerName: "Bob",
        totalAmount: 1500,
      }),
    ).rejects.toThrow("Order not found");
  });
});

import { UpdateOrderUseCase } from "../src/core/application/use-cases/update-order.use-case";
import { CreateOrderUseCase } from "../src/core/application/use-cases/create-order.use-case";
import { InMemoryOrderRepository } from "../src/infrastructure/adapters/in-memory-order.repository";

describe("UpdateOrderUseCase", () => {
  it("updates an existing order", async () => {
    const repository = new InMemoryOrderRepository();
    const createUseCase = new CreateOrderUseCase(repository);
    const updateUseCase = new UpdateOrderUseCase(repository);

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

    const stored = await repository.findById(order.id);
    expect(stored?.customerName).toBe("Bob");
    expect(stored?.totalAmount).toBe(1500);
  });

  it("throws when order does not exist", async () => {
    const repository = new InMemoryOrderRepository();
    const updateUseCase = new UpdateOrderUseCase(repository);

    await expect(
      updateUseCase.execute("non-existent-id", {
        customerName: "Bob",
        totalAmount: 1500,
      }),
    ).rejects.toThrow("Order not found");
  });
});

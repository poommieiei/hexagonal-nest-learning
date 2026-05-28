import { CreateOrderUseCase } from '../src/core/application/use-cases/create-order.use-case';
import { InMemoryOrderRepository } from '../src/infrastructure/adapters/in-memory-order.repository';

describe('CreateOrderUseCase', () => {
  it('creates and stores a valid order', async () => {
    const repository = new InMemoryOrderRepository();
    const useCase = new CreateOrderUseCase(repository);

    const order = await useCase.execute({
      customerName: 'Alice',
      totalAmount: 1250,
    });

    const stored = await repository.findById(order.id);

    expect(stored).not.toBeNull();
    expect(stored?.customerName).toBe('Alice');
    expect(stored?.totalAmount).toBe(1250);
  });

  it('throws when total amount is not positive', async () => {
    const repository = new InMemoryOrderRepository();
    const useCase = new CreateOrderUseCase(repository);

    await expect(
      useCase.execute({ customerName: 'Alice', totalAmount: 0 }),
    ).rejects.toThrow('totalAmount must be greater than zero');
  });
});

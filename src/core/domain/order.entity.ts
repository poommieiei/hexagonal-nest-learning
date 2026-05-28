export class Order {
  constructor(
    public readonly id: string,
    public readonly customerName: string,
    public readonly totalAmount: number,
    public readonly createdAt: Date,
  ) {
    if (!customerName || customerName.trim().length < 2) {
      throw new Error('customerName must contain at least 2 characters');
    }

    if (totalAmount <= 0) {
      throw new Error('totalAmount must be greater than zero');
    }
  }
}

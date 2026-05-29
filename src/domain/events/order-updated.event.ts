import { randomUUID } from "crypto";
import { Order } from "../order.entity";
import { DomainEvent } from "./domain-event";

export function createOrderUpdatedEvent(order: Order): DomainEvent {
  return {
    eventId: randomUUID(),
    eventName: "orders.updated",
    occurredAt: new Date(),
    payload: {
      orderId: order.id,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),
      status: order.status,
    },
  };
}

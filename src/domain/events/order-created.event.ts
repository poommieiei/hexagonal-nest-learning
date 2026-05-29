import { randomUUID } from "crypto";
import { Order } from "../order.entity";
import { DomainEvent } from "./domain-event";

export function createOrderCreatedEvent(order: Order): DomainEvent {
  return {
    eventId: randomUUID(),
    eventName: "orders.created",
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

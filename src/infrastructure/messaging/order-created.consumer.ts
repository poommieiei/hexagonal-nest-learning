import { Injectable, OnModuleInit } from "@nestjs/common";
import { DomainEvent } from "../../domain/events/domain-event";
import { InMemoryEventBusAdapter } from "./in-memory-event-bus.adapter";

@Injectable()
export class OrderCreatedConsumer implements OnModuleInit {
  constructor(private readonly eventBus: InMemoryEventBusAdapter) {}

  onModuleInit(): void {
    this.eventBus.subscribe("orders.created", this.handleOrderCreated.bind(this));
  }

  private async handleOrderCreated(event: DomainEvent): Promise<void> {
    // In a real app, map event payload to a command/use case here.
    console.log("[OrderCreatedConsumer] handled event", event.payload);
  }
}

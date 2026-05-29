import { Injectable } from "@nestjs/common";
import { EventPublisherPort } from "../../application/ports/event-publisher.port";
import { DomainEvent } from "../../domain/events/domain-event";

type EventHandler = (event: DomainEvent) => Promise<void>;

@Injectable()
export class InMemoryEventBusAdapter implements EventPublisherPort {
  private readonly handlers = new Map<string, EventHandler[]>();

  async publish(event: DomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventName) ?? [];

    for (const handler of eventHandlers) {
      await handler(event);
    }
  }

  subscribe(eventName: string, handler: EventHandler): void {
    const eventHandlers = this.handlers.get(eventName) ?? [];
    eventHandlers.push(handler);
    this.handlers.set(eventName, eventHandlers);
  }
}

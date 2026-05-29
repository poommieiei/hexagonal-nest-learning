import { DomainEvent } from "../../domain/events/domain-event";

export const EVENT_PUBLISHER = Symbol("EVENT_PUBLISHER");

export interface EventPublisherPort {
  publish(event: DomainEvent): Promise<void>;
}

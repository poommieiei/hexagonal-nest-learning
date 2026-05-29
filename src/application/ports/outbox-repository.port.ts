import { DomainEvent } from "../../domain/events/domain-event";

export const OUTBOX_REPOSITORY = Symbol("OUTBOX_REPOSITORY");

export type OutboxMessage = {
  id: string;
  event: DomainEvent;
};

export interface OutboxRepositoryPort {
  append(event: DomainEvent): Promise<void>;
  pullPending(limit: number): Promise<OutboxMessage[]>;
  markPublished(ids: string[]): Promise<void>;
}

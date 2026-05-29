import { randomUUID } from "crypto";
import {
  OutboxMessage,
  OutboxRepositoryPort,
} from "../../application/ports/outbox-repository.port";
import { DomainEvent } from "../../domain/events/domain-event";

type StoredOutboxMessage = OutboxMessage & {
  published: boolean;
};

export class InMemoryOutboxRepository implements OutboxRepositoryPort {
  private readonly messages: StoredOutboxMessage[] = [];

  async append(event: DomainEvent): Promise<void> {
    this.messages.push({
      id: randomUUID(),
      event,
      published: false,
    });
  }

  async pullPending(limit: number): Promise<OutboxMessage[]> {
    return this.messages
      .filter((message) => !message.published)
      .slice(0, limit)
      .map(({ id, event }) => ({ id, event }));
  }

  async markPublished(ids: string[]): Promise<void> {
    const idSet = new Set(ids);

    for (const message of this.messages) {
      if (idSet.has(message.id)) {
        message.published = true;
      }
    }
  }
}

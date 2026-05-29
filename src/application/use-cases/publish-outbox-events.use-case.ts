import { EventPublisherPort } from "../ports/event-publisher.port";
import { OutboxRepositoryPort } from "../ports/outbox-repository.port";

const DEFAULT_BATCH_SIZE = 100;

export class PublishOutboxEventsUseCase {
  constructor(
    private readonly outboxRepository: OutboxRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(limit: number = DEFAULT_BATCH_SIZE): Promise<number> {
    const pendingMessages = await this.outboxRepository.pullPending(limit);

    for (const message of pendingMessages) {
      await this.eventPublisher.publish(message.event);
    }

    await this.outboxRepository.markPublished(pendingMessages.map((message) => message.id));

    return pendingMessages.length;
  }
}

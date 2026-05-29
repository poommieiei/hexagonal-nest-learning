export type DomainEvent = {
  eventId: string;
  eventName: string;
  occurredAt: Date;
  payload: Record<string, unknown>;
};

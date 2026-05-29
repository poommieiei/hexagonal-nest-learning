import { Module } from "@nestjs/common";
import {
  EVENT_PUBLISHER,
  EventPublisherPort,
} from "../application/ports/event-publisher.port";
import {
  OUTBOX_REPOSITORY,
  OutboxRepositoryPort,
} from "../application/ports/outbox-repository.port";
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from "../application/ports/order-repository.port";
import { CreateOrderUseCase } from "../application/use-cases/create-order.use-case";
import { CompleteOrderUseCase } from "../application/use-cases/complete-order.use-case";
import { PublishOutboxEventsUseCase } from "../application/use-cases/publish-outbox-events.use-case";
import { InMemoryOrderRepository } from "../infrastructure/adapters/in-memory-order.repository";
import { InMemoryOutboxRepository } from "../infrastructure/adapters/in-memory-outbox.repository";
import { InMemoryEventBusAdapter } from "../infrastructure/messaging/in-memory-event-bus.adapter";
import { OrderCreatedConsumer } from "../infrastructure/messaging/order-created.consumer";
import { OrdersController } from "../interfaces/http/orders.controller";
import {
  CREATE_ORDER_USE_CASE,
  COMPLETE_ORDER_USE_CASE,
  PUBLISH_OUTBOX_EVENTS_USE_CASE,
  UPDATE_ORDER_USE_CASE,
} from "./providers";
import { ConfigModule } from "@nestjs/config";
import { UpdateOrderUseCase } from "../application/use-cases/update-order.use-case";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [OrdersController],
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useClass: InMemoryOrderRepository,
    },
    {
      provide: OUTBOX_REPOSITORY,
      useClass: InMemoryOutboxRepository,
    },
    InMemoryEventBusAdapter,
    {
      provide: EVENT_PUBLISHER,
      useExisting: InMemoryEventBusAdapter,
    },
    OrderCreatedConsumer,
    {
      provide: CREATE_ORDER_USE_CASE,
      useFactory: (
        orderRepository: OrderRepositoryPort,
        outboxRepository: OutboxRepositoryPort,
      ) => new CreateOrderUseCase(orderRepository, outboxRepository),
      inject: [ORDER_REPOSITORY, OUTBOX_REPOSITORY],
    },
    {
      provide: UPDATE_ORDER_USE_CASE,
      useFactory: (
        orderRepository: OrderRepositoryPort,
        outboxRepository: OutboxRepositoryPort,
      ) => new UpdateOrderUseCase(orderRepository, outboxRepository),
      inject: [ORDER_REPOSITORY, OUTBOX_REPOSITORY],
    },
    {
      provide: COMPLETE_ORDER_USE_CASE,
      useFactory: (
        orderRepository: OrderRepositoryPort,
        outboxRepository: OutboxRepositoryPort,
      ) => new CompleteOrderUseCase(orderRepository, outboxRepository),
      inject: [ORDER_REPOSITORY, OUTBOX_REPOSITORY],
    },
    {
      provide: PUBLISH_OUTBOX_EVENTS_USE_CASE,
      useFactory: (
        outboxRepository: OutboxRepositoryPort,
        eventPublisher: EventPublisherPort,
      ) => new PublishOutboxEventsUseCase(outboxRepository, eventPublisher),
      inject: [OUTBOX_REPOSITORY, EVENT_PUBLISHER],
    },
  ],
})
export class AppModule {}

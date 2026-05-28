import { Module } from "@nestjs/common";
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from "../core/application/ports/order-repository.port";
import { CreateOrderUseCase } from "../core/application/use-cases/create-order.use-case";
import { InMemoryOrderRepository } from "../infrastructure/adapters/in-memory-order.repository";
import { OrdersController } from "../presentation/http/orders.controller";
import { CREATE_ORDER_USE_CASE, UPDATE_ORDER_USE_CASE } from "./providers";
import { ConfigModule } from "@nestjs/config";
import { UpdateOrderUseCase } from '../core/application/use-cases/update-order.use-case';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [OrdersController],
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useClass: InMemoryOrderRepository,
    },
    {
      provide: CREATE_ORDER_USE_CASE,
      useFactory: (orderRepository: OrderRepositoryPort) =>
        new CreateOrderUseCase(orderRepository),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: UPDATE_ORDER_USE_CASE,
      useFactory: (orderRepository: OrderRepositoryPort) =>
        new UpdateOrderUseCase(orderRepository),
      inject: [ORDER_REPOSITORY],
    },
  ],
})
export class AppModule {}

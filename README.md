# Hexagonal + Nest Starter

This repository contains a minimal starter for learning Hexagonal Architecture with NestJS.

## Architecture

- `src/core/domain`: domain model and business rules
- `src/core/application`: use cases and ports
- `src/infrastructure`: adapter implementations
- `src/presentation`: controllers
- `src/config`: Nest wiring/DI only

Dependency direction:

`presentation -> application -> domain`
`infrastructure -> application + domain`

Domain and use case layers do not depend on Nest.

## Quick Start

1. Install dependencies:
   - `npm install`
2. Run tests:
   - `npm test`
3. Start API:
   - `npm run start:dev`
4. Try endpoint:
   - `POST /orders`
   - body: `{ "customerName": "Alice", "totalAmount": 1250 }`

## Next Exercises

1. Replace `InMemoryOrderRepository` with a DB adapter (Prisma/TypeORM).
2. Add `GetOrderByIdUseCase`.
3. Add unit tests for domain validation and controller e2e tests.

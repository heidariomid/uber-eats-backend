# Current Feature

## Status

<!-- Not Started | In Progress | Complete -->

## Goals

<!-- What success looks like, as bullets -->

## Notes

<!-- Context, constraints, or details from the spec -->

## History

- Init
- Spec 1: Clean baseline (Nest 8). Node v23.11.0, Postgres 14.17. `npm run build` passed. `npm test` failed (`TS2345` in `auth.service.spec.ts` and `users.service.spec.ts`). `npm run lint` passed with two unused-import warnings. `start:dev` booted with `synchronize` on and created the entity tables. `src/schema.gql` gained `isOpen` on `Restaurant` and `RestaurantInput`. Sign up saved the user, then Mailgun exited the process. Log in returned ok and a token. `getRestaurants`, `getRestaurant`, and `createOrder` returned 400 (`class-validator` 0.14 `forbidUnknownValues`). A `graphql-ws` client with `connectionParams.authToken` connected and `pendingOrders` stayed open; with no token the subscription returned `Forbidden resource`.
- fix: validation pipe and signup mail. `ValidationPipe` uses `forbidUnknownValues: false`. `getRestaurants`, `getRestaurant`, and `createOrder` return data. A failed Mailgun call is logged and the process stays up.
- Spec 2: Nest 12, Apollo Server 5, and TypeORM 1 (17 Oct 2026). Node v23.11.0. `npm run build`, `npm test` (12 passed), and `npm run lint` passed. `src/schema.gql` had no diff. Sign-up saved the user, logged the failed Mailgun call, and the process stayed up. A client placed order 22; on `/order/22` the owner's status change showed without a reload. Local IDE is GraphiQL. Nothing was deployed.

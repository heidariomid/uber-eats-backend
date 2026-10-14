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

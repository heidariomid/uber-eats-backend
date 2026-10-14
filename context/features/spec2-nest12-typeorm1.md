# Spec 2 — Nest 12, Apollo Server 5, and TypeORM 1

## Overview

Spec 2 of 2. Depends on spec 1 here and on
`../uber-eats-frontend` spec 4. Do not start it with any of them
unmerged.

The API is NestJS 8, `@nestjs/graphql` 10 on
`apollo-server-express` 3, TypeORM 0.2.45, and TypeScript 4.3.
Apollo Server 3 is end of life, and the TypeORM 0.2 query API was
removed in 0.3. "Done" is the same GraphQL API on localhost, on the
current majors, still serving the Next 16 front end. No host is
chosen here.

## Requirements

- Check peer ranges on the day with
  `npm view <package> peerDependencies`. Read on 14 October 2026:
  - `@nestjs/core`, `common`, `platform-express`, `testing`, `cli`,
    and `schematics` to 12
  - `@nestjs/graphql` and `@nestjs/apollo` to 14, on
    `@apollo/server` 5. `@nestjs/graphql` 14 wants `graphql` 16.11 or
    newer and TypeScript 5.5 or 6
  - `@nestjs/typeorm` to 12, which accepts TypeORM 0.3 and 1
  - `@nestjs/config` and `@nestjs/schedule` to 12
- Read the Nest 12 GraphQL docs and the TypeORM 1 changelog after
  the install and before editing. Do not answer from memory
- Delete `apollo-server-express` and `apollo-server-core`. Remove
  `@graphql-tools/schema` if nothing imports it
- **GraphQL Playground is gone** in Apollo Server 4 and later.
  Replace `playground: process.env.NODE_ENV !== 'production'` with
  the Apollo landing-page plugin, local only
- **Subscriptions stay on `graphql-ws`.** Keep the spec 1 context
  function that reads `connectionParams.authToken`, and check its
  argument shape on `@nestjs/apollo` 14. `graphql-ws` stays on 5 if
  Nest 14 accepts it. If it needs 6, the front end moves to 6 in a
  `fix/` branch first; Apollo Client 4 accepts both
- **Express 5** comes with `platform-express` 12. The two REST
  controllers, `payments` and `uploads`, use plain `@Post()` paths.
  Check them for wildcard routes and for `req.query` writes, which
  Express 5 rejects
- **TypeORM 1.** Every repository call moves to the new API, not one
  file. The 0.2 forms in this repo:
  - `findOne(id)` and `findOne(id, { relations })`: in
    `orders.service.ts`, `restaurant.service.ts`, `users.service.ts`,
    and `payments.service.ts`. Use `findOneBy({ id })` or
    `findOne({ where: { id }, relations })`
  - `find({ email, mobile })`, `findOne({ slug })`,
    `count({ category })`, and the other calls that pass conditions
    without `where`. Use `findBy`, `findOneBy`, `countBy`, or
    `{ where }`
  - `@EntityRepository` in `src/restaurant/repo/category.repo.ts`
    was removed. Replace it with a provider that extends the
    repository from the `DataSource`, and keep the method it adds
  - The `getRepositoryToken` mocks in the two `.spec.ts` files follow
    the new method names
- `synchronize` stays `process.env.NODE_ENV !== 'production'` on a
  local Postgres. Migrations are the host spec's job
- **TypeScript 6**, not 7. `@types/node` to 22. `reflect-metadata`
  to 0.2. Jest, `ts-jest`, ESLint, and `typescript-eslint` move to the
  versions that support TypeScript 6; ESLint 9 uses
  `eslint.config.mjs`
- Node stays on `engines.node >=22` and `.nvmrc`. If the build
  fails on 22, pin the version that builds and write it in
  `context/stack.md`. Do not bump an unrelated package to make it
  start

## Out of scope

- Supabase, Vercel env, CORS for a public origin
- Seed accounts, the Zarinpal live mode, the portfolio card
- A custom domain
- New features, or a rewrite of the order flow

## Done when

- Every operation on the spec 1 baseline list has the result it had
- The `../uber-eats-frontend` app, on Next 16, still lets a client
  place an order, and the owner's view updates without a reload
- `src/schema.gql` has no change a front-end query depends on.
  `npm run graphql:gen` in the front end produces no diff
- `npm run build`, `npm test`, and `npm run lint` pass
- `grep -rE "apollo-server|EntityRepository" src package.json`
  returns nothing
- Nothing was deployed

## Notes

- After this is on `main`, decide the host. The options stay: a
  Node process that can hold WebSockets, with Supabase for Postgres,
  or leave the portfolio card at `Demo · Offline`. Do not decide
  inside this spec
- If that later spec ships, the public front URL is
  https://uberfooddelivery.vercel.app/ on project
  `uber-eats-frontend`. Do not create a second Vercel project.
  Supabase can hold Postgres; it cannot run Nest or a `graphql-ws`
  socket

## References

- @context/project-overview.md
- @context/stack.md
- @context/features/spec1-clean-baseline.md
- `../uber-eats-frontend/context/features/spec4-tailwind-4.md`
- `../../interview-practice/stack-upgrade.md`

# Project Overview — Uber Eats clone (API)

The GraphQL API behind `../uber-eats-frontend`: accounts, restaurants,
categories, dishes, orders with a live subscription for owners, and
Zarinpal payments. Success for this round is the same API on the
current majors, still serving the upgraded front end on localhost.

---

## The product

| | |
| --- | --- |
| Name | Uber Eats clone API |
| Slug / package | `uber-back` |
| Platforms | Node 22, Postgres |
| Audience | The front end, and Omid showing the code in an interview |
| Language | English |

---

## Current state

On 14 October 2026, before spec 1:

- NestJS 8, `@nestjs/graphql` 10 on `apollo-server-express` 3,
  TypeORM 0.2.45, TypeScript 4.3, `@types/node` 16
- Ten modified files were never committed: the `graphql-ws` auth fix,
  a CORS allowlist, JWT expiry and `null` handling, and `axios`,
  `class-validator`, `jsonwebtoken` bumps
- `liara.json` and `Procfile` are for hosts that are down
- `.env.dev` is gitignored and not tracked

---

## Approach

One spec at a time. Spec 1 commits the working tree and records a
baseline. Spec 2 moves Nest, Apollo Server, TypeORM, and TypeScript
together, after the front end is on Next 16.

---

## Why this stack

Kept as NestJS with GraphQL and `graphql-ws` because the front end's
Apollo code and the owner's live order view depend on it. Apollo
Server 3 is end of life, and TypeORM 0.2 is four years old.

---

## Out of scope

- Hosting, Supabase, migrations. A later host spec
- New features, or a rewrite of the order flow

---

## Success criteria

1. Every baseline operation behaves the same on Nest 12 and TypeORM 1
2. The front end's order story still works, live update included
3. No secret is tracked, and nothing is deployed

---

## Build order

1. `context/features/spec1-clean-baseline.md`
2. `../uber-eats-frontend` specs 1 to 4
3. `context/features/spec2-nest12-typeorm1.md`

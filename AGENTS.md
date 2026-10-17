# Uber Eats clone — API

Read this file at the start of every session. Treat **Memory** as the
source of truth. Do not re-scan the repo, `node_modules`, or lockfile
for facts already written here. After any change to product, stack,
files, or decisions, update Memory in place. Replace stale lines. Do
not append a changelog.

## Context Files

Read these for the full context of the project:

- @context/project-overview.md — what the product is and why this stack
- @context/coding-standards.md — language, files, data, security
- @context/design-system.md — tokens, components, how every screen looks
- @context/stack.md — commands, folders, QA checklists for this stack
- @context/ai-interaction.md — the feature workflow and verification
- @context/current-feature.md — what is being built right now

## Feature workflow

Every feature follows `load → start → complete`, driven by the
`/feature` skill in `.claude/skills/feature/`. `pre-review` and
`after-review` are optional extras, not gates. Specs live in
`context/features/`; the working file is @context/current-feature.md.

**Verification is where the user is, never in a compiler.** The
failures that compile are listed in @context/stack.md.

## Design rules

Every screen follows @context/design-system.md. Boards in `context/plan/`
decide layout and content; the design system decides the look, and
wins where they disagree. Tokens come from one file only. When a spec
adds a token or a shared component, update the design system in the
same change.

## Stack rules

Follow @context/stack.md. That file is the chosen overlay. Do not
paste a second copy of it here.

## Cleanup

When a task is done — especially after-review or complete — stop
every process you started, close QA tabs, and delete session-only
files. Do not leave a dev server running. (Cursor also loads
`.cursor/rules/cleanup-after-finish.mdc`. This paragraph is for
sessions that do not.)

## Memory

- **Product:** The GraphQL API for the Uber Eats clone in `../uber-eats-frontend`: accounts, restaurants, dishes, orders with a live owner subscription, Zarinpal payments. This round is a stack upgrade with the same API. No new features.
- **Package / slug:** `uber-back`.
- **Path:** `/Users/omid/Developer/Github/uberEats/uber-eats`. The front end is `../uber-eats-frontend`, its own git repo.
- **Hosting / production URL:** None. Liara and Heroku are down. `liara.json` and `Procfile` are deleted in spec 1. A host is chosen only after spec 2, in a separate spec.
- **Framework versions:** Nest 12.1.3, `@nestjs/graphql` 14.0.3 and `@nestjs/apollo` 14.0.3 on `@apollo/server` 5.5.1 with `@as-integrations/express5` 1.1.2, TypeORM 1.1.2, TypeScript 6.0.3, `graphql` 16.14.2. `graphql-ws` stays 5.8.2; Nest depends on `graphql-ws` 6.3.0 and both speak `graphql-transport-ws`. Node `>=22` (`.nvmrc` 22). Checked on Node v23.11.0. Spec 2 is on `main`.
- **Scripts:** `npm run start:dev` (port 4000, `.env.dev`), `npm run build`, `npm test`, `npm run lint`.
- **UI:** None. See `../uber-eats-frontend/context/design-system.md`.
- **Process:** `context/` + `/feature` skill. Spec 1 runs first, before the front end's spec 1. Spec 2 runs after the front end's spec 4. Cleanup as above.
- **Backend:** Postgres through TypeORM, `synchronize` on outside production, no migrations. Code-first GraphQL, schema in `src/schema.gql`. JWT raw in `authorization` for HTTP, `connectionParams.authToken` for `graphql-ws`. In-memory `PubSub`.
- **Not built:** The host spec. Spec 1 and spec 2 are on `main`.
- **QA:** Localhost, the front end's client and owner accounts, Playwright for the order story. A `graphql-ws` 5 client with `connectionParams.authToken` connects; without a token `pendingOrders` returns `Forbidden resource`. `createOrder` publishes `pendingOrders`, but no front-end page subscribes to it; the live story is `editOrder` publishing `updateOrders` to the client's `/order/[id]`. Local GraphQL IDE is Nest's GraphiQL (`graphiql` on outside production). `ValidationPipe({ forbidUnknownValues: false })` lets `getRestaurants`, `getRestaurant`, and `createOrder` through. A failed Mailgun call on sign-up is logged and the process stays up.
- **Local database:** Postgres.app 14, data dir `~/Library/Application Support/Postgres/var-14`, database `uber-eats-remote`, port 5432. Current counts: 24 restaurants, 8 categories, 13 dishes, 7 users, 21 orders. Homebrew `postgresql@14` holds a database with the same name and only QA rows; it is stopped and must stay stopped, or it takes port 5432. Backup before any schema change: `~/Developer/Github/uberEats/backups/uber-eats-remote-postgresapp-2026-10-14.dump`. Spec 2 pre-boot dump: `~/Developer/Github/uberEats/backups/uber-eats-remote-postgresapp-2026-10-15-before-spec2.dump`.
- **Secrets:** `.env.dev` holds the DB, JWT, mail, and Zarinpal values and is gitignored. `.env.example` (spec 1) has names only.
- **Git:** Spec 2 is on `main`. Do not commit unless asked. Commits have no `Co-authored-by` trailer. `/feature complete` merges the feature branch into `main`, deletes that branch, and pushes `main` when `origin` exists.

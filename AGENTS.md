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
- **Framework versions:** NestJS 8, `@nestjs/graphql` 10 on `apollo-server-express` 3, TypeORM 0.2.45, TypeScript 4.3, Node `>=22` (`.nvmrc` 22). Target: Nest 12, `@nestjs/graphql` 14 on `@apollo/server` 5, TypeORM 1, TypeScript 6.
- **Scripts:** `npm run start:dev` (port 4000, `.env.dev`), `npm run build`, `npm test`, `npm run lint`.
- **UI:** None. See `../uber-eats-frontend/context/design-system.md`.
- **Process:** `context/` + `/feature` skill. Spec 1 runs first, before the front end's spec 1. Spec 2 runs after the front end's spec 4. Cleanup as above.
- **Backend:** Postgres through TypeORM, `synchronize` on outside production, no migrations. Code-first GraphQL, schema in `src/schema.gql`. JWT raw in `authorization` for HTTP, `connectionParams.authToken` for `graphql-ws`. In-memory `PubSub`.
- **Not built:** Spec 2 and the host spec. Spec 1 is on `main`.
- **QA:** Localhost, the front end's client and owner accounts, Playwright for the order story. A `graphql-ws` client with `connectionParams.authToken` connects; without a token `pendingOrders` returns `Forbidden resource`. `class-validator` 0.14 rejects inputs that have no validator decorators (`getRestaurants`, `getRestaurant`, `createOrder`). Sign-up's unawaited Mailgun call can exit the process.
- **Secrets:** `.env.dev` holds the DB, JWT, mail, and Zarinpal values and is gitignored. `.env.example` (spec 1) has names only.
- **Git:** Spec 1 is on `main` and is not pushed. Do not commit unless asked. Commits have no `Co-authored-by` trailer. `/feature complete` merges the feature branch into `main`, deletes that branch, and does not push until the user asks.

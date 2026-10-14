# Stack

NestJS GraphQL API. No overlay in the process kit covers it; this
file follows `process/overlays/_overlay-template.md`.

## Commands

```bash
npm install
npm run start:dev        # NODE_ENV=dev, reads .env.dev, port 4000
npm run build
npm test
npm run lint
```

## Docs rule

Read the docs for the installed versions before editing: the Nest
GraphQL docs, the Apollo Server docs for the major in
`package.json`, and the TypeORM changelog. Do not answer from memory.
Nest 12, `@nestjs/graphql` 14, Apollo Server 5, and TypeORM 1 are
newer than training data.

## Shape

- `src/main.ts` boots Nest on `PORT` or 4000, with CORS for
  `http://localhost:3000` and `APP_FRONT_URL`
- `src/app.module.ts` wires GraphQL (code first, schema written to
  `src/schema.gql`), TypeORM, and the feature modules
- One folder per module: `auth`, `users`, `restaurant`, `orders`,
  `payments`, `uploads`, `mail`, `jwt`, `common`
- Resolvers for GraphQL. Two REST controllers: `payments`
  (Zarinpal callback) and `uploads`

## Data and auth

- Postgres through TypeORM. Entities are the schema. `synchronize`
  is on outside production. No migrations yet; the host spec adds them
- `src/schema.gql` is generated from the resolvers. The front end's
  codegen reads the running API, so a schema change shows up as a
  diff in `../uber-eats-frontend/src/graphql/schemaTypes.ts`
- Auth is a raw JWT (no `Bearer`) in the `authorization` header for
  HTTP, and `connectionParams.authToken` for `graphql-ws`
- Subscriptions use `graphql-subscriptions` `PubSub` in memory.
  One process only
- Env names are in `.env.example`. Values live in `.env.dev`, which
  is gitignored

## Styling

None. The UI is `../uber-eats-frontend`.

## QA

- Surface: `http://localhost:4000/graphql` and the front end on
  localhost
- Checks: `npm run build`, `npm test`, `npm run lint`
- Product checklist (replaces section A):
  - Every operation on the spec 1 baseline list keeps its result
  - The front end's order story: a client places an order, the
    owner changes its status, and the client's `/order/[id]` updates
    without a reload (`updateOrders`)
  - `src/schema.gql` has no unintended change
- Data checklist (replaces section B): the row in local Postgres
  after a write, read with `psql` or a GUI
- Browser tool: Playwright, for the front-end story
- Gitignore extras: `dist/`, `.env.dev`, `.env.prod`, `.DS_Store`

## Leftovers `start` should list

- Local Postgres running with the `.env.dev` values
- `ZARINPAL_SANDBOX` set, so no real payment can run
- A schema change the front end must regenerate for
- Do not deploy, do not push

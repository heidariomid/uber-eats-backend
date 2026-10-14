# Feature skill — this project only

The action files are reusable. **This file is not.**

## Who we write for

- **End user** — the front end in `../uber-eats-frontend`, and
  through it a client and a restaurant owner
- **Us / client** — Omid, showing the code in an interview
- **App language** — English

## Review write-ups

- **Where:** `docs/` in this repo
- **File name:** `docs/spec{N}-pre-review.fa.md` or
  `docs/spec{N}-after-review.fa.md`
- **Language:** Persian, written the way the `explain-fa` skill
  writes (`~/.claude/skills/explain-fa/SKILL.md`; read it before the
  first write-up). Spoken Persian, coding words in English, the real
  names, concrete values, short sentences
- **Direction:** right-to-left. Wrap the whole file in
  `<div dir="rtl" align="right">` … `</div>`, with a blank line after
  the opening tag and before the closing one
- **Title shape:** `# Pre-review برای spec {N}: {feature}` or
  `# After-review برای spec {N}: {feature}`

Same feature → update its file. Do not create a second one.

## QA

- **Surface:** `npm run start:dev` on `http://localhost:4000/graphql`,
  with the front end on localhost
- **Browser tool:** Playwright, for the front end's order story
- **Checks:** `npm run build`, `npm test`, `npm run lint`
- **Data:** local Postgres from `.env.dev`
- **Test account:** the client and owner accounts the front end's
  QA uses
- **Known QA story:** a `graphql-ws` client with
  `connectionParams.authToken` connects, and `pendingOrders` stays
  open. With no token the socket connects and `pendingOrders`
  returns `Forbidden resource`. `getRestaurants`, `getRestaurant`,
  and `createOrder` return 400 because `class-validator` 0.14
  rejects inputs with no validators. Sign-up's unawaited Mailgun
  call can exit the process

## Git

`/feature complete` does not push until the user asks. One branch
and one commit per spec. No AI attribution.

## Leftovers `start` should look for

- Local Postgres running with the `.env.dev` values
- `ZARINPAL_SANDBOX` set
- A schema change the front end must regenerate for

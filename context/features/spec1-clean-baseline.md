# Spec 1 — Clean baseline

## Overview

Spec 1 of 2 in this repo. No dependencies. Runs before
`../uber-eats-frontend` spec 1, which records its baseline against
this API.

No major version moves in this spec. The working tree has ten
modified files that were never committed. They are real fixes, and
the front end already depends on one of them. This spec commits
them deliberately, removes the dead host files, and writes down
what the API does today on Nest 8. "Done" is a clean tree, a green
build, and the API answering the front end on `localhost:4000`.

## Requirements

- Keep these uncommitted changes. Each one is needed:
  - `src/app.module.ts`: the `subscriptions-transport-ws` block is
    gone, and the context reads `connectionParams.authToken` for
    `graphql-ws`. The front end sends `authToken` in
    `connectionParams`, so the committed version rejects its socket
  - `src/main.ts`: CORS allows `http://localhost:3000` and
    `APP_FRONT_URL` instead of `*`. The unused `addPath` import is
    gone
  - `src/jwt/*` and `src/auth/auth.guard.ts`: `verifyToken` returns
    the payload or `null` instead of an error string, tokens expire
    in 7 days, and the guard rejects a `null` payload
  - `package.json`: `axios` 1, `class-validator` 0.14,
    `jsonwebtoken` 9, `engines.node >=22`, and the lockfile that
    matches
  - `.eslintrc.js`. Read the diff before keeping it
- `webpack` 5.71.0 was added to `devDependencies` in the same diff.
  Keep it only if `npm run build` fails without it, and say why in
  Notes
- `.nvmrc` (`22`) is untracked. Commit it
- `.DS_Store` is tracked. Untrack it; `.gitignore` already lists it
- Delete the files for hosts that are gone: `liara.json` and
  `Procfile`. Remove `ngrok` if a search shows nothing imports it
- `.env.dev` is not tracked. Add `.env.example` with the same key
  names and no values: the `DB_*` keys, `JWT_SECRET`,
  `MAIL_API_KEY`, `MAIL_DOMAIN_NAME`, `APP_FRONT_URL`,
  `ZARINPAL_SANDBOX`, and `ZARINPAL_MERCHANT`
- Record the baseline in `current-feature.md` Notes:
  - Node version, local Postgres version, whether `npm run build`
    and `npm test` pass
  - Whether `npm run start:dev` boots with `synchronize` on and the
    schema created from the entities
  - Whether `src/schema.gql` changes after a boot
  - The operations the front end uses, in Apollo Sandbox or from the
    front end: sign up, log in, list restaurants, open one, create
    an order, and the owner's order subscription. One line each

  Spec 2 is judged against this list

## Out of scope

- Nest, TypeORM, Apollo Server, TypeScript majors. That is spec 2
- Fixing a broken operation found while recording the baseline
- Hosting, Supabase, CORS for a public origin

## Done when

- `git status` is clean after the commit, and `git ls-files` lists
  no `.env*`, `.DS_Store`, `liara.json`, or `Procfile`
- `npm run build` passes
- `npm run start:dev` serves `http://localhost:4000/graphql`, and a
  `graphql-ws` client with `connectionParams.authToken` connects
- The baseline list exists in `current-feature.md`

## Notes

- **Leftover on you:** a local Postgres with the `DB_*` values in
  `.env.dev`, and `ZARINPAL_SANDBOX` set so no real payment can run
- The Liara and Heroku APIs are down. Nothing here brings them back

## References

- @context/project-overview.md
- @context/stack.md
- `../uber-eats-frontend/context/features/spec1-clean-baseline.md`
- `../../interview-practice/stack-upgrade.md`

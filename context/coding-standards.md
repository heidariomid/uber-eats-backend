# Coding Standards

Stack-specific rules (commands, folders, fetching, lists) live in
@context/stack.md. This file is the rest.

## TypeScript

- Strict mode
- No `any` — use a real type or `unknown`
- Generate types from the schema. Do not hand-write an interface that
  duplicates a table or a collection
- Interfaces for component props
- Infer where obvious, be explicit where it helps

## Components

- Functional only
- One job per component. A page or screen composes
- Follow the rendering model in @context/stack.md (server components,
  or client components, or native screens)

## Styling

- Tokens from one file. Never a hex in a component or page
- The look is in @context/design-system.md. Read it first
- No component library unless the overview says so
- Tap targets at least 44×44
- Repeating the same long class string three times is a component

## Naming

- Components: PascalCase
- Files: match the component, or kebab-case for utilities
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types: PascalCase, no prefix
- Tables / collections: lowercase plural `snake_case`

## Data

- Select only the fields a page renders
- Access is enforced next to the data. A client-side filter without
  a rule behind it is a leak
- Schema changes are files in the repo

## Validation and errors

- Validate before the write. Trust only what the database enforces
- Helpers that can fail return `{ success, data, error }`
- User-facing copy is a sentence. Never a raw vendor error
- Every async action has a visible loading state and a visible
  failure state

## Security

- Only public env vars reach the client bundle
- `.env` is gitignored. `.env.example` has names, not values
- Do not store passwords or hand-roll a session

## Quality

- No commented-out code
- No unused imports
- Functions under 50 lines when possible
- The checks in `project.md` pass before a commit

## Testing

Default: no harness. Verification is @context/ai-interaction.md plus
the checklists in @context/stack.md. Do not invent a runner. If one
exists, follow this repo and only test helpers with real branches.

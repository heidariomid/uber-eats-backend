# Pre-Review Action

**Optional.** After load, before start. Status stays Not Started. Do
not run checks, open the product, create a branch, or write code.

## 1. Read

- [project.md](../project.md) — write-up location, who the user is,
  QA surface. Required for the briefing voice
- @context/current-feature.md
- The loaded spec
- @context/coding-standards.md
- @context/design-system.md if there is a page
- @context/stack.md
- @context/project-overview.md

Empty Goals: stop. "Run /feature load first."

## 2. Read the files the spec will touch

Open the current code. Do not rely on memory. Follow an existing
pattern. Check `package.json` for named dependencies.

## 3. Check platform defaults

Read the docs rule in @context/stack.md. Note hard ceilings and
defaults that fail before the spec's own cap.

A limit that only appears in production or on the QA surface is a
must-change.

## 4. Classify

| Mark | Meaning |
| ---- | ------- |
| **Must change** | As written, it will fail or contradict |
| **Spec amendment** | Small change so the spec matches the build |
| **Implementation note** | Easy to miss; no vote |
| **Do not add** | Out of scope |

## 5. Write the file `project.md` names

A team briefing, not a dump. Someone who does not read the repo
should be able to vote. Do **not** paste the findings in chat.

**Voice.** Short sentences. What happens for the end user named in
`project.md`, then why. Define a term the first time it is not
obvious. No file tours, no stack traces, no "see line 40". One real
example only when it makes the risk obvious.

1. Read the "Review write-ups" section of `project.md`
2. Same feature already has a file → update it
3. Plain GitHub-flavoured markdown. Date and branch at the top
4. File shape:
   - Opening: the one thing to remember + the verdict
   - Each must-change / amendment: **what it is now**, **what the
     user would see if we ship that**, **why we want a change**,
     **what we recommend**
   - Implementation notes as a short table
   - Do not add
   - **Votes** as checkboxes
5. End with what they should do next

Do not implement. Do not edit the spec until the user says the team
agreed.

## 6. Pointer in Notes

```
Pre-review — [date]
- Verdict: Ready to implement / Needs decisions
- Write-up: {file path}
```

Leave Goals unchanged until decisions are approved. After the team
agrees, update Goals, Notes, and the spec so implementation follows
the new text.

## 7. Chat

Only the verdict and a link to the file. One clause if a step was
skipped. No findings dump.

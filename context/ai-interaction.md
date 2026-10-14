# AI Interaction Guidelines

## Communication

- Be concise and direct
- Explain non-obvious decisions briefly
- Ask before large refactors or architectural changes
- Don't add features that aren't in the spec
- Never delete files without clarification

## Workflow

1. **Document** — write the feature in @context/current-feature.md
2. **Branch** — `feature/{kebab}` or `fix/{kebab}`
3. **Implement** — only what current-feature lists
4. **After-review** (optional) — the write-up `project.md` names
5. **Iterate** — fix what the user or the review flagged
6. **Commit** — only when the user asks
7. **Merge** — to main, fast-forward
8. **Delete** the branch
9. Mark complete in current-feature History

Do not commit without permission or before the checks in `project.md`
pass.

## Verification

There is no compile-time proof a page works. This is why the
checklists exist. The concrete items are in @context/stack.md.

When `/feature after-review` runs, actually perform them. The step is
optional; faking it is not.

### A. The product (every feature)

Use the product checklist in @context/stack.md. Always also:

- **Renders** on the QA surface in `project.md`
- **Design** — the "Before a page is done" list in the design system
- **Loading and error** — both triggered
- **Console** — no uncaught errors
- **Checks** — the commands in `project.md`

Report a skip as a skip.

### B. Data / admin (when the feature touches them)

Use the data checklist in @context/stack.md. If that overlay has
none, skip this section.

### When something fails

1. Reproduce on the QA surface (note the exact control)
2. Check the host or dashboard logs for the matching request
3. Fix, reload, **re-run the failing checklist item**
4. Record the bug in current-feature Notes so it is not reintroduced

### C. Sign-off (paste into History)

```
Feature verification — [date]
- Product QA: PASS / FAIL (where)
- Data QA: PASS / FAIL / SKIPPED (notes)
- Checks: PASS / FAIL
- Known gaps: …
- Bugs found and fixed: …
```

## Branching and commits

- One branch per feature
- Conventional commits (`feat:`, `fix:`, `chore:`)
- One commit per feature at complete
- Never commit `.env` or a real key
- No AI attribution in the message

## When stuck

Stop after two or three failed attempts and explain. Do not try
random fixes. Ask if the requirement is unclear.

## Code changes

- Minimal
- No unrelated refactors
- No "nice to have"
- Follow the patterns already in the repo

## Code review

Review generated code periodically, especially for:

- Security (what public env exposes, access rules next to the data)
- Performance (images, over-fetching, needless client components)
- Logic errors (missing empty and error states)
- Patterns (does it match the rest of the repo?)
- The platform rules in @context/stack.md

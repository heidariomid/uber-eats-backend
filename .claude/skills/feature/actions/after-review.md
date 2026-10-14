# After-Review Action

**Optional.** After implementation, before complete. Code that passes
checks but was never opened on the QA surface is assumed, not
reviewed.

## 1. Read

- [project.md](../project.md)
- @context/current-feature.md
- The spec
- @context/ai-interaction.md
- @context/stack.md — the concrete A and B lists
- @context/design-system.md "Before a page is done"

## 2. Code review against Goals

- ✅ met
- ❌ missing
- ⚠️ likely bugs
- 🚫 scope creep

Pay extra attention to the security and data notes in
@context/stack.md. Errors are readable copy. No secret in the client
bundle.

## 3. Checks

Run the commands in `project.md`. Fix before giving a pass. Do not
report a check this repo does not have.

## 4. Product QA

@context/ai-interaction.md section A, using the list in
@context/stack.md. Actually do it.

## 5. Data / admin QA

Section B, when the overlay has one and the feature touches data.

## 6. Write the file `project.md` names

A team briefing, not a QA log. Someone who did not run the checks
should still understand: is it safe to ship, and what is broken in
plain words. Do **not** paste the findings in chat.

**Voice.** Short sentences. What the end user would see. Define a
term the first time it is not obvious.

1. Read the "Review write-ups" section of `project.md`
2. Same feature → update its file
3. File shape:
   - Opening: the one thing + the verdict
   - Table: product QA, data QA, each check, console — PASS / FAIL /
     SKIPPED, each with one reason a teammate can read
   - Blockers: what is broken, who it hits, already fixed or not
   - Sign-off from section C
4. End with complete, or fix the blockers

Never report success for a step you did not run.

## 7. Pointer in Notes

```
After-review — [date]
- Verdict: Ready to complete / Needs changes
- Write-up: {file path}
```

## 8. Chat

Only the verdict and a link. If Needs changes: do not commit.

## 9. Cleanup

Stop servers you started. Close QA tabs. Delete session-only files
and throwaway test rows unless the user wants them kept.

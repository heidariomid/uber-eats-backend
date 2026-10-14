---
name: feature
description: Manage current feature workflow - start, pre-review, after-review, explain or complete
argument-hint: load|pre-review|start|after-review|test|explain|complete
---

# Feature Workflow

Manages the full lifecycle of a feature from spec to merge.

## Working File

@context/current-feature.md

Project overlay (this repo only): [project.md](project.md). Read it
before pre-review or after-review. Copy this skill to another repo →
replace that file; do not put project names or write-up locations in
the action files.

### File structure

current-feature.md has these sections:

- `# Current Feature` — H1 with the feature name when active
- `## Status` — Not Started | In Progress | Complete
- `## Goals` — what success looks like
- `## Notes` — constraints and details from the spec
- `## History` — completed features, append only

## Pipeline

Usual order. `pre-review` and `after-review` are **optional**. `start`
and `complete` must not wait for them.

```
load → start → complete
         ↑         ↑
    optional   optional
   pre-review  after-review
```

| Step | Action | When |
| ---- | ------ | ---- |
| 1 | `load` | Spec chosen; fill Goals and Notes |
| 2 | `start` | Create branch; implement; list leftovers |
| 3 | `complete` | Commit, merge to main, delete the branch |
| optional | `pre-review` | Before start — spec vs repo |
| optional | `after-review` | After implementation — checks + QA |
| optional | `test` | Only if this repo has a runner |
| optional | `explain` | Handoff of what changed |

Verification: @context/ai-interaction.md and @context/stack.md.
Pre-review: [actions/pre-review.md](actions/pre-review.md).
After-review: [actions/after-review.md](actions/after-review.md).

**`pre-review` is not `after-review`.** Pre-review does not run
checks or open the product. Both save a write-up where `project.md`
says; chat is the verdict + file link only.

## Task

Execute the requested action: $ARGUMENTS

If no action is provided, explain the options.

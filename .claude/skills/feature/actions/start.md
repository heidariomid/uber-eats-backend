# Start Action

1. Read current-feature.md. If Goals are empty: "Run /feature load first."
2. Set Status to In Progress
3. Create and checkout the branch from the H1
4. List the goals, then implement them one by one
5. Run the checks in `project.md`, then list **leftovers**. If none,
   say so in one line

`pre-review` is optional. If Notes have Pre-review **Needs
decisions**, mention it, then still implement unless the user says
wait.

## While implementing

- Follow @context/design-system.md, @context/coding-standards.md, and
  @context/stack.md
- Use existing shared components. Tokens from the one token file
- A new token or shared component is added to the design system in
  the same change
- Do not add a dependency that changes how the app is run without
  saying so first (the overlay names the cases)

## Leftovers (required)

Code done is not feature done. Tell the user every step still on
them. Do not hide a silent skip as success.

Use the leftover list in `project.md` and @context/stack.md.

A leftover that belongs to a later spec is named as later, not as a
blocker.

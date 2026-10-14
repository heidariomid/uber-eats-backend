# Load Action

1. Check $ARGUMENTS (after "load"):
   - Filename (one word, no spaces): `context/features/{name}.md` or
     `context/fixes/{name}`
   - Multiple words: treat as an inline description and write goals
   - Empty: error — "load" needs a spec filename or a description

2. Update current-feature.md:
   - H1 includes the feature name
   - Goals as bullets
   - Notes from the spec
   - Status: Not Started

3. Confirm in chat with a short summary. Next is usually
   `/feature start`. `/feature pre-review` is optional.

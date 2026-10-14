# Test Action

Optional. Prefer `/feature after-review`. Do not invent a harness.

1. Read current-feature.md
2. Check `package.json` and existing tests
3. No runner: stop. Tell the user to use after-review
4. If tests exist: follow this repo. Do not copy another project's
   paths or mocks
5. Only helpers with real branches (happy path + the error path that
   has its own code). Do not unit-test screens
6. Run the repo's test command and report what ran

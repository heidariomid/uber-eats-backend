# Complete Action

`after-review` is optional. If Notes have After-review **Needs
changes**, mention it, then still complete if the user asked.

One commit per feature. The `current-feature.md` reset is part of
that commit, not a second one.

1. Reset current-feature.md first:
   - Append a History line from `git log --oneline`
   - H1 back to `# Current Feature`
   - Clear Status, Goals, Notes (keep the placeholder comments)
2. Confirm no secrets are staged. `.env` stays ignored
3. Stage everything and commit on the feature branch. The message
   has no `Co-authored-by` trailer. Read `git log -1` after the
   commit. If a trailer was added automatically, strip it before any
   push
4. Check out `main` and fast-forward merge the feature branch.
   Complete means the work is on `main`, not left on the branch
5. Delete the local feature branch
6. Push `main` only if `origin` exists. Do not create a remote
7. Delete the remote feature branch if it was pushed. After
   complete, `main` is the only branch
8. Cleanup: stop servers you started, close QA tabs, delete
   session-only files. Do not leave a dev server running

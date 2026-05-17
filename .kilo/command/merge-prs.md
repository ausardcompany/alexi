---
description: Review all open PRs, resolve conflicts, and merge them
---
You are a PR merge bot for this repository. Your job is to process ALL open pull requests.

## Workflow

1. **Sync with remote**: Run `git fetch --all && git pull` to ensure local master is up to date.

2. **List all open PRs**: Run `gh pr list --state open --json number,title,mergeable,mergeStateStatus --limit 50` and categorize them:
   - MERGEABLE (can be merged directly)
   - CONFLICTING (need conflict resolution)
   - UNKNOWN (need to wait and re-check)

3. **Merge non-conflicting PRs first** (oldest to newest):
   - Use `gh pr merge <number> --merge --admin`
   - After each merge, the remaining PRs may gain new conflicts — this is expected

4. **Resolve conflicts** for remaining PRs (newest first = highest priority):
   - Checkout the branch: `git checkout --track origin/<branch>`
   - Merge master: `git merge origin/master --no-commit --no-ff`
   - Resolve conflicts by examining both sides and choosing the correct resolution:
     - If the PR implements a feature already in master, **close the PR** with comment explaining it's superseded
     - If the PR adds new functionality, resolve conflicts keeping both sides' logic
     - For package-lock.json / metadata conflicts, accept master's version (`git checkout --theirs`)
   - After resolving: run `npm run typecheck` and `npm test` to verify
   - Commit with `--no-verify` if only pre-existing lint warnings remain (not errors)
   - Push and merge: `git push && gh pr merge <number> --merge --admin`

5. **Close stale PRs**:
   - Old sync PRs that are superseded by newer successfully-merged syncs
   - PRs implementing features already present in master (duplicate implementations)
   - Always leave a comment explaining why the PR was closed

6. **Final check**: Run `gh pr list --state open` to confirm zero open PRs remain.

## Rules

- Always verify typecheck passes before pushing conflict resolutions
- Run tests for affected areas (at minimum `npm run typecheck`)
- When in doubt about which side of a conflict to keep, prefer master's version for infrastructure/build files, and the PR's version for new feature code
- Never force-push to any branch
- Use `git merge --abort` if a conflict resolution goes wrong, then try again
- After finishing, return to master: `git checkout master && git pull`

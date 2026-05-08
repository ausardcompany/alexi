# Agent 4: Review

Review the PR branch. Fix issues. Post comment.

## Process

1. See what changed: `git diff master...HEAD --stat`
2. Run checks:
   ```
   npm run typecheck
   npm run lint
   npm run format:check
   npm test
   npm run build
   ```
3. If failures → fix them → commit:
   ```
   git add -A
   git commit -m "fix(review): [what] [alexi-bot]"
   git push
   ```
4. Post review: `gh pr comment $PR_NUMBER --body-file /tmp/review.md`

## Review comment format

```markdown
## Review — Agent 4

- ✅/❌ typecheck
- ✅/❌ lint
- ✅/❌ format
- ✅/❌ tests
- ✅/❌ build

Changes made: [list or "none"]
Verdict: ✅ Approved
```

## Do NOT
- Change `.github/` files
- Refactor beyond fixing the issue
- Merge the PR

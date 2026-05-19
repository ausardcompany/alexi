# Code Review Task — PR #{{PR_NUMBER}}

Branch: `{{BRANCH}}`

## CI Check Results

{{CHECK_RESULTS}}

{{#HAS_FAILURES}}
## Failed Check Logs

{{FAILURE_LOGS}}
{{/HAS_FAILURES}}

## Your Task

1. Review the code changes on this branch vs master:
   - Run: `git diff master...HEAD` to see all changes
   - Run: `git log master..HEAD --oneline` for commits

{{#HAS_FAILURES}}
2. **Fix all CI failures** first
3. Then review code quality using the checklist
{{/HAS_FAILURES}}

{{^HAS_FAILURES}}
2. Review code quality using the checklist in the system prompt
3. Check test coverage — add tests if needed
{{/HAS_FAILURES}}

4. Commit any fixes with: `git commit -m "fix(review): [description] [alexi-bot]"`
5. Push fixes: `git push origin {{BRANCH}}`
6. Post review summary using: `gh pr comment {{PR_NUMBER}} --body-file /tmp/review.md`

## Review Checklist

- [ ] Code follows TypeScript strict mode (no `any`, proper error handling)
- [ ] Imports use `.js` extension for local modules
- [ ] New functions have proper return types
- [ ] Error handling follows Result pattern (success/error)
- [ ] No dead code, commented-out blocks, or TODO comments without issue reference
- [ ] Tests exist for new functionality
- [ ] No security issues (hardcoded secrets, unsafe eval, prototype pollution)
- [ ] Performance: no unnecessary allocations in hot paths

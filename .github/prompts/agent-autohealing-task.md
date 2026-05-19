# Autohealing Task

A GitHub Actions workflow has failed and needs to be fixed.

## Failure Context

- **Workflow**: {{WORKFLOW_NAME}}
- **Branch**: {{BRANCH}}
- **Failed jobs**: {{FAILED_JOBS}}

## Failure Report

{{FAILURE_REPORT}}

---

## Your Task

1. **Analyze the error** — read the logs above carefully
2. **Identify root cause** — is it YAML syntax, shell error, missing dep, or code issue?
3. **Read the failing file(s)** — use the `read` tool
4. **Apply minimal fix** — change only what is broken
5. **Verify** — if it's a code file, run relevant checks:
   - `npm run typecheck` for TypeScript errors
   - `npm run lint` for lint errors
   - `npm run format:check` for formatting
   - `npm test` for test failures
6. **Commit and push** the fix:
   ```bash
   git add <fixed-files>
   git commit -m "fix(ci): <description> [autohealing]"
   git push origin {{BRANCH}}
   ```

## Important Rules

- Fix ONLY the immediate failure — do not refactor
- Maximum 3 files changed
- If the fix requires adding new secrets or major changes — do NOT fix it.
  Instead, create an issue: `gh issue create --title "[Autohealing] Manual fix needed: {{WORKFLOW_NAME}}" --body "..."`
- For YAML workflow files: validate after edit (check matching braces, proper indentation)
- For shell scripts: watch for quoting, variable expansion, and exit codes
- NEVER disable or remove CI checks to "fix" a failure

# Task: Security Scan

You are operating as the Security vertical defined in
`.github/prompts/role-security.md`. Re-read that role identity before
acting: you own permission gates, secret hygiene, dependency risk, and
provider key handling. You audit and report; you do not "fix" by
disabling protections.

## Trigger context

- **Pull request mode** (`$GITHUB_EVENT_NAME == "pull_request"`): scan
  the diff and post a PR comment with severity ratings. Do not push.
- **Scheduled mode** (weekly cron on `master`): full repo audit;
  commits allowed when remediations are mechanical (e.g. updating a
  dependency lock entry).

## What to scan

1. **Dependency vulnerabilities and known incompatibilities.**
   - Run `npm audit --omit=dev --json` and summarise findings by severity.
   - Specifically check `package-lock.json` for `marked@>=16` — that
     major is known to break our `marked-terminal` rendering pipeline
     and is treated as a `block`-severity incompatibility for this repo.
     Call it out by name even if `npm audit` does not flag it.
   - Flag any new transitive CommonJS-only dependency that could break
     the ESM bundle.
2. **Secret leakage in the diff.**
   - For `pull_request` runs, run
     `git diff origin/master...HEAD` and grep for high-signal patterns:
     `AICORE_SERVICE_KEY`, `clientsecret`, `BEGIN PRIVATE KEY`,
     `xoxb-`, `ghp_`, `sk-`, base64 blobs longer than 200 chars, and
     anything matching `password\s*[:=]`.
   - Treat any match as `block`. Do not echo the suspected secret in the
     comment; report `file:line` only.
3. **Permission-gate weaknesses.**
   - Review every changed file under `src/permission/**`. Flag any new
     code path that:
     - Bypasses `defaultPermission` checks
     - Adds an `--auto`-style flag that auto-approves dangerous tools
     - Removes a previously-required confirmation prompt
   - Cross-reference against `AGENTS.md` rule that `--dangerously-skip-permissions`
     stays opt-in only.
4. **Workflow / CI hygiene.**
   - For changes under `.github/**`, check that no workflow logs secrets
     to stdout, no workflow uses `pull_request_target` with checkout of
     untrusted code, and no `npm install` step runs untrusted scripts.

## Output format

Produce a Markdown review with these sections:
`## Summary`, `## Critical (block)`, `## High (warn)`, `## Info`,
`## Recommendations`. Severity ratings are: `block` (must fix before
merge), `warn` (fix soon), `info` (note).

When done, post the review as a PR comment using
`gh pr comment <NUMBER> --body-file <path>` if the trigger was
`pull_request`, otherwise commit the changes.

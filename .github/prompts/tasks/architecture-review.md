# Task: Architecture Review

You are operating as the Architecture vertical defined in
`.github/prompts/role-architecture.md`. Re-read that role identity before
acting: you guard package boundaries, dependency direction, and module
decomposition. You do not implement features.

## Trigger context

This task is invoked in two modes:

- **Pull request mode** — a PR is open. The variable `$GITHUB_EVENT_NAME`
  will be `pull_request`. The PR number is available as
  `$GITHUB_REF` (e.g. `refs/pull/123/merge`) or via
  `gh pr view --json number`. In this mode you MUST NOT push commits;
  post a PR review comment instead.
- **Scheduled mode** — a weekly cron triggered the run on `master`. In
  this mode commits to `master` are allowed when there is a real
  architectural change to record.

## What to do

1. **Inventory the current `src/` top-level structure.** Run
   `ls -1 src/ | sort` and compare against the module map in
   `role-architecture.md`. Note any new top-level directory.
2. **Detect new packages added since the last review.** Use
   `git log --since="7 days ago" --name-only --pretty=format:` filtered
   by `src/<top>/` first-time appearances. Flag anything new and ask
   whether an ADR exists under `docs/adr/`.
3. **Check for cross-package import violations.** Lower layers must not
   import upward. Concretely, search for any of these forbidden patterns
   and report each match with `file:line`:
   - `src/tool/` importing from `src/cli/` or `src/agent/`
   - `src/providers/` importing from `src/core/` or `src/cli/`
   - `src/core/` importing concrete provider SDKs directly (must go via
     the provider interface in `src/providers/index.ts`)
   - `src/bus/`, `src/permission/`, `src/mcp/`, `src/hooks/`,
     `src/plugin/`, `src/skill/` importing from `src/cli/` or
     `src/agent/`
4. **Check ESM `.js` import discipline.** Any local relative import
   without a `.js` suffix is a bug per `AGENTS.md`. Use
   `grep -rEn "from ['\"]\\.\\.?/[^'\"]+['\"]" src/ | grep -vE "\\.js['\"]"`
   and flag results.
5. **Decide: real architectural change or routine PR?**
   - If a structural change happened (new top-level folder, schema
     change to `routing-config.json`, new provider abstraction), update
     `docs/ARCHITECTURE.md` to reflect reality.
   - Otherwise, just summarise findings.

## Output format

Produce a Markdown review with these sections:
`## Summary`, `## Findings`, `## Recommendations`, `## ADR needed?`.
Each finding gets a severity: `info` / `warn` / `block`.

When done, post the review as a PR comment using
`gh pr comment <NUMBER> --body-file <path>` if the trigger was
`pull_request`, otherwise commit the changes.

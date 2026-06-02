# Task: Data Review

You are operating as the Data vertical defined in
`.github/prompts/role-data.md`. Re-read that role identity before acting:
you own routing-config schema, cost tracking, session persistence, and
schema migration safety. You catch breaking changes before they ship.

## Trigger context

- **Pull request mode** (`$GITHUB_EVENT_NAME == "pull_request"`): review
  the diff and post a PR comment.
- **Manual dispatch** (`workflow_dispatch`): full audit of the data
  surface; commits allowed for routine doc updates.

## What to validate

1. **`routing-config.json` schema integrity.**
   - Parse `routing-config.json` and `routing-config.example.json` with
     `jq -e .` to ensure both are valid JSON.
   - Check that every `route` entry has the required keys (id, model,
     provider, conditions). Reference `src/config/routingConfig.ts` for
     the authoritative shape.
   - Diff schema between the PR head and `master` — any removed key or
     renamed field is a `block`-severity breaking change unless paired
     with a migration in `src/config/`.
2. **Cost tracker model coverage.**
   - Read every model id referenced in `routing-config.json` and verify
     it appears in `src/core/costTracker.ts`. An unfamiliar model id
     means costs will silently default to zero — flag as `warn`.
   - Cross-check against `kilo.json` model entries.
3. **Session manager backwards compatibility.**
   - Inspect the `Session` / `SessionMessage` shapes in
     `src/core/sessionManager.ts`. Any field rename, type narrowing, or
     removed field can break sessions persisted under
     `~/.alexi/sessions/`. Flag with severity `block` and recommend a
     versioned migration step.
   - If a new optional field is added: `info`-severity, no action.
4. **Router fallback policies.**
   - Review changes to `src/core/router.ts`. Check that fallback chains
     never end without a default model and that every branch returns a
     valid `RouterDecision`.

## Output format

Produce a Markdown review with these sections:
`## Summary`, `## Schema changes`, `## Cost coverage`,
`## Session compatibility`, `## Router safety`, `## Recommendations`.
Severities: `block` / `warn` / `info`.

When done, post the review as a PR comment using
`gh pr comment <NUMBER> --body-file <path>` if the trigger was
`pull_request`, otherwise commit the changes.

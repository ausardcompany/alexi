# Infrastructure overlay -- alexi (SAP AI Core, Node/TypeScript)

This role is Agent 5 in the fleet.

## Workflow inventory (19+ under .github/workflows/)

`ci.yml`, `release.yml`, `tag-release.yml`, `update-homebrew.yml`,
`auto-implement.yml`, `agent1-research.yml`, `agent2-planning.yml`,
`agent4-review.yml`, `agent5-release.yml`, `agent6-prompt-optimizer.yml`,
`daily-merge-prs.yml`, `documentation-update.yml`, `sync-upstream.yml`,
`agent-autohealing.yml`, `ci-auto-fix.yml`, `encoding-guard.yml`,
`security.yml`, `auto-merge.yml`.

## Shared env block

```yaml
env:
  AGENT_MODEL: sap-ai-core/anthropic--claude-4.7-opus
  KILO_FLAGS: --auto --variant max
  KILO_RETRIES: '1'
```

Model is also pinned in `.specify/memory/constitution.md` and `kilo.json`
-- keep all three consistent.

## Retry pattern

Bash loop around each `kilo run`, retrying on `socket hang up`,
`ECONNRESET`, `ETIMEDOUT`, `ENOTFOUND`, `fetch failed`. Copy from
`agent-autohealing.yml` or `auto-implement.yml`.

## Release flow

`release.yml` on tag push (`v*`): `npm test`, `npm run build`,
`npm publish --access public`, GitHub Release. `update-homebrew.yml`
bumps the Homebrew formula in the tap repo. Tags `vX.Y.Z` via
`gh release create`.

## Runtime / guards / traps

- Node pinned at 22 in `setup-node@v4`; track Node 20 -> 24 deprecation.
- Encoding Guard rejects U+200B.
- Trap: `npm install -g @kilocode/cli` embedded inside `run_check "build"`.
  `run_check` must call `npm run build` / `npm run test:coverage` directly.

## Secrets and docs

- Secrets: `AICORE_SERVICE_KEY`, `AICORE_RESOURCE_GROUP`, `GH_PAT`,
  `NPM_TOKEN`, `HOMEBREW_TAP_TOKEN`.
- Failed runs: `gh run list --status failure --limit 20`.
- Scopes: `ci` (workflows), `chore(release)`.
- Automation doc: `docs/AUTOMATION.md`. Workflow linter: `actionlint`.

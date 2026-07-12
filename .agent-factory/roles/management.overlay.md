# Management overlay -- alexi (SAP AI Core, Node/TypeScript)

This role is Agent 6 (prompt optimizer) in the fleet.

## Labels and automation

- Queued issue label: `auto-implement`. Report label: `daily-report`.
- Merge automation: Daily Merge at 18:00 UTC / `auto-merge.yml`.
- CI flake signal: transient `socket hang up` / `ECONNRESET`.

## Reporting cadence

- Daily summary at 18:00 UTC (post-Daily-Merge).
- Weekly metrics on Monday (after the infrastructure Monday run).
- Release-cadence target: at least one release per two weeks.

## Concrete paths and commands

- Metrics file: `.github/research/YYYY-MM-DD-metrics.md` (under 100 lines).
- Prompt files scanned: all 11 files in `.github/prompts/*.md`.
- Principles doc: `.specify/memory/constitution.md` (principles I-VIII).
- Coverage: `coverage/coverage-summary.json`.

Commands:

```
gh run list --limit 100 --json status,conclusion,name,createdAt,updatedAt
gh pr list --state merged --search "merged:>=YYYY-MM-DD"
gh issue list --label auto-implement --state all
gh issue comment ...   # post daily summary
```

Do not require live SAP credentials; metrics come from `gh api`, workflow
logs, and coverage artefacts.

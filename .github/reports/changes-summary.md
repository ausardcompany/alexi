# Changes Summary — Upstream Sync 2026-08-29

## Plan Executed

Applied the "no-port" upstream sync tracking plan for review ranges:
- kilocode: `e126cc3ca..5e02825c8` (26 commits — all JetBrains plugin scope)
- opencode: `df35e84..dc4449d` (2 commits — console UI + nix hashes)

Total planned code changes: **0**. Total planned tracking/doc changes: **3**.
All three low-priority items were executed. No SAP AI Core surfaces
were modified (nothing under `src/providers/`, `src/core/`, `src/tool/`,
`src/agent/`, `src/permission/`, or `src/bus/` was touched).

## Files Modified / Created

| File | Type | Priority |
| --- | --- | --- |
| `docs/upstream-sync/2026-08-29.md` | created | low |
| `.upstream-sync.json` | created | low |
| `docs/upstream-sync/watchlist.md` | created | low |

## Summary of Each Change

### 1. `docs/upstream-sync/2026-08-29.md` (new)
Audit-trail entry recording the "no port required" decision for the
2026-08-29 sync pass. Documents which upstream commit ranges were
reviewed and why each vertical (JetBrains plugin, OpenCode SolidJS
console, Nix build metadata) is out-of-scope for Alexi. Also records
the correct starting commits for the next sync so we do not re-analyze
the same range: kilocode `5e02825c8`, opencode `dc4449d`.

### 2. `.upstream-sync.json` (new)
Machine-readable watermark tracker at the repo root. Records the last
reviewed commit per upstream (kilocode, opencode), the review date, and
a short human-readable note about the decision. This file did not
previously exist in the repo — created fresh per the plan. Structure
follows the plan's exact JSON schema; the two top-level keys
(`kilocode`, `opencode`) match the two upstream sources tracked by
`scripts/sync-upstream.sh` and `.github/workflows/sync-upstream.yml`.

### 3. `docs/upstream-sync/watchlist.md` (new)
Flags three upstream concepts that are JetBrains-only today but could
migrate into shared surfaces in future commits:
- Session sharing state persistence (kilocode `d2fd73b10`)
- Worktree run lifecycle race-condition fixes (kilocode `e43dd7f23`,
  `1747e05a3`)
- Prompt session actions menu action IDs (kilocode `8b711803b`)

The plan said "append", but the file did not yet exist in the repo, so
it was created with the watchlist header + the plan's payload. Future
sync runs should append additional sections under the existing
"Watchlist (added ...)" pattern.

## Issues Encountered

- **Neither `docs/upstream-sync/` nor `.upstream-sync.json` existed**
  before this run. Both were created from scratch, which matches the
  plan's instruction ("create if absent"). No existing tooling in the
  repo currently reads `.upstream-sync.json` (verified via ripgrep
  across `scripts/`, `.github/workflows/`, `engine/`, and `src/`), so
  creating it is purely informational for now — it will not break any
  CI job. If/when a future sync tool starts consuming it, the schema in
  the plan is the canonical shape.
- No code, tests, providers, routers, or CLI behavior were changed.
  `npm run lint`, `typecheck`, `test`, and `build` are unaffected by
  this changeset (Markdown + a standalone JSON file only). ESLint
  ignores `docs/`; the new JSON is valid and self-contained.
- No SAP AI Core integration surfaces were touched. `src/providers/`,
  `src/core/`, and routing configs are unchanged.

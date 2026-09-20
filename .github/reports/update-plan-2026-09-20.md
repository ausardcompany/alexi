```markdown
# Update Plan for Alexi

Generated: 2026-09-20
Based on upstream commits analyzed:
- kilocode: a85ae672a..010f511d7 (18 commits — docs sync only)
- opencode: ae93d4a..ebb7b76 (4 commits — docs + CI + console redirect)

## Summary
- Total changes planned: 0 code changes; 2 optional documentation/CI enhancements
- Critical: 0 | High: 0 | Medium: 0 | Low: 2

## Analysis

All 18 kilocode commits are documentation auto-sync operations touching only:
- `packages/kilo-docs/LEARNINGS.md`
- `packages/kilo-docs/pages/ai-providers/openai-chatgpt-plus-pro.md`
- `packages/kilo-docs/pages/gateway/authentication.md`
- `packages/kilo-docs/pages/gateway/models-and-providers.md`

All 4 opencode commits touch:
- Documentation (`packages/web/src/content/docs/**/zen.mdx` — 19 locale files added)
- CI workflow (`.github/workflows/models-snapshot.yml` — scheduled models.dev snapshot refresh)
- Console app route (`packages/console/app/src/routes/download/[channel]/[platform].ts` — desktop download redirect refactor, opencode.ai web console, not applicable to Alexi CLI)

**No changes were made** to:
- Tool system (`packages/*/src/tool/`)
- Agent system (`packages/*/src/agent/`)
- Permission system (`**/permission/`)
- Event bus (`**/bus/`, `**/event/`)
- Core orchestration (`**/core/`)
- Providers, router, or CLI code

Therefore, **no code changes to Alexi's `src/` tree are required** from this diff window. Two optional, low-priority items are proposed below.

## Changes

### 1. (Optional) Add scheduled models.dev snapshot refresh workflow
**File**: `.github/workflows/models-snapshot.yml` (new)
**Priority**: low
**Type**: feature (CI)
**Reason**: Upstream opencode added a scheduled workflow to keep the `models.dev` snapshot fresh. If Alexi consumes a cached `models.dev` catalog for provider/model routing (parallel to opencode's v2 snapshot), a similar scheduled refresh keeps model metadata current without manual intervention. Skip this change if Alexi resolves models at runtime or relies on SAP AI Core's model catalog exclusively.

**New code**:
```yaml
name: Refresh models.dev snapshot

on:
  schedule:
    - cron: "0 6 * * *"  # daily at 06:00 UTC
  workflow_dispatch:

jobs:
  refresh:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Fetch models.dev snapshot
        run: |
          mkdir -p data/models
          curl -fsSL https://models.dev/api.json -o data/models/snapshot.json
      - name: Create PR if changed
        uses: peter-evans/create-pull-request@v6
        with:
          commit-message: "chore(data): refresh models.dev snapshot"
          title: "chore(data): refresh models.dev snapshot"
          branch: chore/models-snapshot
          add-paths: data/models/snapshot.json
```

**SAP note**: Ensure this does not override SAP AI Core model definitions. If Alexi maintains a separate SAP-provider model list, keep it in a distinct file (e.g., `data/models/sap-ai-core.json`) that this workflow does not touch.

---

### 2. (Optional) Sync new Zen documentation section
**File**: `docs/zen.md` (new — if Alexi ships user docs)
**Priority**: low
**Type**: docs
**Reason**: Upstream opencode added a "Zen" documentation page across 19 locales describing Jev/Zen usage. Only relevant if Alexi packages user-facing docs that mirror opencode's docs site. Otherwise skip.

**New code**: N/A — copy/adapt from `packages/web/src/content/docs/zen.mdx` in opencode if Alexi's brand includes equivalent functionality; otherwise omit.

---

## Testing Recommendations
- No functional code changed → existing test suite is sufficient.
- If change #1 is adopted:
  - Run the workflow manually via `workflow_dispatch` to verify it fetches and produces a valid JSON snapshot.
  - Verify SAP AI Core provider/model registration paths continue to load correctly with any refreshed snapshot.
  - Add a JSON schema validation step before opening a PR to prevent malformed upstream data from breaking Alexi.

## Potential Risks
- **None from source code**: this diff window contains zero changes to tool, agent, permission, bus, core, provider, router, or CLI code.
- **If workflow #1 is adopted**: an upstream schema change at `models.dev` could introduce fields that Alexi's model loader does not expect. Mitigate by validating the snapshot against a pinned schema and gating merges on CI.
- **SAP AI Core compatibility**: unaffected — no upstream changes touch provider abstractions or authentication flows in this window.

## Recommendation
**Defer this sync cycle.** Re-run the diff generator after the next upstream cycle to capture substantive code changes. Consider narrowing the auto-report to ignore `docs/`, `packages/kilo-docs/`, `packages/web/src/content/`, and locale-only file additions to reduce planning noise.
```
{"prompt_tokens":3201,"completion_tokens":1995,"total_tokens":5196,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: a0daa81e-56ab-4132-a2b2-d9c7f481835d]
[Messages: 2, Tokens: 5196]

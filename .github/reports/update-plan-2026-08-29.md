# Update Plan for Alexi

Generated: 2026-08-29
Based on upstream commits analyzed:
- kilocode: e126cc3ca..5e02825c8 (26 commits — all JetBrains plugin scope)
- opencode: df35e84..dc4449d (2 commits — console UI + nix hashes)

## Summary
- Total changes planned: 0 (code) / 3 (documentation/tracking)
- Critical: 0 | High: 0 | Medium: 0 | Low: 3

## Analysis

After a thorough review of the upstream diffs, **none of the changes are applicable to Alexi's codebase**. Here's the breakdown:

### kilocode (26 commits, 81 files)
All changes are scoped to the **`packages/kilo-jetbrains/`** subproject (Kotlin/JetBrains IDE plugin):
- Worktree run configuration support (backend Kotlin + frontend Kotlin UI)
- Session context menu & sharing (JetBrains UI)
- Prompt session actions menu (JetBrains UI)
- i18n bundle updates for 18 locales (JetBrains resources)
- New RPC APIs: `KiloRunRpcApi`, extensions to `KiloSessionRpcApi` (JetBrains-only IPC)

**Zero changes to** `src/tool/`, `src/agent/`, `src/permission/`, `src/bus/`, `src/core/`, providers, routers, or CLI. Alexi does not ship a JetBrains plugin, so **no port is required**.

### opencode (2 commits, 8 files)
- `feat(console): animate Go usage allowances and bonuses` — SolidJS UI work in `packages/console/app/` (billing/usage dashboard). Alexi does not maintain the OpenCode web console.
- `chore: update nix node_modules hashes` — Nix build reproducibility metadata. N/A to Alexi.

## Changes

### 1. Record upstream sync decision (no code port)
**File**: `docs/upstream-sync/2026-08-29.md` (new)
**Priority**: low
**Type**: documentation
**Reason**: Maintain an audit trail so future syncs can skip already-reviewed ranges and confirm the "no-op" decision was intentional.

**New code**:
```markdown
# Upstream Sync — 2026-08-29

## Reviewed Ranges
- kilocode: `e126cc3ca..5e02825c8` (26 commits)
- opencode: `df35e84..dc4449d` (2 commits)

## Decision: NO PORT

### kilocode
All 81 changed files are under `packages/kilo-jetbrains/**` (Kotlin
JetBrains plugin). Alexi does not ship a JetBrains integration. The new
`KiloRunRpcApi` / `KiloSessionRpcApi.share` surfaces are IDE-plugin RPC
contracts and do not map onto Alexi's core tool/agent/permission model.

Files scanned confirmed no changes to:
- `packages/*/src/tool/**`
- `packages/*/src/agent/**`
- `packages/*/src/core/**`
- Permission / event-bus modules

### opencode
- `packages/console/app/**` — SolidJS billing console (not part of Alexi).
- `nix/hashes.json`, `bun.lock` — build metadata (not applicable).

## Follow-ups
- None. Next sync should start from kilocode `5e02825c8` and opencode `dc4449d`.
```

---

### 2. Advance sync watermark
**File**: `.upstream-sync.json` (or equivalent tracker; create if absent)
**Priority**: low
**Type**: refactor (tooling)
**Reason**: Prevent re-analysis of the same commits on the next sync pass.

**Current code** (illustrative):
```json
{
  "kilocode": { "lastReviewed": "e126cc3ca" },
  "opencode":  { "lastReviewed": "df35e84" }
}
```

**New code**:
```json
{
  "kilocode": {
    "lastReviewed": "5e02825c8",
    "reviewedAt": "2026-08-29",
    "note": "JetBrains-only changes; no port required."
  },
  "opencode": {
    "lastReviewed": "dc4449d",
    "reviewedAt": "2026-08-29",
    "note": "Console UI + nix hashes only; no port required."
  }
}
```

---

### 3. Monitor for future JetBrains-adjacent abstractions
**File**: `docs/upstream-sync/watchlist.md` (append)
**Priority**: low
**Type**: documentation
**Reason**: Some new kilocode concepts (session sharing state persistence, run-config lifecycle races) may eventually surface in the TypeScript core. Flag them so we notice if/when they cross the boundary.

**New code**:
```markdown
## Watchlist (added 2026-08-29)

- **Session sharing state persistence** (kilocode d2fd73b10): if this
  moves from the JetBrains frontend into the shared session model
  (`SessionDto.kt` gained a share field), a corresponding change may
  appear in shared session serialization used by Alexi's session store.
  Watch `packages/*/src/session/` in future diffs.

- **Worktree run lifecycle** (kilocode e43dd7f23, 1747e05a3): purely
  JetBrains today, but the race-condition fixes around "close worktree
  run release" hint at concurrency patterns worth mirroring if Alexi
  ever adds a run-worktree feature. No action now.

- **Prompt session actions menu** (kilocode 8b711803b): if action IDs
  are exposed via a shared RPC contract in a future commit, port to
  Alexi's CLI command palette.
```

## Testing Recommendations
- No code changes ⇒ no functional tests needed.
- If maintaining `.upstream-sync.json`, ensure the sync tooling still parses it (run whatever CI job consumes the tracker).
- Verify the new docs render correctly in the repo's docs viewer (Markdown lint if configured).

## Potential Risks
- **False negatives on scope**: The diff report explicitly shows zero changes in Tool/Agent/Permission/Bus/Core categories, but the categorizer only inspects path prefixes. Low residual risk that a cross-cutting Kotlin change hides a protocol/DTO relevant to Alexi. Mitigation: skim `shared/src/main/kotlin/ai/kilocode/rpc/dto/SessionDto.kt` (+7 lines) — it adds JetBrains session-sharing fields; **not consumed by Alexi's TS core**, so safe to ignore.
- **Deferred debt**: Choosing not to port means if Alexi later adopts session-sharing UX, we'll need to design it from scratch rather than following the JetBrains reference. Documented via the watchlist above.
- **No breaking changes** introduced by this plan.
{"prompt_tokens":7686,"completion_tokens":2379,"total_tokens":10065,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 9062bba6-937f-4397-9944-96346eda1a9e]
[Messages: 2, Tokens: 10065]

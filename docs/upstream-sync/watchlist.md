# Upstream Sync Watchlist

Tracks upstream concepts that were **not ported** to Alexi but may become
relevant if/when they cross an architectural boundary (e.g., move from a
JetBrains-only or console-only surface into shared TypeScript / RPC code).
Entries here are intentionally lightweight — the goal is a signal to
future syncs, not a design doc.

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

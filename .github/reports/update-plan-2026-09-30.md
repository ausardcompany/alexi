# Update Plan for Alexi

Generated: 2026-09-30
Based on upstream commits analyzed:
- `c98f8740c` - Merge: remove-link-pr-feature-vscode
- `154a8427c` - fix(cli): disable session PR linking on non-CLI backends
- `9076f0301` - fix(opencode): offer the link_pr tool to CLI sessions only
- `56ab1e502` - fix(sessions): harden per-session PR link evidence
- `9cc0a9158` - fix(sessions): link a pull request to a session only on its own evidence
- `eb7b4896b` - test(cli): scope PR-link storage fixtures to Effect layers

## Summary
- Total changes planned: 4
- Critical: 0 | High: 3 | Medium: 1 | Low: 0

## Changes

### 1. Gate `link_pr` tool execution to CLI backends only
**File**: `src/tool/link-pr.ts`
**Priority**: high
**Type**: bugfix / security
**Reason**: Upstream disables session PR linking on non-CLI backends (e.g., VS Code webview) because the storage semantics only make sense in the CLI. In Alexi we need to preserve the same behavior so that when Alexi is embedded in non-CLI hosts (SAP BAS / VS Code webview integration), the tool returns an "unavailable" result rather than corrupting session state.

**Current code**:
```typescript
import { Tool } from "@/tool/tool"
import { Instance } from "@/kilocode/instance"
import { linkMatchesWorktree, parsePrUrl } from "@/kilo-sessions/pr-link"
import { Effect, Schema } from "effect"
import * as Log from "@opencode-ai/core/util/log"
import DESCRIPTION from "./link-pr.txt"

// ...

execute: (params) =>
  Effect.gen(function* () {
    const link = parsePrUrl(params.url)
    if (!link) {
      return {
        // ...
      }
    }

    // ...

    const stored = yield* Effect.tryPromise({
      try: async () => {
        const { writePrLinkOverride } = await import("@/kilo-sessions/pr-link")
        await writePrLinkOverride(worktree, link)
      },
      catch: (err) => err,
    }).pipe(
      Effect.as(true),
      Effect.catch((err) =>
        Effect.sync(() => {
          // ...
        }),
      ),
    )
```

**New code**:
```typescript
import { Tool } from "@/tool/tool"
import { Instance } from "@/kilocode/instance"
import {
  enabled as prEnabled,
  linkMatchesWorktree,
  parsePrUrl,
} from "@/kilo-sessions/pr-link"
import { Effect, Schema } from "effect"
import * as Log from "@opencode-ai/core/util/log"
import DESCRIPTION from "./link-pr.txt"

// ...

execute: (params, ctx) =>
  Effect.gen(function* () {
    if (!prEnabled()) {
      return {
        title: "PR linking unavailable",
        output: "Session PR linking is only available in CLI backends.",
        metadata: { ok: false, reason: "unsupported_client" as const },
      }
    }

    const link = parsePrUrl(params.url)
    if (!link) {
      return {
        // ...
      }
    }

    // ...

    // Store the link against THIS session, never the worktree, so an
    // explicit link can never fan out to another session sharing the
    // same checkout. `recordSessionLink` runs the same host/owner/repo
    // check as `linkMatchesWorktree` and refuses a link for a fork or
    // another repo.
    const stored = yield* Effect.tryPromise({
      try: async () => {
        const { recordSessionLink } = await import("@/kilo-sessions/pr-link")
        return recordSessionLink(
          ctx.sessionID,
          { link, evidence: "user" },
          worktree,
        )
      },
      catch: (err) => err,
    }).pipe(
      Effect.map((record) => (record ? ("ok" as const) : ("refused" as const))),
      Effect.catch((err) =>
        Effect.sync(() => {
          Log.warn("link_pr: failed to record session link", { err })
          return "error" as const
        }),
      ),
    )

    if (stored === "refused") {
      return {
        title: "Refused to link PR",
        output:
          "The PR does not match this session's worktree (different host/owner/repo).",
        metadata: { ok: false, reason: "worktree_mismatch" as const },
      }
    }

    if (stored === "error") {
      return {
        title: "Failed to link PR",
        output: "Could not persist the PR link for this session.",
        metadata: { ok: false, reason: "storage_error" as const },
      }
    }
```

### 2. Hide `link_pr` from tool registry on non-CLI backends
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature / bugfix
**Reason**: Even before executing the tool, the model should not be offered `link_pr` when the backend can't honor it. This avoids wasted tool calls and confusing error messages in non-CLI contexts. Matches upstream `9076f0301`.

**Current code**:
```typescript
import * as Network from "@/kilocode/sandbox/network"
import { Notebook } from "@/kilocode/notebook/service"
import { AgentManager, HostError } from "@/kilocode/agent-manager/service"
import { KiloSessions } from "@/kilo-sessions/kilo-sessions"
import * as Log from "@opencode-ai/core/util/log"

// ... inside tool-list builder ...
      tools.notify,
      ...(Flag.KILO_CLIENT === "vscode" && tools.openPlan ? [tools.openPlan] : []),
      tools.send,
      tools.linkPr,
    ]
```

**New code**:
```typescript
import * as Network from "@/kilocode/sandbox/network"
import { Notebook } from "@/kilocode/notebook/service"
import { AgentManager, HostError } from "@/kilocode/agent-manager/service"
import { KiloSessions } from "@/kilo-sessions/kilo-sessions"
import { enabled as prEnabled } from "@/kilo-sessions/pr-link"
import * as Log from "@opencode-ai/core/util/log"

// ... inside tool-list builder ...
      tools.notify,
      ...(Flag.KILO_CLIENT === "vscode" && tools.openPlan ? [tools.openPlan] : []),
      tools.send,
      ...(prEnabled() ? [tools.linkPr] : []),
    ]
```

### 3. Add per-session PR link storage (`recordSessionLink` + `enabled` gate)
**File**: `src/kilo-sessions/pr-link.ts` (or Alexi's equivalent path — likely `src/session/pr-link.ts`)
**Priority**: high
**Type**: security / bugfix
**Reason**: Upstream commits `9cc0a9158` and `56ab1e502` restructure PR-link persistence so that a link is stored against a specific `sessionID` rather than the shared worktree. This prevents cross-session fan-out where two sessions on the same checkout would both inherit a PR link. Alexi must adopt this to avoid leaking PR context between sessions (important for SAP tenant isolation scenarios). Also adds the `enabled()` predicate used by (1) and (2).

**New code** (public API additions — merge with existing file):
```typescript
/**
 * Returns true when PR-link persistence is available for the current backend.
 * On non-CLI backends (e.g., embedded VS Code webview host) this is false.
 */
export function enabled(): boolean {
  // Alexi: gate to CLI client only. Adjust flag lookup to match Alexi's
  // runtime-flag mechanism (Flag.KILO_CLIENT / RuntimeFlags service).
  return Flag.KILO_CLIENT === "cli"
}

export interface SessionPrLink {
  link: ParsedPrLink
  evidence: "user" | "auto" | "poller"
}

/**
 * Records a PR link against a session (never against the worktree).
 * Verifies host/owner/repo match before storing. Returns the record on
 * success, or `undefined` if the link was refused (mismatch).
 */
export async function recordSessionLink(
  sessionId: string,
  record: SessionPrLink,
  worktree: string,
): Promise<SessionPrLink | undefined> {
  if (!enabled()) return undefined
  if (!linkMatchesWorktree(record.link, worktree)) return undefined

  await writeSessionLink(sessionId, record)
  return record
}

// Internal helper — writes to a session-scoped file, not worktree-scoped.
async function writeSessionLink(
  sessionId: string,
  record: SessionPrLink,
): Promise<void> {
  const path = sessionLinkPath(sessionId)
  await fs.mkdir(pathmod.dirname(path), { recursive: true })
  await fs.writeFile(path, JSON.stringify(record, null, 2), "utf8")
}

function sessionLinkPath(sessionId: string): string {
  // Alexi: place under session storage root, not worktree root.
  return pathmod.join(Storage.sessionDir(sessionId), "pr-link.json")
}
```

**Deprecation note**: If Alexi still exposes `writePrLinkOverride(worktree, link)`, keep it as a thin wrapper that logs a deprecation warning and delegates to `recordSessionLink` — but strongly prefer removing all callers.

### 4. Update `link_pr` tool tests to use `spyOn` scoping and session-level recording
**File**: `src/tool/link-pr.test.ts`
**Priority**: medium
**Type**: refactor / test
**Reason**: Upstream `eb7b4896b` scopes PR-link storage fixtures to Effect layers with `spyOn` rather than `mock.module`, and asserts against the new `recordSessionLink` shape (`{ sessionId, record, worktree }`). Aligning avoids brittle module-level mocks that leak between tests.

**Current code**:
```typescript
import { afterAll, beforeEach, describe, expect, mock, test } from "bun:test"

const realPrLink = await import("@/kilo-sessions/pr-link")

const writes: { worktree: string; link: unknown }[] = []
let writeError: unknown

const writeOverride = mock(async (worktree: string, link: unknown) => {
  if (writeError) throw writeError
  writes.push({ worktree, link })
})

void mock.module("@/kilo-sessions/pr-link", () => ({
  ...realPrLink,
  writePrLinkOverride: writeOverride,
}))

const { LinkPrTool } = await import("@/kilocode/tool/link-pr")
const { KiloToolRegistry } = await import("@/kilocode/tool/registry")
```

**New code**:
```typescript
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from "bun:test"
import type { SessionPrLink } from "@/kilo-sessions/pr-link"

const realPrLink = await import("@/kilo-sessions/pr-link")

const writes: { sessionId: string; record: unknown; worktree: string }[] = []
let writeError: unknown
let refuseWrite = false

const recordSessionLink = mock(
  async (sessionId: string, record: SessionPrLink, worktree: string) => {
    if (writeError) throw writeError
    if (refuseWrite) return undefined
    writes.push({ sessionId, record, worktree })
    return record
  },
)

const recorder = spyOn(realPrLink, "rec
{"prompt_tokens":11699,"completion_tokens":4096,"total_tokens":15795,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 34bebad6-33ea-434e-8c82-2c1e72605d24]
[Messages: 2, Tokens: 15795]

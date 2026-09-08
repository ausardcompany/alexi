```markdown
# Update Plan for Alexi

Generated: 2026-09-08
Based on upstream commits: kilocode 1a5ee1882..a7a7690ca (153 commits), opencode 57ef382..d6855b6 (4 commits)

## Summary
- Total changes planned: 12
- Critical: 1 | High: 4 | Medium: 5 | Low: 2

## Analysis Scope
This plan focuses on changes relevant to Alexi's architecture:
- **Tool system** (`packages/opencode/src/kilocode/tool/`) → maps to `src/tool/`
- **Agent system** (`packages/opencode/src/kilocode/agent/`) → maps to `src/agent/`
- **Core session/DB** (`packages/core/src/`) → maps to `src/core/`
- **CLI** (`packages/opencode/src/cli/`) → maps to `src/cli/`

Kilo VSCode UI, i18n, visual regressions, docs, and JetBrains changes are **excluded** as Alexi is a CLI/SAP-integrated tool without VSCode webviews.

## Changes

---

### 1. Add DB migration for model-usage step-finish index
**File**: `src/core/database/migration/20260907102000_model_usage_index.ts` (new)
**Priority**: high
**Type**: feature (performance)
**Reason**: Upstream adds a partial index on `part(session_id)` filtered to `step-finish` rows. This dramatically speeds up cold session loading and model-usage aggregation queries — visible in kilocode commit `66053ef65 fix(session): speed up cold session loading`. Alexi's session listing/model-usage lookups will benefit identically.

**New code**:
```typescript
import { Effect } from "effect"
import type { DatabaseMigration } from "../migration"

export default {
  id: "20260907102000_model_usage_index",
  up(tx) {
    return Effect.gen(function* () {
      yield* tx.run(
        `CREATE INDEX \`part_session_step_finish_idx\` ON \`part\` (\`session_id\`) ` +
        `WHERE json_valid("part"."data") AND json_extract("part"."data", '$.type') = 'step-finish';`,
      )
    })
  },
} satisfies DatabaseMigration.Migration
```

**Also update** `src/core/database/migration.gen.ts` to register:
```typescript
import("./migration/20260907102000_model_usage_index"),
```

---

### 2. Register `open-plan` tool
**File**: `src/tool/open-plan.ts` (new)
**Priority**: high
**Type**: feature
**Reason**: Upstream commit `6024a76db feat(vscode): open agent-created plans` and `325656483 fix(vscode): scope plan opens to active session` introduce a new tool that lets agents surface plan markdown files to the host. For Alexi's CLI, this becomes a "notify plan-ready" hook that emits a bus event / prints the plan path so downstream tooling can open it.

**New code** (adapted for CLI — no VSCode dep):
```typescript
import { z } from "zod"
import { Tool } from "./tool"
import * as path from "node:path"
import * as fs from "node:fs/promises"

export const OpenPlanTool = Tool.define("open-plan", {
  description: "Signal that an agent-authored plan file is ready for review.",
  parameters: z.object({
    path: z.string().describe("Absolute or workspace-relative path to the plan markdown file"),
    title: z.string().optional().describe("Optional human-readable title"),
  }),
  async execute(params, ctx) {
    const resolved = path.isAbsolute(params.path)
      ? params.path
      : path.resolve(ctx.sessionID ? ctx.cwd ?? process.cwd() : process.cwd(), params.path)

    // Guard: only allow plan files (dedupe upstream applied via commit 15041d024)
    const stat = await fs.stat(resolved).catch(() => null)
    if (!stat || !stat.isFile()) {
      throw new Error(`Plan file not found: ${resolved}`)
    }
    if (!resolved.endsWith(".md")) {
      throw new Error(`Plan must be a markdown file: ${resolved}`)
    }

    // Emit event for CLI listeners / SAP integration to consume
    ctx.bus?.publish("plan.opened", {
      sessionID: ctx.sessionID,
      path: resolved,
      title: params.title,
    })

    return {
      path: resolved,
      title: params.title ?? path.basename(resolved),
    }
  },
})
```

**Also update** `src/tool/registry.ts`:
```typescript
// before
import { AgentManagerTool } from "./agent-manager"
// ...
export const tools = [ /* ... */, AgentManagerTool ]

// after
import { AgentManagerTool } from "./agent-manager"
import { OpenPlanTool } from "./open-plan"
// ...
export const tools = [ /* ... */, AgentManagerTool, OpenPlanTool ]
```

---

### 3. Add test for `open-plan` tool
**File**: `src/tool/open-plan.test.ts` (new)
**Priority**: medium
**Type**: feature (test coverage)
**Reason**: Mirrors upstream `packages/opencode/test/kilocode/tool/open-plan.test.ts` (+68 lines).

**New code**:
```typescript
import { describe, it, expect, vi } from "vitest"
import { OpenPlanTool } from "./open-plan"
import * as fs from "node:fs/promises"
import * as os from "node:os"
import * as path from "node:path"

describe("OpenPlanTool", () => {
  it("resolves relative paths against cwd and emits plan.opened", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "alexi-plan-"))
    const planPath = path.join(dir, "plan.md")
    await fs.writeFile(planPath, "# plan")

    const publish = vi.fn()
    const result = await OpenPlanTool.execute(
      { path: "plan.md", title: "Test" },
      { sessionID: "s1", cwd: dir, bus: { publish } } as any,
    )

    expect(result.path).toBe(planPath)
    expect(publish).toHaveBeenCalledWith("plan.opened", expect.objectContaining({ sessionID: "s1" }))
  })

  it("rejects non-markdown files", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "alexi-plan-"))
    const bad = path.join(dir, "plan.txt")
    await fs.writeFile(bad, "x")
    await expect(
      OpenPlanTool.execute({ path: bad }, { cwd: dir } as any),
    ).rejects.toThrow(/markdown/)
  })

  it("rejects missing files", async () => {
    await expect(
      OpenPlanTool.execute({ path: "/nonexistent/plan.md" }, {} as any),
    ).rejects.toThrow(/not found/)
  })
})
```

---

### 4. Update `agent-manager` tool with source-session routing
**File**: `src/tool/agent-manager.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream commits `a1c674ada feat(agent-manager): route peer replies to source sessions` and `b1742663c feat(agent-manager): attribute cross-session messages` add a `sourceSessionID` field to protocol messages so peer replies land in the originating session. This is critical for multi-agent swarm correctness and prevents self-messaging (`4e2b7a035`).

**Current code** (approximate):
```typescript
export const AgentManagerTool = Tool.define("agent-manager", {
  parameters: z.object({
    targetAgent: z.string(),
    message: z.string(),
  }),
  async execute({ targetAgent, message }, ctx) {
    await ctx.agentManager.send({ to: targetAgent, message })
  },
})
```

**New code**:
```typescript
export const AgentManagerTool = Tool.define("agent-manager", {
  parameters: z.object({
    targetAgent: z.string(),
    message: z.string(),
    sourceSessionID: z.string().optional()
      .describe("Session that originated this message; replies route back here"),
  }),
  async execute({ targetAgent, message, sourceSessionID }, ctx) {
    // Prevent swarm self-messaging (upstream fix 4e2b7a035)
    if (targetAgent === ctx.agentID) {
      throw new Error("Agent cannot message itself")
    }
    await ctx.agentManager.send({
      to: targetAgent,
      message,
      sourceSessionID: sourceSessionID ?? ctx.sessionID,
    })
  },
})
```

**Also update** `src/tool/agent-manager.txt` (description text):
```diff
+ Replies from the target agent will be routed back to the sourceSessionID.
+ Do not target your own agent ID.
```

---

### 5. Update agent-manager protocol with routing metadata
**File**: `src/agent-manager/protocol.ts` (or equivalent — `src/agent/manager/protocol.ts`)
**Priority**: high
**Type**: feature
**Reason**: Corresponds to upstream `packages/opencode/src/kilocode/agent-manager/protocol.ts` (+7, -3). Adds optional `sourceSessionID` to the message envelope.

**Current code**:
```typescript
export interface AgentMessage {
  to: string
  message: string
  timestamp: number
}
```

**New code**:
```typescript
export interface AgentMessage {
  to: string
  message: string
  timestamp: number
  /** Session that originated this message; replies should route back here. */
  sourceSessionID?: string
  /** True if this message was auto-generated (e.g. PR check feedback). */
  automated?: boolean
}
```

---

### 6. Guard route-recovery metadata
**File**: `src/agent-manager/routing.ts` (or wherever peer-reply routing lives)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream `34334efd7 fix(agent-manager): guard route recovery metadata` — defensive checks when the source session no longer exists.

**New code** (add helper):
```typescript
export function resolveReplyTarget(
  msg: AgentMessage,
  currentAgentID: string,
  sessionExists: (id: string) => boolean,
): string | undefined {
  const target = msg.sourceSessionID
  if (!target) return undefined
  if (target === currentAgentID) return undefined // no self-loop
  if (!sessionExists(target)) return undefined     // guard stale route
  return target
}
```

---

### 7. Session listing: don't crash when scoping fails
**File**: `src/cli/cmd/session.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream `627501673 fix(cli): list sessions across all projects instead of crashing` — one-line but critical regression fix. `session list` previously crashed on multi-project workspaces.

**Current code** (approximate):
```typescript
const sessions = await Session.list({ projectID: currentProject.id })
```

**New code**:
```typescript
// List across all projects when no project scope is available or requested
const sessions = currentProject
  ? await Session.list({ projectID: currentProject.id })
  : await Session.list({}) // all projects
```

---

### 8. `run` command: nonzero exit on empty assistant response
**File**: `src/cli/cmd/run.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream `c5b6ccf7d fix(opencode): exit nonzero when run produces no assistant message (#13832)` — important for CI/scripting re
{"prompt_tokens":23250,"completion_tokens":4096,"total_tokens":27346,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: fbb56fdd-eb2e-45ab-9bf7-66e984c7d773]
[Messages: 2, Tokens: 27346]

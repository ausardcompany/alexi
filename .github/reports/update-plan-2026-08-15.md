# Update Plan for Alexi

Generated: 2026-08-15
Based on upstream commits analyzed:
- kilocode: 67cda85c9..c8271ad6f (116 commits)
- opencode: e23586a..4643e65 (1 commit)

## Summary
- Total changes planned: 12
- Critical: 2 | High: 5 | Medium: 3 | Low: 2

## Changes

### 1. Enable web search for the `opencode-go` provider
**File**: `src/tool/registry.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream `opencode` PR #42630 fixes web search enablement for the Go OpenCode provider. Alexi should mirror this so that any OpenCode-family provider used via the wrapper receives websearch. Both `kilocode` and `opencode` upstreams shipped equivalent changes.

**Current code**:
```typescript
export function webSearchEnabled(providerID: ProviderV2.ID, flags = { exa: false, parallel: false }) {
  return providerID === ProviderV2.ID.opencode || flags.exa || flags.parallel
}
```

**New code**:
```typescript
export function webSearchEnabled(providerID: ProviderV2.ID, flags = { exa: false, parallel: false }) {
  return (
    providerID === ProviderV2.ID.opencode ||
    providerID === ProviderV2.ID.make("opencode-go") ||
    flags.exa ||
    flags.parallel
  )
}
```

Also update tests in `src/tool/__tests__/websearch.test.ts` (or the Alexi-equivalent):

**New test case**:
```typescript
test("is enabled for OpenCode providers or explicit websearch provider flags", () => {
  expect(webSearchEnabled(ProviderV2.ID.opencode, { exa: false, parallel: false })).toBe(true)
  expect(webSearchEnabled(ProviderV2.ID.make("opencode-go"), { exa: false, parallel: false })).toBe(true)
  expect(webSearchEnabled(ProviderV2.ID.openai, { exa: false, parallel: false })).toBe(false)
  expect(webSearchEnabled(ProviderV2.ID.openai, { exa: true, parallel: false })).toBe(true)
  expect(webSearchEnabled(ProviderV2.ID.openai, { exa: false, parallel: true })).toBe(true)
})
```

---

### 2. Fix-closed guard for unit test database path
**File**: `src/core/__tests__/preload.ts` (or Alexi's test preload entrypoint)
**Priority**: critical
**Type**: security
**Reason**: Upstream added a "fail closed" assertion so unit tests cannot accidentally write to a real user database. This is particularly important for Alexi's SAP AI Core deployment where CI runners may have persistent state. The env variable is read at flag-import time, so the assertion must come *after* the env writes.

**Current code**:
```typescript
import path from "path"

process.env.KILO_DB = ":memory:"
process.env.KILO_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
process.env.KILO_DISABLE_MODELS_FETCH = "true"
```

**New code**:
```typescript
import path from "path"

process.env.KILO_DB = ":memory:"
process.env.KILO_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
process.env.KILO_DISABLE_MODELS_FETCH = "true"

// Fail closed: unit tests do not redirect XDG dirs, so KILO_DB is the only thing
// keeping them off the real ~/.local/share/kilo database. Verify the resolved path
// (env is read at flag import time, so this must stay AFTER the env writes above).
const { Database } = await import("../src/database/database")
const resolved = Database.path()
if (resolved !== ":memory:") {
  throw new Error(`unit test preload: database path must resolve to ":memory:", got "${resolved}"`)
}
```

---

### 3. Preserve Code agent when switching from Ask
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream kilocode commit `e2966abcb` fixes an issue where switching from Ask agent lost the Code agent context. Alexi's agent switching must respect this to prevent surprising context loss for SAP customers.

**Investigation**: Inspect `packages/opencode/src/kilocode/agent/index.ts` (+42/-19) and mirror the same logic. Look for `switchAgent`, `setAgent`, or `previousAgent` fields and ensure that after switching from Ask, the returned agent is the previously active Code agent (not defaulted back).

**Pattern to add** (adapt to Alexi structure):
```typescript
// When switching away from Ask, restore the pre-Ask agent
// instead of resetting to default.
export function switchAgent(current: Agent, next: AgentID): Agent {
  if (current.id === "ask" && next !== "ask") {
    // Restore the caller's previous non-Ask agent when available.
    return restorePreviousAgent(current) ?? getAgentById(next)
  }
  return getAgentById(next)
}
```

Add ask→code switch reminder text (mirrored from `packages/opencode/src/kilocode/session/ask-code-switch.txt`):
```
The user has switched from the Ask agent to a Code agent.
You may now propose file edits and run tools that were previously read-only.
```

Wire into `src/session/reminders.ts` (see change #4).

---

### 4. Add ask→code switch reminder wiring
**File**: `src/session/reminders.ts`
**Priority**: high
**Type**: feature
**Reason**: Complementary to change #3. Upstream added +13/-3 in `session/reminders.ts` for this flow, plus a new test suite `test/kilocode/ask-switch-reminder.test.ts` (247 lines). This surfaces a system reminder to the model when the user switches out of Ask.

**New code** (append):
```typescript
import askCodeSwitchTxt from "./ask-code-switch.txt" with { type: "text" }

export function reminderForAgentSwitch(from: AgentID, to: AgentID): string | undefined {
  if (from === "ask" && isCodeAgent(to)) {
    return askCodeSwitchTxt
  }
  return undefined
}

// In the main reminder assembly:
const switchReminder = reminderForAgentSwitch(previousAgentId, currentAgentId)
if (switchReminder) reminders.push({ role: "system", content: switchReminder })
```

---

### 5. Fix memory auto-save parsing SSE as JSON
**File**: `src/memory/commands.ts` (or Alexi's memory subsystem)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `c34a2a3a4` fixes memory auto-save incorrectly parsing an SSE stream as a single JSON object. This can corrupt memory writes when Alexi's SAP AI Core provider streams responses.

**Current pattern to look for**:
```typescript
const body = await response.text()
const parsed = JSON.parse(body)   // ← breaks on SSE
```

**New pattern**:
```typescript
const contentType = response.headers.get("content-type") ?? ""
if (contentType.includes("text/event-stream")) {
  // Consume SSE and extract the final data payload
  const events = await parseSSE(response)
  const final = events.findLast((e) => e.event === "done" || e.data)
  parsed = final ? JSON.parse(final.data) : null
} else {
  parsed = JSON.parse(await response.text())
}
```

Add matching test cases per `packages/kilo-memory/test/command-cases.json` (+27 lines).

---

### 6. Preserve existing text when selecting slash command at start
**File**: `src/cli/prompt-input.ts` (or Alexi's CLI equivalent — Alexi has no webview)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream PR #11728 fixes slash-command selection wiping out already-typed text. Alexi's CLI slash-command handler likely has the same issue. Original code replaces the entire prompt buffer instead of only the slash-prefix segment.

**Current code (typical pattern)**:
```typescript
function onSlashCommandSelect(cmd: SlashCommand, buffer: string) {
  return `/${cmd.name} `
}
```

**New code**:
```typescript
function onSlashCommandSelect(cmd: SlashCommand, buffer: string): string {
  // Preserve trailing text after the slash-token when user has typed further.
  const match = buffer.match(/^\/(\S*)(\s.*)?$/)
  const trailing = match?.[2] ?? ""
  return `/${cmd.name}${trailing.length > 0 ? trailing : " "}`
}
```

Corresponding tests mirror `packages/kilo-vscode/tests/unit/use-slash-command.test.ts` (+233 lines).

---

### 7. Persist installed agent removal / avoid eager reload
**File**: `src/agent/removal.ts` (new) and `src/agent/registry.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream PR #12542 (kilocode `bfeb3ae01` + `5d713f7d9`) fixes a bug where removed agents came back after reload. Alexi persists agents to disk for SAP AI Core custom agents — this bug likely applies.

**New file** `src/agent/removal.ts`:
```typescript
import path from "path"
import fs from "fs/promises"
import { Env } from "../core/env"

const REMOVED_FILE = () => path.join(Env.Service.dataDir(), "agents.removed.json")

export async function markAgentRemoved(agentId: string): Promise<void> {
  const removed = await readRemoved()
  if (!removed.includes(agentId)) {
    removed.push(agentId)
    await fs.writeFile(REMOVED_FILE(), JSON.stringify(removed, null, 2), "utf8")
  }
}

export async function isAgentRemoved(agentId: string): Promise<boolean> {
  const removed = await readRemoved()
  return removed.includes(agentId)
}

async function readRemoved(): Promise<string[]> {
  try {
    return JSON.parse(await fs.readFile(REMOVED_FILE(), "utf8"))
  } catch {
    return []
  }
}
```

**In `src/agent/registry.ts`** — filter loads by the removal list, and skip eager reload after removal:
```typescript
async function loadAgents(): Promise<Agent[]> {
  const all = await scanAgentDirs()
  const filtered: Agent[] = []
  for (const a of all) {
    if (!(await isAgentRemoved(a.id))) filtered.push(a)
  }
  return filtered
}

export async function removeAgent(agentId: string): Promise<void> {
  await markAgentRemoved(agentId)
  // Do NOT call loadAgents() eagerly — let the next natural refresh pick it up.
  registryCache.delete(agentId)
}
```

---

### 8. Resolve web-search config via Env.Service instead of process.env
**File**: `src/tool/websearch.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Upstream `2aa10017c` migrated websearch config lookup from raw `process.env` to `Env.Service` for testability and SAP-configurable environments. Aligns Alexi with the standard config injection pattern already used elsewhere.

**Current code**:
```typescript
const exaKey = process.env.EXA_API_KEY
const
{"prompt_tokens":22839,"completion_tokens":4096,"total_tokens":26935,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: a4f23346-26a7-4ff4-9bde-98f804f085b5]
[Messages: 2, Tokens: 26935]

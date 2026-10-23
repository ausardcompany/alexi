# Execution Task: Apply Update Plan to Alexi

You are an expert software developer. Your task is to execute the update plan below precisely.

## Update Plan to Execute

```markdown
# Update Plan for Alexi

Generated: 2026-10-23
Based on upstream commits analyzed:
- kilocode: 4481e06d8..4130f7a6e (56 commits)
- opencode: f7d5b6f..2a3e7c0 (74 commits)

## Summary
- Total changes planned: 12
- Critical: 2 | High: 4 | Medium: 4 | Low: 2

## Key Themes Identified

1. **Security hardening** — URL scheme validation for `open()` calls (kilocode CVE fix for `ms-msdt:`, `file://`, `javascript:` URLs via `open` package)
2. **MCP improvements** — OAuth telemetry, OAuth callback hardening, parallel shutdown, idle-timeout handling, non-object output schemas, duplicate server dedup, elicitation forms
3. **Session compaction** — Background (precompute) compaction, buffer safeguards, oldest-first shortening
4. **Session runner** — Fallback to agent's model when session lacks one, context overflow error detection
5. **Provider refactors** — ChatGPT context caps extracted into separate plugin, Codex model filtering
6. **Agent file parsing** — V2 field detection, better unsupported-field warnings

---

## Changes

### 1. Add URL scheme validation helper for browser `open()` calls
**File**: `src/core/open.ts` (new file)
**Priority**: critical
**Type**: security
**Reason**: Backport of kilocode security fix (commit `82926fb30`, upstream also hardens `open` to v11.0.4). Prevents attackers from supplying `file://`, `javascript:`, `ms-msdt:`, or UNC-style payloads that would execute via the browser-opener protocol handler. Any place in Alexi that passes external URLs (OAuth callbacks, MCP sign-in redirects, docs links) to `open` must route through this helper.

**New code**:
```typescript
// src/core/open.ts
// Backport of upstream browser URL validation (kilocode #15383, opencode mcp/browser.ts).
import open from "open"

export function openUrl(input: string): Promise<ReturnType<typeof open>> {
  const url = URL.canParse(input) ? new URL(input) : undefined
  if (!url || (url.protocol !== "http:" && url.protocol !== "https:")) {
    return Promise.reject(
      new Error(`Only http and https links can be opened in the browser: ${input}`),
    )
  }
  return open(url.href)
}
```

**Test file**: `src/core/open.test.ts`
```typescript
import { describe, expect, test } from "bun:test"
import { openUrl } from "./open"

describe("openUrl", () => {
  test("rejects values that are not URLs", async () => {
    for (const input of ["not a url", ""]) {
      const err = await openUrl(input).catch((e: unknown) => e)
      expect(err).toMatchObject({ message: expect.stringContaining("Only http and https links") })
    }
  })

  test("rejects non-http schemes", async () => {
    for (const input of [
      "file:///etc/hosts",
      "javascript:alert(1)",
      "ms-msdt:/id PCWDiagnostic",
      "\\\\server\\share\\file.html",
    ]) {
      const err = await openUrl(input).catch((e: unknown) => e)
      expect(err).toMatchObject({ message: expect.stringContaining("Only http and https links") })
    }
  })
})
```

---

### 2. Route all existing `open()` call sites through `openUrl`
**File**: `src/cli/**/*.ts`, `src/mcp/**/*.ts`, any other callers of the `open` package
**Priority**: critical
**Type**: security
**Reason**: Companion to change #1. The helper is useless unless every `import open from "open"` is replaced. Audit all call sites with `rg "from \"open\"" src/`.

**Current code** (example pattern):
```typescript
import open from "open"
// ...
await open(authorizationUrl)
```

**New code**:
```typescript
import { openUrl } from "../core/open"
// ...
await openUrl(authorizationUrl)
```

**Audit checklist**:
- MCP OAuth sign-in redirect (`src/mcp/oauth-provider.ts` or equivalent)
- Browser-based auth flows (`src/cli/auth.ts`)
- Any "open docs" / "open dashboard" commands
- SAP AI Core login redirect if applicable (verify SAP SSO URL ultimately resolves to https:)

---

### 3. Bump `open` dependency to 11.0.4
**File**: `package.json`
**Priority**: critical
**Type**: security
**Reason**: Transitive-dep vulnerability fix (kilocode #15383, commits `44b21a719`, `ca265eef5`). Older `open` versions did not validate URL schemes.

**Current code**:
```json
"open": "^10.x.x"  // or whatever the current pin is
```

**New code**:
```json
"open": "11.0.4"
```

Also add an override to force transitive dependencies to the fixed version:
```json
"overrides": {
  "open": "11.0.4"
},
"pnpm": {
  "overrides": {
    "open": "11.0.4"
  }
}
```

---

### 4. Use agent's model when session has none
**File**: `src/session/runner/model.ts` (or equivalent runner)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream opencode fix `4d30794` — when a session was created without an explicit model (e.g. created via API), subsequent runs crashed. Fallback to the agent's configured model. Important for SAP AI Core integration where sessions may be created programmatically.

**Current code** (approximate):
```typescript
const model = session.model
if (!model) throw new Error("Session has no model")
```

**New code**:
```typescript
const model = session.model ?? agent.model
if (!model) {
  throw new Error(`Session ${session.id} and agent ${agent.name} both lack a model`)
}
```

---

### 5. Recognize additional context-overflow error patterns
**File**: `src/providers/*/error-handling.ts` (or wherever context errors are mapped)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream opencode `09a1db3` broadens error detection so compaction triggers correctly on more providers. Relevant for SAP AI Core which may surface overflow with provider-specific wording.

**New code** (add to context-overflow matcher):
```typescript
const CONTEXT_OVERFLOW_PATTERNS = [
  /context[_ ]length/i,
  /maximum context/i,
  /token.{0,20}limit/i,
  /prompt is too long/i,
  /input is too long/i,
  // Added from upstream:
  /exceeds.{0,20}context window/i,
  /request.{0,20}too large/i,
  /reduce the length/i,
]

export function isContextOverflow(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return CONTEXT_OVERFLOW_PATTERNS.some((re) => re.test(msg))
}
```

---

### 6. MCP server shutdown — parallelize + dedup on initial reconciliation
**File**: `src/mcp/index.ts` (or server registry)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream opencode fixes `7b14ad4` (parallel shutdown) and `8ecd6ad` (prevent duplicate-start during initial reconciliation). Avoids multi-second shutdowns and duplicated MCP processes when config observers fire during startup.

**Current code** (approximate):
```typescript
async function shutdown() {
  for (const server of servers.values()) {
    await server.stop()
  }
}
```

**New code**:
```typescript
async function shutdown() {
  await Promise.allSettled(
    Array.from(servers.values()).map((s) => s.stop()),
  )
}

// Dedup starts during reconciliation:
const starting = new Map<string, Promise<MCPServer>>()
async function ensureStarted(id: string, config: MCPConfig): Promise<MCPServer> {
  const existing = servers.get(id)
  if (existing) return existing
  let pending = starting.get(id)
  if (pending) return pending
  pending = startServer(id, config).finally(() => starting.delete(id))
  starting.set(id, pending)
  return pending
}
```

---

### 7. Keep MCP OAuth login waiting after stray callback requests
**File**: `src/mcp/oauth-callback.ts` (or equivalent)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream opencode `309522f`. Stray/favicon requests to the callback server were resolving the login promise prematurely. Only resolve on a request that actually contains `code` or `error` query parameters.

**Current code** (approximate):
```typescript
server.on("request", (req, res) => {
  const url = new URL(req.url!, "http://localhost")
  resolve(url.searchParams.get("code"))
  res.end("ok")
})
```

**New code**:
```typescript
server.on("request", (req, res) => {
  const url = new URL(req.url!, "http://localhost")
  const code = url.searchParams.get("code")
  const error = url.searchParams.get("error")
  if (!code && !error) {
    // Stray request (favicon, probe, prefetch) — ignore, keep waiting.
    res.writeHead(404)
    res.end()
    return
  }
  if (error) {
    reject(new Error(`OAuth error: ${error}`))
  } else {
    resolve(code!)
  }
  res.writeHead(200, { "content-type": "text/html" })
  res.end("<html><body>You can close this tab.</body></html>")
})
```

---

### 8. Accept MCP tools with non-root-object output schemas
**File**: `src/mcp/client.ts` or tool-schema normalizer
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream opencode `c41c3a0`. Some MCP servers return union/array/primitive output schemas; previous code required a root `type: "object"`. This broke tool loading entirely for those servers.

**New code**:
```typescript
function normalizeOutputSchema(schema: unknown): JSONSchema | undefined {
  if (!schema || typeof schema !== "object") return undefined
  // Previously: required (schema as any).type === "object"
  // Now: accept any valid JSON schema node; wrap non-object roots so
  // downstream code that expects .properties can still function.
  const s = schema as JSONSchema
  if (s.type === "object" || s.properties) return s
  // Wrap unions/arrays/primitives so our runtime has a stable shape.
  return { type: "object", properties: { result: s }, required: ["result"] }
}
```

---

### 9. Keep remote MCP requests open past Bun's fetch idle timeout
**File**: `src/mcp/client.ts` (HTTP transport)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream opencode `e49157b`. Bun 1.4.x enforces a fetch idle timeout that kills long-running MCP streaming requests. Set `signal`/`idleTimeout: 0` or use a persistent abort controller.

**New code**:
```typescript
async function callRemoteMcp(url: string, body: unknown) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    // Bun-specific: disable idle timeout for streaming MCP sessions.
    // @ts-expect-error — Bun extension
    idleTimeout: 0,
  })
}
```

---

### 10. Compaction — oldest-first shortening and empty-buffer guard
**
{"prompt_tokens":32961,"completion_tokens":4096,"total_tokens":37057,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 4000bf53-4ccc-49a9-b5f5-f7031c41469a]
[Messages: 2, Tokens: 37057]

## Execution Instructions

1. **Execute each change** in the plan above in order of priority (critical → high → medium → low)
2. **Make exact code changes** as specified in the plan
3. **Maintain SAP AI Core compatibility** - do not break existing integrations
4. **Follow existing code style** in this repository
5. **Create changes summary** at `.github/reports/changes-summary.md` with:
   - List of files modified
   - Summary of each change made
   - Any issues encountered

## Important

- Do NOT skip any items in the plan
- Do NOT add extra changes not in the plan
- Do NOT ask questions - just execute
- If a file doesn't exist, create it
- If code context is unclear, use your best judgment based on the plan

Execute the entire plan now.

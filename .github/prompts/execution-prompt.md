# Execution Task: Apply Update Plan to Alexi

You are an expert software developer. Your task is to execute the update plan below precisely.

## Update Plan to Execute

# Update Plan for Alexi

Generated: 2026-10-25
Based on upstream commits analyzed:
- `82926fb30` - fix(cli): restrict browser and MCP OAuth URLs to HTTP(S)
- `44b21a719` - fix(deps): override transitive open versions
- `ca265eef5` - chore(deps): bump open to 11.0.4
- `c7b9c3696` - fix(cli): block compromised eMudhra certificates
- `7e789bbee` / `df98111b3` / `60f1ad7f1` / `df43b6526` - MCP sign-in telemetry hardening
- `432462088` / `70354f039` - fix(cli): MCP SSE probe scoped to stream request and redirects
- `ef2f6d9c7` - chore(deps): MCP TypeScript SDK updated due dependabot alerts (1.32.1)
- `5f2aa0b32` - chore(deps): DOMPurify updated due dependabot alerts
- `0377248fb` - chore(deps): vite updated due launch-editor dependabot alerts

## Summary
- Total changes planned: 7
- Critical: 2 | High: 3 | Medium: 2 | Low: 0

The predominant upstream theme in this window is **security hardening** (URL scheme validation to prevent exploits like `ms-msdt:` / `javascript:` / `file://` abuse, MCP SSE probe scoping, OAuth URL restrictions, and MCP SDK bump for CVE patches). The core change is a tiny-but-important `openUrl` wrapper added to `packages/core/src/open.ts`.

## Changes

### 1. Add URL scheme validation wrapper (`openUrl`)
**File**: `src/core/open.ts` (new file)
**Priority**: critical
**Type**: security
**Reason**: Backports the upstream security fix from commit `82926fb30`. Prevents browser invocation of dangerous URL schemes (`file://`, `javascript:`, `ms-msdt:`, UNC paths) which can lead to local file disclosure, XSS, or RCE (e.g., CVE-2022-30190 "Follina" style exploits). Any code path in Alexi that opens a URL in a user's browser (OAuth callbacks, documentation links, MCP sign-in redirects) MUST route through this helper.

**New code**:
```typescript
// src/core/open.ts
// Backport of upstream kilocode security fix: restrict browser URLs to http(s) only.
// Prevents invocation of dangerous schemes (file://, javascript:, ms-msdt:, UNC paths).
import open from "open"

export function openUrl(input: string): Promise<unknown> {
  const url = URL.canParse(input) ? new URL(input) : undefined
  if (!url || (url.protocol !== "http:" && url.protocol !== "https:")) {
    return Promise.reject(
      new Error(`Only http and https links can be opened in the browser: ${input}`),
    )
  }
  return open(url.href)
}
```

**Test file**: `src/core/__tests__/open.test.ts` (new)
```typescript
import { describe, expect, test } from "vitest" // or bun:test if applicable
import { openUrl } from "../open"

describe("openUrl", () => {
  test("rejects values that are not URLs", async () => {
    for (const input of ["not a url", ""]) {
      await expect(openUrl(input)).rejects.toThrow(/Only http and https links/)
    }
  })

  test("rejects non-http schemes", async () => {
    const dangerous = [
      "file:///etc/hosts",
      "javascript:alert(1)",
      "ms-msdt:/id PCWDiagnostic",
      "\\\\server\\share\\file.html",
    ]
    for (const input of dangerous) {
      await expect(openUrl(input)).rejects.toThrow(/Only http and https links/)
    }
  })

  test("accepts http(s) URLs", () => {
    // smoke test — don't actually open; just verify no sync reject
    expect(URL.canParse("https://example.com")).toBe(true)
  })
})
```

---

### 2. Add `open` dependency and route all browser launches through `openUrl`
**File**: `package.json`
**Priority**: critical
**Type**: security
**Reason**: Required dependency for the new wrapper. Also pins `open` to `11.0.4` which addresses transitive vulnerabilities (upstream `44b21a719`).

**Current code**:
```json
"dependencies": {
  // ...existing deps...
}
```

**New code**:
```json
"dependencies": {
  "open": "11.0.4",
  // ...existing deps...
},
"overrides": {
  "open": "11.0.4"
}
```

Then **audit and migrate** every `import open from "open"` or `child_process.exec("start"|"xdg-open"|"open" ...)` call site:

**Before (anywhere a URL is opened)**:
```typescript
import open from "open"
await open(someUrl)
```

**After**:
```typescript
import { openUrl } from "@/core/open"
await openUrl(someUrl)
```

Likely call sites to audit in Alexi:
- `src/cli/` — any `--open` / documentation / login flows
- `src/providers/` — SAP AI Core console / auth redirect helpers
- `src/router/` — OAuth callback handling for MCP

---

### 3. Harden MCP OAuth callback URLs
**File**: `src/router/mcp/oauth-callback.ts` (or equivalent — mirrors upstream `packages/opencode/src/mcp/oauth-callback.ts`)
**Priority**: critical
**Type**: security
**Reason**: Upstream `82926fb30` also restricts MCP OAuth redirect/authorization URLs to http(s). An attacker-controlled MCP server could otherwise supply `javascript:` or `file:` authorization URLs that would execute on callback open.

**Current code** (illustrative):
```typescript
import open from "open"

export async function startMcpOAuth(authorizationUrl: string) {
  await open(authorizationUrl)
  // ...
}
```

**New code**:
```typescript
import { openUrl } from "@/core/open"

export async function startMcpOAuth(authorizationUrl: string) {
  // Reject non-http(s) authorization URLs supplied by the MCP server
  await openUrl(authorizationUrl)
  // ...
}
```

Also validate on receipt (defense in depth):
```typescript
function assertHttpUrl(input: string, label: string): URL {
  if (!URL.canParse(input)) throw new Error(`${label} is not a valid URL`)
  const url = new URL(input)
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${label} must use http or https: ${input}`)
  }
  return url
}
```

---

### 4. Scope MCP SSE probe to stream request & its redirect hops
**File**: `src/router/mcp/sse-probe.ts` (equivalent to upstream `packages/opencode/src/kilocode/mcp/sse-probe.ts`)
**Priority**: high
**Type**: bugfix
**Reason**: Commits `432462088` and `70354f039` fix a bug where the SSE probe's fetch instrumentation leaked across unrelated fetches when the MCP SDK followed redirects. Must scope the probe to the exact stream request URL (plus observed redirect hops) and tear down the hook afterward.

**New code** (conceptual pattern — adapt to Alexi's probe implementation):
```typescript
export async function probeSseEndpoint(initialUrl: string, opts: { signal?: AbortSignal } = {}) {
  const visited = new Set<string>([initialUrl])
  const originalFetch = globalThis.fetch

  const scopedFetch: typeof fetch = async (input, init) => {
    const reqUrl = typeof input === "string" ? input : input instanceof URL ? input.href : input.url
    if (!visited.has(reqUrl)) {
      // Not our probe traffic — pass through untouched
      return originalFetch(input, init)
    }
    const res = await originalFetch(input, init)
    // Record redirect hops so follow-ups stay scoped
    if (res.redirected && res.url) visited.add(res.url)
    return res
  }

  globalThis.fetch = scopedFetch
  try {
    return await doProbe(initialUrl, opts)
  } finally {
    globalThis.fetch = originalFetch
  }
}
```

Add a regression test mirroring `packages/opencode/test/kilocode/mcp-sse-probe.test.ts`:
```typescript
test("probe does not intercept unrelated fetches", async () => {
  // start probe for URL A, concurrently fetch URL B, assert B was unmodified
})

test("probe follows redirect chain", async () => {
  // Server returns 302 → final SSE endpoint; assert probe stays attached
})
```

---

### 5. Bump MCP TypeScript SDK to 1.32.1
**File**: `package.json`
**Priority**: high
**Type**: security
**Reason**: Upstream `ef2f6d9c7` bumps `@modelcontextprotocol/sdk` from `1.31.0` → `1.32.1` for dependabot alerts. Alexi should match to pick up upstream security fixes.

**Current code**:
```json
"@modelcontextprotocol/sdk": "1.31.0"
```

**New code**:
```json
"@modelcontextprotocol/sdk": "1.32.1"
```

Also check for and port the companion patch:
`patches/@modelcontextprotocol%2Fsdk@1.32.1.patch` (31 insertions / 31 deletions in upstream) — if Alexi applies the same patch, rename and update.

---

### 6. Bump DOMPurify (if used) and Vite
**File**: `package.json`
**Priority**: medium
**Type**: security
**Reason**: Dependabot-driven security bumps in upstream (`5f2aa0b32`, `0377248fb`). DOMPurify 3.4.17 patches XSS bypasses; Vite update patches `launch-editor` transitive advisories. Only applies if Alexi consumes these (web UI / dev server).

**New code** (apply only if dependency is present):
```json
"dompurify": "3.4.17",
"vite": "7.3.7"
```

---

### 7. (Optional) MCP sign-in telemetry pairing
**File**: `src/router/mcp/auth-telemetry.ts` (new, if Alexi has MCP telemetry; otherwise skip)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream commits `60f1ad7f1`, `df98111b3`, `7e789bbee` ensure every MCP `sign_in_start` event is paired with a `sign_in_complete` (success | failure | interrupt | displaced) so metrics are not biased. If Alexi forwards MCP sign-in events to SAP telemetry/analytics, port the pairing logic.

**Pattern**:
```typescript
type SignInOutcome = "success" | "failure" | "interrupt" | "displaced"

class McpAuthTelemetry {
  private inflight = new Map<string, { startedAt: number; serverId: string }>()

  start(flowId: string, serverId: string) {
    // If a flow for serverId already exists, close it as "displaced"
    for (const [existingId, meta] of this.inflight) {
      if (meta.serverId === serverId) {
        this.complete(existingId, "displaced")
      }
    }
    this.inflight.set(flowId, { startedAt: Date.now(), serverId })
    emit("mcp.signin.start", { flowId, serverId })
  }

  complete(flowId: string, outcome: SignInOutcome) {
    const meta = this.inflight.get(flowId)
    if (!meta) return
    this.inflight.delete
{"prompt_tokens":11567,"completion_tokens":4096,"total_tokens":15663,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: ca7e98b4-f299-4694-bffe-b287707fc4b4]
[Messages: 2, Tokens: 15663]

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

```markdown
# Update Plan for Alexi

Generated: 2026-09-27
Based on upstream commits analyzed:
- kilocode: 7d977bce9, 5003a7dd5, 9052be104, 5fdde29a2, 5c2b46e5c, c3dd7453b
- opencode: b471c2b, a42f393, b65de4d

## Summary
- Total changes planned: 2
- Critical: 0 | High: 1 | Medium: 1 | Low: 0

## Analysis of Upstream Changes

The vast majority of changes in this diff cycle are **documentation-only** and do not require code changes in Alexi:

- **kilocode**: Only 1 file changed — `packages/kilo-docs/pages/gateway/api-reference.md` (auto-generated docs). No code changes.
- **opencode**: 58 files, but 56 are localized documentation (`packages/web/src/content/docs/*/`) linking kimaki and adding LongCat 2.5 model docs. Only 2 files have functional code changes:
  - `packages/opencode/src/mcp/browser.ts` (+5, -2) — bug fix for MCP browser launcher
  - `packages/opencode/test/mcp/browser.test.ts` (+36, -0) — corresponding tests
- Console changes (`packages/console/app/src/component/go-models.ts`, `routes/go/index.tsx`) are for opencode's model listing website, not agent runtime.

Only the **MCP browser launcher bug fix** is relevant to Alexi (assuming Alexi implements MCP support).

## Changes

### 1. Catch completed MCP browser launcher failures
**File**: `src/mcp/browser.ts` (if exists in Alexi; otherwise skip)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream opencode commit `b471c2b` fixes a race condition / error handling gap where the MCP browser launcher process could complete (exit) with a failure state that was not caught, leaving the MCP client hanging or crashing on subsequent tool invocations. This is important for reliability of MCP-based tools launched via a browser/OAuth flow.

**Current code** (typical pattern to look for in Alexi's MCP browser launcher):
```typescript
// Somewhere in browser launcher startup — the child/subprocess is spawned
// but errors on the "completed" path are not surfaced.
const child = spawn(cmd, args, { ... })
// ... only listens for stdout/stderr or `error` event, not `exit`/`close`
// with non-zero code combined with unresolved promise.
```

**New code** (apply an equivalent guard around the completion promise):
```typescript
// Wrap the launcher completion in a try/catch and surface non-zero exits.
try {
  await new Promise<void>((resolve, reject) => {
    child.once("exit", (code, signal) => {
      if (code !== 0) {
        reject(
          new Error(
            `MCP browser launcher exited with code=${code} signal=${signal ?? "none"}`,
          ),
        )
        return
      }
      resolve()
    })
    child.once("error", reject)
  })
} catch (err) {
  // Log and propagate a typed error instead of leaving the promise unresolved.
  log.warn("mcp.browser.launcher_failed", { error: String(err) })
  throw new McpBrowserLauncherError(String(err))
}
```

**Note**: If Alexi does not currently have `src/mcp/browser.ts` (i.e., MCP browser-based auth is not implemented), skip this change. Do not create the file speculatively — it would introduce dead code.

---

### 2. Add corresponding test for MCP browser launcher failure path
**File**: `test/mcp/browser.test.ts` (only if change #1 applied)
**Priority**: medium
**Type**: bugfix (test coverage)
**Reason**: Upstream added 36 lines of tests for this specific failure path. Mirroring the test ensures the regression is guarded in Alexi too.

**New code**:
```typescript
import { describe, it, expect, vi } from "vitest"
import { launchBrowserMcp } from "../../src/mcp/browser"

describe("MCP browser launcher", () => {
  it("surfaces a rejection when the launcher process exits with a non-zero code", async () => {
    const fakeSpawn = vi.fn().mockImplementation(() => {
      const handlers: Record<string, Function[]> = {}
      return {
        on: (evt: string, cb: Function) => {
          handlers[evt] ??= []
          handlers[evt].push(cb)
        },
        once: (evt: string, cb: Function) => {
          handlers[evt] ??= []
          handlers[evt].push(cb)
          // simulate immediate exit with failure
          if (evt === "exit") setTimeout(() => cb(1, null), 0)
        },
        kill: vi.fn(),
      }
    })

    await expect(
      launchBrowserMcp({ spawn: fakeSpawn as any, url: "http://localhost/x" }),
    ).rejects.toThrow(/exited with code=1/)
  })

  it("resolves cleanly on zero-exit", async () => {
    const fakeSpawn = vi.fn().mockImplementation(() => ({
      on: () => {},
      once: (evt: string, cb: Function) => {
        if (evt === "exit") setTimeout(() => cb(0, null), 0)
      },
      kill: vi.fn(),
    }))
    await expect(
      launchBrowserMcp({ spawn: fakeSpawn as any, url: "http://localhost/x" }),
    ).resolves.toBeUndefined()
  })
})
```

---

## Changes NOT Recommended

The following upstream changes are intentionally **not** ported to Alexi:

| Upstream file | Reason to skip |
|---|---|
| `packages/kilo-docs/pages/gateway/api-reference.md` | Auto-generated docs for kilocode gateway; not applicable to Alexi (SAP AI Core has its own docs). |
| `packages/web/src/content/docs/**/{ecosystem,go,zen}.mdx` (56 files) | Marketing/docs website for opencode.ai. Alexi does not maintain this docs site. |
| `packages/console/app/src/component/go-models.ts` | Model list for opencode's hosted console (LongCat 2.5 Preview). Alexi routes through SAP AI Core; provider list is governed by SAP AI Core deployments, not this console. |
| `packages/console/app/src/routes/go/index.tsx` | Same reason — hosted console UI. |

## Testing Recommendations

- If change #1 is applied, run: `npm test -- test/mcp/browser.test.ts`
- Manually verify MCP OAuth/browser-launched servers still authenticate successfully end-to-end (happy path not regressed).
- Verify that a deliberately misconfigured MCP server (e.g., non-existent binary) now produces a clear error surfaced to the caller/UI rather than hanging indefinitely.
- Run the full MCP integration test suite if present.

## Potential Risks

- **Risk if change #1 is applied without verifying Alexi has an MCP browser launcher**: Introduces dead/untested code. **Mitigation**: Grep for `mcp/browser` or "browser launcher" in `src/` first; only apply if the module exists.
- **Risk of behavior change**: Previously silent launcher failures will now throw. Any caller that relied on "fire-and-forget" semantics may see new errors surfaced. **Mitigation**: Wrap call sites that intentionally ignore launcher outcomes with `.catch(() => {})` or feature-flag the stricter behavior.
- **No SAP AI Core impact**: These MCP launcher changes are transport-layer and independent of the AI Core provider integration; no risk to existing SAP customizations.
- **No breaking API changes**: The public surface (`launchBrowserMcp` or equivalent) remains the same; only error propagation is tightened.
```
{"prompt_tokens":3728,"completion_tokens":2750,"total_tokens":6478,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 1cd9f428-2826-4598-9bb7-796168d4c390]
[Messages: 2, Tokens: 6478]

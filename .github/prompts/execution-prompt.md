# Execution Task: Apply Update Plan to Alexi

You are an expert software developer. Your task is to execute the update plan below precisely.

## Update Plan to Execute

```markdown
# Update Plan for Alexi

Generated: 2026-10-24
Based on upstream commits analyzed:
- 44b21a719 - fix(deps): override transitive open versions
- 82926fb30 - fix(cli): restrict browser and MCP OAuth URLs to HTTP(S)
- ca265eef5 - chore(deps): bump open to 11.0.4
- eb11204e8 - release: v7.8.17
- e4e347a0e - release: v7.8.16

## Summary
- Total changes planned: 5
- Critical: 1 | High: 2 | Medium: 2 | Low: 0

## Changes

### 1. Add secure URL opener utility (SSRF/scheme-injection hardening)
**File**: `src/core/open.ts` (new file)
**Priority**: critical
**Type**: security
**Reason**: Upstream security fix (`82926fb30`) restricts browser URL opening to HTTP(S) schemes only. Without this, attackers could trigger `file://`, `javascript:`, `ms-msdt:`, or UNC path handlers via crafted URLs in OAuth callbacks, MCP server metadata, or AI-provider-returned links. This is a defense-in-depth security hardening against local file disclosure, protocol-handler-based RCE (e.g., ms-msdt follina-style), and credential theft. The equivalent in Alexi protects SAP AI Core integration since any model-generated URLs opened via the CLI would otherwise be vulnerable.

**New code**:
```typescript
// src/core/open.ts
// Backported from kilocode upstream (82926fb30): restrict browser URL opening to HTTP(S)
import open from "open"

/**
 * Opens a URL in the user's default browser, but only if the URL uses an
 * http(s) scheme. All other schemes (file:, javascript:, ms-msdt:, UNC paths, etc.)
 * are rejected to prevent protocol-handler abuse and local file disclosure.
 */
export function openUrl(input: string): Promise<ReturnType<typeof open> extends Promise<infer T> ? T : never> {
  const url = URL.canParse(input) ? new URL(input) : undefined
  if (!url || (url.protocol !== "http:" && url.protocol !== "https:")) {
    return Promise.reject(
      new Error(`Only http and https links can be opened in the browser: ${input}`),
    )
  }
  return open(url.href)
}
```

### 2. Add tests for `openUrl`
**File**: `test/core/open.test.ts` (new file)
**Priority**: high
**Type**: security
**Reason**: Mirrors upstream test coverage (`packages/core/test/kilocode/open.test.ts`) to assert the critical-path scheme restriction is enforced. Regression protection against accidental re-exposure.

**New code**:
```typescript
// test/core/open.test.ts
import { describe, expect, test } from "bun:test"
import { openUrl } from "../../src/core/open"

describe("openUrl", () => {
  test("rejects values that are not URLs", async () => {
    for (const input of ["not a url", ""]) {
      const err = await openUrl(input).catch((e: unknown) => e)
      expect(err).toMatchObject({
        message: expect.stringContaining("Only http and https links"),
      })
    }
  })

  test("rejects non-http schemes", async () => {
    for (const input of [
      "file:///etc/hosts",
      "file:///etc/passwd",
      "javascript:alert(1)",
      "ms-msdt:/id PCWDiagnostic",
      "\\\\server\\share\\file.html",
      "data:text/html,<script>alert(1)</script>",
      "vbscript:msgbox(1)",
    ]) {
      const err = await openUrl(input).catch((e: unknown) => e)
      expect(err).toMatchObject({
        message: expect.stringContaining("Only http and https links"),
      })
    }
  })

  test("accepts http and https URLs (shape check only)", () => {
    // We don't actually call open() here; just assert URL.canParse paths.
    expect(URL.canParse("https://example.com")).toBe(true)
    expect(URL.canParse("http://localhost:8080/path?q=1")).toBe(true)
  })
})
```

### 3. Migrate callers of `open()` to `openUrl()`
**File**: `src/cli/**/*.ts`, `src/providers/**/oauth*.ts`, `src/router/**/*.ts` (grep & replace)
**Priority**: high
**Type**: security
**Reason**: The new utility only provides value when all `open(...)` call sites are routed through it. Audit all direct imports of `open` and replace with `openUrl` from the new module. Pay special attention to:
- OAuth callback flows (MCP, SAP AI Core auth)
- "Open docs in browser" CLI commands
- Any model-generated clickable links in the TUI

**Current code (example pattern to find)**:
```typescript
import open from "open"
// ...
await open(someUrl)
```

**New code**:
```typescript
import { openUrl } from "@/core/open"   // adjust path per project aliasing
// ...
await openUrl(someUrl)
```

**Grep command to locate**:
```bash
rg -n 'from ["'\'']open["'\'']|require\(["'\'']open["'\'']\)' src/
```

### 4. Pin `open` dependency to 11.0.4 and override transitive versions
**File**: `package.json`
**Priority**: medium
**Type**: security
**Reason**: Upstream commits `ca265eef5` and `44b21a719` bump `open` to 11.0.4 and add overrides for transitive copies. The older `open` versions contain known command-injection vectors (see GHSA advisories around `open` <10). Overrides ensure no transitive dependency silently reintroduces the old version.

**Current code** (likely):
```json
{
  "dependencies": {
    "open": "^8.x" // or missing
  }
}
```

**New code**:
```json
{
  "dependencies": {
    "open": "11.0.4"
  },
  "overrides": {
    "open": "11.0.4"
  },
  "resolutions": {
    "open": "11.0.4"
  }
}
```

> Note: use `overrides` for npm/pnpm and `resolutions` for yarn/bun. Keep whichever matches Alexi's package manager; include both if the repo supports multiple.

### 5. Harden MCP OAuth callback URL handling (if MCP integration present)
**File**: `src/providers/mcp/oauth-callback.ts` (or equivalent in Alexi's MCP layer)
**Priority**: medium
**Type**: security
**Reason**: Upstream `82926fb30` and MCP SDK bump to 1.32.1 together harden the OAuth URL flow — the authorization URL returned by an MCP server is user/network-controlled and must not be opened without scheme validation. If Alexi has an MCP integration, apply the same guard; if not, this item is a no-op and can be skipped.

**Current code** (expected pattern):
```typescript
import open from "open"
// ...
await open(authorizationUrl)
```

**New code**:
```typescript
import { openUrl } from "@/core/open"
// ...
try {
  await openUrl(authorizationUrl)
} catch (err) {
  log.error("Refused to open MCP OAuth URL", {
    url: authorizationUrl,
    error: (err as Error).message,
  })
  throw err // or surface to CLI user explicitly
}
```

## Testing Recommendations

1. **Run new tests**: `bun test test/core/open.test.ts` — must pass with all rejection cases.
2. **Grep audit**: Confirm `rg 'import open from "open"' src/` returns only `src/core/open.ts`. Every other hit indicates a missed migration.
3. **Smoke test SAP AI Core auth flow**: Trigger any browser-opening login/consent flow and verify an https URL still opens successfully.
4. **Negative smoke test**: Manually pass a `file://` URL to any CLI command that opens links; confirm it fails cleanly with the "Only http and https links" error and does not hang the process.
5. **Dependency check**: `bun pm ls open` (or `npm ls open`) — verify exactly one resolved version (`11.0.4`) across the tree.
6. **Lockfile regen**: Commit regenerated lockfile; confirm CI dependency-audit step passes without `open`-related advisories.

## Potential Risks

- **Behavior change for legitimate non-http URLs**: If any existing Alexi feature intentionally opens `file://` (e.g., "open local report" or "reveal in Finder"), it will break. Audit for such uses and route them through a separate `revealLocalPath()` helper that uses OS-native `xdg-open`/`start`/`open -R` directly, bypassing URL-scheme validation. Do NOT weaken `openUrl`.
- **`open` 11.x API changes**: `open` v10+ dropped CJS and tightened ESM-only exports. If Alexi still has CommonJS consumers, ensure the bundler/runtime supports ESM default-import of `open`, or wrap with a dynamic `await import("open")`.
- **URL.canParse availability**: Requires Node ≥ 19.9 / Bun ≥ 1.0. Confirm Alexi's minimum runtime; if older, add a try/catch `new URL(input)` fallback.
- **SAP AI Core integration unaffected**: These changes do not touch provider request paths, auth tokens, or routing — only outbound browser-opening. SAP-specific customizations are preserved.
- **Non-breaking elsewhere**: No tool, agent, permission, or event-bus upstream changes in this window; nothing else in Alexi needs touching.
```
{"prompt_tokens":11566,"completion_tokens":3372,"total_tokens":14938,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: a20bb9d8-9acc-48ad-b1d6-421b0cfe8590]
[Messages: 2, Tokens: 14938]

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

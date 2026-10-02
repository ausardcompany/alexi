# Update Plan for Alexi

Generated: 2026-10-01
Based on upstream commits analyzed:
- **opencode**: 0112a92, 62ac31e, 28e13d9, 82ea3a3, e9f8a21, 9b4882d, 97a86b7
- **kilocode**: fdebb0e10, 40127d260, 64109694d, c3f1e509e, f05a4fdc3, 1988e54fd, 9efa2165a, and 95 others

## Summary
- Total changes planned: 7
- Critical: 1 | High: 3 | Medium: 2 | Low: 1

The majority of upstream changes are IDE-specific (VSCode webview, JetBrains plugin, kilo-docs, package version bumps, i18n, and visual regression tests) that do not apply to Alexi's core SAP AI Core integration. The applicable changes relate to:
1. Session identity headers for LLM requests (opencode)
2. Output token limit fixes for Claude models (kilocode)
3. Storage initialization resilience (kilocode)
4. In-flight model fetch invalidation on connection change (kilocode)
5. Triage ownership metadata (opencode) — low priority / optional

---

## Changes

### 1. Add namespaced session identity headers to LLM requests
**File**: `src/core/session/llm.ts` (or equivalent — look for the `headers` block that currently sends `x-session-affinity` / `X-Session-Id` / `x-parent-session-id`)
**Priority**: critical
**Type**: feature
**Reason**: Upstream opencode (PR #52370) added namespaced `x-opencode-session-id` and `x-opencode-parent-session-id` headers alongside the existing session headers so that downstream proxies and gateways can disambiguate session identity across tenants. For Alexi, this is important because SAP AI Core gateways and intermediate proxies rely on namespaced identifiers to avoid header collisions. We should mirror this change but use an Alexi-specific namespace (`x-alexi-session-id`) **in addition to** keeping the existing headers for backward compatibility.

**Current code**:
```typescript
http: {
  headers: {
    "x-session-affinity": session.id,
    "X-Session-Id": session.id,
    ...(session.parentID ? { "x-parent-session-id": session.parentID } : {}),
  },
},
```

**New code**:
```typescript
http: {
  headers: {
    // Namespaced identity headers (preferred by SAP AI Core gateway)
    "x-alexi-session-id": session.id,
    ...(session.parentID ? { "x-alexi-parent-session-id": session.parentID } : {}),
    // Legacy headers retained for backward compatibility with existing
    // observability / routing infrastructure.
    "x-session-affinity": session.id,
    "X-Session-Id": session.id,
    ...(session.parentID ? { "x-parent-session-id": session.parentID } : {}),
  },
},
```

**Test update** (in `src/core/test/session-runner.test.ts` or equivalent):
```typescript
expect(requests[0]?.http?.headers).toEqual({
  "x-alexi-session-id": sessionID,
  "x-alexi-parent-session-id": parentID,
  "x-session-affinity": sessionID,
  "X-Session-Id": sessionID,
  "x-parent-session-id": parentID,
})
```

---

### 2. Request full output token limit for Claude family models
**File**: `src/providers/claude.ts` or `src/core/model/output-limits.ts` (wherever max_tokens / output limit is derived per model family)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream kilocode commits `f05a4fdc3` ("fix(cli): request full output limit for Claude") and `c3f1e509e` ("fix(cli): use Claude family for output token limits") fix a mismatch where Claude models were being under-provisioned on `max_tokens`. For Alexi running Claude via SAP AI Core, the same under-provisioning will truncate completions. The fix is to detect the Claude family (not just the exact model id) and request the model's documented maximum output tokens.

**Current code** (illustrative — adapt to actual helper):
```typescript
function getMaxOutputTokens(modelID: string): number {
  if (modelID.includes("claude-3-5-sonnet")) return 8192
  // ...other models
  return 4096
}
```

**New code**:
```typescript
// Claude family -> documented max output token caps.
// Keep aligned with Anthropic's published limits.
const CLAUDE_FAMILY_OUTPUT_LIMITS: Array<[RegExp, number]> = [
  [/claude-(?:3-7|sonnet-4|opus-4)/i, 64_000],
  [/claude-3-5-sonnet/i, 8_192],
  [/claude-3-5-haiku/i, 8_192],
  [/claude-3-opus/i, 4_096],
  [/claude-3-(?:sonnet|haiku)/i, 4_096],
]

function isClaudeFamily(modelID: string): boolean {
  return /claude/i.test(modelID)
}

function getMaxOutputTokens(modelID: string): number {
  if (isClaudeFamily(modelID)) {
    for (const [pattern, limit] of CLAUDE_FAMILY_OUTPUT_LIMITS) {
      if (pattern.test(modelID)) return limit
    }
    // Default for unrecognized Claude variants: request a safe high value.
    return 8_192
  }
  // ...other model families
  return 4_096
}
```

**Fixture update**: If there's a recorded fixture similar to `packages/opencode/test/fixtures/recordings/kilocode/session/native-anthropic-tool-loop.json`, update the expected `max_tokens` value to match.

---

### 3. Keep storage usable after an interrupted first access
**File**: `src/storage/storage.ts` (or equivalent — the storage init / lazy-init path)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream kilocode commit `1988e54fd` fixes a bug where if the first storage access is interrupted (e.g. a cancelled promise, process signal, or thrown error during directory bootstrap), subsequent accesses would see a partially-initialized state and fail permanently. Alexi likely has the same lazy-init pattern. The fix is to not cache the init promise if it rejected, so retries can succeed.

**Current code** (illustrative):
```typescript
let initPromise: Promise<void> | undefined

export async function ensureStorage(): Promise<void> {
  if (!initPromise) {
    initPromise = doInit()
  }
  return initPromise
}
```

**New code**:
```typescript
let initPromise: Promise<void> | undefined

export async function ensureStorage(): Promise<void> {
  if (!initPromise) {
    initPromise = doInit().catch((err) => {
      // Clear the cached promise so a subsequent call can retry init
      // instead of inheriting the failed state forever.
      initPromise = undefined
      throw err
    })
  }
  return initPromise
}
```

**Test** (add to `src/storage/test/storage-init.test.ts`):
```typescript
it("retries initialization after an interrupted first attempt", async () => {
  let attempts = 0
  mockFs.mkdir.mockImplementation(async () => {
    attempts++
    if (attempts === 1) throw new Error("EINTR")
  })

  await expect(ensureStorage()).rejects.toThrow("EINTR")
  await expect(ensureStorage()).resolves.toBeUndefined()
  expect(attempts).toBe(2)
})
```

---

### 4. Invalidate in-flight model fetch on provider connection change
**File**: `src/providers/custom-provider.ts` or `src/router/model-fetcher.ts` (wherever custom/dynamic provider model lists are fetched)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream kilocode commit `9efa2165a` ("fix(vscode): invalidate in-flight model fetch on connection change") fixes a race where switching provider credentials/endpoint while a model list fetch was in flight could cause the stale response to populate the UI/state. Alexi — when users switch between SAP AI Core deployments or credential sets — can hit the same race. The fix is to use an AbortController / fetch generation counter tied to the current connection identity.

**New code** (illustrative pattern):
```typescript
class ModelFetcher {
  private currentController: AbortController | undefined
  private currentConnectionKey: string | undefined

  async fetchModels(connectionKey: string): Promise<ModelInfo[]> {
    // Abort any in-flight fetch for a different connection.
    if (this.currentConnectionKey && this.currentConnectionKey !== connectionKey) {
      this.currentController?.abort()
    }

    const controller = new AbortController()
    this.currentController = controller
    this.currentConnectionKey = connectionKey

    try {
      const result = await doFetch({ signal: controller.signal })
      // Guard: another connection superseded us while we awaited.
      if (this.currentConnectionKey !== connectionKey) {
        throw new Error("model fetch superseded by connection change")
      }
      return result
    } finally {
      if (this.currentController === controller) {
        this.currentController = undefined
      }
    }
  }

  invalidate(): void {
    this.currentController?.abort()
    this.currentController = undefined
    this.currentConnectionKey = undefined
  }
}
```

Wire `invalidate()` into whatever event is emitted when credentials/endpoint change.

---

### 5. Add manual "Fetch Models" capability for custom providers
**File**: `src/cli/commands/provider.ts` or `src/providers/custom-provider.ts`
**Priority**: medium
**Type**: feature
**Reason**: Upstream kilocode commits `de285a6b5` and `40127d260` added a manual "Fetch Models" button for custom providers so users don't have to re-open a dialog to refresh the list after changing an endpoint. For Alexi's CLI, the equivalent is a `provider refresh-models <name>` subcommand (or a flag on the existing provider command). This is helpful for SAP AI Core where new model deployments appear mid-session.

**New code** (CLI subcommand sketch):
```typescript
// src/cli/commands/provider.ts
export const refreshModelsCommand = cmd({
  command: "refresh-models <provider>",
  describe: "Force a refresh of the model list for a custom provider",
  builder: (y) => y.positional("provider", { type: "string", demandOption: true }),
  handler: async (argv) => {
    const provider = await ProviderRegistry.get(argv.provider)
    if (!provider) {
      console.error(`Unknown provider: ${argv.provider}`)
      process.exit(1)
    }
    modelFetcher.invalidate()
    const models = await provider.fetchModels()
    console.log(`Fetched ${models.length} models for ${argv.provider}`)
    for (const m of models) console.log(`  - ${m.id}`)
  },
})
```

---

### 6. Use `path.sep` for cross-platform plugin name extraction
**File**: `src/cli/status.ts` or wherever plugin paths are split for display (search for `.split("/")` applied to plugin file paths)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream opencode PR #52328 fixed a Windows bug where plugin names were extracted with a hardcoded `/` separator, producing wrong names on Windows. If Alexi displays plugin names anywhere (status dialog, `/plugins` command, logs), it will have the same bug.

**Current code**:
```typescript
const pluginName = pluginPath.split("/").pop() ?? pluginPath
```

**
{"prompt_tokens":20272,"completion_tokens":4096,"total_tokens":24368,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: e404fe47-761b-4a3e-a730-4a75a65f6649]
[Messages: 2, Tokens: 24368]

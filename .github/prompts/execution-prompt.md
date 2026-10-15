# Execution Task: Apply Update Plan to Alexi

You are an expert software developer. Your task is to execute the update plan below precisely.

## Update Plan to Execute

# Update Plan for Alexi

Generated: 2026-10-15
Based on upstream commits analyzed:
- **kilocode**: 2a7edfedb..e3ef95471 (90 commits) - highlights: ripgrep encoding/glob fixes, MCP OAuth hardening, Kilo AI gateway URL, conda telemetry, terminal routing restart ownership
- **opencode**: 1015cb6..4397ee4 (78 commits) - highlights: MCP capability-gated calls, loopback OAuth tokens, policy consolidation, config normalization, compaction output limit, plugin permission assertions, MCP tool input metadata, codemode skip, DB query param redaction, continue after output limit

## Summary
- Total changes planned: 18
- **Critical**: 3 | **High**: 7 | **Medium**: 6 | **Low**: 2

---

## Changes

### 1. Treat `*.localhost` as loopback for MCP OAuth token endpoints
**File**: `src/mcp/oauth-provider.ts` (and/or `src/mcp/auth.ts`)
**Priority**: critical
**Type**: security
**Reason**: Upstream opencode commit `b55f220` fixes an OAuth security corner case where MCP token endpoints resolved to `*.localhost` were not treated as loopback, breaking local OAuth flows and risking header/credential leakage patterns. Alexi's MCP OAuth implementation needs the same loopback detection.

**Current code**:
```typescript
function isLoopback(url: URL): boolean {
  return (
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "::1"
  )
}
```

**New code**:
```typescript
function isLoopback(url: URL): boolean {
  const host = url.hostname.toLowerCase()
  // RFC 6761: *.localhost names are reserved as loopback.
  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.startsWith("127.")
  )
}
```

---

### 2. Redact SQL parameters in database query error messages
**File**: `src/database/errors.ts` (or wherever DB errors are formatted)
**Priority**: critical
**Type**: security
**Reason**: Upstream opencode commit `a8fc567` scrubs params from database query errors to avoid leaking user data (API keys, session content) through stack traces/logs. Important for SAP AI Core deployments where logs may be shipped to central observability.

**New code**:
```typescript
export function formatQueryError(err: unknown, sql: string, params: unknown[]): Error {
  const message = err instanceof Error ? err.message : String(err)
  const redactedParams = params.map(() => "[redacted]")
  return new Error(
    `Database query failed: ${message}\n` +
    `  sql: ${sql}\n` +
    `  params: ${JSON.stringify(redactedParams)}`,
  )
}
```

Wire into any `Drizzle` / `better-sqlite3` error wrapping.

---

### 3. Managed configuration gets highest precedence; split policies from settings
**File**: `src/core/config.ts`
**Priority**: critical
**Type**: feature / security
**Reason**: Upstream opencode commit `6dc4d4e` gives MDM/managed configuration (system directory + preferences) highest priority so enterprise admins (SAP context) can enforce policy. Policies are split off and loaded first so file-based policy authority is preserved while settings load last.

**Current code**:
```typescript
const systemSupplementary = [
  ...(sources.preferences ? yield* loadPreferences(sources.preferences) : []),
  ...(sources.system?.present ? yield* loadDirectory(sources.system.path) : []),
]
```

**New code**:
```typescript
// Managed settings load last (highest priority); MDM preferences outrank system dir.
// Policies evaluate in reverse load order, so split and load managed policies first.
const managed = [
  ...(sources.system?.present ? yield* loadDirectory(sources.system.path).pipe(Effect.orDie) : []),
  ...(sources.preferences ? yield* loadPreferences(sources.preferences).pipe(Effect.orDie) : []),
]
const managedPolicies = managed
  .flatMap((entry) =>
    entry.type === "document" && entry.info.policies
      ? [new Document({
          type: "document",
          path: entry.path,
          info: new Info({ policies: entry.info.policies }),
        })]
      : [],
  )
  .toReversed()
const managedSettings = managed.map((entry) =>
  entry.type === "document" && entry.info.policies
    ? new Document({ ...entry, info: new Info({ ...entry.info, policies: undefined }) })
    : entry,
)
// ... assemble: [managedPolicies, ...direct, globalSupplementary, ...projectSupplementary, managedSettings]
```

---

### 4. Ripgrep: handle non-UTF-8 output via base64 `bytes` decoding
**File**: `src/core/ripgrep.ts` + new `src/core/ripgrep-grep.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream kilocode commits `0e6da3104` / `31906a56b` fix crashes/incorrect text when grepping files with mixed/legacy encodings (Latin-1, etc.). Ripgrep emits `{bytes}` (base64) instead of `{text}` for non-UTF-8. Decode lossy-UTF-8 to show U+FFFD rather than failing schema validation.

**New file** `src/core/ripgrep-grep.ts`:
```typescript
import { Schema, SchemaGetter } from "effect"

/** ripgrep `arbitrary data` ({text} or {bytes}) normalized to {text}. */
export const Data = Schema.Union([
  Schema.Struct({ text: Schema.String }),
  Schema.Struct({ bytes: Schema.String }),
]).pipe(
  Schema.decodeTo(Schema.Struct({ text: Schema.String }), {
    decode: SchemaGetter.transform((data) =>
      "text" in data
        ? { text: data.text }
        : { text: Buffer.from(data.bytes, "base64").toString("utf8") },
    ),
    encode: SchemaGetter.passthrough({ strict: false }),
  }),
)
```

**Modify** `src/core/ripgrep.ts`:
```typescript
import * as KiloGrep from "./ripgrep-grep"

const RawMatch = Schema.Struct({
  type: Schema.Literals(["match", "context"]),
  data: Schema.Struct({
    path: KiloGrep.Data,
    lines: KiloGrep.Data,
    line_number: PositiveInt,
    absolute_offset: NonNegativeInt,
    submatches: Schema.Array(
      Schema.Struct({
        match: KiloGrep.Data,
        start: NonNegativeInt,
        end: NonNegativeInt,
      }),
    ),
  }),
})
```

---

### 5. Apply glob/include patterns AFTER ripgrep ignore rules (respect .gitignore)
**File**: `src/core/ripgrep.ts` + new `src/core/ripgrep-glob.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream kilocode PR #15017 (`e48c9785c`, `17448f5c5`) fixes glob patterns bypassing `.gitignore`. Passing `--glob=<pattern>` makes ripgrep treat it as an override that wins over ignore rules, causing `node_modules` to be walked. Instead, let ripgrep list files per ignore rules and apply the pattern locally.

**New file** `src/core/ripgrep-glob.ts`:
```typescript
export interface Input {
  readonly pattern: string
  readonly hidden?: boolean
  readonly include?: readonly string[]
}

export interface Walk {
  readonly args: readonly string[]
  readonly match: (file: string) => boolean
}

export function compile(pattern: string) {
  const dir = pattern.endsWith("/")
  const body = pattern.replace(/\/+$/, "")
  const text = body.includes("/") ? body.replace(/^\//, "") : `**/${body}`
  const glob = new Bun.Glob(text)
  const folders = text.endsWith("/**") ? new Bun.Glob(`${text}/*`) : glob
  return (path: string, folder: boolean) => {
    if (folder) return folders.match(path)
    return !dir && glob.match(path)
  }
}

export function glob(input: Input): Walk {
  // Prefilter via ripgrep type if last path segment is a simple name
  const match = compile(input.pattern)
  return {
    args: [], // no --glob override; apply post-filter
    match: (file) => match(file, false),
  }
}
```

**Modify** `src/core/ripgrep.ts` `glob` call site:
```typescript
// before:
//   `--glob=${input.pattern}`,
// after:
...KiloGlob.glob(input).args,
```
Add a post-filter step before applying the result `limit`:
```typescript
.pipe(
  Stream.filter((entry) => KiloGlob.glob(input).match(entry.path) && (input.filter?.(entry.path) ?? true)),
  Stream.take(input.limit ?? Infinity),
)
```

---

### 6. MCP: skip list/call for unadvertised capabilities
**File**: `src/mcp/client.ts`
**Priority**: high
**Type**: bugfix / performance
**Reason**: Upstream opencode commit `fbf5f16` avoids `method not found` errors from MCP servers that don't advertise prompts/resources. Reduces noisy telemetry and failed probes.

**Current code**:
```typescript
const prompts = await client.listPrompts()
const resources = await client.listResources()
```

**New code**:
```typescript
const caps = client.getServerCapabilities?.() ?? {}
const prompts = caps.prompts ? await client.listPrompts().catch(() => ({ prompts: [] })) : { prompts: [] }
const resources = caps.resources ? await client.listResources().catch(() => ({ resources: [] })) : { resources: [] }
```

---

### 7. MCP: skip codemode query for servers that reject it
**File**: `src/mcp/client.ts` (or wherever Alexi probes codemode)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream opencode commit `7b5f1bd` prevents repeated failures and keeps server registration successful even when codemode is unsupported.

**New code**:
```typescript
const codemode = await Effect.tryPromise(() => client.callTool({ name: "codemode" })).pipe(
  Effect.catchAll(() => Effect.succeed({ supported: false } as const)),
)
if (!("supported" in codemode) || codemode.supported !== false) {
  // register codemode handler
}
```

---

### 8. MCP: advertise spec-shaped elicitation capability
**File**: `src/mcp/client.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream opencode commit `3aa26f1` aligns Alexi's client capability advertisement with the MCP spec so servers can send elicit requests.

**Current code**:
```typescript
capabilities: {
  roots: { listChanged: true },
  sampling: {},
}
```

**New code**:
```typescript
capabilities: {
  roots: { listChanged: true },
  sampling: {},
  elicitation: {}, // spec-shaped capability
}
```

---

### 9. MCP: pass tool input as permission metadata
**File**: `src/
{"prompt_tokens":36471,"completion_tokens":4096,"total_tokens":40567,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 0829b9e3-e4d3-467a-9968-8ec7132b9115]
[Messages: 2, Tokens: 40567]

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

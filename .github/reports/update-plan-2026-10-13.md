# Update Plan for Alexi

Generated: 2026-10-13
Based on upstream commits analyzed:
- **kilocode**: 3df806ae9..2a7edfedb (92 commits)
- **opencode**: e41e7e90..1015cb67 (50 commits)

## Summary
- Total changes planned: 12
- Critical: 1 | High: 5 | Medium: 4 | Low: 2

Key themes from upstream:
1. **New `glob_include_ignored` feature** (kilocode): opt-in allowlist for glob searches to include ignored/hidden paths
2. **Provider request body encoding + compatibility.cacheFormat** (opencode): configurable Anthropic cache breakpoints and request encoding
3. **Default chunk timeout raised to 15 min + Bun fetch idle timeout disabled** (opencode): fixes provider request hangs
4. **System config discovery** (opencode): macOS MDM managed preferences + system config dirs
5. **Provider-level compatibility settings** (opencode): per-provider compatibility settings
6. **Promise tool error handling** (opencode): tool throws returned as tool failures
7. **Ripgrep Windows extraction without PowerShell** (opencode)
8. **Azure provider refactor** (opencode): stop listing Azure resources at startup

---

## Changes

### 1. Add `glob_include_ignored` opt-in allowlist for ignored paths
**File**: `src/tool/glob.ts` + new `src/tool/glob-ignored.ts`
**Priority**: high
**Type**: feature
**Reason**: kilocode added an experimental allowlist allowing glob to traverse specific ignored/hidden directories (e.g., `build/`, `node_modules/some-pkg/`). Useful for SAP projects where some generated artifacts are gitignored but need to be searchable.

**New file**: `src/tool/glob-ignored.ts`
```typescript
// Mirrors packages/opencode/src/kilocode/tool/glob-ignored.ts
// Resolves user-provided allowlist patterns into ripgrep --glob includes
// Patterns without a slash match folders at any depth
// Nested ignored folders inside listed folders stay skipped

export interface IgnoredAllowlist {
  readonly include: readonly string[]
  readonly noRequireGit: boolean
}

export function resolveAllowlist(
  patterns: readonly string[] | undefined,
  cwd: string,
): IgnoredAllowlist {
  if (!patterns || patterns.length === 0) {
    return { include: [], noRequireGit: false }
  }
  const include: string[] = []
  for (const raw of patterns) {
    const pattern = raw.trim()
    if (!pattern || pattern.startsWith("#")) continue
    // Patterns without slash match folders at any depth
    if (!pattern.includes("/")) {
      include.push(`**/${pattern}/**`)
      include.push(`**/${pattern}`)
    } else {
      include.push(pattern)
      if (!pattern.endsWith("/**")) include.push(`${pattern}/**`)
    }
  }
  return { include, noRequireGit: true }
}
```

**Modify** `src/tool/glob.ts`:
```typescript
// Before: pass only pattern/exclude to ripgrep
// After: thread includeIgnored through to ripgrep call

import { resolveAllowlist } from "./glob-ignored.js"

const allowlist = resolveAllowlist(
  config.experimental?.glob_include_ignored,
  ctx.cwd,
)

const result = await ripgrep.glob({
  pattern: args.pattern,
  cwd: ctx.cwd,
  include: allowlist.include,          // NEW
  noRequireGit: allowlist.noRequireGit, // NEW
  exclude: args.exclude,
})
```

---

### 2. Extend ripgrep interface to accept `include` globs
**File**: `src/core/ripgrep.ts` (or equivalent)
**Priority**: high
**Type**: feature
**Reason**: Required by change #1. Mirrors `packages/core/src/ripgrep.ts` upstream change.

**Current code**:
```typescript
export interface GlobInput {
  readonly pattern: string
  readonly cwd: string
  readonly follow?: boolean
  readonly signal?: AbortSignal
  readonly noRequireGit?: boolean
  readonly exclude?: readonly string[]
}

// in spawn:
const args = [
  ...(input.follow ? ["--follow"] : []),
  ...(input.noRequireGit ? ["--no-require-git"] : []),
  `--glob=${input.pattern}`,
  ...(input.exclude ?? []).map((g) => `--glob=!${g}`),
  "--glob=!**/.git/**",
  ".",
]
```

**New code**:
```typescript
export interface GlobInput {
  readonly pattern: string
  readonly cwd: string
  readonly follow?: boolean
  readonly signal?: AbortSignal
  readonly noRequireGit?: boolean
  readonly include?: readonly string[]  // NEW: additional whitelist globs
  readonly exclude?: readonly string[]
}

const args = [
  ...(input.follow ? ["--follow"] : []),
  ...(input.noRequireGit ? ["--no-require-git"] : []),
  `--glob=${input.pattern}`,
  ...(input.include ?? []).map((g) => `--glob=${g}`),  // NEW
  ...(input.exclude ?? []).map((g) => `--glob=!${g}`),
  "--glob=!**/.git/**",
  ".",
]
```

---

### 3. Add `glob_include_ignored` to config schema
**File**: `src/core/config/schema.ts` (or wherever `Info` schema is defined)
**Priority**: high
**Type**: feature
**Reason**: Mirrors `packages/core/src/v1/config/config.ts` upstream change. Required for change #1 to be user-configurable.

**New code** (add to experimental block):
```typescript
glob_include_ignored: Schema.optional(
  Schema.mutable(Schema.Array(Schema.String))
).annotate({
  description:
    "Folders or files, as gitignore-style patterns relative to the workspace root, that the glob tool should search even when they are ignored (for example by .gitignore) or hidden. Patterns without a slash match folders at any depth; list a file inside an ignored folder by its path (for example build/report.json). Ignored or hidden folders nested inside a listed folder stay skipped.",
}),
```

---

### 4. Raise default provider chunk timeout to 15 minutes
**File**: `src/providers/http-transport.ts` (or wherever chunk timeout is set)
**Priority**: critical
**Type**: bugfix
**Reason**: opencode PR #55032 — SAP AI Core long-running inference requests can exceed the previous timeout, causing spurious failures mid-stream. This is critical because SAP's enterprise models (gpt-5, claude-opus via SAP) often take >5 minutes for complex reasoning tasks.

**Current code**:
```typescript
const DEFAULT_CHUNK_TIMEOUT = 300_000 // 5 minutes
```

**New code**:
```typescript
// Matches upstream default; critical for long-running SAP AI Core calls
const DEFAULT_CHUNK_TIMEOUT = 900_000 // 15 minutes
```

---

### 5. Disable Bun's fetch idle timeout for provider requests
**File**: `src/providers/http-transport.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: opencode PR #55007 — Bun's default fetch idle timeout silently cuts long-running streams. SAP AI Core streaming responses can idle during model reasoning, triggering ECONNRESET. This must be applied if Alexi runs on Bun.

**New code**:
```typescript
// Only applies when running under Bun; harmless under Node
const fetchOptions: RequestInit & { idleTimeout?: number } = {
  ...baseOptions,
  // 0 = disabled (Bun-specific option)
  idleTimeout: 0,
}
const response = await fetch(url, fetchOptions)
```

---

### 6. Add `compatibility.cacheFormat` for Anthropic cache breakpoints
**File**: `src/providers/anthropic.ts` + `src/core/config/schema.ts`
**Priority**: high
**Type**: feature
**Reason**: opencode PR #54945 — Allows configuring Anthropic cache breakpoints per provider. Important for SAP's Claude integration where cache control may differ from direct Anthropic API.

**Schema change** (`src/core/config/schema.ts`):
```typescript
compatibility: Schema.optional(Schema.Struct({
  cacheFormat: Schema.optional(Schema.Union(
    Schema.Literal("anthropic"),
    Schema.Literal("none"),
  )),
  // keep existing fields
})),
```

**Provider change** (`src/providers/anthropic.ts`):
```typescript
// Before: hardcoded cache breakpoint insertion
// After: respect compatibility.cacheFormat setting

const cacheFormat = provider.compatibility?.cacheFormat ?? "anthropic"
if (cacheFormat === "anthropic") {
  applyCacheBreakpoints(messages)
}
```

---

### 7. Return promise tool throws as tool failures (not fatal errors)
**File**: `src/tool/runner.ts` (or wherever tool execution happens)
**Priority**: high
**Type**: bugfix
**Reason**: opencode PR #54913 — When a tool implementation throws asynchronously, it should surface as a tool-level failure (reported to the model) rather than crashing the session. Critical for stability.

**Current code**:
```typescript
try {
  const result = await tool.execute(args, ctx)
  return { ok: true, result }
} catch (err) {
  throw err // propagates to session crash
}
```

**New code**:
```typescript
try {
  const result = await tool.execute(args, ctx)
  return { ok: true, result }
} catch (err) {
  // Return as tool failure so the model can retry/recover
  const message = err instanceof Error ? err.message : String(err)
  return {
    ok: false,
    error: {
      type: "tool_execution_error",
      message,
      stack: err instanceof Error ? err.stack : undefined,
    },
  }
}
```

---

### 8. Add provider-level compatibility + migrate `setCacheKey`
**File**: `src/providers/base.ts`, `src/core/config/migrate.ts`
**Priority**: medium
**Type**: refactor
**Reason**: opencode PR #54911 — Supports provider-level compatibility settings and migrates legacy `setCacheKey` option. Needed for forward-compatibility with provider configs.

**New code** (migration):
```typescript
// In config migration pass
function migrateCacheKey(provider: ProviderConfig): ProviderConfig {
  if (provider.setCacheKey !== undefined) {
    provider.compatibility = {
      ...provider.compatibility,
      cacheKey: provider.setCacheKey,
    }
    delete (provider as any).setCacheKey
  }
  return provider
}
```

---

### 9. Add request body encoding setting
**File**: `src/providers/base.ts` + schema
**Priority**: medium
**Type**: feature
**Reason**: opencode PR #54932 — Some providers (including possibly SAP AI Core) require specific body encoding. Lets users configure `json` vs `form` encoding per provider.

**Schema**:
```typescript
body: Schema.optional(Schema.Struct({
  encoding: Schema.optional(Schema.Union(
    Schema.Literal("json"),
    Schema
{"prompt_tokens":41328,"completion_tokens":4096,"total_tokens":45424,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 2ec36087-1f69-4623-9b22-c57e4172e339]
[Messages: 2, Tokens: 45424]

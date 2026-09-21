# Update Plan for Alexi

Generated: 2026-09-21
Based on upstream commits analyzed:
- kilocode: f47c29dfe..010f511d7 (73 commits)
- opencode: 70a2469..ebb7b76 (10 commits)

## Summary
- Total changes planned: 8
- Critical: 1 | High: 3 | Medium: 3 | Low: 1

Only changes relevant to Alexi's core scope (tools, providers, session, config, MCP) are included. Kilo-VSCode UI, agent-manager webviews, i18n, and docs are excluded as out-of-scope.

## Changes

### 1. Add semantic-search output helper module
**File**: `src/tool/semantic-search-output.ts` (NEW)
**Priority**: high
**Type**: feature
**Reason**: Splits the wording of semantic-search results into a testable module. The empty-result explanation is critical for correct model behavior — without it, models interpret "no results" as "code does not exist" when in reality the index may be disabled, still building, or broken. This is a behavioral correctness fix that Alexi should adopt.

**New code**:
```typescript
import type { IndexingStatus } from "@kilocode/kilo-indexing/status"

export function normalizePath(value: string): string {
  return value.replaceAll("\\", "/")
}

/** Human-readable description of what was actually searched. */
export function scope(root: string, prefix?: string): string {
  return prefix ? `${root}/${normalizePath(prefix)}` : root
}

/**
 * Explain an empty result set in terms of index state.
 * KiloIndexing.search returns [] when the index is disabled, unbuilt, or
 * broken, which is indistinguishable from a genuine miss.
 */
export function reason(status?: IndexingStatus): string {
  if (!status)
    return "The index could not be queried, so this is not evidence that no matching code exists."
  const detail = status.message.trim()
  const suffix = detail ? ` ${detail}` : ""
  if (status.state === "Disabled") {
    return `Codebase indexing is disabled for this project, so nothing was searched.${suffix}`
  }
  if (status.state === "Error")
    return `Codebase indexing failed, so nothing was searched.${suffix}`
  if (status.state === "In Progress") {
    return `The index is still building (${status.percent}%, ${status.processedFiles}/${status.totalFiles} files), so results are incomplete.`
  }
  if (status.state === "Standby")
    return `The index is not active, so results are incomplete.${suffix}`
  return "The index is up to date, so no semantically similar code exists in this scope."
}

/** Full output for a search that matched nothing. */
export function empty(root: string, prefix: string | undefined, status?: IndexingStatus): string {
  return [
    `No semantically similar code found.`,
    `Scope: ${scope(root, prefix)}`,
    `Reason: ${reason(status)}`,
  ].join("\n")
}
```

---

### 2. Update semantic_search tool to report scope and index state
**File**: `src/tool/semantic-search.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Currently, empty semantic-search results are ambiguous. Callers (LLMs) treat them as evidence of absence when the index may actually be unavailable. This change surfaces the indexed root and index status so models can reason correctly.

**Current code**:
```typescript
const Parameters = Schema.Struct({
  query: Schema.String.annotate({ ... }),
  path: Schema.optional(Schema.String).annotate({
    description:
      "Limit search to specific subdirectory (relative to the current workspace directory). Leave empty for entire workspace.",
  }),
})
```

**New code**:
```typescript
import { empty, normalizePath, scope } from "./semantic-search-output"

const Parameters = Schema.Struct({
  query: Schema.String.annotate({ ... }),
  path: Schema.optional(Schema.String).annotate({
    description:
      "Limit search to a subdirectory, relative to the indexed root. Leave empty to search the whole indexed root.",
  }),
})

type Meta = {
  results: SearchResult[]
  /** Absolute root the index covers, so a caller can tell what was actually searched. */
  root: string
  /** Index state at query time; only resolved when nothing matched. */
  state?: KiloIndexing.Status["state"]
}
```

Inside the execute effect, after computing results:
```typescript
const prefix = normalizeSearchPath(params.path)
const root = normalizePath(Instance.directory)
const matches = yield* Effect.promise(() => KiloIndexing.search(params.query, prefix))
// ... build results ...

if (results.length === 0) {
  const status = yield* Effect.promise(() =>
    KiloIndexing.current().then(
      (value) => value,
      () => undefined,
    ),
  )
  return {
    output: empty(root, prefix, status),
    metadata: { results, root, state: status?.state } satisfies Meta,
  }
}

return {
  output: /* existing formatted results, prefixed with scope(root, prefix) */,
  metadata: { results, root } satisfies Meta,
}
```

---

### 3. Update semantic_search tool description
**File**: `src/tool/semantic-search.txt` (or `.ts` if stringified)
**Priority**: high
**Type**: feature
**Reason**: The current wording misleads models about scope. It says "cannot search outside the current workspace" but the real limit is "the indexed root". Also clarifies multi-root workspace behavior and empty-result semantics.

**Current code**:
```text
- Explore files outside the current workspace - use `Grep`, `Glob`, and `Read`

## Constraints
- Write the query in English.
- Searches the entire current workspace by default. Limit semantic search to one subdirectory with `path`.
- Cannot search outside the current workspace. Use other tools if this functionality is needed.
```

**New code**:
```text
- Explore files outside the indexed root — use `Read`, `Grep` or `Glob` with an absolute path. They search the indexed root by default and need `external_directory` approval to go beyond it, but they can get there; this tool cannot.

## Constraints
- Write the query in English.
- Searches one indexed root: the project directory of the current session. Limit the search to a subdirectory of that root with `path`.
- In a multi-root editor workspace, only that one root is indexed. Files in other workspace folders are not searchable here even though they may appear as `@` mentions.
- Cannot search outside the indexed root. Reach those files with `Read`, `Grep` or `Glob` on an absolute path instead.
- Empty results are not proof that no matching code exists. The output states whether the index was complete, still building, disabled, or failed; read it before concluding anything.
```

---

### 4. Add tests for semantic-search-output helper
**File**: `test/tool/semantic-search-output.test.ts` (NEW)
**Priority**: medium
**Type**: feature
**Reason**: Ensure the empty-result wording is exercised without booting the indexing worker. The exact phrasing is the behavioral contract with the model.

**New code**:
```typescript
import { describe, expect, test } from "bun:test"
import { empty, normalizePath, reason, scope } from "@/tool/semantic-search-output"

describe("semantic-search-output", () => {
  test("normalizePath converts backslashes", () => {
    expect(normalizePath("a\\b\\c")).toBe("a/b/c")
  })

  test("scope joins root and prefix", () => {
    expect(scope("/repo")).toBe("/repo")
    expect(scope("/repo", "src\\a")).toBe("/repo/src/a")
  })

  test("reason handles missing status", () => {
    expect(reason(undefined)).toContain("could not be queried")
  })

  test("reason for Disabled", () => {
    expect(
      reason({ state: "Disabled", message: "toggle in settings", percent: 0, processedFiles: 0, totalFiles: 0 }),
    ).toContain("disabled")
  })

  test("reason for In Progress reports percent", () => {
    expect(
      reason({ state: "In Progress", message: "", percent: 42, processedFiles: 21, totalFiles: 50 }),
    ).toContain("(42%, 21/50 files)")
  })

  test("empty output includes scope and reason", () => {
    const out = empty("/repo", "src", undefined)
    expect(out).toContain("Scope: /repo/src")
    expect(out).toContain("Reason:")
  })
})
```

---

### 5. Add machine-wide session retention config schema
**File**: `src/core/config/config.ts` (or wherever Alexi mirrors `packages/core/src/v1/config/config.ts`)
**Priority**: medium
**Type**: feature
**Reason**: Introduces a backend-owned retention policy for automatic deletion of old sessions. Only the schema — Alexi may defer the actual retention runner. If Alexi does not currently support session retention, this is a low-risk additive schema field to enable future adoption.

**Current code** (in `Info` schema struct):
```typescript
snapshot: Schema.optional(...),
plugin: Schema.optional(...),
share: Schema.optional(Schema.Literals(["manual", "auto", "disabled"])).annotate({ ... }),
```

**New code**:
```typescript
snapshot: Schema.optional(...),

// kilocode_change start - machine-wide session retention policy
retention: Schema.optional(
  Schema.Struct({
    enabled: Schema.optional(Schema.Boolean).annotate({
      description:
        "Enable automatic deletion of old sessions. Defaults to false; deletion is permanent.",
    }),
    maxAgeDays: Schema.optional(Schema.Number).annotate({
      description: "Days a session is kept before retention deletes it. Defaults to 30, minimum 1.",
    }),
  }),
).annotate({
  description: "Machine-wide session retention. Evaluated by the backend; clients only trigger runs.",
}),
// kilocode_change end

plugin: Schema.optional(...),
```

---

### 6. Bump `@ai-sdk/amazon-bedrock` and support Bedrock encrypted reasoning
**File**: `package.json` + `src/providers/bedrock.ts` (or equivalent)
**Priority**: critical
**Type**: bugfix
**Reason**: Bedrock now returns encrypted/redacted reasoning content blocks. The old SDK version breaks on those blocks. This is a runtime failure for any user on Bedrock with a reasoning-capable model — a critical fix. SAP AI Core is unaffected, but if Alexi ships Bedrock support, update it.

**Current code** (`package.json`):
```json
"@ai-sdk/amazon-bedrock": "4.0.112",
```

**New code**:
```json
"@ai-sdk/amazon-bedrock": "4.0.166",
```

**Also**: In the Bedrock message transform, accept `redacted_reasoning` / encrypted content blocks and pass them through instead of throwing. Reference the upstream fix in commit `a7d159633` ("fix(cli): support Bedrock encrypted reasoning"). If Alexi does not ship Bedrock, downgrade this to **low** priority and skip.

---

### 7. Fix MCP SSE probe content-type handling
**File**: `src/mcp/sse-probe.ts` (NEW or update if present) and `src/mcp/index.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Two related MCP fixes upstream:
1. The GET stream probe was retried indefinitely when the server responded with non-SSE — wastes cycles and can hang session startup.
2. Content-type matching was case-sensitive, missing valid `Content-Type: T
{"prompt_tokens":21184,"completion_tokens":4096,"total_tokens":25280,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 1339cff2-f6a4-4bc4-a883-041875c77842]
[Messages: 2, Tokens: 25280]

# Execution Task: Apply Update Plan to Alexi

You are an expert software developer. Your task is to execute the update plan below precisely.

## Update Plan to Execute

```markdown
# Update Plan for Alexi

Generated: 2026-10-14
Based on upstream commits analyzed:
- kilocode: 4ee8d1b3b, ff20ca72d, 17448f5c5, e48c9785c, f8ebadd8a, 62c4b88da, 09399e485, a4731fcd6, da2b05a4c, cd7c29ef6, 44856c1cd, f70f0da2d
- opencode: 34d8ded, f576da5, 6dc4d4e, 6a7cedc, 7351718, a3f7f42, 55c863d, 23e3493, d8e31d8

## Summary
- Total changes planned: 11
- Critical: 2 | High: 4 | Medium: 3 | Low: 2

## Changes

### 1. Fix glob patterns bypassing .gitignore (ripgrep override issue)
**File**: `src/core/kilocode/ripgrep-glob.ts` (NEW)
**Priority**: critical
**Type**: security | bugfix
**Reason**: Upstream kilocode fix #15003/#15017 — passing agent-supplied patterns as `--glob=<pattern>` makes them ripgrep **overrides**, which win over `.gitignore`. This causes `**/*` globs to walk `node_modules`, `.git`, and other ignored directories, exposing secrets (`.env`, `secret/`) and dramatically slowing searches. Must be fixed to preserve ignore semantics.

**New file**:
```typescript
// Glob matching that keeps ripgrep's ignore rules in charge (#15003).
//
// Passing the agent's pattern as `--glob=<pattern>` makes it a ripgrep override, and overrides win
// over `.gitignore`. Instead, let ripgrep list the files its ignore rules allow and apply the
// pattern here with gitignore-style rules.

export interface Input {
  readonly pattern: string
  readonly hidden?: boolean
  readonly include?: readonly string[]
}

export interface Walk {
  readonly args: readonly string[]
  readonly match: (file: string) => boolean
  readonly keep: (file: string | undefined) => boolean
}

/** Match a cwd-relative path the way ripgrep matches an override glob. */
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

/** Extract last path segment to use as a ripgrep file type for prefiltering. */
function prefilter(pattern: string): { typeArgs: readonly string[]; preGlob?: string } {
  const name = pattern.split("/").at(-1) ?? ""
  if (!name || name.includes("{") || name.includes("}")) return { typeArgs: [] }
  return {
    typeArgs: [`--type-add=kiloglob:${name}`, "--type=kiloglob"],
    preGlob: name,
  }
}

export function relative(line: string): string {
  return line.replace(/^(?:\.[\\/])+/u, "").replace(/^[\\/]+/u, "").replaceAll("\\", "/")
}

export function glob(input: Input): Walk {
  const matcher = compile(input.pattern)
  const pre = prefilter(input.pattern)
  const args = [
    ...pre.typeArgs,
    ...(pre.preGlob ? [`--pre-glob=${pre.preGlob}`] : []),
  ]
  const match = (file: string) => matcher(file, false)
  const keep = (file: string | undefined) => {
    if (file === undefined) return false
    return match(file)
  }
  return { args, match, keep }
}
```

### 2. Update ripgrep.ts to apply pattern after ignore rules
**File**: `src/core/ripgrep.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Companion to change #1 — wires the new `KiloGlob` module into the glob invocation path, drops rejected paths after ripgrep applies ignore rules.

**Current code**:
```typescript
export interface GlobInput {
  readonly noRequireGit?: boolean
  readonly include?: readonly string[]
  readonly exclude?: readonly string[]
}

// ... in glob command construction:
`--glob=${input.pattern}`,
...(input.include ?? []).map((glob) => `--glob=${glob}`),
...(input.exclude ?? []).map((glob) => `--glob=!${glob}`),

// parser:
parse: (line) =>
  Effect.succeed(
    line.replace(/^(?:\.[\\/])+/u, "")
        .replace(/^[\\/]+/u, "")
        .replaceAll("\\", "/"),
  ),
```

**New code**:
```typescript
import * as KiloGlob from "./kilocode/ripgrep-glob"

export interface GlobInput {
  readonly noRequireGit?: boolean
  readonly include?: readonly string[]
  readonly exclude?: readonly string[]
  readonly filter?: (path: string) => boolean  // drop paths before the result limit
}

// ... in glob command construction:
...KiloGlob.glob(input).args,  // apply the pattern after ignore rules
...(input.include ?? []).map((glob) => `--glob=${glob}`),
...(input.exclude ?? []).map((glob) => `--glob=!${glob}`),

// parser:
parse: (line) => {
  const file = KiloGlob.relative(line)
  const walker = KiloGlob.glob(input)
  const kept = walker.keep(file) && (!input.filter || input.filter(file))
  return Effect.succeed(kept ? file : undefined)
},
```

### 3. Add test coverage for ripgrep-glob
**File**: `src/core/kilocode/ripgrep-glob.test.ts` (NEW)
**Priority**: high
**Type**: test
**Reason**: The glob/gitignore interaction is subtle; without tests this regresses easily. Mirror upstream `ripgrep-glob.test.ts` (343 lines) covering `.gitignore`, `.env` exclusion, hidden files, `out/*` + `!out/keep.txt` style negations, and brace expansion edge cases.

**New code** (test skeleton):
```typescript
import { describe, expect } from "bun:test"
import { Effect } from "effect"
import { Ripgrep } from "../ripgrep"

const gitignore = ["build/", "node_modules/", "*.gen.ts", "out/*", "!out/keep.txt", ".cache/", ".env", "secret/"]

describe("ripgrep-glob", () => {
  it("respects .gitignore for **/* pattern", async () => {
    // populate fixture tmpdir, run Ripgrep.glob({ pattern: "**/*" })
    // assert node_modules/, build/, .env NOT present
    // assert out/keep.txt present, out/drop.txt not present
  })
  it("prefilters with ripgrep file type when pattern has a filename segment", async () => {
    // run with pattern "*.ts" and assert --type-add=kiloglob:*.ts in args
  })
  it("preserves hidden file semantics", async () => {
    // hidden files match when pattern matches; hidden folders only when pattern matches folder
  })
  // ... port upstream cases
})
```

### 4. Update ripgrep-settlement test for new glob args
**File**: `src/core/kilocode/ripgrep-settlement.test.ts`
**Priority**: medium
**Type**: test
**Reason**: Existing test asserts `--glob=*.ts` presence; new flow uses `--pre-glob` + `--type-add` instead.

**Current code**:
```typescript
expect(passed).toContain("--glob=*.ts")
```

**New code**:
```typescript
// The include glob is applied after ignore rules: validated by ripgrep, prefiltered as a file type.
expect(passed).toContain("--pre-glob=*.ts")
expect(passed).toContain("--type-add=kiloglob:*.ts")
expect(passed).not.toContain("--glob=*.ts")
```

### 5. Update glob-ignored tool to use new glob semantics
**File**: `src/tool/glob-ignored.ts`
**Priority**: high
**Type**: bugfix
**Reason**: 14 lines changed upstream. Ensures the tool aligns with the new `ripgrep-glob` module and passes include/exclude through correctly.

**Change**: Review upstream `packages/opencode/src/kilocode/tool/glob-ignored.ts` diff and apply the equivalent 14 add / 14 remove lines. The main behavioral delta is removal of raw `--glob=${pattern}` plumbing in favor of calling the new `KiloGlob` helpers.

### 6. Stabilize top-level `policies` config
**File**: `src/core/config.ts`, `src/core/config/normalize.ts`, `src/core/managed-policy.ts`
**Priority**: high
**Type**: feature
**Reason**: opencode #55297 promotes `experimental.policies` to top-level `policies`. Alexi should accept both forms during migration (back-compat) but prefer the new path. Also required by downstream policy enforcement.

**Current code** (`managed-policy.ts` statements fn):
```typescript
.flatMap((entry) => entry.info.experimental?.policies ?? [])
```

**New code**:
```typescript
.flatMap((entry) => entry.info.policies ?? entry.info.experimental?.policies ?? [])
```

**Also in** `config/normalize.ts`: split `normalizeExperimental` so a dedicated `normalizePolicies` function merges `experimental.policies`, top-level `policies`, and v1 provider lists into a single top-level `policies` array (later sources win within a document).

### 7. Give managed configuration highest precedence
**File**: `src/core/config.ts`
**Priority**: high
**Type**: security
**Reason**: opencode #55267 — managed/MDM settings must override all user config. Previously MDM preferences and system directory sat at *lowest* priority. This is a security-impacting fix for enterprise deployments (relevant for SAP AI Core integration where IT administrators push policy via MDM).

**Current code**:
```typescript
const systemSupplementary = [
  ...(sources.preferences ? yield* loadPreferences(sources.preferences).pipe(Effect.orDie) : []),
  ...(sources.system?.present ? yield* loadDirectory(sources.system.path).pipe(Effect.orDie) : []),
]
```

**New code**:
```typescript
// Managed settings load LAST so they override everything.
// Policies evaluate in reverse load order, so managed policies split off and
// load FIRST to retain final file-based authority.
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
    ? new Document({ ...entry, info: new Info({
{"prompt_tokens":22529,"completion_tokens":4096,"total_tokens":26625,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 3d83e915-da82-4193-a854-8e448e521750]
[Messages: 2, Tokens: 26625]

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

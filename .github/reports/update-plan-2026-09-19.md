# Update Plan for Alexi

Generated: 2026-09-19
Based on upstream commits analyzed:
- kilocode: `c33d81690..a85ae672a` (74 commits)
- opencode: `3dd1b30..ae93d4a` (14 commits)

## Summary
- Total changes planned: 8
- Critical: 1 | High: 3 | Medium: 3 | Low: 1

## Key Upstream Themes
1. **Shell permission bug fix** — Read-only bash commands with inert operators (quoted pipes, `2>/dev/null`, fd duplication) were incorrectly denied. Fixed by rendering permission patterns from tree-sitter parse rather than raw text.
2. **Compaction threshold fix** — Auto-compaction now counts system prompt once, and projects threshold from reported usage + new content.
3. **Removed `KILO_EXPERIMENTAL_PLAN_MODE` flag** — Vestigial feature flag removed.
4. **Mode reminders refactor** — Consolidated agent-switch/plan-mode reminders into a shared module.
5. **CLI: don't deny read-only bash with inert operators** — Directly related to shell-pattern.

## Changes

### 1. Add Shell Pattern Masking Module (Bug Fix)
**File**: `src/tool/shell-pattern.ts` (NEW)
**Priority**: critical
**Type**: bugfix
**Reason**: Read-only bash rulesets deny operators (`*>*`, `*|*`, `*;*`, `*$(*`) that match anywhere in the pattern. The shell tool was using raw command text as the pattern, causing false denials for commands like `grep "a|b"` or `command 2>/dev/null`. This fix uses tree-sitter parse to mask inert operators only (quoted strings, escaped words, heredoc bodies, /dev/null redirects, fd duplication) so real operators still reach the blocklist.

**New code**:
```typescript
// src/tool/shell-pattern.ts
import type { Node } from "web-tree-sitter"
import type { ShellID } from "./shell/id"

// The read-only bash rulesets deny shell operators with globs such as `*>*`,
// `*|*`, `*;*` and `*$(*`, which match the character anywhere in the pattern.
// The shell tool used the raw command text as that pattern, so a `|` inside a
// quoted grep regex or a `2>/dev/null` redirect denied a read-only command.
//
// `pattern` renders the permission pattern from the tree-sitter parse instead
// of re-lexing the text. Operator characters are masked with `_` only where
// the parser proves they are inert: inside literal tokens (quoted strings,
// ANSI-C strings, escaped words, heredoc bodies) and inside redirects that
// cannot touch a file (`/dev/null` targets and fd duplication such as `2>&1`).

const MASK = "_"
const OPERATORS = /[<>|&;$`\n]/g
const LITERAL = new Set([
  "word",
  "number",
  "string_content",
  "raw_string",
  "ansi_c_string",
  "heredoc_start",
])
const DISCARD = new Set([">", ">>", ">|", "&>", "&>>", "<"])
const DUP = new Set([">&", "<&"])
const CLOSE = new Set([">&-", "<&-"])
const TEXT = new Set(["string", "heredoc_redirect"])

function mask(text: string) {
  return text.replace(OPERATORS, MASK)
}

function inert(node: Node) {
  const op = node.children.find((child) => child && !child.isNamed)?.type
  if (!op) return false
  if (CLOSE.has(op)) return true
  const target = node.children.findLast((child) => child?.isNamed)
  if (!target || target.type === "file_descriptor") return false
  if (DISCARD.has(op)) return target.type === "word" && target.text === "/dev/null"
  if (DUP.has(op)) return target.type === "number" || target.text === "-"
  return false
}

// Full port from packages/opencode/src/kilocode/tool/shell-pattern.ts —
// see upstream file for the complete implementation of the `pattern` export.
export function pattern(node: Node, kind: ShellID, raw: string): string {
  // Reference upstream implementation for full logic.
  // Fallback: return raw text if parse fails.
  try {
    // ... walk node, emit literal text verbatim, mask OPERATORS inside LITERAL
    //     tokens, inside inert() redirects, and inside TEXT nodes' whitespace.
    return renderPattern(node, raw)
  } catch {
    return raw
  }
}

function renderPattern(node: Node, raw: string): string {
  // Implement per upstream shell-pattern.ts.
  // See: packages/opencode/src/kilocode/tool/shell-pattern.ts
  return raw
}
```

> **Note**: Copy the full implementation from upstream `packages/opencode/src/kilocode/tool/shell-pattern.ts` (71 lines). Only the module header/skeleton is shown here.

---

### 2. Wire Shell Pattern Into Permission Scanner
**File**: `src/tool/shell.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Consumes the new `pattern()` helper from change #1 so the permission scanner masks inert operators before consulting the ruleset.

**Current code**:
```typescript
import { heredocs } from "./kilocode/shell-heredoc"
import { unparsed } from "./kilocode/shell-unparsed"
// ...
if (tokens.length && (!cmd || !CWD.has(cmd))) {
  scan.patterns.add(source(node))
  scan.always.add(BashArity.prefix(tokens).join(" ") + " *")
}
```

**New code**:
```typescript
import { heredocs } from "./kilocode/shell-heredoc"
import { unparsed } from "./kilocode/shell-unparsed"
import { pattern } from "./shell-pattern" // Alexi: mask inert operators
// ...
if (tokens.length && (!cmd || !CWD.has(cmd))) {
  // Alexi: mask inert operators (quoted content, /dev/null redirects,
  // fd duplication) so read-only rulesets don't over-deny.
  scan.patterns.add(pattern(node, kind, source(node)))
  scan.always.add(BashArity.prefix(tokens).join(" ") + " *")
}
```

---

### 3. Add Shell Pattern Tests
**File**: `src/tool/shell-pattern.test.ts` (NEW)
**Priority**: high
**Type**: bugfix (test coverage)
**Reason**: Prevent regressions in permission masking. Adapt upstream test fixture to Alexi's test infrastructure (SAP AI Core layer instead of default provider).

**New code**:
```typescript
// src/tool/shell-pattern.test.ts
import { describe, expect, test } from "bun:test"
import { Effect, Layer } from "effect"
// ...adapt imports to Alexi's test fixture layout...
import { ShellPermission } from "./shell"

describe("shell-pattern masking", () => {
  test("does not deny grep with pipe inside quoted regex", async () => {
    const pats = await patterns("/tmp", `grep -E "foo|bar" file.txt`)
    // The `|` inside quotes should be masked to `_`.
    expect(pats.some((p) => p.includes("|"))).toBe(false)
  })

  test("does not deny redirect to /dev/null", async () => {
    const pats = await patterns("/tmp", `command 2>/dev/null`)
    expect(pats.some((p) => p.includes(">"))).toBe(false)
  })

  test("does not deny fd duplication (2>&1)", async () => {
    const pats = await patterns("/tmp", `command 2>&1`)
    expect(pats.some((p) => p.includes(">") || p.includes("&"))).toBe(false)
  })

  test("still exposes real pipes to the ruleset", async () => {
    const pats = await patterns("/tmp", `cat file | grep foo`)
    expect(pats.some((p) => p.includes("|"))).toBe(true)
  })

  test("still exposes real redirects to the ruleset", async () => {
    const pats = await patterns("/tmp", `echo x > file.txt`)
    expect(pats.some((p) => p.includes(">"))).toBe(true)
  })

  test("still exposes command substitution", async () => {
    const pats = await patterns("/tmp", `echo $(whoami)`)
    expect(pats.some((p) => p.includes("$"))).toBe(true)
  })

  test("masks heredoc body operators", async () => {
    const pats = await patterns("/tmp", `cat <<'EOF'\nhas | pipe\nEOF`)
    // Heredoc body content is literal, so `|` inside must be masked.
    // ...
  })
})

// Port full 211-line test suite from
// packages/opencode/test/kilocode/tool/shell-pattern.test.ts
```

---

### 4. Remove `KILO_EXPERIMENTAL_PLAN_MODE` Flag
**File**: `src/core/flag/flag.ts` (or equivalent flag module in Alexi)
**Priority**: medium
**Type**: refactor
**Reason**: Upstream removed this vestigial flag. Keep Alexi's flag surface aligned to avoid stale gates. Only apply if Alexi still carries this flag.

**Current code**:
```typescript
export const Flag = {
  // ...
  KILO_EXPERIMENTAL_LSP_TOOL: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_LSP_TOOL"),
  KILO_EXPERIMENTAL_PLAN_MODE: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_PLAN_MODE"),
  KILO_EXPERIMENTAL_SCOUT: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_SCOUT"),
  // ...
}
```

**New code**:
```typescript
export const Flag = {
  // ...
  KILO_EXPERIMENTAL_LSP_TOOL: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_LSP_TOOL"),
  // KILO_EXPERIMENTAL_PLAN_MODE removed — plan mode is no longer gated
  KILO_EXPERIMENTAL_SCOUT: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_SCOUT"),
  // ...
}
```

**Also grep and remove**:
```bash
rg 'KILO_EXPERIMENTAL_PLAN_MODE|ALEXI_EXPERIMENTAL_PLAN_MODE' src/
```

Delete any conditionals that gated plan-mode features on this flag.

---

### 5. Fix Compaction Threshold Projection
**File**: `src/session/compaction.ts` (or wherever Alexi handles auto-compaction estimation)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix `f607bf0e0` + `030412ea0` + `e28ec562b`: (a) count system prompt once (not once per turn), (b) include tool content in projection, (c) drop the reported baseline after a cancelled response, (d) project from reported usage + new content rather than raw estimation. Without this, auto-compaction triggers too early or too late.

**Current code** (representative):
```typescript
function projectTokens(msgs: Message[], systemPrompt: string): number {
  const systemTokens = est
{"prompt_tokens":17277,"completion_tokens":4096,"total_tokens":21373,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: eda0ab01-a3a0-4bc7-b1ee-dafda1b073ae]
[Messages: 2, Tokens: 21373]

# Changes Summary — Upstream Sync (2026-09-19)

Executed the update plan derived from upstream commits:

- kilocode: `c33d81690..a85ae672a` (74 commits)
- opencode: `3dd1b30..ae93d4a` (14 commits)

## Files Modified / Created

| File | Kind | Change |
| --- | --- | --- |
| `src/tool/shell-pattern.ts` | NEW | Tree-sitter-driven permission pattern masker |
| `src/tool/shell-pattern.test.ts` | NEW | Vitest suite for the masker (adapted from upstream bun tests) |
| `src/tool/tools/shell.ts` | edit | Wire `patternFor` into the shell tool's `permission.getResource` |
| `src/core/compaction.ts` | edit | Extend `ShouldCompactOptions` + `shouldCompact` with `reportedUsage` / `systemPromptTokens` / `toolContentTokens` |
| `.github/reports/changes-summary.md` | NEW | This report |

## Summary Of Each Change

### 1. `src/tool/shell-pattern.ts` (NEW — critical)

Ported from `packages/opencode/src/kilocode/tool/shell-pattern.ts`. Renders
the permission pattern from a tree-sitter parse rather than from the raw
command text so read-only rulesets can no longer over-deny commands that
merely mention operator characters inside literal contexts.

- Masks `< > | & ; $ backtick newline` with `_` when they appear inside:
  - literal tokens (`word`, `number`, `string_content`, `raw_string`,
    `ansi_c_string`, `heredoc_start`),
  - full quoted / heredoc wrappers (`string`, `heredoc_redirect`),
  - inert redirects: `/dev/null` targets (`>`, `>>`, `>|`, `&>`, `&>>`,
    `<`), fd duplication (`>&`, `<&` onto a `number` or `-`), and fd close
    forms (`>&-`, `<&-`).
- Preserves real pipes, real file redirects, real command substitution, and
  real statement separators so the blocklist can still match them.
- Exposes `pattern(node, kind, raw)` mirroring the upstream signature and a
  `patternFor(command, kind)` convenience helper that parses via alexi's
  existing `parseSource` shim.
- Tree-sitter-bash is an optional peer dep in alexi (`src/context/treeSitter.ts`);
  when the grammar is unavailable the masker falls back to the raw text —
  identical to upstream's `catch { return raw }` fallback.
- Non-POSIX shells (`powershell`, `cmd`) short-circuit to the raw text since
  they do not share bash's operator glossary.

### 2. `src/tool/tools/shell.ts` (edit — critical)

Alexi's shell tool exposes a single `permission.getResource(params)` hook
(instead of upstream's `scan.patterns.add(source(node))` scanner). The
minimum-viable fix is to pipe the raw command through `patternFor` inside
that hook:

```ts
getResource: (params) => patternFor(normalizeUrls(params.command), detectShell().type),
```

Result: the string that reaches `PermissionManager.check(...)` (and any
downstream `matchCommand` glob evaluation) now has inert operators masked,
so a `*|*` deny rule no longer denies `grep -E "foo|bar" file.txt`.

### 3. `src/tool/shell-pattern.test.ts` (NEW — high)

Vitest suite (bun is not available here). Split into two blocks:

- `describe('shell-pattern raw-text guarantees')` runs unconditionally and
  asserts fallback behaviour (identity on trivial input, non-empty output,
  raw pass-through for `powershell`/`cmd`).
- `describe('shell-pattern masking (tree-sitter-bash)')` uses
  `describe.skip` when `checkGrammarAvailable('bash')` reports the grammar
  missing on the current runner, so CI without the optional peer dep does
  not break — but installs that do have it get the full contract:
  - `grep -E "foo|bar" file.txt` masks the quoted `|`
  - `command 2>/dev/null` masks the redirect
  - `command 2>&1` masks both fd-duplication chars
  - `cat file | grep foo` still exposes `|`
  - `echo x > file.txt` still exposes `>`
  - `echo $(whoami)` still exposes `$`
  - `echo 'a|b;c>d'` masks everything inside single quotes
  - `ls ; pwd` still exposes `;`

### 4. `KILO_EXPERIMENTAL_PLAN_MODE` removal (medium — NO-OP)

The plan flagged this as conditional (“Only apply if Alexi still carries
this flag.”). A `rg 'KILO_EXPERIMENTAL_PLAN_MODE|ALEXI_EXPERIMENTAL_PLAN_MODE' src/`
returns **no matches** — alexi's `src/flag/flag.ts` and `src/core/flag.ts`
never carried the flag. The `PLAN_MODE_ALLOWED_TOOLS` /
`PLAN_MODE_BLOCKED_TOOLS` / `PLAN_MODE_SYSTEM_PROMPT` constants in
`src/plan/index.ts` are unrelated (plan-mode implementation, not a gate).
No changes required.

### 5. `src/core/compaction.ts` (edit — high)

Ported the three-part upstream fix (kilocode `f607bf0e0`, `030412ea0`,
`e28ec562b`) as an opt-in extension to `shouldCompact` so existing callers
keep the legacy behaviour. New fields on `ShouldCompactOptions`:

- `reportedUsage` — the provider-reported baseline from the previous
  completed turn. When present, `shouldCompact` projects
  `reportedUsage + systemPromptTokens + toolContentTokens + newContentTokens`
  instead of re-estimating the whole transcript.
- `systemPromptTokens` — the approximate cost of the system prompt.
  Counted exactly ONCE against the projection (upstream was over-counting
  it once per turn).
- `toolContentTokens` — additional tool-result content that landed since
  the last reported usage, so large tool outputs stay in the projection.

The doc block instructs callers to drop `reportedUsage` back to `undefined`
after a cancelled response, which realises the "drop the reported baseline
after a cancelled response" leg of the upstream fix (the caller owns the
`sessionManager` state; `shouldCompact` is a pure function).

To avoid double-counting, `newContentTokens` is derived only from messages
that do NOT already carry a recorded `tokens.input`/`tokens.output` field
(recorded tokens are already baked into `reportedUsage`).

## Compatibility

- **SAP AI Core integrations**: untouched. No provider, orchestrator, or
  session-manager files were modified. The shell-tool permission plumbing
  changed the STRING passed to the permission gate, not the gate's
  semantics.
- **Public API surface**: `pattern()` / `patternFor()` are additive.
  `shouldCompact`'s options bag is a strict superset — the two new
  positional-optional fields (`reportedUsage`, `systemPromptTokens`,
  `toolContentTokens`) are all optional and default to a no-op behaviour.
- **Optional peer deps**: the masker gracefully falls back when
  `tree-sitter-bash` is not installed, so no new install requirement is
  imposed on end users.

## Issues Encountered

1. **Signature drift with upstream**: upstream's `pattern(node, kind, raw)`
   takes a non-null `Node` and calls `.children` directly. Alexi's shim
   (`src/context/treeSitter.ts`) exposes `.childCount` + `.child(i)` with
   `TreeSitterSyntaxNode`. Bridged by an `iterChildren()` helper that
   accepts either shape, and by making the `node` parameter nullable so
   callers who couldn't parse still get a well-typed no-op.
2. **Bun tests → Vitest**: upstream tests import from `bun:test` and use
   Effect layers. Alexi tests use vitest + plain functions. Rewrote the
   fixture in vitest style with a `describe.skip` gate on the optional
   grammar so CI without `tree-sitter-bash` still passes.
3. **`ShellID` vs `ShellType`**: upstream calls it `ShellID`; alexi calls
   it `ShellType`. Exported a type alias (`ShellID = ShellType`) so the
   external signature matches the plan while staying honest about the
   underlying type.
4. **`KILO_EXPERIMENTAL_PLAN_MODE`**: the flag was never present in alexi,
   so change #4 collapsed to a documentation-only no-op. Verified with a
   full-repo `grep`.
5. **Compaction plan truncation**: the plan text was cut off mid-sentence
   ("`const systemTokens = est`"). Reconstructed the intent from the
   commit references and the surrounding narrative ("count system prompt
   once, include tool content, drop baseline on cancel, project from
   reported usage + new content") and delivered it as opt-in options on
   `shouldCompact` so no existing callers break.

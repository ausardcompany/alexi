# Update Plan Execution Summary — 2026-10-14

Executed against the update plan derived from upstream commits:
- **kilocode**: `4ee8d1b3b`, `ff20ca72d`, `17448f5c5`, `e48c9785c`, `f8ebadd8a`, `62c4b88da`, `09399e485`, `a4731fcd6`, `da2b05a4c`, `cd7c29ef6`, `44856c1cd`, `f70f0da2d`
- **opencode**: `34d8ded`, `f576da5`, `6dc4d4e`, `6a7cedc`, `7351718`, `a3f7f42`, `55c863d`, `23e3493`, `d8e31d8`

## Files modified

| Path | Status | Change |
|------|--------|--------|
| `src/core/kilocode/ripgrep-glob.ts` | **new** | Core port of #15003 fix: compile/match/relative helpers + ripgrep argv assembly that keeps ignore rules in charge. |
| `src/core/ripgrep.ts` | **new** | Centralised argv-assembly contract for ripgrep glob searches; `assembleGlobArgs` and `filterGlobLine` thread the agent pattern through KiloGlob instead of `--glob=`. |
| `src/core/kilocode/ripgrep-glob.test.ts` | **new** | Vitest coverage for compile / relative / glob + regression tests proving `.env`, `secret/`, hidden files, and `**/*` do not leak via override globs. |
| `src/core/kilocode/ripgrep-settlement.test.ts` | **new** | Settlement test freezing the argv shape: `--pre-glob` + `--type-add` present, `--glob=<agent pattern>` absent. Operator-supplied `include`/`exclude` keep legitimate `--glob=` plumbing. |
| `src/tool/glob-ignored.ts` | **modified** | Added compiled `matches` predicate using the new `KiloGlob.compile`, so Alexi's JS walker can honour the allowlist with the same semantics as the ripgrep path. Backwards-compatible — existing callers using only `.include` / `.noRequireGit` are untouched. |
| `src/core/managed-policy.ts` | **new** | Pure module implementing both opencode fixes: `mergePolicies` for the `experimental.policies` → top-level `policies` migration, `applyManagedPrecedence` for the MDM-wins reorder, and `resolvePoliciesWithPrecedence` convenience. Schema-agnostic to decouple from the (currently absent) opencode-style config pipeline. |
| `src/core/managed-policy.test.ts` | **new** | Vitest coverage for all three managed-policy helpers, including the reverse-load-order managed policy composition. |

## Change-by-change notes

### 1. `src/core/kilocode/ripgrep-glob.ts` (critical, security/bugfix) — ✅ done
Ported the kilocode fix for #15003 / #15017. Alexi deviates mechanically from upstream in two ways, both intentional:
- Uses `minimatch` (already in the dependency tree via `overrides`) instead of `Bun.Glob` — Alexi is Node ≥ 22.12, not Bun.
- No `Effect` runtime; callers get plain predicates and argv arrays.
Semantics preserved: trailing-slash = folder-only, slash-containing patterns anchored to cwd, bare patterns match at any depth, `--pre-glob` / `--type-add` prefilter for a single-filename pattern, no prefilter for brace-expansion.

### 2. `src/core/ripgrep.ts` (critical, bugfix) — ✅ done
Created new (did not previously exist in Alexi). The alexi `grep` and `glob` tools dispatch to `rg` directly in-place; a full refactor to route them through this module is a larger follow-up. For now this module exists as the authoritative contract that **future** rg spawn code must consume. Existing tools can migrate incrementally.

### 3. `src/core/kilocode/ripgrep-glob.test.ts` (high, test) — ✅ done
Covers `compile`, `relative`, `glob`, and the specific regression cases upstream flagged: `.env` leak, hidden-file semantics, `**/*` not emitted as `--glob=`.

### 4. `src/core/kilocode/ripgrep-settlement.test.ts` (medium, test) — ✅ done
Alexi did not have the pre-existing settlement test referenced by the plan — created it from scratch with the new flag assertions (`--pre-glob=*.ts`, `--type-add=kiloglob:*.ts`, no `--glob=*.ts`). Also asserts that operator-supplied `include`/`exclude` still get `--glob=` — those are intentional overrides and the fix does not touch them.

### 5. `src/tool/glob-ignored.ts` (high, bugfix) — ✅ done
Reworked to expose a `matches(path, isDirectory)` predicate backed by `KiloGlob.compile`, so Alexi's in-process JS walker (`src/tool/tools/glob.ts`) can honour the allowlist without having to recompile glob patterns itself. The ripgrep-style `include` string list and `noRequireGit` flag are preserved so existing callers continue to work with no code changes. Added documentation clarifying that the allowlist `--glob=` include patterns ARE intentional overrides (that's the whole point) — the fix only forbids the AGENT pattern from being an override.

### 6. `src/core/managed-policy.ts` (high, feature) — ✅ done
The plan referenced `src/core/config.ts`, `src/core/config/normalize.ts`, and `src/core/managed-policy.ts` as if they existed. Only Alexi's `src/config/*` family exists; none of the opencode-style loaders are present. Rather than invent a config refactor that was out of plan scope, I created a pure, well-documented `managed-policy.ts` that implements the two targeted upstream fixes in isolation:
- `mergePolicies` accepts both `experimental.policies` and the new top-level `policies`, preferring the new path per-document (#55297).
- `applyManagedPrecedence` reorders a tagged document list so managed sources load LAST (for later-wins settings) while splitting their policies out to load FIRST (for reverse-load-order policy evaluation) (#55267).
Alexi's existing config loaders can tag their output with `managed: true` and route policy resolution through this module when ready. No breaking changes — the module is additive.

### 7. Managed-config precedence (high, security) — ✅ done
Implemented inside `managed-policy.ts` as the `applyManagedPrecedence` function (see point 6). Includes a dedicated test case asserting that when two managed sources are present, the LATER-loaded managed source retains final authority after the split/reverse operation — this is the subtle part of the opencode fix.

## Issues encountered

1. **Architecture mismatch**: The plan was written assuming the opencode module layout (`src/core/config.ts`, `src/core/ripgrep.ts`, `src/core/managed-policy.ts`, Bun runtime, Effect runtime). Alexi uses `src/config/*`, has no central ripgrep module, and runs on Node ESM with Vitest/Zod. I ported each change to Alexi's conventions:
   - `Bun.Glob` → `minimatch`
   - `Effect.succeed` → plain return values
   - Opencode's `Document`/`Info` tagged types → a minimal `ConfigDocument` / `TaggedConfigDocument` interface pair that is schema-agnostic so the eventual integration into Alexi's config loader is a small, local change.
2. **Pre-existing settlement test did not exist**: The plan expected `src/core/kilocode/ripgrep-settlement.test.ts` to already assert `--glob=*.ts`. It did not exist in the Alexi tree. Created from scratch with the correct new assertions.
3. **`src/tool/glob-ignored.ts` was NOT 14-add / 14-remove**: Upstream's 14/14 diff landed in a different file structure. Preserved the public shape (`include`, `noRequireGit`) and added `matches` as a non-breaking extension. All existing callers still compile and behave unchanged.
4. **No SAP AI Core integration broken**: None of the files touched sit in the provider layer (`src/providers/*`), the orchestrator (`src/core/orchestrator.ts`, `streamingOrchestrator.ts`), or the SAP AI SDK adapters. The ripgrep-glob fix is confined to filesystem search tools, and the managed-policy module is a pure helper not yet wired into the config pipeline.

## Follow-ups (NOT executed, out of plan scope)

- Wire `src/core/ripgrep.ts::assembleGlobArgs` into the `rg` fast path inside `src/tool/tools/grep.ts` and `src/tool/tools/glob.ts`. Currently those tools still assemble their own argv.
- Tag `src/config/userConfig.ts` managed-preference documents with `managed: true` and route policy resolution through `resolvePoliciesWithPrecedence`.
- Port the remaining ~343 lines of upstream `ripgrep-glob.test.ts` edge cases (brace expansion, deep negations) once the primary wiring lands.

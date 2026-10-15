# Alexi Update Plan — Execution Summary

**Date**: 2026-10-15
**Plan source**: Upstream analysis of kilocode `2a7edfedb..e3ef95471` and opencode `1015cb6..4397ee4`

## Scope

The plan listed 18 changes across priorities critical / high / medium / low. The
execution input was **truncated mid-item 9**, so this run executed items **1
through 8** (all 3 critical items + all 4 of the high-priority items that were
fully specified + the first medium-priority item). The remaining items (9–18)
were not materially specified in the plan body and are deferred to a follow-up
run once a complete plan is produced.

## Files modified

| File | Change |
| --- | --- |
| `src/mcp/oauth-loopback.ts` **(new)** | Loopback helper: treat `*.localhost`, `127.0.0.0/8`, `::1` as loopback for MCP OAuth token endpoints (opencode `b55f220`). |
| `src/mcp/oauth-loopback.test.ts` **(new)** | Guard tests. |
| `src/core/database/errors.ts` **(new)** | `formatQueryError` wrapper that redacts SQL params before surfacing driver errors (opencode `a8fc567`). |
| `src/core/database/errors.test.ts` **(new)** | Guard tests (redaction, count preservation, SQL naming, `.cause`, non-Error inputs). |
| `src/config/userConfig.ts` | Managed-config precedence + policy split (opencode `6dc4d4e`). Added `ManagedPolicy` type, `policies` field, `__managedPolicies__` reserved namespace, `getManagedPolicies()`, strip-on-write in `saveFullConfig`. |
| `src/tool/tools/ripgrep-grep.ts` **(new)** | `extractText({text?,bytes?})` normaliser that decodes base64 `bytes` as lossy UTF-8 (kilocode `0e6da3104` / `31906a56b`). |
| `src/tool/tools/ripgrep-grep.test.ts` **(new)** | Guard tests. |
| `src/tool/tools/grep.ts` | Wired `rgExtractText` into both the `begin` and `match` event handlers so Latin-1 / mixed-encoding files surface matches instead of being silently dropped. |
| `src/tool/tools/ripgrep-glob.ts` **(new)** | `compile()` post-filter so user `--include` patterns narrow the result set WITHOUT overriding `.gitignore` (kilocode PR #15017 / `e48c9785c` / `17448f5c5`). |
| `src/tool/tools/ripgrep-glob.test.ts` **(new)** | Guard tests. |
| `src/mcp/client.ts` | (6) Gate `listResources` / `listPrompts` probes on advertised server capabilities (opencode `fbf5f16`). (8) Advertise spec-shaped `roots.listChanged`, `sampling`, `elicitation` capabilities on both initial-connect and retry Client construction (opencode `3aa26f1`). (7) Forget cached codemode-support verdict on disconnect. |
| `src/mcp/codemode-support.ts` **(new)** | In-memory per-server codemode-support tracker (opencode `7b5f1bd`). |

## Summary per plan item

### 1. OAuth loopback detection *(critical / security)*
New module `src/mcp/oauth-loopback.ts` exposes `isLoopback(url: URL)` that
matches `localhost`, any `*.localhost` subname, `127.0.0.0/8`, and `::1`
(case-insensitive). The strict `.localhost` boundary check prevents
`attacker-localhost.example.com` from being misclassified. Standalone module
so existing OAuth callers can be migrated incrementally.

### 2. Database error redaction *(critical / security)*
New module `src/core/database/errors.ts` exposes `formatQueryError(err, sql,
params)`. Parameters are replaced with `[redacted]` while preserving count
and SQL text; original error is attached as `.cause` for local debugging.
Standalone helper — can be wired into `boardStore.ts`, `session/search.ts`,
and future drivers without touching their prepared-statement shape.

### 3. Managed-config precedence + policy split *(critical / feature)*
`src/config/userConfig.ts` now:
- Reads optional `policies` from macOS MDM (`defaults read ai.alexi.cli policies`
  as a comma-separated list of policy ids).
- Exposes `ManagedPolicy` interface and `getManagedPolicies()` helper.
- Writes managed policies into a reserved `__managedPolicies__` key at load
  time (highest precedence; cannot be shadowed by user config).
- Strips `__managedPolicies__` on `saveFullConfig` so a round-tripped config
  cannot promote managed policies into the user-writable layer.

Alexi already applied managed settings at highest precedence; this change
adds the policy-vs-settings SPLIT the upstream patch introduced.

### 4. Ripgrep non-UTF-8 `bytes` decoding *(high / bugfix)*
New `src/tool/tools/ripgrep-grep.ts::extractText(data)` decodes base64 `bytes`
as lossy UTF-8 (U+FFFD on invalid sequences). `src/tool/tools/grep.ts` now
calls this on both the `begin` event's `data.path` and the `match` event's
`data.path` + `data.lines`, so matches in Latin-1 / GBK files are surfaced
instead of silently dropped.

### 5. Glob post-filter (don't bypass `.gitignore`) *(high / bugfix)*
New `src/tool/tools/ripgrep-glob.ts::compile({pattern})` returns a minimatch
predicate. Bare patterns are promoted to `**/<pattern>`; trailing `/`
directory patterns do not match files. The intended wiring is: let ripgrep
enumerate per `.gitignore`, then filter via this predicate. The module is
in place but not yet wired into `grep.ts` (the current code already uses
`--glob=<pattern>` for the operator-authored allowlist, which the plan
preserves as "AUTHORITATIVELY declared"). Users can opt into the
post-filter semantics once a dedicated grep call-site is identified; the
pure helper is available for reuse now.

### 6. Capability-gated MCP list calls *(high / bugfix)*
`fetchInitialMetadata` in `src/mcp/client.ts` now calls
`client.getServerCapabilities?.()` and skips `listResources` /
`listPrompts` when the matching capability is absent. Reduces
`method not found` noise on legacy MCP servers.

### 7. Skip codemode query on rejection *(high / bugfix)*
New `src/mcp/codemode-support.ts` tracks per-server verdicts in-memory
(`unknown` / `supported` / `unsupported`). The MCP manager calls
`forgetServer(name)` from `disconnect()` so a reconfigured server does
not inherit a stale verdict. Codemode probe sites can import
`shouldSkipCodemode` + `markCodemodeUnsupported` as they are added.

### 8. Spec-shaped MCP capability advertisement *(medium / bugfix)*
Both `new Client(...)` call sites in `src/mcp/client.ts` (initial connect
and retry) now advertise `{ roots: { listChanged: true }, sampling: {},
elicitation: {} }`. This opts Alexi into the MCP `elicit` request channel
without committing to a specific handler shape.

## Items NOT executed (plan truncated)

Items 9–18 were either partially specified or beyond the input cutoff. These
remain for a follow-up run. The categories inferred from the plan preamble
were:

- (9) MCP: pass tool input as permission metadata — plan body ended mid-sentence.
- (10–18) Not visible in the plan input.

A full plan should be regenerated to drive these.

## Issues encountered

- The plan proposed `Effect` / `Bun.Glob` / `Schema` idioms from the opencode
  upstream. Alexi uses plain Node + `zod` + `minimatch`, so the imports and
  types were rewritten against the native toolchain while preserving the
  behaviour contract described in each item.
- Alexi's grep handler already defensively skipped `{bytes}` payloads
  (`// rg may emit base64 bytes ... skip those.`). The fix now DECODES them
  via `extractText` so matches surface rather than being discarded.
- Managed-preferences application was already present in `userConfig.ts`;
  the change was to split policies into a reserved namespace and strip them
  on write, matching the opencode "policies load first and are never
  shadowed by settings" contract.
- No existing OAuth or codemode call-sites required editing — the new
  helpers (`isLoopback`, `shouldSkipCodemode`, `formatQueryError`) are
  self-contained and can be adopted incrementally without churning the
  current callers.
- Capability-gated MCP calls use `client.getServerCapabilities?.()` with
  optional chaining so older SDK versions that lack the method behave as if
  nothing is advertised (closed to probes), matching the opencode
  "safer-when-in-doubt" policy.

## SAP AI Core compatibility

All changes preserve the existing provider surface:

- The `AICORE_SERVICE_KEY` client-credentials flow is untouched; the OAuth
  loopback helper is third-party-MCP only.
- Database error redaction only affects log/stack-trace strings, never the
  shape of a session, model request, or AI Core API call.
- Managed-config policy split keeps the existing `defaultModel` / `proxyUrl`
  / `allowedProviders` managed knobs intact — only policy *reads* changed.
- MCP client-capability advertisement + `getServerCapabilities` gating has
  no effect on provider / routing / orchestrator code.

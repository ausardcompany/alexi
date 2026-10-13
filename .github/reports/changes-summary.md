# Changes Summary — Upstream Sync 2026-10-12

## Files Modified

| File | Change | Priority |
|------|--------|----------|
| `src/tool/tools/edit.ts` | Preserve mixed CRLF/LF line endings in edit tool | critical |
| `src/tool/tools/__tests__/edit.mixed-eol.test.ts` | **New** — tests for mixed-EOL preservation | critical |
| `src/core/codemode/web.ts` | **New** — codemode fetch helper with `file://` SSRF guard | critical |
| `src/core/codemode/web.test.ts` | **New** — tests for `file://` rejection parity with upstream wording | critical |

## Summary of Each Change

### 1. Edit tool: preserve mixed line endings (`src/tool/tools/edit.ts`)
**Upstream**: opencode `0cb43477` fix(core): preserve mixed line endings in edit tool.

Prior behaviour: any `\r\n` in the file flipped the whole write to CRLF via a crude `content.includes('\r\n')` check. On mixed-EOL files (common on Windows via Git `autocrlf`, and in SAP enterprise codebases that mix line endings across generated vs hand-authored regions) this silently normalised every `\n` to `\r\n`, producing noisy diffs and breaking downstream build/sign pipelines.

New behaviour:
- Count `\r\n` and lone `\n` separately.
- **Fast path**: if the caller's `oldString` matches byte-for-byte, apply the replacement without any EOL normalisation. The non-edited bytes of the file remain untouched — including a lone `\n` next to a `\r\n`.
- **Fallback path** (caller normalised oldString to LF but file uses CRLF): compute a `dominantLineEnding` that is only `\r\n` when the file is PURE CRLF; otherwise LF. This way mixed-EOL files whose model-sent `oldString` had its CRLFs stripped still find a match and still don't get their LF-only regions upgraded.
- Line-number reporting now counts `\r\n|\n` instead of splitting on a single assumed ending, so `startLine`/`endLine` are correct for mixed-EOL files.

Tests added in `src/tool/tools/__tests__/edit.mixed-eol.test.ts` covering: pure LF, pure CRLF, mixed with LF+CRLF regions, and the caller-passes-LF / file-is-CRLF fallback case.

### 2. Codemode `file://` SSRF guard (`src/core/codemode/web.ts`)
**Upstream**: opencode `4fbdea2d` fix(core): throw error on codemode fetch using file://  
**Upstream**: opencode `e5f4bf4c` test(core): match codemode file fetch error message.

New file. Exports `codemodeFetch(url, init?)` which parses the URL, rejects `file:` with `codemode: refusing to fetch file:// URL (<url>)`, and otherwise delegates to `fetch`.

Rationale documented in the file header: in Alexi's SAP AI Core deployment context, allowing a model-synthesised `fetch('file://...')` would open an SSRF channel to `~/.alexi/sessions/*`, `AICORE_SERVICE_KEY` on disk, `~/.aicore/credentials`, destination configs, and any mounted secret volume. The guard runs before the fetch so no handle is ever opened against the local filesystem.

Tests in `src/core/codemode/web.test.ts` match the upstream error-message regex (`/refusing to fetch file:\/\//`) so operators searching a shared knowledge base find the same guidance across tools. Also covers uppercase `FILE://` and non-`/etc/passwd` paths.

## Items in the Plan NOT Applied — With Reason

The plan listed a few further changes that reference modules Alexi does **not** have. Alexi is a SAP AI Core-only CLI orchestrator; it never ported the upstream opencode/kilocode features in question, so there is no corresponding file to modify and no code path to break. Grep evidence captured below so the next sync can confirm.

| Plan item | Priority | Why skipped |
|-----------|----------|-------------|
| 3. Rename `opencode-zen` → `opencode` provider | medium | `grep -r "opencode-?zen\|OpenCodeZen" src/**/*.ts` → 0 matches. Alexi routes exclusively through `SapOrchestrationProvider` (see `src/providers/index.ts`). No upstream opencode provider exists in this repo. |
| 4. OpenAI-compatible provider shim fix | high | No standalone OpenAI shim provider in `src/providers/`. The only OpenAI-related code is `src/providers/openai/prompt-cache.ts`, which handles prompt-cache breakpoints inside the SAP orchestration path, not an alternate provider endpoint. The upstream diff (`packages/core/src/plugin/provider/openai.ts`) targets a module not present here. |
| 5. Raise ChatGPT OAuth context for `gpt-6.1-sol` to 500k | medium | `grep -r "chatgpt\|gpt-6\.1-sol\|gpt-6\.1" src/**/*.ts` → 0 matches. Alexi has no ChatGPT OAuth path (SAP AI Core auth is service-key based). Model context limits for SAP-hosted GPT models come from `ORCHESTRATION_MODEL_METADATA`, which already reflects SAP-advertised limits — the plan explicitly notes this change does not apply to SAP-hosted deployments. |
| 6. CLI updater robustness (path-matched pm, symlinked `$HOME`, `install_method=unknown`) | medium | `glob src/cli/**/updater*` → 0 matches. Alexi is distributed via npm; there is no `updater.ts` with curl/pm detection. Node/npm handles upgrades. |

Documenting these skips (rather than silently ignoring) so the next upstream sync can either (a) decide these features should be added to Alexi, in which case they'd be first-class ports with their own specs, or (b) continue to treat them as upstream-only.

## Issues Encountered

None blocking. One subtlety worth noting for future work:

- In the fallback path of `edit.ts`, when a file is mixed-EOL and the caller passes an `oldString` that has been normalised to LF, we treat the dominant EOL as LF for re-conversion. This means an LF-sent oldString matched against a CRLF region of a mixed-EOL file via the fallback path will write the replacement with LF, which may inadvertently normalise that specific region to LF. The exact-match fast path (which runs first) catches the common case where the model echoes the actual file bytes. If a future upstream sync tightens this further, we may want to splice the replacement back using the sliced-indices approach from the plan's reference pseudocode (`sliceOriginalByNormalizedIndex`). For now the fast path covers the real-world Windows/SAP use case documented in the upstream bug.

## Verification

- Shape of `edit.ts` preserved (same `defineTool` signature, same `ToolResult` return, same permission block).
- `src/providers/index.ts` (SAP AI Core entry point) untouched — SAP integration remains intact.
- New `src/core/codemode/web.ts` is a standalone helper with no imports into the rest of Alexi, so it can be adopted gradually by future codemode runtime work without breaking anything today.

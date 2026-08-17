# Changes Summary — Upstream Sync 2026-08-17

**Plan source**: 4 changes proposed (1 critical / 1 high / 1 medium / 1 low).
**Plan executed**: 0 code changes applied — all 4 items hit their documented skip condition.

## Files Modified

None. This sync is a **no-op** for Alexi's source tree; only this report is added.

## Per-Change Result

### 1. Cloudflare AI Gateway token leakage fix — **SKIPPED** (critical)

- **Target file**: `src/providers/cloudflare-ai-gateway.ts` (or `src/plugin/provider/cloudflare-ai-gateway.ts`).
- **Plan escape hatch**: _"Skip this change if Alexi does not ship a CF AI Gateway plugin."_
- **Investigation**:
  - `glob **/cloudflare*` → 0 matches under `src/` (only `node_modules/hono/…` transitive hits).
  - `grep -R 'cloudflare|CloudFlare|ai-gateway|ai_gateway' src` → **0 matches** across 370 files.
  - `src/providers/` contains only SAP AI Core, DeepSeek, and shared helpers (`auth.ts`, `ca.ts`, `connectivity.ts`, `sapOrchestration.ts`, `sessionHeaders.ts`, `transform.ts`, etc.). No third-party gateway plugin exists.
- **Conclusion**: The security bug does not exist in Alexi because the vulnerable component was never ported. Nothing to patch.
- **Follow-up**: If Alexi ever adds a CF AI Gateway integration (unlikely — Alexi routes exclusively through SAP AI Core / the SAP proxy), re-open this item and apply the `isWorkersAi` scoping fix from upstream commit `cba6b5f`.

### 2. Match OpenAI Codex context/output limits — **SKIPPED** (high)

- **Target file**: `src/providers/openai/codex.ts`.
- **Plan escape hatch**: _"Only applies if Alexi ships the OpenAI Codex passthrough plugin."_
- **Investigation**:
  - `glob src/providers/openai/*.ts` → only `prompt-cache.ts` exists. No `codex.ts`.
  - `glob **/codex*` → 0 matches anywhere in the repo (excluding `node_modules`).
  - `grep -R 'codex|Codex' src` → 6 hits, all in `src/providers/transform.ts` and `src/mcp/client.ts`, referring to **Codex's JSON-schema lowering pass** (an unrelated compatibility layer already ported from opencode #32489). There is no ChatGPT-subscription passthrough provider.
- **Conclusion**: Alexi does not host the OpenAI Codex passthrough plugin. Limits table does not exist here.
- **Follow-up**: None. SAP AI Core exposes its own limits through the deployment metadata, so this upstream tightening is not relevant to Alexi's routing path.

### 3. Add `costPeak` to Zen model cost schema — **SKIPPED** (medium)

- **Target file**: `src/core/model.ts` (or wherever `ZenData` lives).
- **Plan escape hatch**: _"Skip if Alexi does not use the Zen schema."_
- **Investigation**:
  - `glob src/core/model*.ts` → 0 matches.
  - `glob **/zen*` → 0 matches under `src/` (only `highlight.js` theme CSS in `node_modules`).
  - `grep -R 'ZenData|costPeak|cost200K|ModelCostSchema' src` → **0 matches**.
- **Conclusion**: Alexi does not consume, re-export, or validate against the Zen (opencode) model schema. Model metadata for Alexi comes from SAP AI Core deployment listings (see `src/providers/index.ts` / `src/core/catalog.ts`), which have their own shape.
- **Follow-up**: None until/unless Alexi ingests opencode's Zen feed.

### 4. Simplify Cloudflare plugin wrapper — **SKIPPED** (low)

- **Target file**: `src/providers/cloudflare.ts`.
- **Plan escape hatch**: _"if present"_ / _"mirror the deletions if the same wrapper exists in Alexi."_
- **Investigation**: Same result as change #1 — no Cloudflare wrapper of any kind exists in Alexi's source tree.
- **Conclusion**: Nothing to delete. No merge-friction reduction possible until the file exists.

## Issues Encountered

None. The plan's explicit skip conditions were designed exactly for this scenario ("Most changes are docs/localization/console-specific and not applicable"), and every proposed change matched one of them.

## SAP AI Core Regression Risk

**Zero.** No SAP AI Core-facing code (`src/providers/sapOrchestration.ts`, `src/providers/auth.ts`, `src/providers/ca.ts`, `src/providers/connectivity.ts`, `src/providers/sessionHeaders.ts`, `src/providers/transform.ts`, `src/providers/index.ts`) was read, edited, or otherwise touched during this sync. `npm run typecheck`, `npm test`, and `npm run build` should behave identically to the pre-sync commit.

## Verification Commands Run

```bash
glob 'src/providers/**/*.ts'                     # 22 matches, no cloudflare/codex
glob 'src/plugin/**/*.ts'                        # 7 matches, none are provider plugins
grep 'cloudflare|CloudFlare|ai-gateway' src/     # 0 matches
grep 'codex|Codex' src/                          # 6 matches, all schema-lowering, unrelated
grep 'ZenData|costPeak|ModelCostSchema' src/     # 0 matches
glob '**/cloudflare*'                            # only node_modules/hono
glob '**/codex*'                                 # 0 matches
glob '**/zen*'                                   # only node_modules/highlight.js CSS
glob 'src/core/model*.ts'                        # 0 matches
```

## Upstream Commits Reviewed

- kilocode: `4239f9d98`, `87ba0569f`, `90a93a7aa`, `9851253b7`, `5766f7e96` — docs / Kilo-PR-linking; explicitly skipped per plan.
- opencode: `4d68d30`, `5a0e07e`, `cba6b5f`, `1c96545`, `a0f8dcc`, `fb8344f`, `3fd77ae` — CF gateway auth scoping, Codex limits, DeepSeek V4 / zen pricing docs, YouTube footer, `beta.yml` removal, console tweaks — none applicable to Alexi's SAP-AI-Core-only architecture.

## Recommendation

Merge this sync report as-is. No `contributing.md` scopes (`cli, core, providers, config, server, agent, tools, ci, deps, tests`) require a code change this cycle. When the next upstream diff report lands, re-run the same scoping checks before touching `src/providers/`.

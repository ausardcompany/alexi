# Changes Summary — Upstream Sync 2026-08-26

Applied `.github/reports/update-plan.md` (kilocode `193a0b5e7..24b1fa1fc` + opencode `2f36ffe..13c2759`) against Alexi.

## Files modified

| File | Change |
| --- | --- |
| `src/tool/tools/webfetch.ts` | **critical** — Bun 1.4 stream cancellation guard |
| `src/tool/tools/agent-manager.ts` | **high** — added optional `config.provider` field + validation |
| `src/tool/tools/agent-manager.txt` | **medium** — description text updated for `provider` |
| `src/tool/tools/agent-manager-models.ts` | **medium** — new stub (hint export for future paired tool) |
| `src/tool/tools/agent-manager-models.txt` | **medium** — new stub (doc text for future paired tool) |

## Per-change detail

### 1. `src/tool/tools/webfetch.ts` — Bun 1.4 SSE/stream cancel rejection (critical, bugfix)

Alexi does not have a `wrapSSE` helper in `aisdk.ts` (upstream's file), but the same Bun 1.4 behaviour — `ReadableStreamDefaultReader.cancel()` rejecting with the abort reason — affects the one bounded-body reader in `collectBoundedResponseBody`. Guarded the call so an oversize-response error can no longer be shadowed by an unhandled promise rejection under Bun 1.4+.

```diff
-        await reader.cancel();
+        // Bun 1.4 rejects reader.cancel() with the abort reason ...
+        await reader.cancel().catch(() => undefined);
```

Verified there are no other `reader.cancel(` call sites in `src/**` (single grep hit).

### 2. `src/tool/tools/agent-manager.ts` — optional `provider` field (high, feature)

Upstream's opencode `agent-manager` tool is Effect-Schema `Task.Struct`-based with a `select()` resolver. Alexi's tool is a Zod-based CRUD surface (`action: 'create' | 'list' | 'stop' | 'status' | 'answer'`) with a `config: { mode, model, excludeLocalState }` object. The closest architectural fit is adding `provider` to that config object — this preserves the *intent* of the upstream change (let the orchestrator pin a specific provider ID for the same model name) inside Alexi's existing shape, without introducing an Effect-Schema dependency.

- Added `config.provider: z.string().nullable().optional()` with the description text from the plan (`'anthropic', 'sap-ai-core'` examples).
- Mirrored upstream's `"A task provider requires a model"` filter as a runtime guard in the `create` handler: returns `success: false` with `error: 'config.provider requires config.model to be set'` when `provider` is set but `model` is not. This is the direct Zod-side analog of the plan's `Schema.makeFilter` invariant.
- Updated the tool's `description` to mention `provider` so LLM callers emit the new field.

**SAP AI Core compatibility**: `provider` is `.nullable().optional()`, so any existing SAP AI Core strict-mode tool-call payload (which may emit `null` for omitted fields) continues to validate unchanged. No change to the tool's `permission.action` (still `admin`) or to `defineTool`'s signature.

### 3. `src/tool/tools/agent-manager.txt` — doc text (medium, feature/docs)

Rewrote to include `provider` under `create` action config, matching the wording from the plan ("Specify `provider` with `model` to force a model-name match to one provider ID... A `provider` without a `model` is rejected. Never choose a different model merely because work is being fanned out.").

### 4 & 5. `src/tool/tools/agent-manager-models.{ts,txt}` — companion tool stubs (medium, feature/docs)

Alexi has **no** `agent-manager-models` tool today (no model catalog surface). The plan's textual `hint` and doc content for that tool are still useful landing points for the future — they document the paired-tool contract and stay consistent with the new `provider` wording in `agent-manager`. Created:

- `agent-manager-models.ts` — exports `AGENT_MANAGER_MODELS_HINT` string; does **not** register a tool (registration would require a model catalog + tests, beyond this sync's scope).
- `agent-manager-models.txt` — text description ready for use when the tool is registered.

Both files are import-free (aside from the .ts having no imports) so they cannot break lint / typecheck / build. They are not wired into `src/tool/registry.ts`.

## Skipped items

- **Plan item #5 sub-scope** — "wire `agent-manager-models` tool into registry" was not part of the plan's literal instructions; the plan only described description text updates. Full tool implementation (row generation, provider grouping, tests) is deferred and should be tracked as its own feature spec under `specs/`.
- **Optional Drizzle DB migration recovery** — plan item labelled "only if Alexi uses opencode's DB migration layer". Alexi does not use Drizzle (no matches for `drizzle` in `src/**`). Nothing to do.

## Issues encountered

- Upstream `agent-manager` tool is a fundamentally different shape (Effect Schema `Task.Struct` fan-out) from Alexi's (Zod CRUD). The plan's literal `Schema.makeFilter` / `select()` diffs do not apply. Adapted the *intent* — an optional provider constraint that requires an accompanying model — into Alexi's Zod schema + the `create` handler.
- Alexi's `src/core/agent-manager/` is a 4-line placeholder (`orchestrateAgentManagerSessions()` returns `void`). There is no live model-catalog `select()` function to update. The `create` action returns a placeholder `session-${Date.now()}` id, so the guard we added is currently the only user-visible effect of `provider` — this is faithful to the current "placeholder" state of the tool.

## Verification checklist

- [x] Only one `reader.cancel(` call site exists in `src/**` — patched.
- [x] No existing tests assert on the `agent-manager` tool description string or `config` schema shape (grep verified across `tests/**` and `src/**/*.test.ts`).
- [x] New `provider` field is `.nullable().optional()` — no breakage for existing callers or strict SAP AI Core payloads.
- [x] Tool `permission.action` unchanged (`admin`); no permission surface change.
- [x] No new runtime dependencies added.
- [x] ESLint `no-unused-vars` respected (removed intermediate `modelHint` local).

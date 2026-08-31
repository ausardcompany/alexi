# Update Plan for Alexi

Generated: 2026-08-31
Based on upstream commits analyzed:
- kilocode: `5e02825c8..ab143253a` (54 commits)
- opencode: `10765ff..9f69463` (1 commit)

## Summary
- Total changes planned: 8
- Critical: 1 | High: 4 | Medium: 2 | Low: 1

Focus areas from upstream:
1. **Task model selection** (experimental) — subagents can now pick model/provider/reasoning effort (`task_model_selection` config flag).
2. **Refactor of `agent-manager-models` tool** — now takes `Config.Service` and gates model listing on the experimental flag.
3. **New `model-selection.ts` helper** — extracted from `agent-manager.ts` for reuse in `task.ts`.
4. **`task.ts` enhancements** — accepts `model`, `provider`, `reasoning_effort` params.
5. **PTY smoke test hardening** — new `render()` helper detecting blank TUI, panics, and unresponsive palette.
6. **Config schema** — new `experimental.task_model_selection` field.
7. **Cancelled agent sessions** stay idle (icon/state fix).
8. **Session prompt** — small change to `session/prompt.ts` (+8/-1).

---

## Changes

### 1. Add `task_model_selection` experimental config flag
**File**: `src/core/v1/config/config.ts` (or wherever `experimental` schema lives in Alexi)
**Priority**: high
**Type**: feature
**Reason**: This is the enabling flag for the whole task-model-selection feature and must be defined before dependent tool changes will type-check. Keeping opt-in behavior matches upstream and preserves default behavior for SAP AI Core users.

**New code** (add to the `experimental` Schema.Struct):
```typescript
task_model_selection: Schema.optional(Schema.Boolean).annotate({
  description: "Allow task subagents to select a model, provider, and reasoning effort",
}),
```

Reference: `packages/core/src/v1/config/config.ts` (+3 lines around L304).

---

### 2. Extract model resolution into `model-selection.ts` helper
**File**: `src/tool/model-selection.ts` (**new file**)
**Priority**: high
**Type**: refactor
**Reason**: Upstream split the model lookup / candidate resolution logic out of `agent-manager.ts` (-132 lines) into a reusable `selectModel()` helper so both `agent-manager` and `task` tools can share it. Required before touching `task.ts` and `agent-manager.ts`.

**New code** (skeleton mirroring upstream; adapt SAP provider filtering as needed):
```typescript
import { Provider } from "@/providers/provider"
import { matchesQuery } from "./model-search"

export type Candidate = { providerID: string; model: Provider.Info["models"][string] }
export type Source = { model: string; variant?: string }

export function candidates(providers: Record<string, Provider.Info>): Candidate[] {
  return Object.values(providers).flatMap((provider) =>
    Object.values(provider.models).map((model) => ({ providerID: provider.id, model })),
  )
}

// Resolve a query to the candidates for a single logical model.
// Exact id/name wins first; otherwise falls back to fuzzy match.
export function lookup(all: Candidate[], value: string): { pool: Candidate[]; names: string[] } {
  const query = value.toLowerCase()
  const exactId = all.filter((item) => `${item.providerID}/${item.model.id}`.toLowerCase() === query)
  const exactName = exactId.length
    ? exactId
    : all.filter((item) => item.model.name.toLowerCase() === query)
  const pool = exactName.length
    ? exactName
    : all.filter((item) =>
        matchesQuery([item.model.name, `${item.providerID}/${item.model.id}`], value),
      )
  const names = [...new Set(pool.map((item) => item.model.name))]
  return { pool, names }
}

export function selectModel(
  providers: Record<string, Provider.Info>,
  source: Source,
  preferredProviderID?: string,
): { providerID: string; modelID: string } | { error: string } {
  const all = candidates(providers)
  const { pool, names } = lookup(all, source.model)
  if (pool.length === 0) return { error: `No model matches "${source.model}"` }
  if (names.length > 1)
    return { error: `Ambiguous model "${source.model}" — candidates: ${names.join(", ")}` }

  // Prefer the requested variant/provider, else the caller's current provider, else first.
  const byVariant = source.variant
    ? pool.filter((c) => c.providerID.toLowerCase() === source.variant!.toLowerCase())
    : pool
  const byPreferred = preferredProviderID
    ? byVariant.filter((c) => c.providerID === preferredProviderID)
    : []
  const picked = (byPreferred[0] ?? byVariant[0] ?? pool[0])
  return { providerID: picked.providerID, modelID: picked.model.id }
}
```

> ⚠️ Reconstruct the exact `selectModel` return shape by inspecting the full upstream `packages/opencode/src/kilocode/tool/model-selection.ts` (+117 lines) — the diff only shows partial context. Preserve SAP AI Core provider ID conventions when filtering.

---

### 3. Refactor `agent-manager-models` tool to gate on config flag
**File**: `src/tool/agent-manager-models.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream added `Config.Service` as a dependency and now returns tool disabled/hidden when `task_model_selection` is off. Signature also changed from returning the tool object directly to returning a `() => Effect` factory.

**Current code**:
```typescript
export const AgentManagerModelsTool = Tool.define<
  typeof Params,
  { count: number; total: number },
  Provider.Service,
  "agent_manager_models"
>(
  "agent_manager_models",
  Effect.gen(function* () {
    const provider = yield* Provider.Service
    return {
      description: DESCRIPTION,
      parameters: Params,
      execute: (params) => Effect.gen(function* () { /* ... */ }),
    }
  }),
)
```

**New code**:
```typescript
import { Config } from "@/config/config"

export const AgentManagerModelsTool = Tool.define<
  typeof Params,
  { count: number; total: number },
  Provider.Service | Config.Service,
  "agent_manager_models"
>(
  "agent_manager_models",
  Effect.gen(function* () {
    const provider = yield* Provider.Service
    const config = yield* Config.Service
    return () =>
      Effect.gen(function* () {
        const cfg = yield* config.get()
        // Hide/disable tool when experimental flag is off.
        if (!cfg.experimental?.task_model_selection) {
          return { enabled: false as const }
        }
        return {
          enabled: true as const,
          description: DESCRIPTION,
          parameters: Params,
          execute: (params: Schema.Schema.Type<typeof Params>) =>
            Effect.gen(function* () {
              const providers = yield* provider.list()
              const all = entries(providers)
              const query = params.query?.trim()
              const matches = query
                ? all.filter((entry) => matchesQuery([entry.name, ...entry.ids], query))
                : all
              const offset = params.offset ?? 0
              const limit = Math.min(params.limit ?? MAX_LIMIT, MAX_LIMIT)
              const models = matches.slice(offset, offset + limit).map(view)
              const nextOffset =
                offset + models.length < matches.length ? offset + models.length : undefined
              return {
                title: query
                  ? `${matches.length} model${matches.length === 1 ? "" : "s"} matching "${query}"`
                  : `${matches.length} available models`,
                output: JSON.stringify({
                  models,
                  offset,
                  total: matches.length,
                  nextOffset,
                  hint: "Pass a model name (or one of its providers/IDs) as the agent_manager task `model`. Add the task `provider` to force one of the listed providers; otherwise Agent Manager prefers the provider used by the current turn.",
                }),
                metadata: { count: models.length, total: matches.length },
              }
            }),
        }
      })
  }),
)
```

> Verify the exact factory shape (`() => Effect`) matches Alexi's `Tool.define` contract; the diff shows this pattern but Alexi may need a small adapter.

---

### 4. Simplify `agent-manager.ts` to use shared `selectModel()`
**File**: `src/tool/agent-manager.ts`
**Priority**: high
**Type**: refactor
**Reason**: Upstream removed ~132 lines of embedded model resolution logic and replaced it with `selectModel()` from the new helper. Must be applied together with change #2 to avoid duplication.

**Current code** (inside `agent-manager.ts`):
```typescript
import { matchesQuery } from "./model-search"

type Candidate = { providerID: string; model: Provider.Info["models"][string] }

function candidates(providers: Record<string, Provider.Info>): Candidate[] { /* ... */ }
function lookup(all: Candidate[], value: string): { pool: Candidate[]; names: string[] } { /* ... */ }
// ~ additional inline resolution logic ~
```

**New code**:
```typescript
import { selectModel } from "./model-selection"

// Remove local `Candidate`, `candidates()`, `lookup()`, and any resolveModel()
// helpers — call selectModel() at the point where the task's model is chosen:
const resolved = selectModel(providers, { model: source.model, variant: source.variant }, currentProviderID)
if ("error" in resolved) {
  return { error: resolved.error }
}
task.model = { providerID: resolved.providerID, modelID: resolved.modelID }
```

Also drop the leading `// kilocode_change - new file` comment as upstream did.

---

### 5. Extend `task.ts` to accept model/provider/reasoning params
**File**: `src/tool/task.ts`
**Priority**: high
**Type**: feature
**Reason**: Both `packages/opencode/src/tool/task.ts` (+55/-32) and `packages/opencode/src/kilocode/tool/task.ts` (+55/-3) grew task parameters to include model selection. This is the user-facing surface of the new experimental feature. Must be gated on `experimental.task_model_selection` to preserve default behavior.

**New code** (add to task Params schema and execute logic):
```typescript
const Params = Schema.Struct({
  // ...existing description, subagent_type, etc.
  model: Schema.optional(Schema.String).annotate({
    description:
      "Optional model name (or provider/id) for the subagent. Requires experimental.task_model_selection.",
  }),
  provider: Schema.optional(Schema.String).annotate({
    description: "Optional provider ID to disambiguate when the model is offered by multiple providers.",
  }),
  reasoning_effort: Schema.optional(
    Schema.Literal("low", "medium", "high"),
  ).annotate({
    description: "Optional reasoning effort hint for reasoning-capable models.",
  }),
})

// In execute():
const cfg = yield* config.get()
if (params.model || params.provider || params.reasoning_effort) {
  if (!cfg.experimental?.task_model_selection) {
    return {
      title: "Model selection disabled",
      output:
        "Set experimental.task_model_selection=true to allow subagents to override model/provider/reasoning_effort.",
      metadata: {},
    }
  }
  const providers = y
{"prompt_tokens":23800,"completion_tokens":4096,"total_tokens":27896,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 3bdb9b37-3c2c-4247-8061-ad75f67789e4]
[Messages: 2, Tokens: 27896]

# Update Plan for Alexi

Generated: 2026-08-26
Based on upstream commits analyzed:
- kilocode: 193a0b5e7..24b1fa1fc (125 commits)
- opencode: 2f36ffe..13c2759 (14 commits)

## Summary

- Total changes planned: 5
- Critical: 1 | High: 2 | Medium: 2 | Low: 0

The bulk of upstream changes affect JetBrains/VSCode UIs, agent-manager webviews, docs, and console/billing — none of which apply to Alexi's SAP AI Core-focused codebase. The relevant changes are:

1. **Bun 1.4 SSE cancellation fix** (core) — critical stream stability fix
2. **Agent-manager tool `provider` field** (tool system) — new task parameter
3. **Agent-manager tool documentation updates** — accompanying doc changes
4. **Agent-manager models tool hint text** — accompanying doc changes
5. **Optional: legacy Drizzle migration recovery** (only if Alexi uses opencode's DB migration layer)

---

## Changes

### 1. Handle Bun 1.4 stream cancellation rejection in SSE reader

**File**: `src/core/aisdk.ts` (or wherever `wrapSSE` lives in Alexi; fall back to `src/providers/aisdk.ts`)
**Priority**: critical
**Type**: bugfix
**Reason**: Under Bun 1.4, `reader.cancel(err)` may reject with the abort reason and produce an unhandled promise rejection that flashes as an "abort error" and destabilizes SSE streams. This affects any SAP AI Core streaming provider that flows through the shared SSE helper.

**Current code**:
```typescript
function wrapSSE(res: Response, ms: number, ctl: AbortController) {
  // ...
  const id = setTimeout(() => {
    const err = new Error("SSE read timed out")
    ctl.abort(err)
    void reader.cancel(err)
    reject(err)
  }, ms)
```

**New code**:
```typescript
function wrapSSE(res: Response, ms: number, ctl: AbortController) {
  // ...
  const id = setTimeout(() => {
    const err = new Error("SSE read timed out")
    ctl.abort(err)
    // Bun 1.4 rejects cancel() with the abort reason — swallow it to avoid
    // an unhandled rejection racing with the reject() below.
    void reader.cancel(err).catch(() => undefined)
    reject(err)
  }, ms)
```

**Verification**: search the repo for `reader.cancel(` occurrences in any SSE/stream wrappers and apply the same guard. If Alexi wraps `fetch` streams elsewhere (e.g., a SAP-specific streaming client), audit those too.

---

### 2. Add optional `provider` field to Agent Manager task schema

**File**: `src/tool/agent-manager.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream now lets callers pin a specific provider ID alongside a model name (e.g. force `anthropic/claude-opus-4.1` vs. `bedrock/claude-opus-4.1`). This matters for SAP AI Core deployments where the same model may be exposed by multiple providers (e.g., SAP-hosted vs. direct Anthropic) and the LLM must be able to constrain the routing.

**Current code** (schema block):
```typescript
const Task = Schema.Struct({
  // ...
  model: Schema.optional(Schema.NullOr(Schema.String)).annotate({
    description:
      "Optional model override from agent_manager_models (e.g. 'Claude Opus 4.1'). Omit unless the user requests a different model. Agent Manager otherwise inherits the current turn's model. A qualified provider/model ID is also accepted to force a specific provider.",
  }),
  variant: Schema.optional(Schema.NullOr(Schema.String)).annotate({
    description:
      "Optional reasoning variant override from agent_manager_models. Specify it without model to override the inherited model's variant. Omit both to inherit the current turn's selection.",
  }),
  // ...
}).pipe(
  Schema.makeFilter((task) =>
    task.model?.trim() && !task.prompt?.trim() ? "A task model requires an initial prompt" : undefined,
  ),
  Schema.makeFilter((task) =>
    task.variant?.trim() && !task.prompt?.trim() ? "A task variant requires an initial prompt" : undefined,
  ),
```

**New code**:
```typescript
const Task = Schema.Struct({
  // ...
  model: Schema.optional(Schema.NullOr(Schema.String)).annotate({
    description:
      "Optional model override from agent_manager_models (e.g. 'Claude Opus 4.1'). Omit unless the user requests a different model. Agent Manager otherwise inherits the current turn's model. A qualified provider/model ID is also accepted to force a specific provider.",
  }),
  provider: Schema.optional(Schema.NullOr(Schema.String)).annotate({
    description:
      "Optional provider ID to constrain model resolution (e.g. 'anthropic', 'sap-ai-core'). Use with model to select a model from a specific provider; omit to use the current-turn provider preference.",
  }),
  variant: Schema.optional(Schema.NullOr(Schema.String)).annotate({
    description:
      "Optional reasoning variant override from agent_manager_models. Specify it without model to override the inherited model's variant. Omit both to inherit the current turn's selection.",
  }),
  // ...
}).pipe(
  Schema.makeFilter((task) =>
    task.model?.trim() && !task.prompt?.trim() ? "A task model requires an initial prompt" : undefined,
  ),
  Schema.makeFilter((task) =>
    task.provider?.trim() && !task.model?.trim() ? "A task provider requires a model" : undefined,
  ),
  Schema.makeFilter((task) =>
    task.variant?.trim() && !task.prompt?.trim() ? "A task variant requires an initial prompt" : undefined,
  ),
```

---

### 3. Honor `provider` scope in Agent Manager task `select()` resolver

**File**: `src/tool/agent-manager.ts`
**Function**: `select()`
**Priority**: high
**Type**: feature
**Reason**: The schema change is inert without a matching resolver update. Filter the model catalog by `providerID` before running the lenient name match, and surface a clear error when the provider has no matching model.

**Current code**:
```typescript
function select(
  // ...
) {
  const base = {
    ...(task.branchName != null ? { branchName: task.branchName } : {}),
  }
  const value = task.model?.trim()
  const variant = task.variant?.trim()
  if (!value) {
    // ...
  }
  // ...
  const { pool, names } = lookup(all, value)
  if (pool.length === 0) {
    const close = suggest(all, value)
    const hint = close.length ? ` Closest matches: ${close.join(", ")}.` : ""
    // ...
  }
```

**New code**:
```typescript
function select(
  // ...
) {
  const base = {
    ...(task.branchName != null ? { branchName: task.branchName } : {}),
  }
  const value = task.model?.trim()
  const provider = task.provider?.trim()
  const variant = task.variant?.trim()
  if (!value) {
    // ...
  }
  // ...
  const scope = provider ? all.filter((item) => item.providerID === provider) : all
  if (provider && scope.length === 0) {
    return {
      error: `Task ${index + 1} provider is not available for model selection: ${provider}. Requested model: ${value}.`,
    }
  }

  const { pool, names } = lookup(scope, value)
  if (pool.length === 0) {
    const close = suggest(scope, value)
    const hint = close.length ? ` Closest matches: ${close.join(", ")}.` : ""
    // ...
  }
```

**Note for Alexi**: If Alexi's model catalog uses a different field name than `providerID` (e.g., `provider` or a SAP-specific `deploymentId`), adjust the filter accordingly and consider matching on both the SAP provider alias and the canonical `providerID`.

---

### 4. Update Agent Manager tool description text

**File**: `src/tool/agent-manager.txt.ts` (or `agent-manager.txt` if raw)
**Priority**: medium
**Type**: feature (docs coupled to schema)
**Reason**: The LLM relies on the tool's description to know that `provider` is now accepted. Without this, models will not emit the new field even when the schema allows it.

**Current code** (relevant paragraph):
```
Each task may provide a prompt, a short display name, a branch name, a `model`, and a model-specific reasoning `variant`. By default, omit `model` and `variant`: prompted tasks inherit the exact model and reasoning variant used by the current turn. Only specify `model` when the user explicitly asks to use or compare a different model, and only specify `variant` when the user explicitly asks for a different reasoning variant. ...
```

**New code**:
```
Each task may provide a prompt, a short display name, a branch name, a `model`, an optional `provider`, and a model-specific reasoning `variant`. By default, omit `model`, `provider`, and `variant`: prompted tasks inherit the exact model and reasoning variant used by the current turn. Only specify `model` when the user explicitly asks to use or compare a different model, and only specify `variant` when the user explicitly asks for a different reasoning variant. A variant can be specified without a model to override the inherited model's variant. Specify `provider` with `model` to force a model-name match to one provider ID. Never choose a different model merely because work is being fanned out. ...
```

---

### 5. Update Agent Manager Models tool description and hint

**File**: `src/tool/agent-manager-models.ts` and `src/tool/agent-manager-models.txt.ts`
**Priority**: medium
**Type**: feature (docs coupled to schema)
**Reason**: Keeps the paired discovery tool consistent with the new `provider` capability so models discover providers per row and know they can pass them back.

**Current code** (`agent-manager-models.ts` — hint):
```typescript
hint: "Pass a model name (or one of its providers/IDs) as the agent_manager task `model`. Agent Manager picks the provider, preferring the one used by the current turn.",
```

**New code**:
```typescript
hint: "Pass a model name (or one of its providers/IDs) as the agent_manager task `model`. Add the task `provider` to force one of the listed providers; otherwise Agent Manager prefers the provider used by the current turn.",
```

**Current code** (`agent-manager-models.txt`):
```
Use this tool before `agent_manager` when you need to pick a model or reasoning effort. Results are grouped by model, not by provider, because you select a model and Agent Manager chooses the provider for you. ...

Each result includes the model name, its reasoning variant names, and the providers that offer it (informational only). Pass the model name back as the `agent_manager` task `model`. Agent Manager resolves the provider automatically, preferring the provider used by the current turn and falling back to the Kilo Gateway, so you do not need to choose a provider yourself.
```

**New code**:
```
Use this tool before `agent_manager` when you need to pick a model or reasoning effort. Results are grouped by model, not by provider, and list every provider that offers each model so you can constrain the provider when needed. ...

Each result includes the model name, its reasoning variant names, and the providers that offer it. Pass the model name back as the `agent_manager` task `model`; pass one of the listed provider IDs as the task `provider` when the provider must be explicit. When `provider` is omitted, Agent Man
{"prompt_tokens":29476,"completion_tokens":4096,"total_tokens":33572,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 7772b7c0-49bd-4dde-89f1-d5b7bfcc4508]
[Messages: 2, Tokens: 33572]

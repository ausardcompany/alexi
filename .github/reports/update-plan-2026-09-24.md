# Update Plan for Alexi

Generated: 2026-09-24
Based on upstream commits analyzed:
- kilocode: 95b45e54e..50e520adf (92 commits)
- opencode: 18ef3cc..0f54984 (9 commits)

## Summary
- Total changes planned: 7
- Critical: 1 | High: 3 | Medium: 2 | Low: 1

The most impactful upstream changes for Alexi center around:
1. **Task subagent model selection is now the default** — the experimental `task_model_selection` flag has been removed, meaning the `agent_manager_models` tool description always reflects model selection availability, and `task.ts` no longer branches on the flag.
2. **MCP client metadata support** — new `client-metadata.ts` module in opencode.
3. **Session processor changes** — small enhancements in `session/processor.ts` and `session/prompt.ts`.
4. **opencode**: `gitlab-ai-provider` bump and provider transform changes with credential redaction for debug config.

## Changes

### 1. Remove `task_model_selection` experimental flag (make default)
**File**: `src/core/config.ts` (or equivalent v1 config schema)
**Priority**: high
**Type**: feature/refactor
**Reason**: Upstream removed the `task_model_selection` experimental flag from the config schema and made task subagent model selection the default behavior. Alexi should mirror this to avoid drift and to allow subagents to always select a model/provider/reasoning effort. This also removes a config surface that no longer exists upstream, preventing schema validation drift.

**Current code** (if present in Alexi's config schema):
```typescript
experimental: Schema.Struct({
  // ...
  task_model_selection: Schema.optional(Schema.Boolean).annotate({
    description: "Allow task subagents to select a model, provider, and reasoning effort",
  }),
  // ...
})
```

**New code**:
```typescript
experimental: Schema.Struct({
  // ...
  // task_model_selection removed — behavior is now the default.
  // If SAP-specific gating is required, wrap the default in a SAP flag instead.
  // ...
})
```

Also remove any references in `src/webview/settings/ExperimentalTab.tsx`-equivalent (Alexi settings UI) if they exist.

---

### 2. Simplify `agent_manager_models` tool — always advertise model selection
**File**: `src/tool/agent-manager-models.ts`
**Priority**: high
**Type**: refactor
**Reason**: With `task_model_selection` gone, the tool description no longer branches on config. This simplifies the tool: it drops the `Config.Service` dependency and returns a static description. Keeping Alexi aligned reduces divergence and prevents `Config.Service` from being a required dep in the Effect requirements.

**Current code**:
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
        const selection = cfg.experimental?.task_model_selection === true
        return {
          description: selection
            ? `${DESCRIPTION}\n\nExperimental Task model selection is enabled. Also use this tool before choosing model, provider, or variant for the task subagent tool. You may choose these settings to suit the subagent task without creating an Agent Manager session.`
            : DESCRIPTION,
          parameters: Params,
          execute: (params) => Effect.gen(function* () {
            // ...
          }),
        }
      })
  }),
)
```

**New code**:
```typescript
// no Config import needed

export const AgentManagerModelsTool = Tool.define<
  typeof Params,
  { count: number; total: number },
  Provider.Service,
  "agent_manager_models"
>(
  "agent_manager_models",
  Effect.gen(function* () {
    const provider = yield* Provider.Service
    return () => ({
      description: `${DESCRIPTION}\n\nAlso use this tool before choosing model, provider, or variant for the task subagent tool. You may choose these settings to suit the subagent task without creating an Agent Manager session.`,
      parameters: Params,
      execute: (params: typeof Params.Type) =>
        Effect.gen(function* () {
          const providers = yield* provider.list()
          const all = entries(providers)
          const query = params.query?.trim()
          const matches = query ? all.filter((entry) => matchesQuery([entry.name, ...entry.ids], query)) : all
          const offset = params.offset ?? 0
          const limit = Math.min(params.limit ?? MAX_LIMIT, MAX_LIMIT)
          const models = matches.slice(offset, offset + limit).map(view)
          const nextOffset = offset + models.length < matches.length ? offset + models.length : undefined
          return {
            title: query
              ? `${matches.length} model${matches.length === 1 ? "" : "s"} matching "${params.query?.trim()}"`
              : `${matches.length} available models`,
            output: JSON.stringify({
              models,
              offset,
              nextOffset,
              total: matches.length,
            }),
            metadata: { count: models.length, total: matches.length },
          }
        }),
    })
  }),
)
```

**SAP note**: If SAP AI Core deployments need to gate model selection (e.g., only allow SAP-approved models), add a SAP-specific filter inside `provider.list()` output rather than reintroducing the flag.

---

### 3. Simplify `task` tool — drop `task_model_selection` gating
**File**: `src/tool/task.ts`
**Priority**: high
**Type**: refactor
**Reason**: Upstream removed the flag check inside `task.ts`. Subagent model/provider/reasoning parameters are now always accepted. Keep Alexi's task tool consistent.

**Current code** (representative — verify actual Alexi code):
```typescript
const cfg = yield* config.get()
const modelSelectionEnabled = cfg.experimental?.task_model_selection === true

const params = modelSelectionEnabled
  ? ParamsWithModelSelection
  : ParamsBase

// ...
if (modelSelectionEnabled && input.model) {
  // apply model override
}
```

**New code**:
```typescript
// Model selection is always available for task subagents.
const params = ParamsWithModelSelection

// ...
if (input.model) {
  // apply model override
}
if (input.provider) {
  // apply provider override
}
if (input.reasoningEffort) {
  // apply reasoning effort override
}
```

Remove the `Config.Service` dependency from the tool's Effect requirements if it was only used for this flag. Update tool registry (`src/tool/registry.ts`) to drop `Config.Service` from the requirements union if applicable (upstream diff shows `registry.ts` shrunk by 3 lines — same removal).

---

### 4. Add MCP client metadata support
**File**: `src/mcp/client-metadata.ts` (new file)
**Priority**: medium
**Type**: feature
**Reason**: Upstream added `packages/opencode/src/kilocode/mcp/client-metadata.ts` (+1 line — likely an export/re-export) plus a new CIMD test suite (`test/kilocode/mcp-cimd.test.ts`, +217 lines) and OAuth provider changes (`src/mcp/oauth-provider.ts`, +10 lines). This adds support for MCP Client ID Metadata Documents (CIMD), which is a spec extension. If Alexi supports MCP with OAuth flows, add this.

**New code** (skeleton — adapt to Alexi's MCP module):
```typescript
// src/mcp/client-metadata.ts
import { Schema } from "effect"

export const ClientMetadataDocument = Schema.Struct({
  client_id: Schema.String,
  client_name: Schema.optional(Schema.String),
  redirect_uris: Schema.Array(Schema.String),
  grant_types: Schema.optional(Schema.Array(Schema.String)),
  response_types: Schema.optional(Schema.Array(Schema.String)),
  scope: Schema.optional(Schema.String),
  token_endpoint_auth_method: Schema.optional(Schema.String),
})
export type ClientMetadataDocument = typeof ClientMetadataDocument.Type

/**
 * Fetch and validate a Client ID Metadata Document per MCP CIMD spec.
 * The client_id is a URL that returns a JSON document describing the client.
 */
export async function fetchClientMetadata(url: string, signal?: AbortSignal): Promise<ClientMetadataDocument> {
  const res = await fetch(url, { signal, headers: { accept: "application/json" } })
  if (!res.ok) throw new Error(`CIMD fetch failed: ${res.status} ${res.statusText}`)
  const body = await res.json()
  return Schema.decodeUnknownSync(ClientMetadataDocument)(body)
}
```

Then wire into `src/mcp/oauth-provider.ts`:
```typescript
// Before OAuth begins, if client_id looks like a URL, fetch its metadata document.
if (/^https?:\/\//.test(clientId)) {
  const metadata = await fetchClientMetadata(clientId)
  registration = {
    client_id: metadata.client_id,
    redirect_uris: metadata.redirect_uris,
    // ...
  }
}
```

**SAP note**: SAP AI Core auth is typically service-key based, not OAuth. This change is only relevant if Alexi supports third-party MCP servers with OAuth.

---

### 5. Route plan follow-up questions by directory
**File**: `src/session/processor.ts` (or equivalent)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream commit `5e05988b1 fix(cli): route plan follow-up events by directory` and processor.ts diff (+11, -2). Plan-mode follow-up questions were being routed globally instead of per-directory, causing cross-project bleed. Adopt the same directory-scoped routing.

**Current code** (approximate):
```typescript
Bus.publish("plan.followup", { question, sessionID })
```

**New code**:
```typescript
Bus.publish("plan.followup", {
  question,
  sessionID,
  directory: session.directory, // include directory so subscribers can filter
})
```

And in the subscriber:
```typescript
Bus.subscribe("plan.followup", (event) => {
  if (event.directory && event.directory !== currentDirectory) return
  // handle
})
```

---

### 6. Redact credentials in debug config output
**File**: `src/cli/cmd/debug/config.ts` and new `src/cli/cmd/debug/redact.ts`
**Priority**: critical (security)
**Type**: security
**Reason**: opencode commit `82d4c89 fix(opencode): redact credentials in debug config (#50956)` — debug config output was leaking API keys, tokens, and other secrets. This is a security fix and should be applied ASAP. Especially important for SAP AI Core where service key credentials are highly sensitive.

**New file `src/cli/cmd/debug/redact.ts`**:
```typescript
const SECRET_KEY_PATTERNS = [
  /api[_-]?key/i,
  /secret/i,
  /token/i,
  /password/i,
  /credential/i,
  /authorization/i,
  /client[_-]?secret/i,
  // SAP-specific
  /clientsecret/i,
  /serviceurl/i, // optional — may leak tenant info
]

export function redact
{"prompt_tokens":23297,"completion_tokens":4096,"total_tokens":27393,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: edd57e12-1331-423f-b0d8-35f7e5841900]
[Messages: 2, Tokens: 27393]

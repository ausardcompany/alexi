```markdown
# Update Plan for Alexi

Generated: 2026-07-30
Based on upstream commits: Kilo AI coding assistant, OpenCode AI terminal assistant

## Summary
- Total changes planned: 6
- Critical: 2 | High: 2 | Medium: 2 | Low: 0

## Changes

### 1. Update Catalog Integration
**File**: `src/core/catalog.ts`
**Priority**: critical
**Type**: refactor
**Reason**: Ensure seamless integration with updated credential and integration logic from Kilo AI.

**Current code**:
```typescript
import { Credential } from "./credential"
import { IntegrationSchema } from "./integration/schema"
```

**New code**:
```typescript
import { Integration } from "./integration"
```

### 2. Update Provider Configuration
**File**: `src/core/config/plugin/provider.ts`
**Priority**: high
**Type**: refactor
**Reason**: Align configuration logic with the updated integration schema, ensuring correct provider setup.

**Current code**:
```typescript
const transform = yield* catalog.transform()
```

**New code**:
```typescript
const integrationTransform = yield* integrations.transform()
```

### 3. Enhance Credential Management
**File**: `src/core/credential.ts`
**Priority**: medium
**Type**: feature
**Reason**: Add capability to retrieve individual credentials by ID, enhancing security and flexibility.

**Current code**:
```typescript
readonly list: (integrationID: IntegrationSchema.ID) => Effect.Effect<Stored[]>
```

**New code**:
```typescript
readonly get: (id: ID) => Effect.Effect<Stored | undefined>
```

### 4. Refactor Integration Prompts
**File**: `src/core/integration.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Simplify and standardize prompt definitions for better integration handling.

**Current code**:
```typescript
export class TextPrompt extends Schema.Class<TextPrompt>("Integration.TextPrompt")({
```

**New code**:
```typescript
export const TextPrompt = Schema.Struct({
```

### 5. Code Mode Tool Call Update
**File**: `src/tool/code-mode.ts`
**Priority**: high
**Type**: feature
**Reason**: Optimize tool call logic to incorporate new timeout reset handling and error reporting.

**Current code**:
```typescript
return yield* Effect.promise(() => McpCatalog.callTool(input.entry.tool, input.args, input.ctx.abort))
```

**New code**:
```typescript
return yield* Effect.promise(async () => {
  const raw = await input.entry.tool.client.callTool(
    { name: input.entry.tool.def.name, arguments: input.args },
    CallToolResultSchema,
    {
      resetTimeoutOnProgress: true,
      signal: input.ctx.abort,
      timeout: input.entry.tool.timeout,
      onprogress: () => {},
    },
  )
  // Error handling
})
```

### 6. Update Tool Mode Integration Test
**File**: `src/tool/code-mode-integration.test.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Ensure test compatibility with updated server request handling and schema.

**Current code**:
```typescript
server.setRequestHandler("tools/list", async () => ({ tools: TOOL_DEFS }))
```

**New code**:
```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOL_DEFS }))
```

## Testing Recommendations
- Verify integration with SAP AI Core after applying credential and provider updates.
- Test all tool functionalities to ensure no regression occurs due to schema changes.
- Perform security audits on the credential retrieval logic.

## Potential Risks
- Changes to credential management could affect existing integrations if not handled correctly.
- Refactoring of prompt definitions may introduce bugs if not thoroughly tested.
```

{"prompt_tokens":20693,"completion_tokens":818,"total_tokens":21511,"cache_read_input_tokens":0}

[Session: f99cbc4f-f9a6-4718-b935-16731715f3d1]
[Messages: 2, Tokens: 21511]

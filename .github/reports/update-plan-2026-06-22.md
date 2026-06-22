# Update Plan for Alexi

Generated: 2026-06-23
Based on upstream commits: [kilocode: a42413247..d378114b8, opencode: d4d841b..4ecc3ac]

## Summary
- Total changes planned: 10
- Critical: 2 | High: 4 | Medium: 3 | Low: 1

## Changes

### 1. Update Agent System
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: refactor
**Reason**: Integrate changes from `packages/opencode/src/agent/agent.ts` to improve agent handling and compatibility with new API.

**Current code**:
```typescript
// Original agent handling code
```

**New code**:
```typescript
import { Array, Context, Effect, Layer, Schema, Scope, Types } from "effect";
import { ModelV2 } from "./model";
import { PermissionV2 } from "./permission";
import { ProviderV2 } from "./provider";

export const ID = Schema.String.pipe(Schema.brand("AgentV2.ID"));
// Updated agent handling code based on upstream changes
```

### 2. Integrate Core Package Updates
**File**: `src/core/index.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Address critical dependencies and API changes reflected in `packages/core/package.json`.

**Current code**:
```typescript
// Original core module setup
```

**New code**:
```typescript
import { Version } from "core";
import { Dependency } from "effect";
const coreDependencies = {
  "@types/semver": "catalog:",
  "@ai-sdk/amazon-bedrock": "4.0.107",
  "@ai-sdk/google-vertex": "4.0.128",
  "gitlab-ai-provider": "6.8.0",
};
// Integrate new dependencies and version management
```

### 3. Update Tool System for Web Fetching
**File**: `src/tool/webfetch.ts`
**Priority**: high
**Type**: feature
**Reason**: Enhance web fetching capabilities and handling of dynamic URLs as per `packages/core/src/tool/webfetch.ts`.

**Current code**:
```typescript
export function webFetch(url: string) {
    // Fetch logic
}
```

**New code**:
```typescript
export function webFetch(url: string, options?: FetchOptions) {
    // Enhanced fetch logic with options for handling dynamic URLs
}
```

### 4. Enhance Session Management
**File**: `src/session/index.ts`
**Priority**: critical
**Type**: security
**Reason**: Implement new session switching endpoints for improved security and flexibility, as seen in `packages/core/src/session.ts`.

**Current code**:
```typescript
// Original session management code
```

**New code**:
```typescript
import { Session } from "session";
Session.configureSwitchingEndpoints();
// Secure session switching logic
```

### 5. Refactor Catalog Integration
**File**: `src/core/catalog.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Simplify catalog integration by adopting changes from `packages/core/src/catalog.ts`.

**Current code**:
```typescript
// Original catalog integration
```

**New code**:
```typescript
import { Catalog } from "core";
Catalog.updateProvider(providerID, fn => {
    // Updated provider logic
});
// Simplified integration logic
```

### 6. Update Configuration Handling
**File**: `src/core/config.ts`
**Priority**: high
**Type**: feature
**Reason**: Add support for new configuration schema and options from `packages/core/src/config.ts`.

**Current code**:
```typescript
// Original configuration handling
```

**New code**:
```typescript
import { Config } from "core";
Config.loadSchema();
Config.applyDefaults();
// Advanced configuration handling
```

### 7. Modify Plugin Provider Integrations
**File**: `src/plugin/provider.ts`
**Priority**: medium
**Type**: feature
**Reason**: Update plugin providers with new compatibility layers from `packages/core/src/plugin/provider/*.ts`.

**Current code**:
```typescript
// Original provider integration
```

**New code**:
```typescript
import { ProviderV2 } from "plugin";
ProviderV2.integrateNewAPI();
// Updated provider integration logic
```

### 8. Streamline Event Handling
**File**: `src/event/index.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Simplify event model based on changes in `packages/core/src/event.ts`.

**Current code**:
```typescript
export const EventBus = {
    registerEvent(eventType: string) {
        // Original event registration
    },
    dispatchEvent(event) {
        // Original event dispatch
    },
};
```

**New code**:
```typescript
export const EventBus = {
    registerEvent(eventType: string, handler: EventHandler) {
        // Streamlined event registration
    },
    dispatchEvent(event) {
        // Streamlined event dispatch
    },
};
```

### 9. Update Tool Snapshot Tests
**File**: `src/tool/parameters.test.ts.snap.ts`
**Priority**: low
**Type**: testing
**Reason**: Align snapshot tests with updated tool parameters from `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap`.

**Current code**:
```typescript
// Original snapshot test
```

**New code**:
```typescript
// Updated snapshot test reflecting new parameters
```

### 10. Revise Task Management Logic
**File**: `src/tool/task.ts`
**Priority**: high
**Type**: feature
**Reason**: Incorporate new task management features and fixes from `packages/opencode/src/tool/task.ts`.

**Current code**:
```typescript
export class TaskManager {
    // Original task management code
}
```

**New code**:
```typescript
export class TaskManager {
    // Updated task logic with new features
}
```

## Testing Recommendations
- Ensure all new dependencies are installed correctly.
- Test session switching functionality for security vulnerabilities.
- Verify tool system updates with integration tests, focusing on web fetching and task management.
- Confirm event handling is streamlined without breaking existing workflows.
- Validate configuration changes with a variety of schema inputs.

## Potential Risks
- Breaking changes in session management could lead to security vulnerabilities if not thoroughly tested.
- New tool features might introduce bugs if integration tests are not comprehensive.
- Dependency updates require careful version management to prevent compatibility issues.
{"prompt_tokens":23027,"completion_tokens":1391,"total_tokens":24418}

[Session: 147b6319-163b-4d11-8392-f8b8d08943d2]
[Messages: 2, Tokens: 24418]

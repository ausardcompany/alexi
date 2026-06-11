# Update Plan for Alexi

Generated: 2026-06-11
Based on upstream commits: kilocode (c7a06d2f4..8b2a10008), opencode (97e713e..318dbe9)

## Summary
- Total changes planned: 5
- Critical: 1 | High: 3 | Medium: 1 | Low: 0

## Changes

### 1. Integrate New Agent Patterns
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: feature
**Reason**: Update agent system to incorporate new permission handling and subagent patterns from upstream changes.

**Current code**:
```typescript
// Existing agent permission logic
```

**New code**:
```typescript
// Updated logic to integrate new permission and subagent patterns
import { SubagentPermissions } from 'opencode/src/agent/subagent-permissions';

// New permission handling logic
function updatePermissions(agent) {
    const permissions = SubagentPermissions.getPermissions(agent.id);
    // Integrate permissions into agent logic
}
```

### 2. Update Core Orchestration for Enhanced SDK Integration
**File**: `src/core/aisdk.ts`
**Priority**: critical
**Type**: feature
**Reason**: Implement new SDK integration for enhanced language model capabilities and provider handling.

**Current code**:
```typescript
// Existing SDK initialization logic
```

**New code**:
```typescript
import { AISDK } from 'core/src/aisdk';

function initializeSDK() {
    const sdk = new AISDK();
    sdk.initialize({
        timeout: 3000,
        provider: 'openai'
    });
    return sdk;
}
```

### 3. Improve Tool System with New Registry Logic
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: Enhance tool registry with updated task management and integrate new task status tracking.

**Current code**:
```typescript
// Existing tool registry logic
```

**New code**:
```typescript
import { TaskStatus } from 'opencode/src/tool/task_status';

function registerTool(tool) {
    const status = TaskStatus.get(tool.id);
    // Integrate status tracking into tool registration
    toolRegistry.add(tool, status);
}
```

### 4. Revise Core Catalog Handling
**File**: `src/core/catalog.ts`
**Priority**: high
**Type**: refactor
**Reason**: Optimize provider and model retrieval to align with updated catalog structure.

**Current code**:
```typescript
// Existing catalog retrieval logic
```

**New code**:
```typescript
import { Catalog } from 'core/src/catalog';

function fetchProvider(providerID) {
    return Catalog.provider.get(providerID);
}

function fetchAllModels() {
    return Catalog.model.all();
}
```

### 5. Enable Enhanced Session Handling
**File**: `src/session/index.ts`
**Priority**: medium
**Type**: feature
**Reason**: Implement new session API endpoints for improved session management and data context integration.

**Current code**:
```typescript
// Existing session handling logic
```

**New code**:
```typescript
import { SessionAPI } from 'server/src/groups/session';

function manageSession(sessionID) {
    const sessionData = SessionAPI.get(sessionID);
    // Integrate session data into management logic
}
```

## Testing Recommendations
- Validate agent permissions and subagent interactions.
- Test SDK initialization and provider integration thoroughly.
- Verify tool registration and status tracking functionality.
- Ensure provider and model retrieval are optimized with new catalog logic.
- Test session API endpoints for correct data handling and context integration.

## Potential Risks
- Changes to SDK and session handling may introduce compatibility issues with existing integrations.
- New tool registry logic requires thorough testing to ensure backward compatibility with existing tools.
{"prompt_tokens":35276,"completion_tokens":814,"total_tokens":36090}

[Session: d1633404-6acb-4d10-b0b2-3ff0759c6ab0]
[Messages: 2, Tokens: 36090]

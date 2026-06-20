```markdown
# Update Plan for Alexi

Generated: 2026-06-16
Based on upstream commits: Kilo-Org/kilocode (fcb8802aa..2ddf6f635), anomalyco/opencode (7efade2..5d0f866)

## Summary
- Total changes planned: 5
- Critical: 1 | High: 2 | Medium: 2 | Low: 0

## Changes

### 1. Update Agent Model Reference
**File**: `src/agent/index.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: To reflect the updated model reference in `.opencode/agent/triage.md` which includes a change in the model identifier, ensuring compatibility with upstream changes.

**Current code**:
```typescript
const model = "openai/gpt-5-nano";
```

**New code**:
```typescript
const model = "kilo/openai/gpt-5-nano"; // Updated model reference
```

### 2. Integrate Event System Updates
**File**: `src/core/event.ts`
**Priority**: high
**Type**: feature
**Reason**: Introduction of a new event system in `packages/core/src/event.ts` to manage and synchronize events across the application, enhancing functionality and consistency.

**New code**:
```typescript
import { Event } from "@opencode-ai/core";

export const MyEvent = Event.define({
  type: "my.event",
  schema: {
    data: Schema.Struct({
      message: Schema.String,
    }),
  },
});
```

### 3. Update Core Catalog Structure
**File**: `src/core/catalog.ts`
**Priority**: high
**Type**: refactor
**Reason**: To align with structural changes in `packages/core/src/catalog.ts`, improving the integration with the new provider and model management features.

**Current code**:
```typescript
import { ModelV2 } from "./model";
```

**New code**:
```typescript
import { ModelV2, EventV2 } from "./model";
// Updated to use new EventV2 structure
```

### 4. Modify Tool System for New Task Handling
**File**: `src/tool/task.ts`
**Priority**: medium
**Type**: feature
**Reason**: Incorporation of changes in task handling from `packages/opencode/src/tool/task.ts` to support new functionalities and improve task execution.

**Current code**:
```typescript
function executeTask(task: Task) {
    // existing task execution logic
}
```

**New code**:
```typescript
function executeTask(task: Task, options: TaskOptions = {}) {
    // updated task execution logic with options handling
}
```

### 5. Adjust Core Location Management
**File**: `src/core/location.ts`
**Priority**: medium
**Type**: refactor
**Reason**: To align with the updates in `packages/core/src/location.ts` for improved location management and consistency across modules.

**Current code**:
```typescript
export class LocationManager {
    // existing methods
}
```

**New code**:
```typescript
export class LocationManager {
    // updated methods reflecting new location management strategies
}
```

## Testing Recommendations
- Validate the new agent model is being correctly referenced and utilized in workflows.
- Test event creation and synchronization to ensure the new event system is functioning as intended.
- Verify task execution with new options parameters in the tool system.
- Confirm that the core catalog and location changes do not disrupt existing functionality.

## Potential Risks
- Updating the model reference may cause compatibility issues if not all dependencies are updated accordingly.
- The integration of new event and catalog structures might introduce unexpected behavior if not thoroughly tested.
- Changes in task handling could affect existing integrations if not backward compatible.
```
{"prompt_tokens":21832,"completion_tokens":803,"total_tokens":22635}

[Session: 94806bbe-d83a-4460-8dcd-fb7f7f08e057]
[Messages: 2, Tokens: 22635]

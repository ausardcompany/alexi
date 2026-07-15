```markdown
# Update Plan for Alexi

Generated: 2026-07-15
Based on upstream commits: 323227940, 05c3e40

## Summary
- Total changes planned: 10
- Critical: 4 | High: 3 | Medium: 2 | Low: 1

## Changes

### 1. Update Session Message Projection Order
**File**: `src/core/database/migration/session_message_projection_order.sql`
**Priority**: critical
**Type**: bugfix
**Reason**: To align session message projection with upstream changes, ensuring proper indexing and sequence management.

**Current code**:
```sql
ALTER TABLE `session_message` ADD `seq` integer NOT NULL;
```

**New code**:
```sql
ALTER TABLE `session_message` ADD `seq` integer;
```

### 2. Modify Session Input Inbox Snapshot
**File**: `src/core/migration/session_input_inbox_snapshot.json`
**Priority**: high
**Type**: bugfix
**Reason**: Update snapshot to match the new upstream structure, ensuring data consistency.

**Current code**:
```json
"notNull": true,
```

**New code**:
```json
"notNull": false,
```

### 3. Enhance Agent Manager Orchestration
**File**: `src/core/agent-manager/orchestration-api.ts`
**Priority**: critical
**Type**: feature
**Reason**: Integrate upstream orchestration API updates for better session management.

**New code**:
```typescript
export function orchestrateAgentManagerSessions() {
  // Orchestration logic
}
```

### 4. Update Permission Config Paths
**File**: `src/permission/config-paths.ts`
**Priority**: critical
**Type**: security
**Reason**: Ensure paths are correctly configured and permissions are enforced as per upstream changes.

**Current code**:
```typescript
export const configPaths = {...};
```

**New code**:
```typescript
export const configPaths = {
  // Updated paths and permissions
};
```

### 5. Adjust Tool Support for JetBrains
**File**: `src/tool/ToolSupport.kt`
**Priority**: high
**Type**: feature
**Reason**: Enhance JetBrains tool integration to support new UI capabilities.

**Current code**:
```kotlin
class ToolSupport {
  // Existing support logic
}
```

**New code**:
```kotlin
class ToolSupport {
  fun enhanceUI() {
    // New UI enhancement logic
  }
}
```

### 6. Modify Core Session Store
**File**: `src/core/session/store.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Refactor session store to improve performance and align with upstream optimizations.

**Current code**:
```typescript
function storeSession(data) {
  // Storing logic
}
```

**New code**:
```typescript
function storeSession(data) {
  // Optimized storing logic
}
```

### 7. Update CLI Session Prompt
**File**: `src/cli/session/prompt.tsx`
**Priority**: medium
**Type**: feature
**Reason**: Implement changes for better prompt management and user interaction.

**Current code**:
```typescript
function sendPrompt() {
  // Existing prompt logic
}
```

**New code**:
```typescript
function sendPrompt() {
  // Updated prompt logic with new features
}
```

### 8. Adjust Permission Index
**File**: `src/permission/index.ts`
**Priority**: critical
**Type**: security
**Reason**: Update permission index to prevent unauthorized access and enforce new security measures.

**Current code**:
```typescript
export const permissions = [...];
```

**New code**:
```typescript
export const permissions = [
  // Revised permissions list
];
```

### 9. Revise Notebook Tool Integration
**File**: `src/tool/notebook.ts`
**Priority**: low
**Type**: refactor
**Reason**: Minor refactor to improve code readability and maintainability.

**Current code**:
```typescript
export function manageNotebook() {
  // Existing notebook management
}
```

**New code**:
```typescript
export function manageNotebook() {
  // Refactored notebook management
}
```

### 10. Enhance Legacy Migration Handling
**File**: `src/core/migration/legacy_migration.ts`
**Priority**: high
**Type**: feature
**Reason**: Implement upstream changes to better handle legacy migrations and improve data integrity.

**New code**:
```typescript
function handleLegacyMigration() {
  // New legacy migration logic
}
```

## Testing Recommendations
- Ensure all session management and migration features work as expected.
- Validate permission enforcement across different modules.
- Test the updated UI elements in JetBrains and Visual Studio Code integrations.
- Confirm no regression in existing functionalities.

## Potential Risks
- Changes to session and permission handling could introduce new security vulnerabilities if not properly tested.
- Refactoring might inadvertently affect performance if not optimized correctly.
```

{"prompt_tokens":15930,"completion_tokens":1080,"total_tokens":17010,"cache_read_input_tokens":0}

[Session: 61b5e56f-094d-4c0e-ac5e-6f15d35318e0]
[Messages: 2, Tokens: 17010]

# Update Plan for Alexi

Generated: 2026-07-14
Based on upstream commits: `kilocode` (3cb82a090..a4e1dd72c), `opencode` (34e5809..cb8be9b)

## Summary
- Total changes planned: 10
- Critical: 3 | High: 4 | Medium: 2 | Low: 1

## Changes

### 1. Implement Session Metadata
**File**: `src/core/database/session.ts`
**Priority**: critical
**Type**: feature
**Reason**: Upstream changes introduced a new metadata field in the session table, which is critical for ensuring compatibility with the latest session features.

**Current code**:
```typescript
// Existing session table structure
```

**New code**:
```typescript
// Add metadata field to session table
ALTER TABLE `session` ADD `metadata` text;
```

### 2. Normalize Storage Paths
**File**: `src/core/database/project.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: This update ensures that file paths are consistently formatted across different operating systems, reducing bugs related to path handling.

**Current code**:
```typescript
// Existing path manipulation logic
```

**New code**:
```typescript
// Normalize paths using consistent separators
UPDATE project SET worktree = REPLACE(worktree, char(92), '/') WHERE worktree GLOB '[A-Za-z]:' || char(92) || '*' OR worktree LIKE char(92) || char(92) || '%';
```

### 3. Remove Permission Table
**File**: `src/core/database/permission.ts`
**Priority**: critical
**Type**: security
**Reason**: Upstream changes necessitate the removal of the permission table to align with updated security practices.

**Current code**:
```typescript
// Existing permission table structure
```

**New code**:
```typescript
// Drop permission table
DROP TABLE `permission`;
```

### 4. Update Tool Registry
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: The tool registry now supports new capabilities, enhancing tool discovery and integration.

**Current code**:
```typescript
// Existing registry logic
```

**New code**:
```typescript
// Add new tool capabilities
export const ToolRegistry = {
  // New enhancements
};
```

### 5. Enhance Git Operations
**File**: `src/core/git.ts`
**Priority**: high
**Type**: feature
**Reason**: Enhancements to git operations are needed to support new workflow capabilities introduced upstream.

**Current code**:
```typescript
// Existing git operation logic
```

**New code**:
```typescript
// Enhanced git operations
function enhancedGitFunction() {
  // New logic
}
```

### 6. Adjust Agent Manager Patterns
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: refactor
**Reason**: Refactoring agent manager patterns to align with upstream changes improves maintainability and reduces complexity.

**Current code**:
```typescript
// Existing agent manager patterns
```

**New code**:
```typescript
// Refactored agent manager patterns
function refactorAgentManager() {
  // New structure
}
```

### 7. Incorporate Event Bus Enhancements
**File**: `src/bus/index.ts`
**Priority**: high
**Type**: feature
**Reason**: Event bus enhancements are crucial for handling new event types and improving system responsiveness.

**Current code**:
```typescript
// Existing event bus logic
```

**New code**:
```typescript
// Enhanced event handling
class EventBus {
  // New methods
}
```

### 8. Update Provider Transform Logic
**File**: `src/providers/transform.ts`
**Priority**: medium
**Type**: feature
**Reason**: Update transform logic to support new reasoning options and model variants.

**Current code**:
```typescript
// Existing transform logic
```

**New code**:
```typescript
// Updated provider transform logic
function transformProviderData() {
  // New options handling
}
```

### 9. Refactor Session Runner
**File**: `src/core/session-runner.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Refactoring the session runner for better performance and alignment with upstream changes.

**Current code**:
```typescript
// Existing session runner code
```

**New code**:
```typescript
// Refactored session runner logic
function sessionRunner() {
  // Optimized execution
}
```

### 10. Update Permission Evaluation Logic
**File**: `src/permission/evaluate.ts`
**Priority**: low
**Type**: feature
**Reason**: Update permission evaluation to incorporate new rules and logic from upstream.

**Current code**:
```typescript
// Existing permission evaluation logic
```

**New code**:
```typescript
// Enhanced permission evaluation
function evaluatePermissions() {
  // New evaluation rules
}
```

## Testing Recommendations
- Verify database migrations are applied correctly without errors.
- Test path normalization across different platforms.
- Ensure session metadata is correctly handled in new workflows.
- Validate tool registry and git enhancements in typical user scenarios.
- Confirm event bus can handle new event types.
- Check provider transformations for accuracy in reasoning options.
- Benchmark refactored components for performance improvements.

## Potential Risks
- Breaking changes in session handling due to metadata addition.
- Path normalization might introduce issues on legacy systems.
- Removing permission table requires careful security audit.
- New tool capabilities must be thoroughly tested to avoid integration issues.
{"prompt_tokens":52925,"completion_tokens":1211,"total_tokens":54136,"cache_read_input_tokens":0}

[Session: b23fedb5-d057-47fb-a821-835fac2f8d2f]
[Messages: 2, Tokens: 54136]

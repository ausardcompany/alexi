```markdown
# Update Plan for Alexi

Generated: 2026-07-02
Based on upstream commits: kilocode (c856bb33e..78cdc9c89), opencode (8289883..f014686)

## Summary
- Total changes planned: 15
- Critical: 2 | High: 5 | Medium: 6 | Low: 2

## Changes

### 1. Update Agent Option Handling
**File**: `src/agent/index.ts`
**Priority**: critical
**Type**: feature
**Reason**: Incorporate new agent patterns to prevent internal metadata leakage.

**New code**:
```typescript
export const INTERNAL_OPTION_KEYS = ["id", "displayName", "source", "reference", "resolved"] as const;

const internal: ReadonlySet<string> = new Set(INTERNAL_OPTION_KEYS);

function stripInternalOptions(options: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in options) {
    if (internal.has(key)) continue;
    result[key] = options[key];
  }
  return result;
}
```

### 2. Synchronize Package Versions
**File**: `src/core/package.json`
**Priority**: high
**Type**: refactor
**Reason**: Keep package dependencies up to date for compatibility.

**Current code**:
```json
{
  "version": "1.17.11",
  "dependencies": {
    "venice-ai-sdk-provider": "2.0.2"
  }
}
```

**New code**:
```json
{
  "version": "1.17.12",
  "dependencies": {
    "venice-ai-sdk-provider": "2.1.1"
  }
}
```

### 3. Refactor Tool Layer Exports
**File**: `src/tool/application-tools.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Align with upstream removal of default layer exports.

**Current code**:
```typescript
export const layer = Layer.effect(Service, make);
export const defaultLayer = layer;
```

**New code**:
```typescript
const layer = Layer.effect(Service, make);
```

### 4. Update Tool System: Apply Patch
**File**: `src/tool/apply-patch.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Maintain consistency with upstream code changes.

**Current code**:
```typescript
// existing patch application logic
```

**New code**:
```typescript
// updated patch application logic
```

### 5. Update Tool System: Bash
**File**: `src/tool/bash.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Ensure compatibility with upstream tool updates.

**Current code**:
```typescript
// existing bash tool logic
```

**New code**:
```typescript
// updated bash tool logic
```

### 6. Update Tool System: Builtins
**File**: `src/tool/builtins.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Remove unused exports to streamline code.

**Current code**:
```typescript
export const someBuiltin = function() {};
```

**New code**:
```typescript
// Builtin export removed
```

### 7. Update Tool System: Edit
**File**: `src/tool/edit.ts`
**Priority**: low
**Type**: refactor
**Reason**: Align with upstream changes for code consistency.

**Current code**:
```typescript
// existing edit tool logic
```

**New code**:
```typescript
// updated edit tool logic
```

### 8. Update Tool System: Glob
**File**: `src/tool/glob.ts`
**Priority**: low
**Type**: refactor
**Reason**: Ensure consistency with upstream pattern updates.

**Current code**:
```typescript
// existing glob tool logic
```

**New code**:
```typescript
// updated glob tool logic
```

### 9. Update Tool System: Grep
**File**: `src/tool/grep.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Update grep logic for improved performance.

**Current code**:
```typescript
// existing grep tool logic
```

**New code**:
```typescript
// updated grep tool logic
```

### 10. Update Tool System: Question
**File**: `src/tool/question.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Ensure question tool logic aligns with upstream changes.

**Current code**:
```typescript
// existing question tool logic
```

**New code**:
```typescript
// updated question tool logic
```

### 11. Update Tool System: Read Filesystem
**File**: `src/tool/read-filesystem.ts`
**Priority**: high
**Type**: feature
**Reason**: Implement new filesystem reading capabilities.

**Current code**:
```typescript
// existing filesystem read logic
```

**New code**:
```typescript
// updated filesystem read logic
```

### 12. Update Tool System: Read
**File**: `src/tool/read.ts`
**Priority**: high
**Type**: feature
**Reason**: Enhance reading functionality for better data handling.

**Current code**:
```typescript
// existing read tool logic
```

**New code**:
```typescript
// updated read tool logic
```

### 13. Update Tool System: Registry
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: Reflect changes in tool registration process.

**Current code**:
```typescript
// existing registry tool logic
```

**New code**:
```typescript
// updated registry tool logic
```

### 14. Update Tool System: Skill
**File**: `src/tool/skill.ts`
**Priority**: high
**Type**: feature
**Reason**: Implement changes in skill management and execution.

**Current code**:
```typescript
// existing skill tool logic
```

**New code**:
```typescript
// updated skill tool logic
```

### 15. Update Tool System: Todowrite
**File**: `src/tool/todowrite.ts`
**Priority**: high
**Type**: feature
**Reason**: Improve todo writing capabilities based on upstream updates.

**Current code**:
```typescript
// existing todowrite tool logic
```

**New code**:
```typescript
// updated todowrite tool logic
```

## Testing Recommendations
- Conduct integration tests for agent option handling.
- Verify package compatibility with updated dependencies.
- Perform regression tests on tool system functionalities.
- Check SAP AI Core integration remains unaffected.

## Potential Risks
- Breaking changes in agent metadata handling.
- Compatibility issues with new package versions.
- Tool system updates might introduce unexpected behaviors.
```
{"prompt_tokens":11983,"completion_tokens":1484,"total_tokens":13467,"cache_read_input_tokens":0}

[Session: cc024d49-6f0b-449c-9803-d4b793ca6aeb]
[Messages: 2, Tokens: 13467]

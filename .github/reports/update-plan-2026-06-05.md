```markdown
# Update Plan for Alexi

Generated: 2026-06-05
Based on upstream commits: kilocode (38eb5879f..049d567d1), opencode (69cfc44..a468680)

## Summary
- Total changes planned: 10
- Critical: 2 | High: 4 | Medium: 3 | Low: 1

## Changes

### 1. Update version in core package
**File**: `src/core/package.json`
**Priority**: high
**Type**: bugfix
**Reason**: Ensure compatibility with latest core changes for maintaining version consistency.

**Current code**:
```json
{
  "version": "7.3.29",
}
```

**New code**:
```json
{
  "version": "7.3.33",
}
```

### 2. Update webfetch tool for MIME type handling
**File**: `src/tool/webfetch.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Fix MIME type rejection to prevent unsupported images from causing errors.

**Current code**:
```typescript
if (isImageAttachment(mime)) {
  const base64Content = Buffer.from(arrayBuffer).toString("base64")
  return {
    // existing logic
  }
}
```

**New code**:
```typescript
if (isIconMimeType(mime)) throw new Error(`Unsupported image format: ${mime}`)
if (isImageAttachment(mime)) {
  const base64Content = Buffer.from(arrayBuffer).toString("base64")
  return {
    // updated logic
  }
}
```

### 3. Add new models to tool fixtures
**File**: `src/tool/models-api.json.ts`
**Priority**: medium
**Type**: feature
**Reason**: Integrate new Atomic Chat models for expanded capability.

**Current code**:
```json
{
  // existing models
}
```

**New code**:
```json
{
  "atomic-chat": {
    "id": "atomic-chat",
    "models": {
      "gemma-4-E4B-it-IQ4_XS": {
        "id": "gemma-4-E4B-it-IQ4_XS",
        // model details
      },
      "gemma-4-E4B-it-MLX-4bit": {
        "id": "gemma-4-E4B-it-MLX-4bit",
        // model details
      }
    }
  }
}
```

### 4. Update application-tools for new features
**File**: `src/tool/application-tools.ts`
**Priority**: high
**Type**: feature
**Reason**: Improve tool capabilities with new application tool features.

**Current code**:
```typescript
// existing application tool logic
```

**New code**:
```typescript
// enhanced application tool logic with new features
```

### 5. Update task test for new task handling
**File**: `src/tool/task.test.ts`
**Priority**: medium
**Type**: feature
**Reason**: Ensure coverage for new task handling changes.

**Current code**:
```typescript
// existing task test cases
```

**New code**:
```typescript
// additional test cases for new task handling
```

### 6. Update native tool for global native tools
**File**: `src/tool/native.ts`
**Priority**: high
**Type**: feature
**Reason**: Integrate global native tools for enhanced functionality.

**Current code**:
```typescript
// existing native tool logic
```

**New code**:
```typescript
// updated native tool logic with global integration
```

### 7. Update sync-v2 context
**File**: `src/cli/context/sync-v2.tsx`
**Priority**: medium
**Type**: refactor
**Reason**: Improve synchronization with experimental session switcher changes.

**Current code**:
```typescript
// existing sync-v2 logic
```

**New code**:
```typescript
// refactored sync-v2 logic for better session management
```

### 8. Update task tool for path formatting
**File**: `src/tool/task.ts`
**Priority**: low
**Type**: bugfix
**Reason**: Guard against improper path formatting inputs.

**Current code**:
```typescript
// existing task path logic
```

**New code**:
```typescript
// updated path formatting guard logic
```

### 9. Update migrate SQL for session projection order
**File**: `src/core/migration/session_message_projection_order.sql`
**Priority**: high
**Type**: bugfix
**Reason**: Ensure proper ordering for session message projections.

**Current code**:
```sql
ALTER TABLE `session_message` ADD `seq` integer NOT NULL;
```

**New code**:
```sql
DELETE FROM `session_message`;
ALTER TABLE `session_message` ADD `seq` integer NOT NULL;
```

### 10. Add event-sourced session input migration
**File**: `src/core/migration/event_sourced_session_input.sql`
**Priority**: critical
**Type**: feature
**Reason**: Transition to event-sourced session input for enhanced session management.

**Current code**: *New file*

**New code**:
```sql
-- SQL migration logic for event-sourced session input
```

## Testing Recommendations
- Validate functionality of new Atomic Chat models.
- Check MIME type rejection logic to ensure unsupported images are handled correctly.
- Verify application tools operate as expected with new features.
- Ensure new task handling logic is covered by tests.
- Confirm synchronization improvements with session switcher functionality.

## Potential Risks
- Ensure compatibility with SAP AI Core integration.
- Verify no breaking changes in tool and core functionalities.
- Maintain SAP-specific customizations during updates.
```
{"prompt_tokens":16824,"completion_tokens":1239,"total_tokens":18063}

[Session: 9b869c16-a65a-4a6f-893d-56afd25bb7b0]
[Messages: 2, Tokens: 18063]

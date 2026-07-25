```markdown
# Update Plan for Alexi

Generated: 2026-07-25
Based on upstream commits: eab61d853, d6b45d323, 2b2b69d, 9e8b217

## Summary
- Total changes planned: 8
- Critical: 2 | High: 3 | Medium: 3 | Low: 0

## Changes

### 1. Update Database Preflight Checks
**File**: `src/core/database.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Ensure database files are writable to prevent crash due to read-only file errors.

**Current code**:
```typescript
import { existsSync } from "fs"; 
// other imports...
```

**New code**:
```typescript
import { DbPreflight } from "../kilocode/db-preflight"; 
// other imports...

DbPreflight.assertWritable(filename);
```

### 2. Add Database Preflight Module
**File**: `src/core/db-preflight.ts`
**Priority**: critical
**Type**: feature
**Reason**: New functionality for asserting file writability to prevent runtime errors.

**New code**:
```typescript
export * as DbPreflight from "./db-preflight";

import { accessSync, chmodSync, constants, statSync } from "fs";
// other imports...

export function assertWritable(filename: string, trusted: string = Global.Path.data) {
  if (!filename || filename === ":memory:" || filename.startsWith("file:")) return;
  // logic for checking writability...
}
```

### 3. Update Permission System for Provenance
**File**: `src/permission/provenance.ts`
**Priority**: high
**Type**: feature
**Reason**: To improve tracking of auto-approval provenance per permission pattern.

**Current code**:
```typescript
// existing permission setup...
```

**New code**:
```typescript
// Updated permission setup with provenance tracking...
```

### 4. Adjust Core Session Configuration
**File**: `src/core/session.ts`
**Priority**: high
**Type**: feature
**Reason**: Support new session identifiers and improve configuration.

**Current code**:
```typescript
export const StepFinishPart = Schema.Struct({
  // existing fields...
});
```

**New code**:
```typescript
export const StepFinishPart = Schema.Struct({
  generationID: Schema.optional(Schema.String),
  vercelID: Schema.optional(Schema.String),
  // existing fields...
});
```

### 5. Refactor Repository Caching Logic
**File**: `src/core/repository-cache.ts`
**Priority**: high
**Type**: refactor
**Reason**: Improve the caching mechanism by using branch-specific directories.

**Current code**:
```typescript
const localPath = Repository.cachePath(global.repos, input.reference);
```

**New code**:
```typescript
const localPath = Repository.cachePath(global.repos, input.reference, input.branch);
```

### 6. Update Tool Support for JetBrains Integration
**File**: `src/tool/ToolSupport.kt`
**Priority**: medium
**Type**: feature
**Reason**: Enhance JetBrains integration with new tool support.

**Current code**:
```kotlin
// tool support logic...
```

**New code**:
```kotlin
// updated tool support logic with new features...
```

### 7. Modify Grep Tool Logic
**File**: `src/tool/grep.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Fix logic for preserving symlink paths in grep tool.

**Current code**:
```typescript
// grep logic...
```

**New code**:
```typescript
// updated grep logic to handle symlink paths...
```

### 8. Update Grep Tool Tests
**File**: `src/tool/grep.test.ts`
**Priority**: medium
**Type**: test
**Reason**: Ensure functionality of updated grep tool logic.

**New code**:
```typescript
// New tests for grep tool symlink path preservation...
```

## Testing Recommendations
- Validate database operations after preflight checks are added.
- Verify permission system behavior for auto-approval provenance.
- Test session handling for new identifier fields.
- Ensure repository caching is correctly using branch-specific directories.
- Check JetBrains integration functionality with new tool support.
- Run grep tool tests to confirm symlink path handling.

## Potential Risks
- Changes to database handling could affect data persistence.
- Permission system updates may alter behavior for existing permissions.
- Incorrect repository caching logic could lead to data inconsistency.
```

{"prompt_tokens":14593,"completion_tokens":982,"total_tokens":15575,"cache_read_input_tokens":0}

[Session: 90c0304f-03a8-4841-88cd-90b3315239a8]
[Messages: 2, Tokens: 15575]

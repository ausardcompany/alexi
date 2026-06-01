```markdown
# Update Plan for Alexi

Generated: 2026-06-01
Based on upstream commits: kilocode (ad908e283..1eeab10b2), opencode (04c4611..d85f8cd)

## Summary
- Total changes planned: 5
- Critical: 1 | High: 2 | Medium: 2 | Low: 0

## Changes

### 1. Update Session Metadata
**File**: `src/core/migration/20260511173437_session-metadata.sql`
**Priority**: critical
**Type**: feature
**Reason**: Incorporate new session metadata feature for tracking additional session details.

**New code**:
```sql
ALTER TABLE `session` ADD `metadata` text;
```

### 2. Align Agent Import Patterns
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: refactor
**Reason**: Ensure consistency with opencode's new agent import patterns to improve maintainability and readability.

**Current code**:
```typescript
import { Agent } from './agent';
```

**New code**:
```typescript
import { Agent } from './agent';
import { Namespace } from './namespace';
```

### 3. Update Tool Apply Patch Logic
**File**: `src/tool/apply_patch.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Address bugs related to patch application logic as observed in opencode's recent updates.

**Current code**:
```typescript
function applyPatch(patch: Patch) {
    // old logic
}
```

**New code**:
```typescript
function applyPatch(patch: Patch) {
    if (!patch.isValid()) {
        throw new Error("Invalid patch");
    }
    // updated logic
}
```

### 4. Update LSP Test Cases
**File**: `src/tool/lsp.test.ts`
**Priority**: medium
**Type**: test
**Reason**: Improve LSP test coverage based on opencode's adjustments, ensuring robust testing for new LSP features.

**Current code**:
```typescript
test('LSP connection', () => {
    // existing test logic
});
```

**New code**:
```typescript
test('LSP connection with new schema', () => {
    // enhanced test logic
});
```

### 5. Implement Session Metadata in Referral Logic
**File**: `src/core/referral.ts`
**Priority**: medium
**Type**: feature
**Reason**: Utilize new session metadata in referral logic to improve data tracking and analytics.

**Current code**:
```typescript
const workspaceIDs = await tx.select(...);
```

**New code**:
```typescript
const metadata = await tx.select({ id: MetadataTable.id }).from(MetadataTable);
// integrate metadata with workspace IDs
```

## Testing Recommendations
- Validate session metadata addition in the database.
- Ensure all agent imports are correctly aligned and functional.
- Test the application of patches to ensure no errors.
- Run full test suite to verify LSP and tool functionality.
- Check referral logic with metadata integration for accuracy.

## Potential Risks
- Changes to the database schema may affect existing deployments.
- Refactoring imports could lead to module resolution issues if not handled carefully.
- Patch logic changes might introduce regressions if not thoroughly tested.
```

{"prompt_tokens":15889,"completion_tokens":710,"total_tokens":16599}

[Session: bf5c51b9-a589-4441-a234-8e7e5fbfa501]
[Messages: 2, Tokens: 16599]

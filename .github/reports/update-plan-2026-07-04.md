```markdown
# Update Plan for Alexi

Generated: 2026-07-04
Based on upstream commits: kilocode (4c07a1db5..1fc8f066f), opencode (30936a9..7a8e7c8)

## Summary
- Total changes planned: 10
- Critical: 2 | High: 3 | Medium: 4 | Low: 1

## Changes

### 1. Implement Stdio Tap for Fast Exiting Processes
**File**: `src/core/cross-spawn-spawner.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Fix issue with fast-exiting processes losing stdio output due to lazy attachment.

**Current code**:
```typescript
let stdout = proc.stdout ? NodeStream.fromReadable({ evaluate: () => proc.stdout! }) : Stream.empty;
let stderr = proc.stderr ? NodeStream.fromReadable({ evaluate: () => proc.stderr! }) : Stream.empty;
```

**New code**:
```typescript
import { tap as tapStdio, tapped } from "./kilocode/stdio-tap";

let stdout = proc.stdout ? NodeStream.fromReadable({ evaluate: () => tapped(proc, "stdout") }) : Stream.empty;
let stderr = proc.stderr ? NodeStream.fromReadable({ evaluate: () => tapped(proc, "stderr") }) : Stream.empty;
tapStdio(proc);
```

### 2. Add Permission Handling for Headless Sessions
**File**: `src/permission/headless.ts`
**Priority**: critical
**Type**: security
**Reason**: Enhance security by failing permission prompts in headless sessions.

**New code**:
```typescript
export namespace KiloHeadless {
  const roots = new Set<string>();

  export function mark(id: string) {
    roots.add(id);
  }

  export function clear(id: string) {
    roots.delete(id);
  }

  export function denies(id: string): boolean {
    if (roots.size === 0) return false;
    if (roots.has(id)) return false;
    for (let parent = lookup(id); parent; parent = lookup(parent)) {
      if (roots.has(parent)) return true;
    }
    return false;
  }

  function lookup(id: string) {
    const row = Database.use((db) =>
      db.select({ parent: SessionTable.parent_id }).from(SessionTable).where(eq(SessionTable.id, id as SessionID)).get(),
    );
    return row?.parent ?? undefined;
  }
}
```

### 3. Update Tool Code Mode Integration
**File**: `src/tool/code-mode-integration.test.ts`
**Priority**: high
**Type**: feature
**Reason**: Add tests for new code-mode features ensuring proper integration.

**New code**:
```typescript
// Add comprehensive tests for code-mode tool integration
describe('Code Mode Integration', () => {
  it('should execute code mode tool with child calls correctly', async () => {
    // Test implementation
  });
});
```

### 4. Enhance Plan File Resolution Logic
**File**: `src/tool/plan.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Improve plan file resolution to handle non-git directories and provide better error handling.

**Current code**:
```typescript
const file = PlanFile.resolve(params.path, instance) ?? Session.plan(info, instance);
```

**New code**:
```typescript
const resolved = params.path ? PlanFile.resolve(params.path, instance) : undefined;
const target = resolved ?? Session.plan(info, instance);
const file = yield* Effect.promise(() => PlanFile.locate(target, messages, info, instance, ctx.agent));
```

### 5. Refactor FS Util for Path Resolution
**File**: `src/core/fs-util.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Centralize path resolution logic for better maintainability.

**Current code**:
```typescript
const start = FSUtil.resolve(location.directory);
const stop = FSUtil.resolve(location.project.directory);
```

**New code**:
```typescript
const start = yield* fs.resolve(location.directory);
const stop = yield* fs.resolve(location.project.directory);
```

### 6. Improve Spinner Registration in TUI
**File**: `src/tool/registry.ts`
**Priority**: medium
**Type**: feature
**Reason**: Ensure spinner registration is preserved across TUI sessions.

**Current code**:
```typescript
// Existing spinner registration code
```

**New code**:
```typescript
registerSpinner(session.id, spinnerOptions);
```

### 7. Update Session Compaction Logic
**File**: `src/core/session/compaction.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Stabilize session compaction to prevent data loss during hoisting.

**Current code**:
```typescript
compactSession(session);
```

**New code**:
```typescript
compactSession(session, hoistedDependencies);
```

### 8. Add Code Mode Tool Implementation
**File**: `src/tool/code-mode.ts`
**Priority**: medium
**Type**: feature
**Reason**: Introduce code-mode tool with child call rendering.

**New code**:
```typescript
export const CodeModeTool = Tool.define({
  execute: async (params) => {
    // Code mode execution logic
  },
});
```

### 9. Enhance Test Coverage for Registry
**File**: `src/tool/registry.test.ts`
**Priority**: low
**Type**: refactor
**Reason**: Add missing test cases to improve coverage.

**New code**:
```typescript
// Additional test cases for registry functionality
```

## Testing Recommendations
- Validate that stdio output for fast-exiting processes is captured.
- Ensure headless session permissions are denied correctly.
- Run all tests related to code-mode and verify integration works.
- Check plan file resolution handles edge cases.
- Verify spinner registration in TUI is consistent.
- Test session compaction for stability.

## Potential Risks
- Changes to stdio handling may affect existing process management.
- Headless session permissions could inadvertently block legitimate prompts.
- New code-mode features may introduce unexpected behavior if not thoroughly tested.
```

{"prompt_tokens":13522,"completion_tokens":1320,"total_tokens":14842,"cache_read_input_tokens":0}

[Session: 44890b4e-c46c-457d-879e-0acdc5e039af]
[Messages: 2, Tokens: 14842]

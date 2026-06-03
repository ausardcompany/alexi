```markdown
# Update Plan for Alexi

Generated: 2026-06-03
Based on upstream commits: kilocode (7433b0d75..66f053a38), opencode (d5a0ddb..56ec4b6)

## Summary
- Total changes planned: 8
- Critical: 1 | High: 3 | Medium: 3 | Low: 1

## Changes

### 1. Incorporate Shell Tool Enhancements
**File**: `src/tool/shell.ts`
**Priority**: critical
**Type**: feature
**Reason**: Enhance command execution with additional metadata for improved logging and user feedback.

**Current code**:
```typescript
const ask = Effect.fn("ShellTool.ask")(function* (ctx: Tool.Context, scan: Scan, command: string) {
  // existing logic
});
```

**New code**:
```typescript
const ask = Effect.fn("ShellTool.ask")(function* (
  ctx: Tool.Context,
  scan: Scan,
  command: string,
  description?: string,
) {
  // Updated logic with description handling
  yield* ctx.require({
    permission: "external_directory",
    patterns: Array.from(scan.patterns),
    always: Array.from(scan.always),
    metadata: { command, ...(description ? { description } : {}) },
  });
});
```

### 2. Add Project Directories Table
**File**: `src/core/migrations/20260602182828_add_project_directories.sql`
**Priority**: high
**Type**: feature
**Reason**: Support new feature for project directory tracking.

**New code**:
```sql
CREATE TABLE `project_directory` (
  `project_id` text NOT NULL,
  `directory` text NOT NULL,
  `type` text NOT NULL,
  `time_created` integer NOT NULL,
  CONSTRAINT `project_directory_pk` PRIMARY KEY(`project_id`, `directory`),
  CONSTRAINT `fk_project_directory_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE
);
```

### 3. Update Core Package for Migration Script Enhancements
**File**: `src/core/script/migration.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Improve migration script flexibility with argument parsing.

**Current code**:
```typescript
if (Bun.argv.includes("--check")) {
  await check();
  process.exit(0);
}
```

**New code**:
```typescript
const args = parseArgs({
  args: process.argv.slice(2),
  options: {
    check: { type: "boolean" },
    name: { type: "string" },
  },
});

if (args.values.check) {
  await check();
  process.exit(0);
}
```

### 4. Update File System Service Utilization
**File**: `src/core/auth.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Consolidate filesystem service usage to improve code maintainability.

**Current code**:
```typescript
import { AppFileSystem } from "./filesystem";
// usage of AppFileSystem
```

**New code**:
```typescript
import { FSUtil } from "./fs-util";
// usage of FSUtil
```

### 5. Update Session Export Handling
**File**: `src/session/export.ts`
**Priority**: high
**Type**: feature
**Reason**: Enable session export capabilities for better data management.

**New code**:
```typescript
export function captureSession() {
  // Implement session capture logic following opencode's updated pattern
}
```

### 6. Enhance Project Copy Strategy
**File**: `src/core/project.ts`
**Priority**: high
**Type**: feature
**Reason**: Introduce project copy strategies for enhanced project management.

**New code**:
```typescript
export class ProjectCopy {
  static copy(projectId: string, strategy: CopyStrategy) {
    // Implement copy logic
  }
}
```

### 7. Update CLI Handling for Agent Debug
**File**: `src/cli/cmd/debug/agent.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Improve CLI debugging capabilities with updated agent handling.

**Current code**:
```typescript
// existing CLI debug logic
```

**New code**:
```typescript
import { DebugHandler } from './debug-handler';

export class AgentDebug {
  static run() {
    DebugHandler.handleAgentDebug();
  }
}
```

### 8. Update Permissions Index
**File**: `src/permission/index.ts`
**Priority**: low
**Type**: bugfix
**Reason**: Fix permission handling inconsistencies identified in upstream changes.

**New code**:
```typescript
export const Permissions = {
  // Updated permissions logic
};
```

## Testing Recommendations
- Ensure all new features are covered with automated tests.
- Manually test project directory tracking and session export features.
- Verify backward compatibility with existing functionalities.
- Perform regression testing on CLI functionalities.

## Potential Risks
- Changes to file system and migration scripts might introduce compatibility issues with existing setups.
- New database migrations need careful testing to avoid data loss.
```

{"prompt_tokens":20490,"completion_tokens":1106,"total_tokens":21596}

[Session: cec83c83-41f5-4b6e-8f95-a744fedf0616]
[Messages: 2, Tokens: 21596]

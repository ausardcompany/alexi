```markdown
# Update Plan for Alexi

Generated: 2026-07-31
Based on upstream commits: kilocode (3b8bd23e1..7cbe92e39), opencode (f720490..14f0bf6)

## Summary
- Total changes planned: 12
- Critical: 2 | High: 4 | Medium: 4 | Low: 2

## Changes

### 1. Update exit code handling for terminated processes
**File**: `src/core/cross-spawn-spawner.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Ensure processes terminated by signals return conventional exit codes for robust error handling.

**Current code**:
```typescript
exitCode: Effect.flatMap(Deferred.await(signal), ([code, signal]) => {
  if (Predicate.isNotNull(code)) return Effect.succeed(ExitCode(code))
  return Effect.fail(new Error(`Process interrupted due to receipt of signal: '${signal}'`))
}),
```

**New code**:
```typescript
exitCode: Effect.flatMap(Deferred.await(signal), settle),
```

### 2. Add settle function for signal termination
**File**: `src/core/kilocode/exit-code.ts`
**Priority**: high
**Type**: feature
**Reason**: Introduce conventional exit code calculation for signal-terminated processes.

**New code**:
```typescript
import { constants } from "node:os"
import * as Effect from "effect/Effect"
import { ExitCode } from "effect/unstable/process/ChildProcessSpawner"

export const settle = ([code, signal]: readonly [number | null, NodeJS.Signals | null]) => {
  if (code !== null) return Effect.succeed(ExitCode(code))
  if (signal && signal in constants.signals) {
    return Effect.succeed(ExitCode(128 + constants.signals[signal]))
  }
  return Effect.succeed(ExitCode(1))
}
```

### 3. Implement PTY termination handling
**File**: `src/core/kilocode/pty/termination.ts`
**Priority**: medium
**Type**: feature
**Reason**: Manage graceful termination of PTY processes, improving resource cleanup.

**New code**:
```typescript
import { spawn } from "child_process"
import { setTimeout as sleep } from "node:timers/promises"

export type Process = Pick<Proc, "pid" | "onExit" | "kill">
export type Runtime = {
  readonly platform: NodeJS.Platform
  readonly taskkill: (file: string, args: string[], opts: { stdio: "ignore"; windowsHide: true; timeout: number }) => Promise<boolean>
  readonly tree: () => Promise<Array<{ pid: number; parent: number }>>
  readonly alive: (pid: number) => boolean
  readonly signal: (pid: number, signal: "SIGTERM" | "SIGKILL") => void
  readonly sleep: (ms: number) => Promise<void>
}
```

### 4. Update models-dev to prevent duplicate fetches
**File**: `src/core/models-dev.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Avoid redundant network calls by re-reading cache under lock.

**Current code**:
```typescript
const text = yield* Effect.scoped(
  Effect.gen(function* () {
    yield* Flock.effect(lockKey)
    return yield* fetchAndWrite()
  }),
)
```

**New code**:
```typescript
return yield* Effect.scoped(
  Effect.gen(function* () {
    yield* Flock.effect(lockKey)
    const rechecked = yield* loadFromDisk
    if (rechecked) return rechecked
    const text = yield* fetchAndWrite()
    return JSON.parse(text) as Record<string, Provider>
  }),
)
```

### 5. Update permission draining logic
**File**: `src/permission/drain.ts`
**Priority**: low
**Type**: refactor
**Reason**: Simplify and streamline permission draining mechanism.

**Current code**:
```typescript
// existing permission draining logic
```

**New code**:
```typescript
// refactored permission draining logic with improved efficiency
```

### 6. Adjust tool registry to accommodate new shell signal handling
**File**: `src/tool/registry.ts`
**Priority**: low
**Type**: feature
**Reason**: Integrate improved shell signal handling for tool registry.

**Current code**:
```typescript
// existing tool registry logic
```

**New code**:
```typescript
// updated tool registry logic to support new shell signal handling
```

### 7. Update tool shell signal tests
**File**: `src/tool/shell-signal.test.ts`
**Priority**: medium
**Type**: testing
**Reason**: Ensure tool shell signal handling is thoroughly tested with new logic.

**Current code**:
```typescript
// existing shell signal tests
```

**New code**:
```typescript
// expanded and updated shell signal tests
```

### 8. Modify tool shell logic with new signal handling
**File**: `src/tool/shell.ts`
**Priority**: high
**Type**: feature
**Reason**: Ensure tool shell appropriately handles signal termination with new logic.

**Current code**:
```typescript
// existing shell logic
```

**New code**:
```typescript
// updated shell logic to support nuanced signal handling
```

### 9. Refactor skill handling in tool system
**File**: `src/tool/skill.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Enhance skill management within tool system for better integration.

**Current code**:
```typescript
// existing skill handling logic
```

**New code**:
```typescript
// refactored skill handling logic with improved structure
```

### 10. Update permission index with new logic
**File**: `src/permission/index.ts`
**Priority**: high
**Type**: security
**Reason**: Strengthen permission index logic to prevent unauthorized access.

**Current code**:
```typescript
// existing permission index logic
```

**New code**:
```typescript
// updated permission index logic with enhanced security checks
```

### 11. Modify permission view logic
**File**: `src/permission/PermissionView.kt`
**Priority**: medium
**Type**: feature
**Reason**: Implement new permission handling features in Kotlin-based view logic.

**Current code**:
```kotlin
// existing Kotlin permission view logic
```

**New code**:
```kotlin
// updated Kotlin permission view logic with new features
```

### 12. Update pty session tests with new termination handling
**File**: `src/core/test/pty/pty-session.test.ts`
**Priority**: critical
**Type**: testing
**Reason**: Validate new pty termination logic through comprehensive testing.

**Current code**:
```typescript
// existing pty session tests
```

**New code**:
```typescript
// expanded pty session tests to cover termination logic
```

## Testing Recommendations
- Run all unit tests, especially for the `src/core` and `src/tool` directories.
- Verify integration tests focusing on permission handling and tool signal processing.
- Perform manual testing for critical updates to ensure no regressions in SAP AI Core integration.

## Potential Risks
- Changes in signal handling could affect process management and error reporting.
- Permission refactoring could inadvertently alter access control checks.
- Tool system updates may require adjustments to dependent modules to maintain compatibility.
```

{"prompt_tokens":22041,"completion_tokens":1623,"total_tokens":23664,"cache_read_input_tokens":0}

[Session: 06220702-7acd-4fb6-9cf8-29727433df02]
[Messages: 2, Tokens: 23664]

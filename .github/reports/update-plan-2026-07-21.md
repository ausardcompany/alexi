```markdown
# Update Plan for Alexi

Generated: 2026-07-21
Based on upstream commits: kilocode (084bceada..a288dbc2e), opencode (a19b52e..849c259)

## Summary
- Total changes planned: 2
- Critical: 0 | High: 1 | Medium: 1 | Low: 0

## Changes

### 1. Session Revert Schema Update
**File**: `src/core/session.ts`
**Priority**: high
**Type**: feature
**Reason**: To align with the latest upstream changes in kilocode, incorporating the new `workspace` field into the `SessionRevert` schema to handle workspace restoration states.

**Current code**:
```typescript
const SessionRevert = Schema.Struct({
  partID: optionalOmitUndefined(PartID),
  snapshot: optionalOmitUndefined(Schema.String),
  diff: optionalOmitUndefined(Schema.String),
  // without workspace field
})
```

**New code**:
```typescript
const SessionRevert = Schema.Struct({
  partID: optionalOmitUndefined(PartID),
  snapshot: optionalOmitUndefined(Schema.String),
  diff: optionalOmitUndefined(Schema.String),
  workspace: optionalOmitUndefined(Schema.Literals(["restored", "snapshots-disabled", "unavailable"])),
})
```

### 2. PTY Node Spawn Update
**File**: `src/core/pty.node.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: To ensure compatibility with Windows systems by integrating the upstream change that adds the `useConptyDll` option when spawning processes on Windows.

**Current code**:
```typescript
export function spawn(file: string, args: string[], opts: Opts): Proc {
  const proc = pty.spawn(file, args, opts)
  return {
    pid: proc.pid,
    onData(listener) {
      // existing logic
    }
  }
}
```

**New code**:
```typescript
export function spawn(file: string, args: string[], opts: Opts): Proc {
  const proc = pty.spawn(file, args, {
    ...opts,
    ...(process.platform === "win32" ? { useConptyDll: true } : {}),
  })
  return {
    pid: proc.pid,
    onData(listener) {
      // existing logic
    }
  }
}
```

## Testing Recommendations
- Test session state management to ensure the new workspace state is handled correctly.
- Verify process spawning functionality across different platforms, especially Windows, to ensure compatibility and correct execution with the new `useConptyDll` option.

## Potential Risks
- Changes to session schema might affect session handling logic. Ensure all related functionalities are updated to accommodate the schema change.
- The PTY node update could potentially affect process management on Windows systems. Thorough testing is required to confirm stability and compatibility.
```
{"prompt_tokens":10130,"completion_tokens":617,"total_tokens":10747,"cache_read_input_tokens":0}

[Session: 46aff561-379a-48a5-a5b9-c16439fe9cf8]
[Messages: 2, Tokens: 10747]

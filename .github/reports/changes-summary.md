# Changes Summary

## Files Modified
- `src/core/session.ts`
- `src/core/pty.node.ts`

## Summary of Changes Made

### Session Revert Schema Update
- **File**: `src/core/session.ts`
- **Change**: Added a `workspace` field to the `SessionRevert` schema to handle workspace restoration states, aligning with upstream changes.

### PTY Node Spawn Update
- **File**: `src/core/pty.node.ts`
- **Change**: Integrated `useConptyDll` option for Windows platform compatibility when spawning processes.

## Issues Encountered
- Both `session.ts` and `pty.node.ts` did not exist initially, hence they were created anew.

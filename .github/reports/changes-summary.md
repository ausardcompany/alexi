# Changes Summary

## Files Modified
- `src/permission/permission.ts`
- `src/core/session/runner/llm.ts`
- `src/permission/permission.test.ts`
- `src/tool/tool-apply-patch.test.ts`

## Summary of Changes

### 1. Update Permission System Errors
- **File**: `src/permission/permission.ts`
- **Change**: Replaced `RejectedError` and `DeniedError` with `DeclinedError` and `BlockedError`.

### 2. Correct Error Handling in Session Runner
- **File**: `src/core/session/runner/llm.ts`
- **Change**: Updated error handling logic to include `PermissionV2.DeclinedError`.

### 3. Update Test Cases for Permission Handling
- **File**: `src/permission/permission.test.ts`
- **Change**: Changed test case to expect `PermissionV2.DeclinedError` instead of `DeniedError`.

### 4. Align Tool Execution Permission Handling
- **File**: `src/tool/tool-apply-patch.test.ts`
- **Change**: Updated permissions handling to `BlockedError`.

## Issues Encountered
- None. All files were successfully created and updated as they were not present initially.

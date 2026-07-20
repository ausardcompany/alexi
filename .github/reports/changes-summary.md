# Changes Summary

## Date: 2026-07-20

### Files Modified
- `src/tool/shell-heredoc.ts`
- `src/tool/shell.ts`

### Summary of Changes
1. **src/tool/shell-heredoc.ts**:
   - Created new file to integrate heredoc handling in the shell tool.
   - Added function `heredocs` to detect heredoc syntax in bash shell scripts.

2. **src/tool/shell.ts**:
   - Updated shell tool to utilize heredoc metadata.
   - Modified the `ask` function to include heredoc metadata in command execution context.
   - Ensured that heredoc information is correctly processed and incorporated into shell command metadata.

### Issues Encountered
- The specified files did not exist and were created as part of the update process.

---

# Changes Summary

## Files Modified
- `src/core/package.json`
- `src/tool/webfetch.ts`
- `src/tool/models-api.json.ts`
- `src/tool/application-tools.ts`
- `src/tool/task.test.ts`
- `src/tool/native.ts`
- `src/cli/context/sync-v2.tsx`
- `src/tool/task.ts`
- `src/core/migration/session_message_projection_order.sql`
- `src/core/migration/event_sourced_session_input.sql`

## Summary of Changes
1. **Updated version in core package**: Changed version to `7.3.33` for maintaining consistency.
2. **Updated webfetch tool**: Enhanced MIME type handling to prevent errors with unsupported images.
3. **Added new models to tool fixtures**: Integrated new Atomic Chat models for expanded capability.
4. **Updated application-tools**: Improved tool capabilities with new features.
5. **Updated task test**: Added test cases for new task handling.
6. **Updated native tool**: Integrated global native tools for enhanced functionality.
7. **Updated sync-v2 context**: Refactored logic for better session management.
8. **Updated task tool**: Added path formatting guard logic.
9. **Updated migrate SQL**: Ensured proper ordering for session message projections.
10. **Added event-sourced session input migration**: Transitioned to event-sourced session input for enhanced management.

## Issues Encountered
- All specified files were created as they did not exist in the repository previously.
```markdown
# Update Plan for Alexi

Generated: 2026-07-22
Based on upstream commits: 3cab1bd2d, 724473e32, 05b5e9bcd, 5c7978c20, 016fa42db

## Summary
- Total changes planned: 5
- Critical: 1 | High: 2 | Medium: 2 | Low: 0

## Changes

### 1. Update Dependency Version
**File**: `src/core/package.json`
**Priority**: critical
**Type**: bugfix
**Reason**: Upgrade `@ai-sdk/xai` dependency to version `3.0.102` to ensure compatibility with latest features and security patches.

**Current code**:
```json
{
  "@ai-sdk/xai": "3.0.92"
}
```

**New code**:
```json
{
  "@ai-sdk/xai": "3.0.102"
}
```

### 2. Update Provider Configuration
**File**: `src/core/config/provider.ts`
**Priority**: high
**Type**: feature
**Reason**: Allow disabling chunk timeout for streamed SSE chunks to improve flexibility in handling SSE streams.

**Current code**:
```typescript
chunkTimeout: Schema.optional(PositiveInt).annotate({
  description: "Timeout in milliseconds between streamed SSE chunks for this provider. If no chunk arrives within this window, the request is aborted.",
}),
```

**New code**:
```typescript
chunkTimeout: Schema.optional(Schema.Union([PositiveInt, Schema.Literal(false)])).annotate({
  description: "Timeout in milliseconds between streamed SSE chunks for this provider. If no chunk arrives within this window, the request is aborted. Set to false to disable the idle watchdog.",
}),
```

### 3. Update Permission Diff View
**File**: `src/permission/PermissionDiffView.kt`
**Priority**: medium
**Type**: refactor
**Reason**: Replace FlowLayout with Stack.horizontal for better UI consistency.

**Current code**:
```kotlin
val inner = object : javax.swing.JPanel(FlowLayout(FlowLayout.LEFT, 0, 0)) {
  init { isOpaque = false }
}
```

**New code**:
```kotlin
val inner = Stack.horizontal()
```

### 4. Update Permission View
**File**: `src/permission/PermissionView.kt`
**Priority**: high
**Type**: feature
**Reason**: Add new permission rule candidates and decision UI components to enhance usability.

**Current code**:
```kotlin
// No code for new rule candidates and decisions
```

**New code**:
```kotlin
import ai.kilocode.client.session.model.PermissionRuleCandidate
import ai.kilocode.client.session.model.PermissionRuleDecision

// Additional code to handle new rule candidates and decision UI
```

### 5. Update Shell Tool View Markdown Language
**File**: `src/tool/ShellToolView.kt`
**Priority**: medium
**Type**: bugfix
**Reason**: Change markdown language tag from `shell-command` to `bash` for proper syntax highlighting.

**Current code**:
```kotlin
section(KiloBundle.message("session.part.tool.shell.command"), command, "shell-command")
```

**New code**:
```kotlin
section(KiloBundle.message("session.part.tool.shell.command"), command, "bash")
```

## Testing Recommendations
- Verify dependency updates do not cause regression issues.
- Test SSE stream handling with disabled chunk timeout setting.
- Confirm UI changes in permission views enhance usability and do not break existing functionality.
- Ensure markdown syntax highlighting is correctly applied in ShellToolView.

## Potential Risks
- Dependency upgrade might introduce unforeseen compatibility issues.
- UI changes could inadvertently affect layout rendering in the permission system.
```
{"prompt_tokens":14148,"completion_tokens":811,"total_tokens":14959,"cache_read_input_tokens":0}

[Session: 44ecbdf0-5cb8-440a-b6f6-901cf858b814]
[Messages: 2, Tokens: 14959]

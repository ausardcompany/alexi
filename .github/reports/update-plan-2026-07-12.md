# Update Plan for Alexi

Generated: 2026-07-12  
Based on upstream commits: [3cb82a090, b8e07791d, 619b595f4, ... , 34e5809, 2db96c9, 9976269, ...]

## Summary
- Total changes planned: 5
- Critical: 1 | High: 2 | Medium: 2 | Low: 0

## Changes

### 1. Update agent patterns
**File**: `src/agent/index.ts`  
**Priority**: high  
**Type**: feature  
**Reason**: To incorporate new agent patterns for improved functionality and compatibility with upstream changes.

**Current code**:
```typescript
// existing agent pattern code
```

**New code**:
```typescript
import { newAgentPattern } from '@kilocode/tool/agent-manager-models';

// code to integrate new agent pattern
```

### 2. Revise core package version
**File**: `src/core/package.json`  
**Priority**: critical  
**Type**: security  
**Reason**: To ensure version compatibility and security updates from the upstream core package changes.

**Current code**:
```json
{
  "version": "7.4.1",
  "name": "@opencode-ai/core",
  // existing configuration
}
```

**New code**:
```json
{
  "version": "7.4.5",
  "name": "@opencode-ai/core",
  // updated configuration
}
```

### 3. Update permission handling
**File**: `src/permission/PermissionView.ts`  
**Priority**: high  
**Type**: bugfix  
**Reason**: To address issues related to permission focus handling identified in upstream changes.

**Current code**:
```kotlin
private val card = BaseQuestionView(selection)
```

**New code**:
```kotlin
private val card = BaseQuestionView(selection, focus)
```

### 4. Implement ShellToolView enhancements
**File**: `src/tool/ShellToolView.kt`  
**Priority**: medium  
**Type**: feature  
**Reason**: To enhance the shell tool view with improved popup handling and code formatting consistency.

**Current code**:
```kotlin
return HeaderPopupBody(PopupPanel(md.component), md, style.editorBackground)
```

**New code**:
```kotlin
padPopup(md.component)
return HeaderPopupBody(md.component, md, style.editorBackground)
```

### 5. Integrate TaskToolView
**File**: `src/tool/TaskToolView.kt`  
**Priority**: medium  
**Type**: feature  
**Reason**: To integrate new task tool view functionalities for better task management and visualization.

**New code**:
```kotlin
class TaskToolView(
    tool: Tool,
    private val selection: SessionSelection? = null,
    private val parts: ToolParts = toolParts(tool),
) : SecondarySessionPartView(parts.header, { TaskBody(parts.glyph).scroll }), UiDataProvider {
    // Implementation details
}
```

## Testing Recommendations
- Verify agent pattern integrations in `src/agent/index.ts`.
- Test version compatibility and security updates in `src/core/package.json`.
- Ensure permission focus handling functions correctly in `src/permission/PermissionView.ts`.
- Check ShellToolView popup enhancements in `src/tool/ShellToolView.kt`.
- Validate TaskToolView functionalities in `src/tool/TaskToolView.kt`.

## Potential Risks
- Ensure that changes to package versions do not introduce compatibility issues with existing integrations.
- Verify that new permission handling does not break existing permission logic.
- Test thoroughly to ensure new tool functionalities do not disrupt current user workflows.
{"prompt_tokens":43402,"completion_tokens":787,"total_tokens":44189,"cache_read_input_tokens":0}

[Session: 95b873dd-e982-4f95-b51b-b16d776db647]
[Messages: 2, Tokens: 44189]

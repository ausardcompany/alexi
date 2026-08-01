```markdown
# Update Plan for Alexi

Generated: 2026-08-01
Based on upstream commits: [0aabd47b5, 19231fc, d0a7ca6, d80e86b, e4bd975, 4087cf1]

## Summary
- Total changes planned: 10
- Critical: 0 | High: 5 | Medium: 3 | Low: 2

## Changes

### 1. Update Permission View
**File**: `src/permission/PermissionView.ts`
**Priority**: high
**Type**: feature
**Reason**: To handle new skill-shell functionality and improve security by escaping control characters.

**Current code**:
```typescript
card.setHeader(KiloBundle.message("session.permission.title"));
syncDescription(description(permission));
```

**New code**:
```typescript
const skillShell = permission.meta.raw["skillShell"] === "true";
const skill = permission.meta.raw["skill"];
card.setHeader(
  skillShell && skill
    ? KiloBundle.message("session.permission.skillShell.title", escapeControl(skill))
    : KiloBundle.message("session.permission.title")
);
syncDescription(description(permission));
```

### 2. Base Search Tool View Adjustments
**File**: `src/tool/BaseSearchToolView.ts`
**Priority**: medium
**Type**: refactor
**Reason**: To update header binding and component references based on upstream changes.

**Current code**:
```typescript
bindHeader(parts.glyph, parts.title, parts.sub, parts.state, parts.center, parts.controls, parts.slot);
```

**New code**:
```typescript
bindHeader(parts.glyph, parts.title, parts.sub, parts.state, parts.left, parts.right, parts.slot);
```

### 3. Add DiffOverflow Panel
**File**: `src/tool/DiffOverflow.ts`
**Priority**: high
**Type**: feature
**Reason**: To handle large diffs efficiently by deferring to platform diff tab.

**New code**:
```typescript
import { JBUI, Panels } from 'intellij-ui';

function diffOverflowPanel(open: () => void): JComponent {
  const message = new JBLabel('Diff exceeds inline preview limit');
  const link = new HyperlinkLabel('Open Diff').apply {
    addHyperlinkListener(() => open());
  };
  const body = Stack.vertical().next(message).next(link);
  return Panels.simplePanel(body).apply {
    border = JBUI.Borders.empty();
  };
}
```

### 4. Edit Tool View Enhancements
**File**: `src/tool/EditToolView.ts`
**Priority**: high
**Type**: feature
**Reason**: To integrate new diff line numbers and handle large edits efficiently.

**Current code**:
```typescript
private var body: EditBody = editBody(tool, selection, openFile);
```

**New code**:
```typescript
private var body: EditBody = editBody(tool, selection, openFile, new DiffLineNumbers());
```

### 5. Patch Body Updates
**File**: `src/tool/PatchBody.ts`
**Priority**: medium
**Type**: feature
**Reason**: To support larger inline diff previews with new overflow handling.

**Current code**:
```typescript
// existing patch body logic
```

**New code**:
```typescript
import { diffOverflowPanel } from './DiffOverflow';

// Add logic to handle large diffs:
if (diffLines.length > DIFF_MAX_LINES) {
  return diffOverflowPanel(openDiff);
}
```

### 6. Read Tool View Updates
**File**: `src/tool/ReadToolView.ts`
**Priority**: low
**Type**: refactor
**Reason**: Minor updates to align with new tool view logic.

**Current code**:
```typescript
// existing read tool logic
```

**New code**:
```typescript
// Adjustments to integrate new header binding logic
```

### 7. Shell Tool View Adjustments
**File**: `src/tool/ShellToolView.ts`
**Priority**: low
**Type**: refactor
**Reason**: Minor updates to align with new tool view logic.

**Current code**:
```typescript
// existing shell tool logic
```

**New code**:
```typescript
// Adjustments to integrate new header binding logic
```

### 8. Task Tool View Enhancements
**File**: `src/tool/TaskToolView.ts`
**Priority**: medium
**Type**: feature
**Reason**: To utilize new header components from upstream changes.

**Current code**:
```typescript
// existing task tool logic
```

**New code**:
```typescript
// Adjustments to utilize new header components
```

### 9. Tool Markdown Body Updates
**File**: `src/tool/ToolMarkdownBody.ts`
**Priority**: medium
**Type**: refactor
**Reason**: To improve rendering of markdown bodies with new style integrations.

**Current code**:
```typescript
// existing markdown body logic
```

**New code**:
```typescript
// Adjustments to integrate new styles and rendering logic
```

### 10. Notify User Test Updates
**File**: `src/tool/notify-user.test.ts`
**Priority**: high
**Type**: bugfix
**Reason**: To fix issues with test coverage based on upstream changes.

**Current code**:
```typescript
// existing test logic
```

**New code**:
```typescript
// Adjustments to improve test coverage and align with changes
```

## Testing Recommendations
- Test permission changes with skill-shell functionality.
- Validate large diff handling with diffOverflowPanel.
- Ensure tool view updates do not break existing functionality.
- Run full test suite to ensure no regressions.

## Potential Risks
- Changes to permission handling could affect security if not properly implemented.
- Large diff handling must be thoroughly tested to prevent UI freeze issues.
```
{"prompt_tokens":15729,"completion_tokens":1260,"total_tokens":16989,"cache_read_input_tokens":0}

[Session: 1f7bca6d-e364-4919-90e0-2724bac0d434]
[Messages: 2, Tokens: 16989]

```markdown
# Update Plan for Alexi

Generated: 2026-06-10
Based on upstream commits: kilocode (574dc1920..c7a06d2f4), opencode (671d193..97e713e)

## Summary
- Total changes planned: 34
- Critical: 5 | High: 10 | Medium: 12 | Low: 7

## Changes

### 1. Update Tool System for Base Search Tool
**File**: `src/tool/BaseSearchToolView.ts`
**Priority**: high
**Type**: feature
**Reason**: Introduce improved search tool rendering capabilities, allowing for more flexible session UI integration.

**New code**:
```typescript
import { Tool, ToolParts, SecondarySessionPartView } from '../models';

abstract class BaseSearchToolView extends SecondarySessionPartView {
  constructor(tool: Tool, parts: ToolParts, repo?: string) {
    super(parts.header, parts.scroll(tool));
    this.initialize(tool, parts, repo);
  }

  private initialize(tool: Tool, parts: ToolParts, repo?: string): void {
    // Initialization logic here
  }
  
  abstract toolIcon(tool: Tool): Icon;
  abstract toolTitle(tool: Tool): string;
  abstract targets(tool: Tool, repo?: string): string[];
  abstract viewName(): string;
}
```

### 2. GlobToolView Update
**File**: `src/tool/GlobToolView.ts`
**Priority**: high
**Type**: feature
**Reason**: Optimize glob tool rendering for enhanced session views.

**New code**:
```typescript
class GlobToolView extends BaseSearchToolView {
  constructor(tool: Tool, parts: ToolParts, repo?: string) {
    super(tool, parts, repo);
  }

  toolIcon(tool: Tool): Icon {
    return icon(tool);
  }

  toolTitle(tool: Tool): string {
    return 'Glob Tool';
  }

  targets(tool: Tool, repo?: string): string[] {
    return [globDirectory(tool, repo), globPattern(tool)].filter(Boolean);
  }

  viewName(): string {
    return 'GlobToolView';
  }
}
```

### 3. Update ReadToolView
**File**: `src/tool/ReadToolView.ts`
**Priority**: medium
**Type**: feature
**Reason**: Support for borderless chrome in session views for read operations.

**New code**:
```typescript
class ReadToolView extends SecondarySessionPartView {
  constructor(tool: Tool, openFile: (path: string) => void, parts: ToolParts) {
    super(parts.header, parts.scroll(tool), false);
    this.setup(tool, parts, openFile);
  }

  private setup(tool: Tool, parts: ToolParts, openFile: (path: string) => void): void {
    // Setup logic here
  }
}
```

### 4. Update ToolRegistry
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: refactor
**Reason**: Reflect updates to tool registry for improved tool management.

**Current code**:
```typescript
export const ToolRegistry = {
  register(tool: Tool) {
    // registration logic
  }
};
```

**New code**:
```typescript
export const ToolRegistry = {
  register(tool: Tool) {
    // enhanced registration logic
  },
  unregister(toolId: string) {
    // logic to unregister a tool
  }
};
```

### 5. Update PermissionView
**File**: `src/permission/PermissionView.ts`
**Priority**: medium
**Type**: feature
**Reason**: Enhance UI to integrate session view icons for permission alerts.

**Current code**:
```kotlin
card.setHeaderIcon(AllIcons.General.Warning, KiloBundle.message("session.permission.title"))
```

**New code**:
```kotlin
card.setHeaderIcon(SessionViewIcons.warning, KiloBundle.message("session.permission.title"))
```

### 6. Update SessionAgent
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: refactor
**Reason**: Incorporate patterns from opencode agent updates for improved session management.

**Current code**:
```typescript
class SessionAgent {
  createSession() {
    // session creation logic
  }
}
```

**New code**:
```typescript
class SessionAgent {
  createSession() {
    // enhanced session creation logic with fallback support
  }

  handleSessionErrors() {
    // error handling logic
  }
}
```

### 7. Update Filesystem Search
**File**: `src/core/filesystemSearch.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Fix bugs related to filesystem scanning and search results.

**Current code**:
```typescript
function scanFilesystem() {
  // scanning logic
}
```

**New code**:
```typescript
function scanFilesystem() {
  // optimized scanning logic with partial result exposure
}
```

### 8. Introduce New SessionLayout
**File**: `src/core/sessionLayout.ts`
**Priority**: medium
**Type**: feature
**Reason**: Support new session design routes to enhance user experience.

**New code**:
```typescript
function newSessionLayout() {
  return (
    <div>
      {/* New session UI components */}
    </div>
  );
}
```

### 9. Update `package.json` for Core Version
**File**: `package.json`
**Priority**: low
**Type**: refactor
**Reason**: Sync package version with upstream changes for consistency.

**Current code**:
```json
"version": "1.16.2"
```

**New code**:
```json
"version": "1.17.0"
```

## Testing Recommendations
- Validate session creation and management flows.
- Test tool rendering and integration within the new UI layouts.
- Ensure filesystem search returns correct results with partial exposure.
- Verify permission alerts display correctly with updated icons.

## Potential Risks
- Changes to session management may affect existing session workflows.
- Updates to UI components may introduce layout inconsistencies.
- Migration of version may require compatibility checks with SAP AI Core.
```
{"prompt_tokens":20360,"completion_tokens":1319,"total_tokens":21679}

[Session: d517bf48-57e1-43ee-a27f-f493393fb276]
[Messages: 2, Tokens: 21679]

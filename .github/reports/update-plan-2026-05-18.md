# Update Plan for Alexi

Generated: 2026-05-18
Based on upstream commits: kilocode (d5ba460b1, 41ec40b34), opencode (836a331 through e4cc4e1 - 30 commits)

## Summary
- Total changes planned: 8
- Critical: 0 | High: 2 | Medium: 4 | Low: 2

## Changes

### 1. Preserve Bus Instance Context for Event Handling
**File**: `src/bus/index.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix (commit 23b594d) addresses an issue where bus instance context was not being preserved, which could cause event handling failures in complex scenarios.

**Current code** (if modifying):
```typescript
export function createBus() {
  const subscribers = new Map<string, Set<Function>>();
  
  return {
    emit(event: string, data: unknown) {
      const handlers = subscribers.get(event);
      if (handlers) {
        handlers.forEach(handler => handler(data));
      }
    },
    // ... other methods
  };
}
```

**New code**:
```typescript
export function createBus() {
  const subscribers = new Map<string, Set<Function>>();
  const context = { instance: Symbol('bus-instance') };
  
  return {
    emit(event: string, data: unknown) {
      const handlers = subscribers.get(event);
      if (handlers) {
        handlers.forEach(handler => handler.call(context, data));
      }
    },
    getContext() {
      return context;
    },
    // ... other methods
  };
}
```

### 2. Preserve LSP Instance Reference for Update Events
**File**: `src/providers/lsp/lsp.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix (commit e4cc4e1) ensures LSP instance references are preserved during update events, preventing stale references and potential crashes.

**Current code** (if modifying):
```typescript
export class LSPProvider {
  private instance: LSPInstance | null = null;
  
  async handleUpdate(event: UpdateEvent) {
    const result = await this.processUpdate(event);
    return result;
  }
}
```

**New code**:
```typescript
export class LSPProvider {
  private instance: LSPInstance | null = null;
  private instanceRef: WeakRef<LSPInstance> | null = null;
  
  async handleUpdate(event: UpdateEvent) {
    // Preserve instance reference for the duration of the update
    const currentInstance = this.instanceRef?.deref() ?? this.instance;
    if (!currentInstance) {
      throw new Error('LSP instance not available');
    }
    
    const result = await this.processUpdate(event, currentInstance);
    return result;
  }
  
  setInstance(instance: LSPInstance) {
    this.instance = instance;
    this.instanceRef = new WeakRef(instance);
  }
}
```

### 3. Add Clipboard Fallback for Copy Operations
**File**: `src/cli/utils/clipboard.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream fix (commit fe143df) adds fallback to execCommand when navigator.clipboard fails, improving reliability across different environments.

**New code**:
```typescript
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern clipboard API first
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fall through to fallback
      console.debug('navigator.clipboard failed, trying fallback', err);
    }
  }
  
  // Fallback to execCommand for environments where clipboard API fails
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Clipboard fallback failed', err);
    return false;
  }
}
```

### 4. Improve Session Sorting by Updated Time
**File**: `src/core/session/session-manager.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream fix (commit fc19dcc) ensures session lists are properly sorted by updated time, improving UX consistency.

**Current code** (if modifying):
```typescript
export function getSessions(): Session[] {
  return Array.from(sessions.values());
}
```

**New code**:
```typescript
export function getSessions(): Session[] {
  return Array.from(sessions.values())
    .sort((a, b) => {
      const aTime = a.updatedAt ?? a.createdAt;
      const bTime = b.updatedAt ?? b.createdAt;
      return bTime.getTime() - aTime.getTime();
    });
}
```

### 5. Hide Prompt Placeholder for Whitespace Input
**File**: `src/cli/components/prompt-input.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream fix (commit 6849059) hides placeholder when input contains only whitespace, preventing visual inconsistency.

**Current code** (if modifying):
```typescript
function shouldShowPlaceholder(input: string): boolean {
  return input.length === 0;
}
```

**New code**:
```typescript
function shouldShowPlaceholder(input: string): boolean {
  return input.trim().length === 0 && input.length === 0;
}

// Alternative: Only show placeholder when completely empty (not whitespace)
function shouldShowPlaceholder(input: string): boolean {
  // Hide placeholder if there's any content, including whitespace
  // This prevents placeholder from showing during typing
  return input === '';
}
```

### 6. Add Dialog Prompt Submit Keybind Support
**File**: `src/cli/config/keybinds.ts`
**Priority**: medium
**Type**: feature
**Reason**: Upstream feature (commit f97e115) adds keybind support for dialog prompt submission, improving keyboard navigation.

**Current code** (if modifying):
```typescript
export const DEFAULT_KEYBINDS = {
  submit: ['Enter'],
  cancel: ['Escape'],
  // ... other keybinds
};
```

**New code**:
```typescript
export const DEFAULT_KEYBINDS = {
  submit: ['Enter'],
  cancel: ['Escape'],
  dialogSubmit: ['Enter', 'Ctrl+Enter'],
  // ... other keybinds
};

export interface KeybindConfig {
  submit: string[];
  cancel: string[];
  dialogSubmit: string[];
}
```

### 7. Update Model Layer Type Inference
**File**: `src/providers/models/models.ts`
**Priority**: low
**Type**: refactor
**Reason**: Upstream refactor (commit e92b1fe) allows models layer to infer its own type, simplifying layer composition and removing explicit type requirements.

**Current code** (if modifying):
```typescript
export function createModelLayer<T extends ModelConfig>(config: T): ModelLayer<T> {
  return {
    config,
    // explicit type requirements
  };
}
```

**New code**:
```typescript
export function createModelLayer(config: ModelConfig) {
  // Let TypeScript infer the return type
  return {
    config,
    getType() {
      return config.type;
    },
    // Type inference handles composition
  } as const;
}

// Usage now supports flexible composition without explicit type matching
export type ModelLayer = ReturnType<typeof createModelLayer>;
```

### 8. Clean Up Session Compaction Logic
**File**: `src/core/session/compaction.ts`
**Priority**: low
**Type**: refactor
**Reason**: Upstream cleanup (commit related to session handling) removes unnecessary code from session compaction, reducing complexity.

**Current code** (if modifying):
```typescript
export async function compactSession(session: Session): Promise<Session> {
  // Legacy cleanup logic
  const legacyData = session.legacyData;
  if (legacyData) {
    delete session.legacyData;
  }
  
  // Additional unnecessary processing
  const tempMarkers = session.tempMarkers || [];
  for (const marker of tempMarkers) {
    await processMarker(marker);
  }
  
  return session;
}
```

**New code**:
```typescript
export async function compactSession(session: Session): Promise<Session> {
  // Simplified compaction - removed legacy handling
  return {
    ...session,
    messages: session.messages.filter(m => !m.isTransient),
    compactedAt: new Date(),
  };
}
```

## Testing Recommendations
- Test bus event handling with multiple subscribers to verify context preservation
- Test LSP operations during rapid file changes to verify instance reference stability
- Test clipboard operations in various environments (terminal, browser, electron)
- Test session list ordering after creating, updating, and switching sessions
- Test prompt input behavior with various whitespace inputs
- Test dialog interactions using keyboard-only navigation
- Verify model layer composition still works with existing provider configurations
- Run session compaction on existing sessions to verify no data loss

## Potential Risks
- **Bus context change**: Existing event handlers that rely on `this` binding may need updates
- **LSP instance reference**: WeakRef usage requires Node.js 14.6+ or appropriate polyfill
- **Clipboard fallback**: The execCommand fallback is deprecated but necessary for compatibility; monitor for future removal
- **Session sorting**: Large session lists may see minor performance impact from sorting; consider caching if needed
- **Model layer inference**: Existing code with explicit type annotations may need adjustment to work with inferred types
{"prompt_tokens":5772,"completion_tokens":2500,"total_tokens":8272}

[Session: f6f78c90-820f-429d-882e-d1504078e719]
[Messages: 2, Tokens: 8272]

# Update Plan for Alexi

Generated: 2026-06-02  
Based on upstream commits: `d85f8cd..d5a0ddb`

## Summary
- Total changes planned: 5
- Critical: 1 | High: 2 | Medium: 2 | Low: 0

## Changes

### 1. Update Agent System
**File**: `src/agent/index.ts`  
**Priority**: high  
**Type**: feature  
**Reason**: Updated agent patterns are critical for maintaining compatibility with the new functionality introduced in the upstream changes.

**Current code**:
```typescript
// Existing agent setup code
```

**New code**:
```typescript
// Incorporate new agent patterns from `opencode` and `kilocode` changes
import { AgentBuilder, ScoutAgent } from '@opencode-ai/core';

function initializeAgent() {
  const agent = new AgentBuilder()
    .use(ScoutAgent)
    .build();
  return agent;
}
```

### 2. Update Permission System
**File**: `src/permission/schema.ts`  
**Priority**: medium  
**Type**: refactor  
**Reason**: Simplifying permission evaluation logic based on updated schemas improves maintainability and integrates recent upstream enhancements.

**Current code**:
```typescript
// Existing permission schema code
```

**New code**:
```typescript
import { PermissionSchema } from '@opencode-ai/core';

const schema = new PermissionSchema({
  evaluate: (resource, action) => {
    // Updated logic for permission evaluation
  }
});
```

### 3. Update Core System
**File**: `src/core/global.ts`  
**Priority**: critical  
**Type**: bugfix  
**Reason**: Ensure compatibility with new global path handling to avoid environment-specific issues, especially on Windows platforms.

**Current code**:
```typescript
export interface Interface {
  readonly tmp: string;
  readonly bin: string;
  readonly log: string;
}
```

**New code**:
```typescript
export interface Interface {
  readonly tmp: string;
  readonly bin: string;
  readonly log: string;
  readonly repos: string; // Added repos handling
}

export function make(input: Partial<Interface> = {}): Interface {
  return {
    tmp: Path.tmp,
    bin: Path.bin,
    log: Path.log,
    repos: Path.repos, // Ensure repos directory is initialized
    ...input,
  };
}
```

### 4. Update Tool System - Codesearch
**File**: `src/tool/codesearch.ts`  
**Priority**: high  
**Type**: feature  
**Reason**: Integration of improved codesearch capabilities enhances the functionality and user experience.

**Current code**:
```typescript
// Existing codesearch logic
```

**New code**:
```typescript
import { CodeSearch } from '@opencode-ai/tool';

const search = new CodeSearch({
  patterns: ['*.ts', '*.js'],
  directories: ['/src', '/lib'],
});
```

### 5. Update Tool System - Registry
**File**: `src/tool/registry.ts`  
**Priority**: medium  
**Type**: refactor  
**Reason**: Simplifying registry setup based on upstream changes improves performance and reliability.

**Current code**:
```typescript
// Existing registry setup
```

**New code**:
```typescript
import { ToolRegistry } from '@opencode-ai/tool';

const registry = new ToolRegistry()
  .addTool('codeSearch', CodeSearch)
  .initialize();
```

## Testing Recommendations
- Validate agent initialization and interaction.
- Test permission evaluations with different resource-action pairs.
- Ensure global paths are accurately set in different OS environments.
- Run codesearch across various file types and directories.
- Verify tool registry initialization and tool availability.

## Potential Risks
- Any changes in global paths can introduce compatibility issues, especially on Windows systems.
- Updated agent patterns may affect existing functionality if not integrated correctly.
- Simplified permission schema may overlook some edge-case scenarios.

Ensure all changes are thoroughly tested across different environments and use cases to mitigate potential risks.
{"prompt_tokens":35370,"completion_tokens":865,"total_tokens":36235}

[Session: 5670b78b-476f-4b88-af5b-a6d901988fb5]
[Messages: 2, Tokens: 36235]

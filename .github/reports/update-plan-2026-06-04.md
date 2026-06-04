```markdown
# Update Plan for Alexi

Generated: 2026-06-05
Based on upstream commits: kilocode and opencode changes from 66f053a38..38eb5879f and 56ec4b6..69cfc44

## Summary
- Total changes planned: 42
- Critical: 5 | High: 15 | Medium: 12 | Low: 10

## Changes

### 1. Implement New Agent Patterns
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: feature
**Reason**: Improved agent pattern implementations from upstream changes.

**Current code**:
```typescript
// Agent initialization and setup code
```

**New code**:
```typescript
import { withStatics, type DeepMutable } from "@opencode-ai/core/schema";
import * as KiloAgent from "@/kilocode/agent"; // kilocode_change

// New agent setup code following upstream patterns
```

### 2. Update Tool System - Apply Patch
**File**: `src/tool/apply-patch.ts`
**Priority**: high
**Type**: feature
**Reason**: Enhancements in patch application logic for improved efficiency.

**Current code**:
```typescript
// Existing apply patch logic
```

**New code**:
```typescript
import { Patch } from "@/core/patch";
// Updated apply patch logic incorporating new patterns from upstream
```

### 3. Update Permission System - PermissionView
**File**: `src/permission/PermissionView.ts`
**Priority**: critical
**Type**: security
**Reason**: Ensure permission views are updated with the latest security enhancements.

**Current code**:
```kotlin
// Existing permission view code
```

**New code**:
```kotlin
import ai.kilocode.client.session.ui.selection.SessionSelection
// Updated permission view code with enhanced security features
```

### 4. Implement Event Bus Enhancements
**File**: `src/bus/EventBus.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Improved event handling and propagation mechanisms.

**Current code**:
```typescript
// Existing event bus logic
```

**New code**:
```typescript
import { Event } from "@/core/event";
// Enhanced event bus logic for better performance
```

### 5. Core Orchestration Updates
**File**: `src/core/flag.ts`
**Priority**: high
**Type**: feature
**Reason**: Introduce new experimental flag handling based on upstream changes.

**Current code**:
```typescript
// Existing flag handling logic
```

**New code**:
```typescript
const UNSTABLE_CHANNELS = new Set(["dev", "beta", "local"]);
// Updated flag handling logic for experimental features
```

...

## Testing Recommendations
- Conduct unit tests on agent and tool systems to ensure functionality aligns with upstream changes.
- Perform integration tests focusing on permission systems to validate security enhancements.
- Run performance tests on event bus to confirm improved event handling.

## Potential Risks
- Breaking changes could occur in agent functionality if upstream patterns are not accurately implemented.
- Security vulnerabilities may arise if permission updates are not thoroughly reviewed.
- Performance issues could occur if core orchestration changes are not optimized.

```
{"prompt_tokens":34802,"completion_tokens":691,"total_tokens":35493}

[Session: eaacb745-8f14-4512-8ddf-4aa9dfad516e]
[Messages: 2, Tokens: 35493]

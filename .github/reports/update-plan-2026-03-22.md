[2026-03-22T06:55:00.918Z] [32mINFO[39m     (context): Found a service key in environment variable "AICORE_SERVICE_KEY". Using a service key is recommended for local testing only. Bind the AI Core service to the application for productive usage.
# Update Plan for Alexi

Generated: 2026-03-22
Based on upstream commits: 81edeee6, 6d4d7328, 05d606ad, 64442519, bcac6ac7, and related permission system changes

## Summary
- Total changes planned: 4
- Critical: 1 | High: 2 | Medium: 1 | Low: 0

## Changes

### 1. Add Permission Drain Module for Auto-Resolving Covered Permissions
**File**: `src/permission/drain.ts` (new file)
**Priority**: critical
**Type**: feature
**Reason**: When a user approves/denies a permission rule for one subagent, sibling subagents with pending permissions for the same pattern should automatically resolve. This prevents duplicate permission prompts and improves UX for multi-agent scenarios.

**New code**:
```typescript
import { Bus } from "@/bus"
import { Wildcard } from "@/util/wildcard"
import type { PermissionNext } from "@/permission/next"

/**
 * Auto-resolve pending permissions now fully covered by approved or denied rules.
 * When the user approves/denies a rule on subagent A, sibling subagent B's
 * pending permission for the same pattern resolves or rejects automatically.
 */
export async function drainCovered(
  pending: Record<
    string,
    {
      info: PermissionNext.Request
      ruleset: PermissionNext.Ruleset
      resolve: () => void
      reject: (e: any) => void
    }
  >,
  approved: PermissionNext.Ruleset,
  evaluate: typeof PermissionNext.evaluate,
  events: typeof PermissionNext.Event,
  DeniedError: typeof PermissionNext.DeniedError,
  exclude?: string,
): Promise<void> {
  for (const [id, entry] of Object.entries(pending)) {
    if (id === exclude) continue
    
    const actions = entry.info.patterns.map((pattern) =>
      evaluate(entry.info.permission, pattern, entry.ruleset, approved),
    )
    
    const denied = actions.some((r) => r.action === "deny")
    const allowed = !denied && actions.every((r) => r.action === "allow")
    
    if (!denied && !allowed) continue
    
    delete pending[id]
    
    if (denied) {
      Bus.publish(events.Replied, {
        sessionID: entry.info.sessionID,
        requestID: entry.info.id,
        reply: "reject",
      })
      entry.reject(
        new DeniedError(
          approved.filter((r) => Wildcard.match(entry.info.permission, r.permission))
        )
      )
    } else {
      Bus.publish(events.Replied, {
        sessionID: entry.info.sessionID,
        requestID: entry.info.id,
        reply: "allow",
      })
      entry.resolve()
    }
  }
}
```

---

### 2. Update Permission Next Module to Store Ruleset and Integrate Drain
**File**: `src/permission/next.ts`
**Priority**: high
**Type**: feature
**Reason**: The pending permission entries need to store the ruleset at the time of request to properly evaluate whether new rules cover them. The drain function must be called after saving always rules.

**Current code** (pending entry structure):
```typescript
pending: Record<
  string,
  {
    info: Request
    resolve: () => void
    reject: (e: any) => void
  }
>
```

**New code** (updated pending entry structure):
```typescript
import { drainCovered } from "@/permission/drain"

// Update the pending type definition
pending: Record<
  string,
  {
    info: Request
    ruleset: Ruleset  // Store ruleset at request time for later evaluation
    resolve: () => void
    reject: (e: any) => void
  }
>
```

**Current code** (when adding to pending):
```typescript
s.pending[id] = {
  info,
  resolve,
  reject,
}
```

**New code** (store ruleset when adding to pending):
```typescript
s.pending[id] = {
  info,
  ruleset,  // Capture the ruleset at the time of the permission request
  resolve,
  reject,
}
```

**Current code** (saveAlwaysRules function end):
```typescript
if (newRules.length > 0) {
  await Config.updateGlobal({ permission: toConfig(newRules) }, { dispose: false })
}
```

**New code** (add drain call after saving rules):
```typescript
if (newRules.length > 0) {
  await Config.updateGlobal({ permission: toConfig(newRules) }, { dispose: false })
}

// Auto-resolve any pending permissions that are now covered by the new rules
await drainCovered(s.pending, s.approved, evaluate, Event, DeniedError, input.requestID)
```

---

### 3. Add Wildcard Utility for Permission Pattern Matching
**File**: `src/util/wildcard.ts` (verify exists or create)
**Priority**: high
**Type**: feature
**Reason**: The drain function relies on Wildcard.match for pattern matching. Ensure this utility exists and properly handles permission pattern matching.

**New code** (if file doesn't exist or needs update):
```typescript
export namespace Wildcard {
  /**
   * Match a value against a wildcard pattern.
   * Supports '*' as a wildcard character that matches any sequence.
   * 
   * @param value - The value to test
   * @param pattern - The pattern with optional wildcards
   * @returns true if the value matches the pattern
   */
  export function match(value: string, pattern: string): boolean {
    // Convert wildcard pattern to regex
    const regexPattern = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')  // Escape special regex chars
      .replace(/\*/g, '.*')                    // Convert * to .*
      .replace(/\?/g, '.')                     // Convert ? to .
    
    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(value)
  }

  /**
   * Check if a pattern matches any item in a list.
   * 
   * @param patterns - List of patterns to check
   * @param value - The value to match against
   * @returns true if any pattern matches the value
   */
  export function matchAny(patterns: string[], value: string): boolean {
    return patterns.some((pattern) => match(value, pattern))
  }
}
```

---

### 4. Add Tests for Permission Drain Functionality
**File**: `src/permission/__tests__/drain.test.ts` (new file)
**Priority**: medium
**Type**: feature
**Reason**: The drain functionality is critical for multi-agent permission handling. Tests ensure correct behavior when rules are approved/denied and pending permissions are auto-resolved.

**New code**:
```typescript
import { describe, it, expect, vi, beforeEach } from "vitest"
import { drainCovered } from "../drain"
import { Bus } from "@/bus"

vi.mock("@/bus", () => ({
  Bus: {
    publish: vi.fn(),
  },
}))

describe("drainCovered", () => {
  const mockEvents = {
    Replied: "permission.replied",
  }
  
  class MockDeniedError extends Error {
    constructor(public rules: any[]) {
      super("Permission denied")
    }
  }
  
  const mockEvaluate = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should resolve pending permissions covered by allow rules", async () => {
    const resolve = vi.fn()
    const reject = vi.fn()
    
    const pending = {
      "req-1": {
        info: {
          id: "req-1",
          sessionID: "session-1",
          permission: "file:read",
          patterns: ["/path/to/file.txt"],
        },
        ruleset: [],
        resolve,
        reject,
      },
    }
    
    mockEvaluate.mockReturnValue({ action: "allow" })
    
    await drainCovered(
      pending,
      [{ permission: "file:read", pattern: "/path/*", action: "allow" }],
      mockEvaluate,
      mockEvents,
      MockDeniedError,
    )
    
    expect(resolve).toHaveBeenCalled()
    expect(reject).not.toHaveBeenCalled()
    expect(pending["req-1"]).toBeUndefined()
  })

  it("should reject pending permissions covered by deny rules", async () => {
    const resolve = vi.fn()
    const reject = vi.fn()
    
    const pending = {
      "req-1": {
        info: {
          id: "req-1",
          sessionID: "session-1",
          permission: "file:write",
          patterns: ["/sensitive/file.txt"],
        },
        ruleset: [],
        resolve,
        reject,
      },
    }
    
    mockEvaluate.mockReturnValue({ action: "deny" })
    
    await drainCovered(
      pending,
      [{ permission: "file:write", pattern: "/sensitive/*", action: "deny" }],
      mockEvaluate,
      mockEvents,
      MockDeniedError,
    )
    
    expect(reject).toHaveBeenCalled()
    expect(resolve).not.toHaveBeenCalled()
    expect(pending["req-1"]).toBeUndefined()
  })

  it("should skip the excluded request ID", async () => {
    const resolve = vi.fn()
    const reject = vi.fn()
    
    const pending = {
      "req-1": {
        info: {
          id: "req-1",
          sessionID: "session-1",
          permission: "file:read",
          patterns: ["/path/to/file.txt"],
        },
        ruleset: [],
        resolve,
        reject,
      },
    }
    
    mockEvaluate.mockReturnValue({ action: "allow" })
    
    await drainCovered(
      pending,
      [],
      mockEvaluate,
      mockEvents,
      MockDeniedError,
      "req-1",  // Exclude this request
    )
    
    expect(resolve).not.toHaveBeenCalled()
    expect(reject).not.toHaveBeenCalled()
    expect(pending["req-1"]).toBeDefined()
  })

  it("should not touch pending permissions not fully covered", async () => {
    const resolve = vi.fn()
    const reject = vi.fn()
    
    const pending = {
      "req-1": {
        info: {
          id: "req-1",
          sessionID: "session-1",
          permission: "file:read",
          patterns: ["/path/to/file.txt"],
        },
        ruleset: [],
        resolve,
        reject,
      },
    }
    
    mockEvaluate.mockReturnValue({ action: "ask" })
    
    await drainCovered(
      pending,
      [],
      mockEvaluate,
      mockEvents,
      MockDeniedError,
    )
    
    expect(resolve).not.toHaveBeenCalled()
    expect(reject).not.toHaveBeenCalled()
    expect(pending["req-1"]).toBeDefined()
  })
})
```

---

## Testing Recommendations

1. **Unit Tests**: Run the new drain.test.ts to verify auto-resolution logic
2. **Integration Tests**: Test multi-agent scenarios where:
   - Agent A requests permission for `/path/*`
   - Agent B requests permission for `/path/subdir/*`
   - User approves Agent A's request
   - Verify Agent B's request auto-resolves
3. **Edge Cases**:
   - Test with overlapping patterns (e.g., `*` vs specific paths)
   - Test deny rules taking precedence over allow rules
   - Test with SAP AI Core specific permission patterns
4. **Regression Tests**: Ensure existing single-agent permission flows still work correctly

## Potential Risks

1. **Race Conditions**: If multiple permission requests are processed simultaneously, ensure the drain function handles concurrent access to the pending map safely. Consider adding mutex/locking if needed.

2. **Pattern Matching Edge Cases**: The Wildcard.match function must correctly handle all SAP-specific path patterns. Test with actual SAP AI Core resource paths.

3. **Event Bus Compatibility**: Ensure the Bus.publish calls are compatible with Alexi's existing event bus implementation. The event names may need adjustment.

4. **Memory Leaks**: If pending permissions are never resolved or rejected, they could accumulate. Consider adding a timeout mechanism for stale pending entries.

5. **Backward Compatibility**: Existing code that creates pending entries without the `ruleset` property will break. Ensure all callsites are updated.
{"prompt_tokens":12296,"completion_tokens":3277,"total_tokens":15573}

[Session: c076fe32-56f4-4e23-bd50-8389ea3d6be1]
[Messages: 2, Tokens: 15573]

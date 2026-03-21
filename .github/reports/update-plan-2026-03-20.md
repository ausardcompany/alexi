[2026-03-20T06:58:18.388Z] [32mINFO[39m     (context): Found a service key in environment variable "AICORE_SERVICE_KEY". Using a service key is recommended for local testing only. Bind the AI Core service to the application for productive usage.
# Update Plan for Alexi

Generated: 2026-03-20
Based on upstream commits: f5529601..4bef41a2 (kilocode)

## Summary
- Total changes planned: 2
- Critical: 0 | High: 2 | Medium: 0 | Low: 0

## Changes

### 1. Handle null delete sentinels in permission config parsing
**File**: `src/permission/next.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Permission config patches may contain `null` values as delete sentinels (indicating a key should be removed). Without this fix, null entries would cause runtime errors or create invalid rules when parsing permission configurations. This is critical for proper permission merging when configs are updated.

**Current code** (if modifying):
```typescript
export namespace PermissionNext {
  export function fromConfig(config: PermissionConfig): Ruleset {
    const ruleset: Ruleset = []
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === "string") {
        ruleset.push({
          permission: key,
          pattern: "*",
          action: value,
        })
        continue
      }
      ruleset.push(
        ...Object.entries(value).map(([pattern, action]) => ({ permission: key, pattern: expand(pattern), action })),
      )
    }
    return ruleset
  }

  export function toConfig(rules: Ruleset): PermissionConfig {
    const result: PermissionConfig = {}
    for (const rule of rules) {
      const existing = result[rule.permission]
      // ... existing logic
      if (existing === undefined) {
        // Use object format to avoid replacing existing granular rules
        result[rule.permission] = { [rule.pattern]: rule.action }
      }
      // ... rest of logic
    }
    return result
  }
}
```

**New code**:
```typescript
export namespace PermissionNext {
  export function fromConfig(config: PermissionConfig): Ruleset {
    const ruleset: Ruleset = []
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === "string") {
        ruleset.push({
          permission: key,
          pattern: "*",
          action: value,
        })
        continue
      }
      // null is a delete sentinel — skip it (it only appears in patches, not in stored config)
      if (value === null) continue
      ruleset.push(
        // Filter out null entries (delete sentinels) — they don't represent real rules
        ...Object.entries(value)
          .filter(([, action]) => action !== null)
          .map(([pattern, action]) => ({ permission: key, pattern: expand(pattern), action: action as Action })),
      )
    }
    return ruleset
  }

  export function toConfig(rules: Ruleset): PermissionConfig {
    const result: PermissionConfig = {}
    for (const rule of rules) {
      const existing = result[rule.permission]
      // ... existing logic preserved
      if (existing === undefined || existing === null) {
        // Use object format to avoid replacing existing granular rules
        // when merged via updateGlobal (e.g. { read: "allow" } would wipe
        // { read: { "*": "ask", "src/*": "allow" } })
        result[rule.permission] = { [rule.pattern]: rule.action }
      }
      // ... rest of logic
    }
    return result
  }
}
```

### 2. Add unit tests for null delete sentinel handling in permission config
**File**: `src/permission/next.toConfig.test.ts` (or equivalent test file)
**Priority**: high
**Type**: bugfix
**Reason**: Tests ensure the null sentinel handling works correctly and prevents regressions. These tests verify that null values in permission configs are properly skipped during parsing, preventing invalid rules from being created.

**New code**:
```typescript
import { describe, test, expect } from "vitest"
import { PermissionNext } from "./next"

// Tests for null delete sentinel handling (null = "remove this key from config")

describe("PermissionNext null sentinel handling", () => {
  test("fromConfig - null entries in PermissionObject are skipped", () => {
    const config = { bash: { "*": "ask" as const, "npm *": null } }
    const rules = PermissionNext.fromConfig(config)
    // null is a delete sentinel — only the non-null entry should produce a rule
    expect(rules).toEqual([{ permission: "bash", pattern: "*", action: "ask" }])
  })

  test("fromConfig - null top-level PermissionRule is skipped", () => {
    const config = { bash: null }
    const rules = PermissionNext.fromConfig(config)
    expect(rules).toEqual([])
  })

  test("toConfig - null existing entry is treated as absent (new rule wins)", () => {
    // If result[permission] is null (shouldn't happen in practice but defensive),
    // the new rule should be written as a fresh object entry.
    const result = PermissionNext.toConfig([{ permission: "bash", pattern: "npm *", action: "allow" }])
    expect(result).toEqual({ bash: { "npm *": "allow" } })
  })
})
```

## Testing Recommendations
- Run all existing permission system tests to ensure no regressions
- Test permission config merging scenarios with null values in patches
- Verify that deleting a permission rule via UI/API properly uses null sentinels
- Test edge cases:
  - Config with only null entries
  - Mixed valid and null entries in same permission object
  - Null at top-level permission key
  - Null in nested pattern entries

## Potential Risks
- **Type safety**: The `action as Action` cast in the new code assumes the filter has already removed null values. Ensure TypeScript types for `PermissionConfig` allow null values in the object form to properly represent delete sentinels.
- **Backward compatibility**: If existing stored configs somehow contain null values (unlikely but possible from manual edits), they will now be silently ignored rather than causing errors. This is the desired behavior but should be documented.
- **SAP AI Core integration**: These changes are isolated to permission parsing and should not affect SAP-specific integrations. However, verify that any SAP-specific permission configurations don't rely on null having a different meaning.
{"prompt_tokens":14470,"completion_tokens":1566,"total_tokens":16036}

[Session: 939b92ba-8c41-4d90-9ace-ef089d449089]
[Messages: 2, Tokens: 16036]

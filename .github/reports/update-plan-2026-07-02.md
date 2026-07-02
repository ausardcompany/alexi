# Update Plan for Alexi

Generated: 2026-07-05  
Based on upstream commits: kilocode (78cdc9c89..2992e3e44), opencode (f014686..f52424e)

## Summary
- Total changes planned: 4
- Critical: 0 | High: 2 | Medium: 2 | Low: 0

## Changes

### 1. Implement MaxCostNudge Feature
**File**: `src/core/max-cost-nudge.ts`
**Priority**: high  
**Type**: feature  
**Reason**: Introduces a new feature to alert when session cost exceeds a threshold, improving user cost management.

**New code**:
```typescript
export type MaxCostChoice = "continue" | "stop"

export interface MaxCostMessage {
  id: string
  sessionID: string
  role?: string
  cost?: number
}

export class MaxCostNudge {
  readonly #msgs = new Map<string, { sid: string; cost: number }>()
  readonly #totals = new Map<string, number>()
  readonly #floors = new Map<string, number>()
  readonly #alerted = new Map<string, Set<number>>() 
  readonly #acked = new Map<string, Set<number>>()
  
  #limit: number | undefined

  static normalizeLimit(value: number | undefined | null): number | undefined {
    if (value == null || !Number.isFinite(value) || value <= 0) return undefined
    return Math.ceil(value)
  }

  static formatCost(value: number): string {
    return `$${value.toFixed(value < 1 ? 4 : 2)}`
  }

  setLimit(value: number | undefined | null): void {
    // Additional logic
  }
}
```

### 2. Add Unit Tests for MaxCostNudge
**File**: `src/core/max-cost-nudge.test.ts`
**Priority**: medium  
**Type**: test  
**Reason**: Ensure the new cost nudge feature functions correctly under various conditions.

**New code**:
```typescript
import { describe, expect, test } from "bun:test"
import { MaxCostNudge } from "./max-cost-nudge"

describe("MaxCostNudge", () => {
  test("normalizeLimit functionality", () => {
    expect(MaxCostNudge.normalizeLimit(null)).toBeUndefined()
    expect(MaxCostNudge.normalizeLimit(4.2)).toBe(5)
  })

  test("formatCost precision", () => {
    expect(MaxCostNudge.formatCost(0.5)).toBe("$0.5000")
  })

  // Additional tests
})
```

### 3. Update Tool Registry for Model Family Awareness
**File**: `src/tool/registry.ts`
**Priority**: high  
**Type**: feature  
**Reason**: Align tool registry functionality with new upstream changes for family-aware experimental tools.

**Current code**:
```typescript
readonly tools: (model: { providerID: ProviderID; modelID: ModelID; agent: Agent.Info }) => Effect.Effect<Tool.Def[]>
```

**New code**:
```typescript
readonly tools: (model: {
  providerID: ProviderID
  modelID: ModelID
  family?: string
  agent: Agent.Info
}) => Effect.Effect<Tool.Def[]>
```

### 4. Implement usePatch Functionality for Tools
**File**: `src/tool/registry.ts`
**Priority**: medium  
**Type**: feature  
**Reason**: Incorporate logic for determining tool usage based on model family, enhancing tool selection precision.

**Current code**:
```typescript
const usePatch = !!process.env["KILO_E2E_LLM_URL"] || (input.modelID.includes("gpt-"))
```

**New code**:
```typescript
const usePatch = KiloToolRegistry.usePatch(input)
```

## Testing Recommendations
- Validate MaxCostNudge alerts are triggered accurately during high-cost sessions.
- Ensure the tool registry correctly selects tools based on model family.
- Run unit tests for MaxCostNudge to confirm logic and edge cases are handled.

## Potential Risks
- Changes to tool registry may affect integration with existing tools if not properly tested.
- Introduction of cost management features could interfere with existing cost tracking if not aligned with current systems.
{"prompt_tokens":16451,"completion_tokens":919,"total_tokens":17370,"cache_read_input_tokens":0}

[Session: 2aa04e58-f61c-4cb0-8217-fa3373a3c049]
[Messages: 2, Tokens: 17370]

# Update Plan for Alexi

Generated: 2026-03-25
Based on upstream commits: b853ca57, 10db72a7, a6e52547, bf07e75e, 04d0175d, d6d082ea, c87457ba, 4c9bc9ca, and related commits from kilocode

## Summary
- Total changes planned: 8
- Critical: 1 | High: 3 | Medium: 3 | Low: 1

## Changes

### 1. Add displayName Support for Organization Modes in Agent System
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream added support for human-readable display names for organization-managed modes, improving UX when displaying agent names in UI components.

**Current code** (if modifying):
```typescript
export const Info = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    mode: z.enum(["subagent", "primary", "all"]),
    native: z.boolean().optional(),
    // ... other fields
  })
```

**New code**:
```typescript
export const Info = z
  .object({
    name: z.string(),
    displayName: z.string().optional(), // Human-readable name for org modes
    description: z.string().optional(),
    mode: z.enum(["subagent", "primary", "all"]),
    native: z.boolean().optional(),
    // ... other fields
  })
```

### 2. Populate displayName from Agent Options
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: feature
**Reason**: When merging agent configurations, extract displayName from options if provided by organization-managed modes.

**Current code** (if modifying):
```typescript
// In agent merge/configuration logic
item.name = value.name ?? item.name
item.steps = value.steps ?? item.steps
item.options = mergeDeep(item.options, value.options ?? {})
item.permission = PermissionNext.merge(item.permission, PermissionNext.fromConfig(value.permission ?? {}))
```

**New code**:
```typescript
// In agent merge/configuration logic
item.name = value.name ?? item.name
item.steps = value.steps ?? item.steps
item.options = mergeDeep(item.options, value.options ?? {})

// Populate displayName from org mode options
if (item.options?.displayName && typeof item.options.displayName === "string") {
  item.displayName = item.options.displayName
}

item.permission = PermissionNext.merge(item.permission, PermissionNext.fromConfig(value.permission ?? {}))
```

### 3. Prevent Removal of Organization-Managed Agents
**File**: `src/agent/index.ts`
**Priority**: critical
**Type**: security
**Reason**: Organization-managed agents should not be removable by end users - they must be managed through the cloud dashboard to maintain organizational control.

**Current code** (if modifying):
```typescript
export async function removeAgent(name: string): Promise<void> {
  const agents = await getAgents()
  const agent = agents[name]
  if (!agent) throw new RemoveError({ name, message: "agent not found" })
  if (agent.native) throw new RemoveError({ name, message: "cannot remove native agent" })
  
  // ... rest of removal logic
}
```

**New code**:
```typescript
export async function removeAgent(name: string): Promise<void> {
  const agents = await getAgents()
  const agent = agents[name]
  if (!agent) throw new RemoveError({ name, message: "agent not found" })
  if (agent.native) throw new RemoveError({ name, message: "cannot remove native agent" })
  
  // Prevent removal of organization-managed agents
  if (agent.options?.source === "organization") {
    throw new RemoveError({ 
      name, 
      message: "cannot remove organization agent — manage it from the cloud dashboard" 
    })
  }
  
  // ... rest of removal logic
}
```

### 4. Update Default Permission Configuration - Remove bash:ask Default
**File**: `src/permission/defaults.ts` (or equivalent permission configuration)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream reverted the bash auto-approve rule change. The default permission for bash should not be "ask" - this was causing UX issues and was reverted in commit a637715a.

**Current code** (if present):
```typescript
const defaults = PermissionNext.fromConfig({
  "*": "allow",
  bash: "ask",
  doom_loop: "ask",
  external_directory: {
    "*": "ask",
    // ...
  },
  // ...
})
```

**New code**:
```typescript
const defaults = PermissionNext.fromConfig({
  "*": "allow",
  // bash permission removed - inherits from "*": "allow"
  doom_loop: "ask",
  external_directory: {
    "*": "ask",
    // ...
  },
  // ...
})
```

### 5. Add Error Backoff System for API Calls
**File**: `src/core/error-backoff.ts` (new file)
**Priority**: medium
**Type**: feature
**Reason**: Upstream added a circuit breaker and exponential backoff system for handling API errors gracefully, preventing infinite loading states and improving reliability.

**New code**:
```typescript
export interface BackoffConfig {
  initialDelayMs: number
  maxDelayMs: number
  multiplier: number
  maxRetries: number
}

export class ErrorBackoff {
  private consecutiveErrors = 0
  private backoffUntil: number | null = null
  private fatalNotified = false
  
  private readonly config: BackoffConfig
  
  constructor(config: Partial<BackoffConfig> = {}) {
    this.config = {
      initialDelayMs: config.initialDelayMs ?? 1000,
      maxDelayMs: config.maxDelayMs ?? 60000,
      multiplier: config.multiplier ?? 2,
      maxRetries: config.maxRetries ?? 5,
    }
  }
  
  recordError(statusCode?: number): void {
    this.consecutiveErrors++
    
    // Check for fatal errors (4xx client errors)
    if (statusCode && statusCode >= 400 && statusCode < 500) {
      this.fatalNotified = true
    }
    
    const delay = Math.min(
      this.config.initialDelayMs * Math.pow(this.config.multiplier, this.consecutiveErrors - 1),
      this.config.maxDelayMs
    )
    this.backoffUntil = Date.now() + delay
  }
  
  recordSuccess(): void {
    this.consecutiveErrors = 0
    this.backoffUntil = null
  }
  
  reset(): void {
    this.consecutiveErrors = 0
    this.backoffUntil = null
    this.fatalNotified = false
  }
  
  shouldBackoff(): boolean {
    if (this.backoffUntil === null) return false
    return Date.now() < this.backoffUntil
  }
  
  getRemainingBackoffMs(): number {
    if (this.backoffUntil === null) return 0
    return Math.max(0, this.backoffUntil - Date.now())
  }
  
  isFatal(): boolean {
    return this.fatalNotified
  }
  
  getConsecutiveErrors(): number {
    return this.consecutiveErrors
  }
}

// Extract status code from error messages
export function extractStatusCode(errorMessage: string): number | undefined {
  // Anchor to colon to avoid false matches, restrict to 4xx/5xx
  const match = errorMessage.match(/status:\s*([45]\d{2})\b/)
  return match ? parseInt(match[1], 10) : undefined
}
```

### 6. Add Modes Migrator for Organization Modes
**File**: `src/config/modes-migrator.ts` (new file)
**Priority**: medium
**Type**: feature
**Reason**: Upstream added support for migrating/syncing organization-managed modes from cloud configuration.

**New code**:
```typescript
import { Config } from "./config"
import { Agent } from "../agent"

export interface OrgMode {
  name: string
  displayName?: string
  description?: string
  steps?: string[]
  options?: Record<string, unknown>
  permission?: Record<string, unknown>
}

export async function migrateOrgModes(orgModes: OrgMode[]): Promise<void> {
  for (const mode of orgModes) {
    const agentConfig: Partial<Agent.Info> = {
      name: mode.name,
      displayName: mode.displayName,
      description: mode.description,
      steps: mode.steps,
      options: {
        ...mode.options,
        source: "organization",
        displayName: mode.displayName,
      },
    }
    
    await Agent.merge(mode.name, agentConfig)
  }
}

export function isOrgManagedMode(agent: Agent.Info): boolean {
  return agent.options?.source === "organization"
}
```

### 7. Enhance Commit Message Generation with Explicit Stream Consumption
**File**: `src/cli/commit-message.ts` (or equivalent)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream fixed an issue where commit message generation could get stuck in infinite loading by explicitly consuming the stream response.

**Current code** (if present):
```typescript
export async function generateCommitMessage(diff: string): Promise<string> {
  const response = await streamCompletion({
    prompt: buildCommitPrompt(diff),
    // ...
  })
  
  return response.text
}
```

**New code**:
```typescript
export async function generateCommitMessage(diff: string): Promise<string> {
  const response = await streamCompletion({
    prompt: buildCommitPrompt(diff),
    // ...
  })
  
  // Explicitly consume the stream to prevent infinite loading
  let result = ""
  for await (const chunk of response.stream) {
    result += chunk.text ?? ""
  }
  
  // Ensure stream is fully consumed
  if (response.stream && typeof response.stream.return === "function") {
    await response.stream.return()
  }
  
  return result || response.text
}
```

### 8. Add MCP Server Initialization Improvements
**File**: `src/mcp/index.ts`
**Priority**: low
**Type**: feature
**Reason**: Upstream added improvements to MCP server initialization handling.

**Current code** (if present):
```typescript
export async function initializeMcpServers(): Promise<void> {
  const config = await Config.get()
  // ... initialization logic
}
```

**New code**:
```typescript
export async function initializeMcpServers(): Promise<void> {
  const config = await Config.get()
  
  // Add graceful handling for server initialization failures
  const servers = config.mcp?.servers ?? []
  const results = await Promise.allSettled(
    servers.map(async (server) => {
      try {
        await initializeServer(server)
        return { server: server.name, status: "connected" }
      } catch (error) {
        console.warn(`Failed to initialize MCP server ${server.name}:`, error)
        return { server: server.name, status: "failed", error }
      }
    })
  )
  
  // Log initialization summary
  const successful = results.filter(r => r.status === "fulfilled").length
  const failed = results.filter(r => r.status === "rejected").length
  
  if (failed > 0) {
    console.warn(`MCP initialization: ${successful} connected, ${failed} failed`)
  }
}
```

## Testing Recommendations

1. **Agent Display Name Tests**
   - Verify agents with `displayName` in options correctly populate the field
   - Test UI components display `displayName` when available, falling back to `name`

2. **Organization Agent Protection Tests**
   - Attempt to remove an agent with `options.source === "organization"`
   - Verify appropriate error message is thrown
   - Ensure native agents still cannot be removed

3. **Permission Default Tests**
   - Verify bash commands execute with default "allow" permission
   - Ensure doom_loop and external_directory still require "ask"

4. **Error Backoff Tests**
   - Simulate consecutive API failures and verify backoff timing
   - Test reset on auth changes
   - Verify 4xx errors are marked as fatal

5. **Commit Message Generation Tests**
   - Test with various diff sizes
   - Verify no infinite loading states
   - Test stream consumption completion

6. **SAP AI Core Integration Tests**
   - Verify all changes maintain compatibility with SAP AI Core provider
   - Test organization mode sync with SAP-specific configurations

## Potential Risks

1. **Permission Change Risk**: Removing `bash: "ask"` default returns to more permissive behavior. Ensure this aligns with Alexi's security requirements for SAP environments.

2. **Organization Mode Source Detection**: The `options.source === "organization"` check assumes this field is consistently set. Verify SAP AI Core integration properly sets this field for managed modes.

3. **Backward Compatibility**: Agents created before `displayName` support will not have this field. UI components must gracefully handle missing `displayName`.

4. **Error Backoff State**: The backoff state is instance-level. In distributed deployments, each instance will have independent backoff states which may lead to inconsistent behavior.
{"prompt_tokens":9168,"completion_tokens":3399,"total_tokens":12567}

[Session: d3d69daf-b875-4f27-82cf-119931d07659]
[Messages: 2, Tokens: 12567]

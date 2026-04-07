# Update Plan for Alexi

Generated: 2026-04-07
Based on upstream commits: kilocode d10d25a4..cb0c58c0 (38 commits), opencode 3c96bf8..3a0e00d (32 commits)

## Summary
- Total changes planned: 8
- Critical: 1 | High: 3 | Medium: 3 | Low: 1

## Changes

### 1. Propagate MCP and Edit Restrictions to Sub-Agents in Task Tool
**File**: `src/tool/task.ts`
**Priority**: critical
**Type**: security
**Reason**: Sub-agents must inherit edit, bash, and MCP restrictions from their parent agent to prevent privilege escalation. Without this, a sub-agent could bypass restrictions that were set on the parent agent, creating a security vulnerability in multi-hop agent chains.

**Current code** (if modifying):
```typescript
// In TaskTool definition, where sub-agent session is created
const session = await iife(async () => {
  // ... existing session creation logic
  return await Session.create({
    // existing properties
    permission: [
      // existing permission rules
    ],
  })
})
```

**New code**:
```typescript
import { PermissionNext } from "../permission"
import { Agent } from "../agent"
import { Session } from "../session"
import { config } from "../config"

// In TaskTool definition, before session creation
// Inherit edit and bash restrictions from the calling agent so
// sub-agents cannot perform actions the parent agent is not allowed to perform.
// We merge the static agent definition with the current session's accumulated permissions
// so that restrictions survive multi-hop chains (plan → general → explore).
const caller = await Agent.get(ctx.agent)
const callerSession = await Session.get(ctx.sessionID)
const callerRules = PermissionNext.merge(caller?.permission ?? [], callerSession.permission ?? [])

// Build the set of MCP server prefixes (e.g. "servername_") so we can
// include both server-wide wildcards ("servername_*") and specific MCP tool
// permissions ("servername_create_issue") in the inherited ruleset.
// Same sanitisation logic as agent.ts.
const mcpPrefixes = Object.keys(config.mcp ?? {}).map((k) => k.replace(/[^a-zA-Z0-9_-]/g, "_") + "_")
const isMcpRule = (p: string) => mcpPrefixes.some((prefix) => p.startsWith(prefix))
const inherited = callerRules.filter(
  (r) => r.permission === "edit" || r.permission === "bash" || isMcpRule(r.permission),
)

const session = await iife(async () => {
  // ... existing session creation logic
  return await Session.create({
    // existing properties
    permission: [
      // existing permission rules
      ...inherited, // Propagate caller's edit, bash, and MCP restrictions
    ],
  })
})
```

---

### 2. Update Plan Mode to Allow Asking for Edits Outside Plan Files
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Plan mode currently denies all edits, but users should be able to approve edits outside plan files. Also adds read-only bash and MCP rules to plan mode for consistency with ask agent behavior.

**Current code** (if modifying):
```typescript
// In Agent namespace, plan mode definition
plan: {
  name: "plan",
  description: "Plan mode. Disallows all edit tools.",
  options: {},
  permission: PermissionNext.merge(
    defaults,
    PermissionNext.fromConfig({
      question: "allow",
      plan_exit: "allow",
      external_directory: {
        [path.join(Global.Path.data, "plans", "*")]: "allow",
      },
      edit: {
        "*": "deny",
        [path.join(".kilo", "plans", "*.md")]: "allow",
        [path.join(".opencode", "plans", "*.md")]: "allow",
        [path.relative(Instance.worktree, path.join(Global.Path.data, path.join("plans", "*.md")))]: "allow",
      },
    }),
  ),
},
```

**New code**:
```typescript
// In Agent namespace, plan mode definition
plan: {
  name: "plan",
  description: "Plan mode. Only allows editing plan files; asks before editing anything else.",
  options: {},
  permission: PermissionNext.merge(
    defaults,
    PermissionNext.fromConfig({
      question: "allow",
      plan_exit: "allow",
      bash: readOnlyBash, // Read-only bash for plan mode (mirrors ask agent)
      ...mcpRules, // MCP with user approval for plan mode
      external_directory: {
        [path.join(Global.Path.data, "plans", "*")]: "allow",
      },
      edit: {
        "*": "ask", // Ask (not deny) so user can approve edits outside plan files
        [path.join(".alexi", "plans", "*.md")]: "allow",
        [path.join(".opencode", "plans", "*.md")]: "allow",
        [path.relative(Instance.worktree, path.join(Global.Path.data, path.join("plans", "*.md")))]: "allow",
      },
    }),
  ),
},
```

---

### 3. Add --dangerously-skip-permissions Flag to Run Command
**File**: `src/cli/cmd/run.ts`
**Priority**: high
**Type**: feature
**Reason**: Allows advanced users to skip permission checks when running automated scripts in controlled environments. This is useful for CI/CD pipelines and trusted automation scenarios.

**Current code** (if modifying):
```typescript
// In run command definition
export const runCommand = command({
  name: "run",
  description: "Run a task with the AI agent",
  args: {
    task: positional({ type: string, description: "Task to run" }),
    // existing args
  },
  handler: async (args) => {
    // existing handler logic
  },
})
```

**New code**:
```typescript
import { Flag } from "../../flag/flag"

// In run command definition
export const runCommand = command({
  name: "run",
  description: "Run a task with the AI agent",
  args: {
    task: positional({ type: string, description: "Task to run" }),
    dangerouslySkipPermissions: flag({
      type: boolean,
      long: "dangerously-skip-permissions",
      description: "Skip all permission checks (use with caution)",
      default: false,
    }),
    // existing args
  },
  handler: async (args) => {
    if (args.dangerouslySkipPermissions) {
      Flag.set("dangerouslySkipPermissions", true)
      console.warn(
        "⚠️  WARNING: Running with --dangerously-skip-permissions. All permission checks will be bypassed."
      )
    }
    // existing handler logic
  },
})
```

**Additional file**: `src/flag/flag.ts`
```typescript
// Add new flag
export namespace Flag {
  const flags: Record<string, boolean> = {}
  
  export function set(name: string, value: boolean) {
    flags[name] = value
  }
  
  export function get(name: string): boolean {
    return flags[name] ?? false
  }
  
  // Add to existing flags
  export const dangerouslySkipPermissions = () => get("dangerouslySkipPermissions")
}
```

---

### 4. Add HTTP Proxy Support to Workspace Adaptor
**File**: `src/control-plane/workspace.ts`
**Priority**: high
**Type**: feature
**Reason**: Adds full HTTP proxy support for enterprise environments that require proxy configuration for outbound connections. Essential for SAP AI Core integration in corporate networks.

**Current code** (if modifying):
```typescript
// In workspace adaptor interface
export interface WorkspaceAdaptor {
  // existing methods
}
```

**New code**:
```typescript
// In workspace adaptor interface and types
export interface WorkspaceAdaptorConfig {
  // existing config
  proxy?: {
    http?: string
    https?: string
    noProxy?: string[]
  }
}

export interface WorkspaceAdaptor {
  // existing methods
  
  /**
   * Configure HTTP proxy settings for the workspace
   */
  setProxy(config: WorkspaceAdaptorConfig["proxy"]): void
  
  /**
   * Get current proxy configuration
   */
  getProxy(): WorkspaceAdaptorConfig["proxy"] | undefined
}

// In workspace implementation
export class Workspace implements WorkspaceAdaptor {
  private proxyConfig?: WorkspaceAdaptorConfig["proxy"]
  
  setProxy(config: WorkspaceAdaptorConfig["proxy"]): void {
    this.proxyConfig = config
    if (config?.http) {
      process.env.HTTP_PROXY = config.http
    }
    if (config?.https) {
      process.env.HTTPS_PROXY = config.https
    }
    if (config?.noProxy) {
      process.env.NO_PROXY = config.noProxy.join(",")
    }
  }
  
  getProxy(): WorkspaceAdaptorConfig["proxy"] | undefined {
    return this.proxyConfig
  }
}
```

---

### 5. Add Mouse Disable Option to TUI Configuration
**File**: `src/config/tui.ts`
**Priority**: medium
**Type**: feature
**Reason**: Allows users to disable mouse support in the TUI, which is useful for terminal environments where mouse events cause issues or for users who prefer keyboard-only navigation.

**Current code** (if modifying):
```typescript
// In TUI config schema
export const tuiConfigSchema = z.object({
  // existing config options
})
```

**New code**:
```typescript
// In TUI config schema
export const tuiConfigSchema = z.object({
  // existing config options
  mouse: z.boolean().default(true).describe("Enable mouse support in TUI"),
})

// In TUI config type
export interface TuiConfig {
  // existing properties
  mouse: boolean
}

// In TUI initialization (src/cli/cmd/tui/app.tsx)
export function App({ config }: { config: TuiConfig }) {
  const mouseEnabled = config.mouse ?? true
  
  // Pass to ink/react-ink configuration
  return (
    <InkApp
      // existing props
      mouse={mouseEnabled}
    >
      {/* existing children */}
    </InkApp>
  )
}
```

---

### 6. Fix TypeScript LSP Memory Leak with Native Project Config
**File**: `src/lsp/server.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Ensures TypeScript language server uses native project configuration to prevent memory leaks. This is critical for long-running sessions where the LSP server would otherwise accumulate memory.

**Current code** (if modifying):
```typescript
// In LSP server initialization for TypeScript
export async function initializeTypeScriptServer(workspacePath: string) {
  // existing initialization
}
```

**New code**:
```typescript
// In LSP server initialization for TypeScript
export async function initializeTypeScriptServer(workspacePath: string) {
  const tsconfig = await findTsConfig(workspacePath)
  
  // Ensure TypeScript server uses native project config to prevent memory leaks
  const serverOptions: TypeScriptServerOptions = {
    // existing options
    useNativeProjectConfig: true,
    projectConfig: tsconfig,
    // Disable features that can cause memory accumulation
    disableAutomaticTypingAcquisition: true,
  }
  
  return createTypeScriptServer(serverOptions)
}

async function findTsConfig(workspacePath: string): Promise<string | undefined> {
  const tsconfigPath = path.join(workspacePath, "tsconfig.json")
  try {
    await fs.access(tsconfigPath)
    return tsconfigPath
  } catch {
    return undefined
  }
}
```

---

### 7. Improve NPM Package Specifier Parsing
**File**: `src/npm/index.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Uses npm-package-arg for proper parsing of package specifiers and sanitizes Windows cache paths. Fixes issues with complex package specifiers and Windows path handling.

**Current code** (if modifying):
```typescript
// In npm package handling
export function parsePackageSpecifier(specifier: string) {
  // simple parsing logic
}
```

**New code**:
```typescript
import npa from "npm-package-arg"
import path from "path"

// In npm package handling
export function parsePackageSpecifier(specifier: string) {
  try {
    const parsed = npa(specifier)
    return {
      name: parsed.name,
      version: parsed.fetchSpec,
      type: parsed.type,
      raw: parsed.raw,
    }
  } catch (error) {
    throw new Error(`Invalid package specifier: ${specifier}`)
  }
}

export function sanitizeCachePath(cachePath: string): string {
  // Sanitize Windows paths by replacing invalid characters
  if (process.platform === "win32") {
    return cachePath
      .replace(/[<>:"|?*]/g, "_")
      .replace(/\\/g, "/")
  }
  return cachePath
}

export function getCachePath(packageName: string): string {
  const baseCachePath = path.join(os.homedir(), ".alexi", "npm-cache")
  const sanitizedName = sanitizeCachePath(packageName)
  return path.join(baseCachePath, sanitizedName)
}
```

---

### 8. Add Cloudflare Provider Error Handling for Missing Environment Variables
**File**: `src/providers/cloudflare.ts`
**Priority**: low
**Type**: bugfix
**Reason**: Shows clear error messages when Cloudflare provider environment variables are missing, improving developer experience during setup.

**Current code** (if modifying):
```typescript
// In Cloudflare provider initialization
export function initializeCloudflareProvider(config: CloudflareConfig) {
  // existing initialization
}
```

**New code**:
```typescript
// In Cloudflare provider initialization
const REQUIRED_ENV_VARS = [
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_API_TOKEN",
] as const

export function initializeCloudflareProvider(config: CloudflareConfig) {
  // Check for required environment variables
  const missingVars = REQUIRED_ENV_VARS.filter(
    (varName) => !process.env[varName] && !config[varName.toLowerCase().replace("cloudflare_", "")]
  )
  
  if (missingVars.length > 0) {
    const errorMessage = `Cloudflare provider configuration error: Missing required environment variables:\n${missingVars
      .map((v) => `  - ${v}`)
      .join("\n")}\n\nPlease set these variables or provide them in your configuration.\nSee: https://docs.alexi.dev/providers#cloudflare`
    
    throw new Error(errorMessage)
  }
  
  // existing initialization
}
```

---

## Testing Recommendations

1. **Permission Inheritance Testing**
   - Create multi-hop agent chains (plan → general → explore) and verify restrictions propagate correctly
   - Test MCP tool restrictions are inherited by sub-agents
   - Verify edit and bash restrictions cannot be bypassed through sub-agent delegation

2. **Plan Mode Testing**
   - Verify plan mode prompts for approval when editing non-plan files
   - Test that read-only bash commands work in plan mode
   - Confirm MCP tools require user approval in plan mode

3. **CLI Flag Testing**
   - Test `--dangerously-skip-permissions` flag bypasses permission checks
   - Verify warning message is displayed when flag is used
   - Ensure flag does not affect normal operation when not specified

4. **Proxy Configuration Testing**
   - Test HTTP/HTTPS proxy settings are correctly applied
   - Verify NO_PROXY exclusions work as expected
   - Test with SAP AI Core in corporate proxy environment

5. **LSP Memory Testing**
   - Run long TypeScript editing sessions and monitor memory usage
   - Verify TypeScript server uses native project
{"prompt_tokens":9930,"completion_tokens":4096,"total_tokens":14026}

[Session: b60f2d22-20ab-4143-bfcf-9d868f2b2db6]
[Messages: 2, Tokens: 14026]

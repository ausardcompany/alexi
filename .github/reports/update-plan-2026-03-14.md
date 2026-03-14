[2026-03-14T08:16:55.170Z] [32mINFO[39m     (context): Found a service key in environment variable "AICORE_SERVICE_KEY". Using a service key is recommended for local testing only. Bind the AI Core service to the application for productive usage.
# Update Plan for Alexi

Generated: 2026-03-14
Based on upstream commits: kilocode 34a92107..93c9819a (993 commits)

## Summary
- Total changes planned: 12
- Critical: 2 | High: 4 | Medium: 4 | Low: 2

## Changes

### 1. Update Agent Permission Path for .kilo Directory Migration
**File**: `src/agent/index.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Kilocode is migrating from `.opencode` to `.kilo` directory for configuration. Agent edit permissions need to allow both paths for backward compatibility.

**Current code** (if modifying):
```typescript
edit: {
  "*": "deny",
  [path.join(".opencode", "plans", "*.md")]: "allow",
  [path.relative(Instance.worktree, path.join(Global.Path.data, path.join("plans", "*.md")))]: "allow",
},
```

**New code**:
```typescript
edit: {
  "*": "deny",
  [path.join(".kilo", "plans", "*.md")]: "allow", // Primary path
  [path.join(".opencode", "plans", "*.md")]: "allow", // Fallback for backward compatibility
  [path.relative(Instance.worktree, path.join(Global.Path.data, path.join("plans", "*.md")))]: "allow",
},
```

### 2. Fix Ask Mode Permission Merge Order
**File**: `src/agent/index.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: User permissions must be merged before ask-specific permissions so that ask mode's deny+allowlist pattern takes precedence. This fixes a bug where ask mode could incorrectly allow edits.

**Current code** (if modifying):
```typescript
permission: PermissionNext.merge(
  defaults,
  PermissionNext.fromConfig({
    "*": "deny",
    read: {
      "*": "allow",
    },
    // ... ask-specific config
  }),
  user,
),
```

**New code**:
```typescript
permission: PermissionNext.merge(
  defaults,
  user, // User permissions merged first so ask's deny+allowlist wins
  PermissionNext.fromConfig({
    "*": "deny",
    read: {
      "*": "allow",
    },
    // ... ask-specific config
  }),
),
```

### 3. Add Pattern Rules Support to Permission System
**File**: `src/permission/next.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream added support for pattern-based permission rules with 317 lines of new tests. This enables more granular permission control.

**New code**:
```typescript
/**
 * Evaluates a permission pattern against a path.
 * Supports glob patterns with wildcards.
 * 
 * @param pattern - The permission pattern (e.g., "*.md", "src/**")
 * @param targetPath - The path to check
 * @returns true if pattern matches the path
 */
export function matchesPattern(pattern: string, targetPath: string): boolean {
  // Handle exact matches
  if (pattern === targetPath) return true;
  
  // Handle wildcard patterns
  if (pattern === "*") return true;
  
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\*\*/g, "{{GLOBSTAR}}")
    .replace(/\*/g, "[^/]*")
    .replace(/{{GLOBSTAR}}/g, ".*")
    .replace(/\?/g, ".");
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(targetPath);
}

/**
 * Evaluates permission rules in order, returning the first matching rule's action.
 * Rules are evaluated from most specific to least specific.
 */
export function evaluatePatternRules(
  rules: Array<{ pattern: string; action: "allow" | "deny" }>,
  targetPath: string
): "allow" | "deny" | undefined {
  for (const rule of rules) {
    if (matchesPattern(rule.pattern, targetPath)) {
      return rule.action;
    }
  }
  return undefined;
}
```

### 4. Add Permission Pattern Rules Tests
**File**: `src/permission/next.test.ts`
**Priority**: high
**Type**: feature
**Reason**: Comprehensive test coverage for the new pattern rules functionality.

**New code**:
```typescript
import { describe, it, expect } from "vitest";
import { matchesPattern, evaluatePatternRules } from "./next";

describe("matchesPattern", () => {
  it("matches exact paths", () => {
    expect(matchesPattern("src/file.ts", "src/file.ts")).toBe(true);
    expect(matchesPattern("src/file.ts", "src/other.ts")).toBe(false);
  });

  it("matches single wildcard patterns", () => {
    expect(matchesPattern("*.md", "README.md")).toBe(true);
    expect(matchesPattern("*.md", "src/README.md")).toBe(false);
    expect(matchesPattern("src/*.ts", "src/index.ts")).toBe(true);
  });

  it("matches globstar patterns", () => {
    expect(matchesPattern("src/**/*.ts", "src/deep/nested/file.ts")).toBe(true);
    expect(matchesPattern("**/*.md", "any/path/file.md")).toBe(true);
  });

  it("handles universal wildcard", () => {
    expect(matchesPattern("*", "anything")).toBe(true);
  });
});

describe("evaluatePatternRules", () => {
  it("returns first matching rule action", () => {
    const rules = [
      { pattern: "*.secret", action: "deny" as const },
      { pattern: "*.md", action: "allow" as const },
      { pattern: "*", action: "deny" as const },
    ];
    
    expect(evaluatePatternRules(rules, "config.secret")).toBe("deny");
    expect(evaluatePatternRules(rules, "README.md")).toBe("allow");
    expect(evaluatePatternRules(rules, "other.txt")).toBe("deny");
  });

  it("returns undefined when no rules match", () => {
    const rules = [{ pattern: "*.md", action: "allow" as const }];
    expect(evaluatePatternRules(rules, "file.ts")).toBeUndefined();
  });
});
```

### 5. Enhance Bash Tool UTF-8 Multi-byte Stream Decoding
**File**: `src/tool/bash.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fixed UTF-8 multi-byte character corruption in bash output by using StringDecoder per stream. This prevents garbled output when commands emit multi-byte characters split across chunks.

**Current code** (if modifying):
```typescript
// Assuming current implementation uses direct buffer concatenation
const stdout: Buffer[] = [];
const stderr: Buffer[] = [];

process.stdout.on("data", (chunk) => {
  stdout.push(chunk);
});
```

**New code**:
```typescript
import { StringDecoder } from "string_decoder";

// Use separate StringDecoder per stream to prevent cross-pipe corruption
const stdoutDecoder = new StringDecoder("utf8");
const stderrDecoder = new StringDecoder("utf8");
let stdoutContent = "";
let stderrContent = "";

process.stdout.on("data", (chunk: Buffer) => {
  stdoutContent += stdoutDecoder.write(chunk);
});

process.stderr.on("data", (chunk: Buffer) => {
  stderrContent += stderrDecoder.write(chunk);
});

// Flush decoders at EOF to surface trailing buffered bytes
process.on("close", () => {
  stdoutContent += stdoutDecoder.end();
  stderrContent += stderrDecoder.end();
});
```

### 6. Process Carriage Returns in Bash Tool Output for Windows
**File**: `src/tool/bash.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Windows commands often emit `\r\n` line endings. Processing carriage returns ensures consistent output formatting across platforms.

**New code** (add to output processing):
```typescript
/**
 * Processes carriage returns in command output.
 * Handles Windows-style line endings and progress indicators that use \r.
 */
function processCarriageReturns(output: string): string {
  // Split by lines, handling both \r\n and \n
  const lines = output.split(/\r?\n/);
  
  return lines.map(line => {
    // Handle carriage returns within a line (progress indicators)
    if (line.includes("\r")) {
      const parts = line.split("\r");
      // Return the last part (most recent overwrite)
      return parts[parts.length - 1];
    }
    return line;
  }).join("\n");
}

// Apply in output processing
const processedStdout = processCarriageReturns(stdoutContent);
const processedStderr = processCarriageReturns(stderrContent);
```

### 7. Add windowsHide to Spawn Calls
**File**: `src/tool/bash.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Prevents CMD window flash on Windows when spawning processes.

**Current code** (if modifying):
```typescript
const process = spawn(command, args, {
  cwd: workingDirectory,
  env: environment,
});
```

**New code**:
```typescript
const process = spawn(command, args, {
  cwd: workingDirectory,
  env: environment,
  windowsHide: true, // Prevent CMD window flash on Windows
});
```

### 8. Update Bash Tool Prompt Text
**File**: `src/tool/bash.txt.ts`
**Priority**: low
**Type**: refactor
**Reason**: Minor text update in bash tool documentation/prompt.

**Current code** (if modifying):
```typescript
export const BASH_PROMPT = `Execute shell commands...`;
```

**New code**:
```typescript
export const BASH_PROMPT = `Execute shell commands in the user's environment...`;
```

### 9. Fix Batch Tool Plan Exit Handling
**File**: `src/tool/batch.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Disallow plan_exit from batch tool execution to prevent premature session termination during batch operations.

**Current code** (if modifying):
```typescript
async function executeBatch(tools: Tool[], context: Context) {
  for (const tool of tools) {
    await tool.execute(context);
  }
}
```

**New code**:
```typescript
async function executeBatch(tools: Tool[], context: Context) {
  for (const tool of tools) {
    // Disallow plan_exit from batch execution
    if (tool.name === "plan_exit") {
      throw new Error("plan_exit cannot be executed within a batch operation");
    }
    await tool.execute(context);
  }
}
```

### 10. Update Tool Registry Type Consistency
**File**: `src/tool/registry.ts`
**Priority**: low
**Type**: refactor
**Reason**: Minor type consistency update to align with upstream patterns.

**Current code** (if modifying):
```typescript
export type ToolName = string;
```

**New code**:
```typescript
export type ToolName = string & { readonly brand: unique symbol };

export function createToolName(name: string): ToolName {
  return name as ToolName;
}
```

### 11. Add Glossary Directory Migration Support
**File**: `src/agent/translator.ts` (if exists) or `src/config/paths.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Glossary files moved from `.opencode/agent/glossary/` to `.opencode/glossary/`. Update path references.

**New code**:
```typescript
/**
 * Returns the path to locale-specific glossary file.
 * Checks new location first, falls back to legacy location.
 */
export function getGlossaryPath(locale: string): string {
  const newPath = path.join(".opencode", "glossary", `${locale}.md`);
  const legacyPath = path.join(".opencode", "agent", "glossary", `${locale}.md`);
  
  // Check new location first
  if (fs.existsSync(newPath)) {
    return newPath;
  }
  
  // Fall back to legacy location
  if (fs.existsSync(legacyPath)) {
    return legacyPath;
  }
  
  return newPath; // Return new path even if doesn't exist (for creation)
}
```

### 12. Add Agent Test Coverage for Permission Behavior
**File**: `src/agent/index.test.ts`
**Priority**: medium
**Type**: feature
**Reason**: Upstream added tests verifying ask mode correctly denies specific-path edits. Add equivalent tests.

**New code**:
```typescript
import { describe, it, expect } from "vitest";
import { Agent } from "./index";

describe("Agent permissions", () => {
  describe("ask mode", () => {
    it("denies specific-path edit in ask mode", async () => {
      const agent = Agent.create({
        name: "test",
        mode: "ask",
      });
      
      const permission = agent.checkPermission("edit", "src/file.ts");
      expect(permission).toBe("deny");
    });

    it("allows read operations in ask mode", async () => {
      const agent = Agent.create({
        name: "test", 
        mode: "ask",
      });
      
      const permission = agent.checkPermission("read", "src/file.ts");
      expect(permission).toBe("allow");
    });

    it("respects user permission config for edit tools", async () => {
      const agent = Agent.create({
        name: "test",
        mode: "ask",
        userPermissions: {
          edit: {
            "*.md": "allow",
          },
        },
      });
      
      // User allowed *.md but ask mode's deny+allowlist should win
      const permission = agent.checkPermission("edit", "README.md");
      expect(permission).toBe("deny");
    });
  });
});
```

## Testing Recommendations
1. **Permission System Tests**
   - Run all permission-related tests after implementing pattern rules
   - Verify ask mode correctly denies edits while allowing reads
   - Test backward compatibility with `.opencode` paths

2. **Bash Tool Tests**
   - Test UTF-8 multi-byte character handling (e.g., emoji, CJK characters)
   - Test Windows carriage return processing
   - Verify no CMD window flash on Windows

3. **Integration Tests**
   - Test full agent workflow with new permission merge order
   - Verify SAP AI Core integration still works correctly
   - Test batch operations don't allow plan_exit

4. **Cross-Platform Tests**
   - Run bash tool tests on Windows, macOS, and Linux
   - Verify path handling works with both `/` and `\` separators

## Potential Risks
1. **Permission Merge Order Change** - The change to merge user permissions before ask-specific permissions could affect existing workflows that rely on the previous behavior. Thoroughly test all agent modes.

2. **Directory Migration** - The `.opencode` to `.kilo` migration affects path resolution. Ensure backward compatibility is maintained for existing projects.

3. **StringDecoder Usage** - The UTF-8 decoding change requires Node.js's `string_decoder` module. Verify this is available in all deployment environments.

4. **SAP AI Core Compatibility** - None of these changes directly affect SAP integration, but verify that permission changes don't inadvertently block SAP-specific operations.
{"prompt_tokens":86789,"completion_tokens":3965,"total_tokens":90754}

[Session: 033e9cdb-f338-4a24-be3e-ab1ba067f4c7]
[Messages: 2, Tokens: 90754]

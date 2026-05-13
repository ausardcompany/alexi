# Update Plan for Alexi

Generated: 2026-05-13
Based on upstream commits: 174d467a4, edf91229a, b04e1a113, 628166403, 5b61045de, 3ca9941bb, 80edeee58, af902eb35, e498c02f7, f449375e0, b539c6920, 710c9dca1

## Summary
- Total changes planned: 6
- Critical: 1 | High: 2 | Medium: 2 | Low: 1

## Changes

### 1. Windows-resilient mkdir with EEXIST handling
**File**: `src/core/filesystem.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: On Windows with NTFS reparse points (OneDrive), directory junctions, or WSL-served paths, `fs.mkdir` with `recursive: true` can throw EEXIST even though it should be idempotent. This causes failures in directory creation operations on Windows environments, which may include SAP development setups.

**Current code** (if exists, typical pattern):
```typescript
import * as fs from "fs/promises"
import { Effect, FileSystem } from "effect"

export async function ensureDir(path: string): Promise<void> {
  await fs.mkdir(path, { recursive: true })
}
```

**New code**:
```typescript
import * as fs from "fs/promises"
import { Effect } from "effect"

/**
 * Checks if an error is an EEXIST error (directory already exists)
 * Windows with NTFS reparse points can throw EEXIST even with recursive: true
 * 
 * References:
 *   https://github.com/Kilo-Org/kilocode/issues/9618
 *   https://github.com/Kilo-Org/kilocode/issues/9755
 */
function isEexist(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as NodeJS.ErrnoException).code === "EEXIST"
  )
}

/**
 * Windows-resilient mkdir -p implementation.
 * Catches EEXIST errors that can occur on Windows with OneDrive,
 * directory junctions, or WSL-served paths.
 */
export async function mkdirSafe(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (err: unknown) {
    if (isEexist(err)) return
    throw err
  }
}

export async function ensureDir(path: string): Promise<void> {
  await mkdirSafe(path)
}

// If using Effect-based filesystem:
export const ensureDirEffect = Effect.fn("FileSystem.ensureDir")(function* (path: string) {
  yield* Effect.tryPromise({
    try: () => mkdirSafe(path),
    catch: (cause) => new FileSystemError({ method: "ensureDir", cause }),
  })
})
```

---

### 2. Add mode field to QuestionOption schema
**File**: `src/tool/question.ts`
**Priority**: high
**Type**: feature
**Reason**: The QuestionOption schema now includes an optional `mode` field that allows pre-selecting an agent/mode in the UI when a specific option is picked. This enables smoother UX transitions, particularly for plan follow-up "Continue here" options.

**Current code** (if exists):
```typescript
export interface QuestionOption {
  label: string
  value: string
  description?: string
  i18nKey?: string
}

export const QuestionOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  description: z.string().optional(),
  i18nKey: z.string().optional(),
})
```

**New code**:
```typescript
export interface QuestionOption {
  label: string
  value: string
  description?: string
  i18nKey?: string
  /** Optional agent/mode name to pre-select in the UI when this option is picked */
  mode?: string
}

export const QuestionOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  description: z.string().optional(),
  i18nKey: z.string().optional(),
  mode: z.string().optional().describe(
    "Optional agent/mode name to pre-select in the UI when this option is picked"
  ),
})
```

---

### 3. Update tool parameters snapshot for QuestionOption
**File**: `src/tool/__snapshots__/parameters.test.ts.snap` (or equivalent test snapshot)
**Priority**: high
**Type**: feature
**Reason**: Test snapshots must be updated to include the new `mode` field in QuestionOption to ensure schema validation tests pass.

**New code** (add to QuestionOption properties in snapshot):
```typescript
// In the QuestionOption schema snapshot, add:
"mode": {
  "description": "Optional agent/mode name to pre-select in the UI when this option is picked",
  "type": "string",
},
```

---

### 4. Add escapeJson parameter to substitute function for raw content handling
**File**: `src/config/variable.ts`
**Priority**: medium
**Type**: feature
**Reason**: The `substitute` function needs an `escapeJson` parameter to handle raw content properly when substituting variables into JSON contexts. This prevents JSON parsing errors when content contains special characters.

**Current code** (if exists):
```typescript
export function substitute(
  template: string,
  variables: Record<string, string>
): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }
  return result
}
```

**New code**:
```typescript
/**
 * Escapes a string for safe inclusion in JSON
 */
function escapeJsonString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}

/**
 * Substitutes variables in a template string
 * @param template - Template string with {variable} placeholders
 * @param variables - Key-value pairs to substitute
 * @param options - Substitution options
 * @param options.escapeJson - If true, escape values for JSON contexts
 */
export function substitute(
  template: string,
  variables: Record<string, string>,
  options: { escapeJson?: boolean } = {}
): string {
  const { escapeJson = false } = options
  
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    const processedValue = escapeJson ? escapeJsonString(value) : value
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), processedValue)
  }
  return result
}
```

---

### 5. Add {file:...} syntax support for agent markdown prompts
**File**: `src/config/markdown.ts`
**Priority**: medium
**Type**: feature
**Reason**: Support `{file:path/to/file.md}` syntax in agent markdown prompts to include external file content. This enables modular prompt composition and reuse.

**Current code** (if exists):
```typescript
export function processMarkdownPrompt(content: string): string {
  return content
}
```

**New code**:
```typescript
import * as fs from "fs/promises"
import * as path from "path"

/**
 * Regex to match {file:path} syntax in markdown
 */
const FILE_INCLUDE_REGEX = /\{file:([^}]+)\}/g

/**
 * Resolves file includes in markdown content
 * Supports {file:path/to/file.md} syntax for including external files
 * 
 * @param content - Markdown content with potential file includes
 * @param basePath - Base path for resolving relative file paths
 * @returns Processed content with file includes resolved
 */
export async function processMarkdownPrompt(
  content: string,
  basePath: string = process.cwd()
): Promise<string> {
  const matches = content.matchAll(FILE_INCLUDE_REGEX)
  let result = content
  
  for (const match of matches) {
    const [fullMatch, filePath] = match
    const resolvedPath = path.resolve(basePath, filePath.trim())
    
    try {
      const fileContent = await fs.readFile(resolvedPath, 'utf-8')
      result = result.replace(fullMatch, fileContent)
    } catch (error) {
      console.warn(`Failed to include file: ${resolvedPath}`, error)
      // Keep the original placeholder if file cannot be read
    }
  }
  
  return result
}

/**
 * Synchronous version for contexts where async is not available
 */
export function processMarkdownPromptSync(
  content: string,
  basePath: string = process.cwd()
): string {
  const fsSync = require("fs")
  const matches = content.matchAll(FILE_INCLUDE_REGEX)
  let result = content
  
  for (const match of matches) {
    const [fullMatch, filePath] = match
    const resolvedPath = path.resolve(basePath, filePath.trim())
    
    try {
      const fileContent = fsSync.readFileSync(resolvedPath, 'utf-8')
      result = result.replace(fullMatch, fileContent)
    } catch (error) {
      console.warn(`Failed to include file: ${resolvedPath}`, error)
    }
  }
  
  return result
}
```

---

### 6. Exclude local state on agent-manager startup
**File**: `src/agent/manager.ts`
**Priority**: low
**Type**: bugfix
**Reason**: Agent manager should exclude local state during startup to prevent stale state from affecting fresh sessions. This ensures clean initialization.

**Current code** (if exists):
```typescript
export class AgentManager {
  private state: AgentState = {}
  
  async initialize(): Promise<void> {
    this.state = await this.loadState()
    // ... rest of initialization
  }
}
```

**New code**:
```typescript
export class AgentManager {
  private state: AgentState = {}
  
  async initialize(options: { excludeLocalState?: boolean } = {}): Promise<void> {
    const { excludeLocalState = false } = options
    
    if (excludeLocalState) {
      // Start with fresh state, excluding any persisted local state
      this.state = this.getDefaultState()
    } else {
      this.state = await this.loadState()
    }
    
    // ... rest of initialization
  }
  
  private getDefaultState(): AgentState {
    return {
      // Default initial state without any local persistence
    }
  }
}
```

---

## Testing Recommendations

1. **Windows filesystem tests**: Test `mkdirSafe` function on Windows with:
   - OneDrive-synced directories
   - Directory junctions/symlinks
   - WSL-mounted paths
   - Rapid sequential mkdir calls to the same path

2. **QuestionOption schema tests**: 
   - Verify `mode` field is optional and accepts string values
   - Test that existing code without `mode` field still works
   - Update snapshot tests to include new field

3. **Variable substitution tests**:
   - Test `escapeJson: true` with content containing quotes, newlines, backslashes
   - Verify backward compatibility when `escapeJson` is not provided

4. **Markdown file include tests**:
   - Test valid file includes
   - Test missing file handling (graceful degradation)
   - Test nested file includes
   - Test relative and absolute paths

5. **Agent manager tests**:
   - Test initialization with `excludeLocalState: true`
   - Verify state is clean after exclusion
   - Test backward compatibility when option not provided

## Potential Risks

1. **Windows-specific behavior**: The `mkdirSafe` fix specifically targets Windows edge cases. Ensure it doesn't affect Linux/macOS behavior. The implementation is safe as it only catches EEXIST which is always acceptable for mkdir -p semantics.

2. **Schema changes**: Adding `mode` to QuestionOption is additive and backward compatible, but any code that strictly validates against the old schema may need updates.

3. **File include security**: The `{file:...}` syntax could potentially be used to read sensitive files. Consider:
   - Restricting to relative paths only
   - Implementing an allowlist of directories
   - Sanitizing paths to prevent directory traversal attacks

4. **SAP AI Core compatibility**: None of these changes directly affect SAP AI Core integration. The filesystem changes may improve reliability on Windows-based SAP development environments.
{"prompt_tokens":4918,"completion_tokens":3224,"total_tokens":8142}

[Session: 560e65e8-0e5a-446d-a171-7ed2aa20096f]
[Messages: 2, Tokens: 8142]

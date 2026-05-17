# Update Plan for Alexi

Generated: 2026-05-17
Based on upstream commits: kilocode a23fe160d..8de6c2ea8 (77 commits), opencode 53e89f9..202cc86 (66 commits)

## Summary
- Total changes planned: 18
- Critical: 1 | High: 5 | Medium: 9 | Low: 3

## Changes

### 1. Update Semantic Search Tool Description
**File**: `src/tool/semantic-search.txt.ts`
**Priority**: high
**Type**: feature
**Reason**: The semantic search tool description has been completely rewritten to provide clearer guidance on when to use it vs other tools, with better examples and constraints.

**Current code**:
```typescript
export const semanticSearchDescription = `- Find code snippets most relevant to the search query using semantic search.
- Returns matching content with file paths, line ranges, and relevance scores.
- Searches based on meaning rather than exact text matches.
- By default searches entire workspace, with capability to filter by path.

Usage Notes:
- Use this tool any time you start exploring a new area of the codebase. This tool will help discover all areas of the codebase related to the query, even if they do not match an exact symbol name.
- Queries MUST be in English (translate if needed).
- Prefer the Grep tool if you know the exact symbol name to search for and do not need semantic context.

Example Queries:
- "User login and password hashing"
- "database connection pooling"`
```

**New code**:
```typescript
export const semanticSearchDescription = `Find code snippets by semantic meaning and return ranked matches with file paths and line ranges.

## When to use

- Explore an unfamiliar code area before you know exact identifiers
- Find related implementations of a concept or behavior across the workspace
- Search by intent such as authentication, caching, or session resume logic
- Narrow a large codebase before following up with \`Read\` or \`Grep\`
- Limit semantic search to one subdirectory with \`path\`

## When NOT to use

- Search for an exact symbol or regex pattern — use \`Grep\`
- Find files by filename or extension — use \`Glob\`
- Read the contents of a known file — use \`Read\`
- Explore files outside the current workspace - use \`Grep\`, \`Glob\`, and \`Read\`

## Examples

- "User login and password hashing" → search for auth-related code by meaning
- "Database connection pooling" → find conceptually similar implementations
- "Session resume flow" → retrieve snippets involved in restoring session state
- "Tool approval UI" with \`path: "packages/opencode/src"\` → combine a natural-language query with \`path\`

## Constraints

- Write the query in English.
- Use \`path\` only for subdirectories inside the current workspace.`
```

### 2. Add Semantic Search Hint to Grep/Glob Tools
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: When semantic search is enabled, grep and glob tools should include a hint directing users to use semantic search for open-ended searches.

**Current code**:
```typescript
export namespace ToolRegistry {
  export function getBuiltinTools(config: Config): Tool.Def[] {
    return [
      tool.invalid,
      tool.bash,
      tool.read,
      tool.glob,
      tool.grep,
      tool.edit,
      tool.write,
      tool.task,
      tool.fetch,
      tool.todo,
      tool.search,
      tool.skill,
      tool.patch,
      tool.plan,
      ...getExtraTools(config),
    ]
  }
}
```

**New code**:
```typescript
export namespace ToolRegistry {
  const semanticSearchHint =
    "- When you are doing an open-ended search where you do not know the exact symbol name, use the `semantic_search` tool first to narrow down the search scope, then follow up with `Grep` and/or `Read`"

  export function describe(tools: Tool.Def[], extra: { semantic?: Tool.Def }): Tool.Def[] {
    if (!extra.semantic) return tools
    return tools.map((tool) => {
      if (tool.id !== "glob" && tool.id !== "grep") return tool
      return { ...tool, description: `${tool.description}\n${semanticSearchHint}` }
    })
  }

  export function getBuiltinTools(config: Config): Tool.Def[] {
    const semanticTool = config.experimental?.semanticSearch ? tool.semanticSearch : undefined
    
    const baseTools = [
      tool.invalid,
      tool.bash,
      tool.read,
      tool.glob,
      tool.grep,
      tool.edit,
      tool.write,
      tool.task,
      tool.fetch,
      tool.todo,
      tool.search,
      tool.skill,
      tool.patch,
      tool.plan,
      ...getExtraTools(config),
    ]
    
    return describe(baseTools, { semantic: semanticTool })
  }
}
```

### 3. Remove Semantic Search Hint from Grep Tool Description
**File**: `src/tool/grep.txt.ts`
**Priority**: medium
**Type**: refactor
**Reason**: The semantic search hint is now dynamically added via the registry when semantic search is enabled, so it should be removed from the static description to avoid duplication.

**Current code**:
```typescript
export const grepDescription = `- Search for a pattern in files using ripgrep
- Returns file paths and line numbers with at least one match sorted by modification time
- Use this tool when you need to find files containing specific patterns
- If you need to identify/count the number of matches within files, use the Bash tool with \`rg\` (ripgrep) directly. Do NOT use \`grep\`.
- When you are doing an open-ended search where you do not know the exact symbol name, use the SemanticSearch tool instead
- When you are doing a deep search that may require multiple tool invocations, use the Task tool instead`
```

**New code**:
```typescript
export const grepDescription = `- Search for a pattern in files using ripgrep
- Returns file paths and line numbers with at least one match sorted by modification time
- Use this tool when you need to find files containing specific patterns
- If you need to identify/count the number of matches within files, use the Bash tool with \`rg\` (ripgrep) directly. Do NOT use \`grep\`.
- When you are doing a deep search that may require multiple tool invocations, use the Task tool instead`
```

### 4. Update Read Tool with Byte Cap Fix
**File**: `src/tool/read.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Fix read stream byte cap handling to prevent truncation issues.

**Current code**:
```typescript
export async function readFile(
  filePath: string,
  options?: { maxBytes?: number }
): Promise<string> {
  const maxBytes = options?.maxBytes ?? DEFAULT_MAX_BYTES
  const content = await fs.readFile(filePath, "utf-8")
  if (content.length > maxBytes) {
    return content.slice(0, maxBytes) + "\n... (truncated)"
  }
  return content
}
```

**New code**:
```typescript
export async function readFile(
  filePath: string,
  options?: { maxBytes?: number }
): Promise<string> {
  const maxBytes = options?.maxBytes ?? DEFAULT_MAX_BYTES
  
  // Use stream-based reading for proper byte handling
  const stats = await fs.stat(filePath)
  if (stats.size <= maxBytes) {
    return await fs.readFile(filePath, "utf-8")
  }
  
  // Read only up to maxBytes using a stream
  const stream = createReadStream(filePath, { 
    encoding: "utf-8",
    highWaterMark: maxBytes,
    end: maxBytes - 1
  })
  
  let content = ""
  for await (const chunk of stream) {
    content += chunk
    if (Buffer.byteLength(content, "utf-8") >= maxBytes) {
      break
    }
  }
  
  // Ensure we don't cut in the middle of a multi-byte character
  const byteLength = Buffer.byteLength(content, "utf-8")
  if (byteLength > maxBytes) {
    const buffer = Buffer.from(content, "utf-8")
    content = buffer.subarray(0, maxBytes).toString("utf-8")
  }
  
  return content + "\n... (truncated)"
}
```

### 5. Reduce Shell Tool Prompt Size
**File**: `src/tool/shell.txt.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Shell tool prompt has been significantly reduced to decrease token usage while maintaining essential guidance.

**Current code**:
```typescript
export const shellDescription = `Execute shell commands in the user's environment.

## Guidelines

- Use for file operations, running scripts, installing packages
- Prefer built-in tools when available (Read, Write, Grep)
- Always use absolute paths
- Handle errors gracefully
- Use non-interactive flags (-y, --yes, etc.)
- Avoid commands that require user input
- Use ripgrep (rg) instead of grep for searching
- Timeout: commands have a default timeout

## Common Patterns

### File Operations
- List files: ls -la /path
- Find files: find /path -name "pattern"
- Copy: cp -r source dest

### Package Management
- npm: npm install --save package
- pip: pip install package
- apt: apt-get install -y package

### Git Operations
- Status: git status
- Diff: git diff
- Log: git log --oneline -n 10

## Security

- Never execute commands from untrusted sources
- Avoid rm -rf without confirmation
- Don't expose secrets in command arguments`
```

**New code**:
```typescript
export const shellDescription = `Execute shell commands in the user's environment.

## Guidelines

- Use for file operations, running scripts, installing packages
- Prefer built-in tools when available (Read, Write, Grep)
- Always use absolute paths
- Use non-interactive flags (-y, --yes)
- Use ripgrep (rg) instead of grep

## Security

- Never execute commands from untrusted sources
- Avoid rm -rf without confirmation
- Don't expose secrets in command arguments`
```

### 6. Reduce Task Tool Prompt Size
**File**: `src/tool/task.txt.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Task tool prompt has been significantly reduced to decrease token usage.

**Current code**:
```typescript
export const taskDescription = `Create a subtask to handle complex operations that require multiple steps.

## When to Use

- Complex file refactoring across multiple files
- Multi-step operations requiring coordination
- Operations that benefit from isolated context
- Deep searches requiring multiple tool invocations

## Guidelines

- Provide clear, specific instructions
- Include all necessary context
- Define expected outcomes
- Break down into logical steps

## Examples

### Code Refactoring
"Refactor the authentication module:
1. Extract common logic into shared utilities
2. Update all consumers to use new utilities
3. Add comprehensive tests"

### Feature Implementation
"Implement user profile feature:
1. Create database schema
2. Add API endpoints
3. Create UI components
4. Add validation and error handling"

## Best Practices

- Keep subtasks focused and atomic
- Provide sufficient context
- Define clear success criteria
- Consider dependencies between subtasks`
```

**New code**:
```typescript
export const taskDescription = `Create a subtask to handle complex operations that require multiple steps.

## When to Use

- Complex file refactoring across multiple files
- Multi-step operations requiring coordination
- Deep searches requiring multiple tool invocations

## Guidelines

- Provide clear, specific instructions
- Include all necessary context
- Define expected outcomes`
```

### 7. Reduce TodoWrite Tool Prompt Size
**File**: `src/tool/todowrite.txt.ts`
**Priority**: medium
**Type**: refactor
**Reason**: TodoWrite tool prompt has been significantly reduced from ~167 lines to ~44 lines to decrease token usage.

**Current code**:
```typescript
export const todoWriteDescription = `Create or update TODO items for tracking work.

## Format

TODOs are stored in a structured format with:
- ID: Unique identifier
- Title: Brief description
- Status: pending | in_progress | completed
- Priority: low | medium | high | critical
- Description: Detailed information
- Tags: Categorization labels

## Operations

### Create TODO
{
  "action": "create",
  "title": "Implement feature X",
  "priority": "high",
  "description": "Detailed requirements...",
  "tags": ["feature", "backend"]
}

### Update TODO
{
  "action": "update",
  "id": "todo-123",
  "status": "in_progress"
}

### Complete TODO
{
  "action": "complete",
  "id": "todo-123"
}

### Delete TODO
{
  "action": "delete",
  "id": "todo-123"
}

## Guidelines

- Use clear, actionable titles
- Set appropriate priorities
- Include relevant context in descriptions
- Use consistent tags for categorization
- Update status as work progresses
- Complete or delete TODOs when done

## Best Practices

### Good Titles
✓ "Fix authentication timeout in login flow"
✓ "Add unit tests for UserService"
✗ "Fix bug"
✗ "TODO"

### Priority Guidelines
- critical: Blocking issues, security vulnerabilities
- high: Important features, significant bugs
- medium: Regular tasks, minor improvements
- low: Nice-to-have, cosmetic changes

## Integration

TODOs integrate with:
- Task tool for complex operations
- Session context for tracking progress
- Export for external tool compatibility`
```

**New code**:
```typescript
export const todoWriteDescription = `Create or update TODO items for tracking work.

## Format

TODOs have: ID, Title, Status (pending|in_progress|completed), Priority (low|medium|high|critical), Description, Tags

## Operations

### Create
{ "action": "create", "title": "...", "priority": "high", "description": "...", "tags": [...] }

### Update
{ "action": "update", "id": "...", "status": "in_progress" }

### Complete
{ "action": "complete", "id": "..." }

### Delete
{ "action": "delete", "id": "..." }

## Guidelines

- Use clear, actionable titles
- Set appropriate priorities
- Update status as work progresses`
```

### 8. Update Task Tool to Hide Background Instructions
**File**: `src/tool/task.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Task background instructions should be hidden by default to reduce noise in output.

**Current code**:
```typescript
export interface TaskOptions {
  instructions: string
  context?: string
}

export async function executeTask(options: TaskOptions): Promise<TaskResult> {
  const { instructions, context } = options
  
  // Execute task with full instructions visible
  return await runSubtask({
    instructions,
    context,
    showInstructions: true
  })
}
```

**New code**:
```typescript
export interface TaskOptions {
  instructions: string
  context?: string
  showBackgroundInstructions?: boolean
}

export async function executeTask(options: TaskOptions): Promise<TaskResult> {
  const { instructions, context, showBackgroundInstructions = false } = options
  
  // Execute task with background instructions hidden by default
  return await runSubtask({
    instructions,
    context,
    showInstructions: showBackgroundInstructions
  })
}
```

### 9. Add Warpgrep Improvements
**File**: `src/tool/warpgrep.ts`
**Priority**: low
**Type**: feature
**Reason**: Minor improvements to warpgrep tool configuration.

**Current code**:
```typescript
export const warpgrepConfig: WarpgrepConfig = {
  maxResults: 100,
  timeout: 30000,
}
```

**New code**:
```typescript
export const warpgrepConfig: WarpgrepConfig = {
  maxResults: 100,
  timeout: 30000,
  // Enable streaming results for large codebases
  streaming: true,
  // Respect .gitignore by default
  respectGitignore: true,
}
```

### 10. Update Repo Overview Tool Instance State Reading
**File
{"prompt_tokens":17661,"completion_tokens":4096,"total_tokens":21757}

[Session: 1df4418c-dde3-4fe3-8230-33157ee8078f]
[Messages: 2, Tokens: 21757]

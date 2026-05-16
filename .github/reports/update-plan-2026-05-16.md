# Update Plan for Alexi

Generated: 2026-05-16
Based on upstream commits: f44d75d9d, 7e06c68e8, deddacf06, 863ca97ab, c1a797c1f, and related changes from kilocode

## Summary
- Total changes planned: 6
- Critical: 0 | High: 3 | Medium: 2 | Low: 1

## Changes

### 1. Add Semantic Search Hint to Tool Registry
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: Kilocode added a `describe()` function that appends semantic search guidance to `glob` and `grep` tools when semantic search is enabled. This helps guide the AI to use semantic search for open-ended queries before falling back to exact pattern matching.

**New code** (add to existing registry module):
```typescript
export namespace ToolRegistry {
  // ... existing code ...

  const SEMANTIC_SEARCH_HINT =
    "- When you are doing an open-ended search where you do not know the exact symbol name, use the `semantic_search` tool first to narrow down the search scope, then follow up with `Grep` and/or `Read`"

  /**
   * Augment tool descriptions with semantic search hints when semantic search is available.
   * @param tools - Array of tool definitions to potentially augment
   * @param extra - Object containing optional semantic search tool definition
   * @returns Tool definitions with augmented descriptions where applicable
   */
  export function describe(tools: Tool.Def[], extra: { semantic?: Tool.Def }): Tool.Def[] {
    if (!extra.semantic) return tools
    return tools.map((tool) => {
      if (tool.id !== "glob" && tool.id !== "grep") return tool
      return { ...tool, description: `${tool.description}\n${SEMANTIC_SEARCH_HINT}` }
    })
  }
}
```

### 2. Update Semantic Search Tool Description
**File**: `src/tool/semantic-search.txt.ts` (or equivalent tool definition file)
**Priority**: high
**Type**: feature
**Reason**: The semantic search tool description was significantly improved with clearer usage guidance, explicit "when to use" and "when NOT to use" sections, and better examples. This helps the AI make better decisions about when to use semantic search vs other tools.

**Current code**:
```typescript
const SEMANTIC_SEARCH_DESCRIPTION = `- Find code snippets most relevant to the search query using semantic search.
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
const SEMANTIC_SEARCH_DESCRIPTION = `Find code snippets by semantic meaning and return ranked matches with file paths and line ranges.

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

### 3. Remove Redundant Semantic Search Hint from Grep Tool
**File**: `src/tool/grep.txt.ts` (or equivalent tool definition file)
**Priority**: high
**Type**: refactor
**Reason**: The semantic search hint was removed from the grep tool's static description because it's now dynamically added via the `describe()` function only when semantic search is actually enabled. This prevents confusion when semantic search is not available.

**Current code**:
```typescript
const GREP_DESCRIPTION = `- Fast content search using ripgrep
- Searches file contents using regular expressions (Rust regex syntax)
- Supports full regex syntax (e.g., "log.*Error", "function\\s+\\w+")
- Filter files by pattern with the include parameter (e.g., "*.ts" for TypeScript files)
- Returns file paths and line numbers with at least one match sorted by modification time
- Use this tool when you need to find files containing specific patterns
- If you need to identify/count the number of matches within files, use the Bash tool with \`rg\` (ripgrep) directly. Do NOT use \`grep\`.
- When you are doing an open-ended search where you do not know the exact symbol name, use the SemanticSearch tool instead
- When you are doing a deep search that may require multiple tool invocations, use the Task tool instead`
```

**New code**:
```typescript
const GREP_DESCRIPTION = `- Fast content search using ripgrep
- Searches file contents using regular expressions (Rust regex syntax)
- Supports full regex syntax (e.g., "log.*Error", "function\\s+\\w+")
- Filter files by pattern with the include parameter (e.g., "*.ts" for TypeScript files)
- Returns file paths and line numbers with at least one match sorted by modification time
- Use this tool when you need to find files containing specific patterns
- If you need to identify/count the number of matches within files, use the Bash tool with \`rg\` (ripgrep) directly. Do NOT use \`grep\`.
- When you are doing a deep search that may require multiple tool invocations, use the Task tool instead`
```

### 4. Add Codebase Search Usage Tracking
**File**: `src/tool/warpgrep.ts`
**Priority**: medium
**Type**: feature
**Reason**: Kilocode added tracking for codebase search usage. This helps with analytics and understanding tool usage patterns.

**New code** (add to warpgrep tool execution):
```typescript
import { Telemetry } from "../telemetry"

// Inside the warpgrep tool execution function, after successful search:
export async function executeWarpgrep(params: WarpgrepParams): Promise<WarpgrepResult> {
  // ... existing search logic ...
  
  const result = await performSearch(params)
  
  // Track codebase search usage
  Telemetry.track("codebase_search", {
    tool: "warpgrep",
    query_length: params.query?.length ?? 0,
    results_count: result.matches?.length ?? 0,
    path_filter: !!params.path,
  })
  
  return result
}
```

### 5. Implement Chunked Compaction for Large Contexts
**File**: `src/core/session/compaction.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Kilocode added chunked compaction handling for oversized contexts. This prevents failures when compacting very large conversation histories that exceed API limits.

**New code** (create new file or add to existing compaction module):
```typescript
// src/core/session/compaction-chunks.ts

export namespace CompactionChunks {
  const MAX_CHUNK_SIZE = 100000 // Approximate token limit per chunk
  
  export interface ChunkResult {
    chunks: string[]
    totalSize: number
  }
  
  /**
   * Split large content into manageable chunks for compaction.
   * Ensures each chunk stays within API limits while preserving context boundaries.
   */
  export function splitForCompaction(content: string, maxSize: number = MAX_CHUNK_SIZE): ChunkResult {
    if (content.length <= maxSize) {
      return { chunks: [content], totalSize: content.length }
    }
    
    const chunks: string[] = []
    let remaining = content
    
    while (remaining.length > 0) {
      if (remaining.length <= maxSize) {
        chunks.push(remaining)
        break
      }
      
      // Find a good break point (newline, paragraph, or sentence)
      let breakPoint = maxSize
      const newlinePos = remaining.lastIndexOf('\n', maxSize)
      if (newlinePos > maxSize * 0.5) {
        breakPoint = newlinePos + 1
      }
      
      chunks.push(remaining.slice(0, breakPoint))
      remaining = remaining.slice(breakPoint)
    }
    
    return { chunks, totalSize: content.length }
  }
  
  /**
   * Compact content in chunks and merge results.
   */
  export async function compactInChunks(
    content: string,
    compactFn: (chunk: string) => Promise<string>,
    maxSize?: number
  ): Promise<string> {
    const { chunks } = splitForCompaction(content, maxSize)
    
    if (chunks.length === 1) {
      return compactFn(chunks[0])
    }
    
    const compactedChunks = await Promise.all(chunks.map(compactFn))
    return compactedChunks.join('\n\n---\n\n')
  }
}
```

**Update existing compaction.ts**:
```typescript
import { CompactionChunks } from "./compaction-chunks"

// In the main compaction function:
export async function compactSession(session: Session): Promise<CompactionResult> {
  const content = serializeSessionHistory(session)
  
  // Use chunked compaction for large contexts
  const compacted = await CompactionChunks.compactInChunks(
    content,
    async (chunk) => {
      return await llmCompact(chunk, session.config)
    }
  )
  
  return { compacted, originalSize: content.length }
}
```

### 6. Update Agent Documentation for Upstream Merge Guidance
**File**: `src/agent/upstream-merge.md` (or equivalent agent configuration)
**Priority**: low
**Type**: documentation
**Reason**: Added explicit guidance to NOT use the `kilocode-merge-minimizer` skill during upstream merges, as it provides incorrect guidance for merge resolution scenarios.

**New code** (add to agent instructions):
```markdown
# Upstream Merge Agent

Resolve the manual part of an upstream merge.

**Do not load the `kilocode-merge-minimizer` skill.** That skill is for
authoring new Kilo changes against shared upstream files; during an upstream
merge it gives the wrong guidance (it nudges toward extracting Kilo logic out
of conflict regions, which is exactly the opposite of what merge resolution
needs). Follow the rules in this agent file instead.

The user will provide the upstream version (for example `v1.1.50` or `1.1.50`)
in their first message. If they don't, infer it from the current branch name,
from `upstream-merge-report-<version>.md`, or from the newest relevant report
file in the repository.

<!-- rest of existing agent instructions -->
```

## Testing Recommendations

1. **Tool Registry Tests**:
   - Verify `describe()` function correctly adds hints only to `glob` and `grep` tools
   - Verify hints are NOT added when semantic search tool is undefined
   - Test that other tools remain unmodified

2. **Semantic Search Tests**:
   - Validate new description is properly formatted
   - Test that path filtering still works correctly
   - Verify English-only constraint is documented

3. **Grep Tool Tests**:
   - Confirm grep still works without semantic search hint in base description
   - Verify hint is added dynamically when semantic search is enabled

4. **Compaction Chunk Tests**:
   - Test with content smaller than max size (single chunk)
   - Test with content exactly at max size
   - Test with very large content requiring multiple chunks
   - Verify chunk boundaries respect newlines when possible
   - Test async compaction with multiple chunks

5. **Integration Tests**:
   - End-to-end test of tool selection with semantic search enabled
   - Verify SAP AI Core integration remains functional
   - Test session compaction with large conversation histories

## Potential Risks

1. **Tool Description Changes**: The updated semantic search description is significantly longer. Ensure this doesn't cause token limit issues when tools are included in prompts.

2. **Dynamic Hint Injection**: The `describe()` function modifies tool definitions at runtime. Ensure this doesn't cause issues with tool caching or registration.

3. **Compaction Chunking**: The chunked compaction approach may produce slightly different results than single-pass compaction. Test thoroughly to ensure context quality is maintained.

4. **SAP AI Core Compatibility**: All changes should be tested against SAP AI Core to ensure no regressions in the provider integration.

5. **Telemetry Data**: The new tracking for codebase search usage should comply with any data privacy requirements for SAP deployments.
{"prompt_tokens":15573,"completion_tokens":3371,"total_tokens":18944}

[Session: 13049ad5-3751-4e26-82c0-1b5b65ac515c]
[Messages: 2, Tokens: 18944]

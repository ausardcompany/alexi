[2026-03-19T07:02:47.464Z] [32mINFO[39m     (context): Found a service key in environment variable "AICORE_SERVICE_KEY". Using a service key is recommended for local testing only. Bind the AI Core service to the application for productive usage.
# Update Plan for Alexi

Generated: 2026-03-19
Based on upstream commits: f5529601, f1d7e08f, be9b4d1b, and related changes from kilocode

## Summary
- Total changes planned: 5
- Critical: 1 | High: 2 | Medium: 2 | Low: 0

## Changes

### 1. Preserve Original Line Endings in Edit Tool
**File**: `src/tool/edit.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: The edit tool currently normalizes all line endings which can corrupt files on Windows systems that use CRLF. This fix detects the original line ending style and preserves it when writing changes back.

**Current code**:
```typescript
function normalizeLineEndings(text: string): string {
  return text.replaceAll("\r\n", "\n")
}

// In the execute function:
if (stats.isDirectory()) throw new Error(`Path is a directory, not a file: ${filePath}`)
await FileTime.assert(ctx.sessionID, filePath)
contentOld = await Filesystem.readText(filePath)
contentNew = replace(contentOld, params.oldString, params.newString, params.replaceAll)
```

**New code**:
```typescript
function normalizeLineEndings(text: string): string {
  return text.replaceAll("\r\n", "\n")
}

function detectLineEnding(text: string): "\n" | "\r\n" {
  return text.includes("\r\n") ? "\r\n" : "\n"
}

function convertToLineEnding(text: string, ending: "\n" | "\r\n"): string {
  if (ending === "\n") return text
  return text.replaceAll("\n", "\r\n")
}

// In the execute function:
if (stats.isDirectory()) throw new Error(`Path is a directory, not a file: ${filePath}`)
await FileTime.assert(ctx.sessionID, filePath)
contentOld = await Filesystem.readText(filePath)

const ending = detectLineEnding(contentOld)
const old = convertToLineEnding(normalizeLineEndings(params.oldString), ending)
const next = convertToLineEnding(normalizeLineEndings(params.newString), ending)

contentNew = replace(contentOld, old, next, params.replaceAll)
```

---

### 2. Save Permissions Without Disposing Config Instances
**File**: `src/permission/next.ts`
**Priority**: high
**Type**: bugfix
**Reason**: When saving permission rules to global config, the current implementation disposes config instances which can cause issues if other parts of the system are still using them. Adding `{ dispose: false }` option prevents premature disposal.

**Current code**:
```typescript
// In the approval handler:
s.approved.push(...newRules)

if (newRules.length > 0) {
  await Config.updateGlobal({ permission: toConfig(newRules) })
}

// In the "always allow" handler:
if (alwaysRules.length > 0) {
  await Config.updateGlobal({ permission: toConfig(alwaysRules) })
}
```

**New code**:
```typescript
// In the approval handler:
s.approved.push(...newRules)

if (newRules.length > 0) {
  await Config.updateGlobal({ permission: toConfig(newRules) }, { dispose: false })
}

// In the "always allow" handler:
if (alwaysRules.length > 0) {
  await Config.updateGlobal({ permission: toConfig(alwaysRules) }, { dispose: false })
}
```

---

### 3. Add Config.updateGlobal dispose Option Support
**File**: `src/config/config.ts`
**Priority**: high
**Type**: feature
**Reason**: Support the `dispose` option in `Config.updateGlobal` to allow callers to control whether config instances should be disposed after update.

**Current code** (if exists):
```typescript
export async function updateGlobal(updates: Partial<ConfigSchema>): Promise<void> {
  // existing implementation
  // ...
  // likely disposes instances at the end
}
```

**New code**:
```typescript
export interface UpdateGlobalOptions {
  dispose?: boolean
}

export async function updateGlobal(
  updates: Partial<ConfigSchema>,
  options: UpdateGlobalOptions = {}
): Promise<void> {
  const { dispose = true } = options
  
  // existing implementation for updating config
  // ...
  
  // Only dispose if explicitly requested (default behavior preserved)
  if (dispose) {
    // existing disposal logic
  }
}
```

---

### 4. Skip Non-File URIs in Import Definitions Service
**File**: `src/core/autocomplete/ImportDefinitionsService.ts` (if applicable)
**Priority**: medium
**Type**: bugfix
**Reason**: VS Code virtual documents (like `output:tasks`, `vscode:`, `untitled:`) don't have parseable source code and should be skipped to prevent errors.

**Current code**:
```typescript
async getDefinitions(filepath: string) {
  if (!filepath) {
    return null
  }

  const parser = await getParserForFile(filepath)
  // ...
}
```

**New code**:
```typescript
async getDefinitions(filepath: string) {
  if (!filepath) {
    return null
  }

  // Skip non-file URIs (e.g. output:tasks, vscode:, untitled:) — these are
  // VS Code virtual documents that have no parseable source.
  if (/^[a-zA-Z][\w+.-]*:/.test(filepath) && !filepath.startsWith("file:") && !filepath.startsWith("/")) {
    return null
  }

  const parser = await getParserForFile(filepath)
  // ...
}
```

---

### 5. Add Null Check for Tree-Sitter Parser
**File**: `src/core/util/treeSitter.ts` (if applicable)
**Priority**: medium
**Type**: bugfix
**Reason**: Add defensive null check when dynamically importing the Parser to handle cases where WASM loading fails silently.

**Current code**:
```typescript
export async function getParserForFile(filepath: string) {
  try {
    // Dynamically import Parser to avoid issues with WASM loading
    const { Parser } = require("web-tree-sitter")

    await Parser.init()
    const parser = new Parser()
    // ...
  }
}
```

**New code**:
```typescript
export async function getParserForFile(filepath: string) {
  try {
    // Dynamically import Parser to avoid issues with WASM loading
    const { Parser } = require("web-tree-sitter")
    if (!Parser) {
      return undefined
    }

    await Parser.init()
    const parser = new Parser()
    // ...
  }
}
```

---

## Testing Recommendations

1. **Edit Tool Line Endings Test**:
   - Create a test file with CRLF line endings on Windows
   - Run an edit operation that modifies content
   - Verify the file still has CRLF line endings after edit
   - Create a test file with LF line endings
   - Run an edit operation and verify LF is preserved

2. **Permission Save Test**:
   - Save a permission rule
   - Verify the config instance is still usable after save
   - Test that subsequent operations don't fail due to disposed instances

3. **Non-File URI Test**:
   - If autocomplete functionality exists, test with various URI schemes
   - Verify no errors are thrown for `output:`, `vscode:`, `untitled:` URIs

4. **Tree-Sitter Parser Test**:
   - Test parser initialization with missing WASM files
   - Verify graceful fallback when Parser is undefined

## Potential Risks

1. **Config.updateGlobal API Change**: Adding the options parameter is backward compatible, but any code that extends or mocks this function will need updates.

2. **Line Ending Detection Edge Cases**: Files with mixed line endings (both CRLF and LF) will be detected as CRLF. This matches the upstream behavior but may not handle all edge cases perfectly.

3. **SAP AI Core Compatibility**: These changes are infrastructure-level and should not affect SAP AI Core integration, but verify that any config-related changes don't interfere with SAP-specific configuration loading.
{"prompt_tokens":21550,"completion_tokens":2089,"total_tokens":23639}

[Session: d128ae58-3926-42a1-97ce-0e4d6bea3e92]
[Messages: 2, Tokens: 23639]

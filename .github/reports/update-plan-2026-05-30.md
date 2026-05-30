```markdown
# Update Plan for Alexi

Generated: 2026-06-01
Based on upstream commits: cf9b7ea42..ad908e283 for kilocode, 710ed7c..04c4611 for opencode

## Summary
- Total changes planned: 7
- Critical: 2 | High: 3 | Medium: 2 | Low: 0

## Changes

### 1. Update Agent Manager Tool
**File**: `src/tool/agent-manager.ts`
**Priority**: high
**Type**: feature
**Reason**: Incorporate new feature that utilizes `kilo_local_recall` for context from completed sessions.

**New code**:
```typescript
// Import necessary modules
import { kiloLocalRecall } from 'kilocode/tool';

// New feature implementation
function useKiloLocalRecall(sessionId: string) {
  // Use the kilo_local_recall feature
}
```

### 2. Add Notebook File Support
**File**: `src/tool/notebook.ts`
**Priority**: critical
**Type**: feature
**Reason**: Support reading Jupyter notebook files (.ipynb) as part of the tool system.

**New code**:
```typescript
import * as path from "path";
import { Readable } from "stream";
import * as Encoding from "../encoding";

export function isFile(filepath: string) {
  return path.extname(filepath).toLowerCase() === ".ipynb";
}

export async function open(filepath: string): Promise<Readable> {
  const raw = (await Encoding.read(filepath)).text;
  // parsing logic
}
```

### 3. Enhance DOCX Text Extraction
**File**: `src/tool/read-docx.ts`
**Priority**: critical
**Type**: feature
**Reason**: Add support for reading text from DOCX files, including error handling.

**New code**:
```typescript
import mammoth from "mammoth";
import * as path from "path";
import { Readable } from "stream";

export function accepts(filepath: string) {
  return path.extname(filepath).toLowerCase() === ".docx";
}

export async function open(filepath: string) {
  const result = await mammoth.extractRawText({ path: filepath });
  // Handle extraction and warnings
}
```

### 4. Update Permission Handling
**File**: `src/permission/allow-everything.ts`
**Priority**: high
**Type**: refactor
**Reason**: Use new session and permission interfaces to improve reliability and maintainability.

**Current code**:
```typescript
// Promise-based session permission setting
```

**New code**:
```typescript
// Use Effect-based session permission setting
const session = yield* sessions.get(id).pipe(Effect.orDie);
yield* sessions.setPermission({ /* updated logic */ });
```

### 5. Update XLSX Tool
**File**: `src/tool/xlsx.ts`
**Priority**: medium
**Type**: feature
**Reason**: Align with upstream support for XLSX text extraction.

**New code**:
```typescript
// Add XLSX text extraction logic
```

### 6. Modify Core Package
**File**: `src/core/package.json`
**Priority**: medium
**Type**: refactor
**Reason**: Align versioning and dependency updates from upstream.

**Current code**:
```json
"version": "7.3.16",
```

**New code**:
```json
"version": "7.3.18",
```

### 7. Update Recall Tests
**File**: `src/tool/recall.test.ts`
**Priority**: high
**Type**: refactor
**Reason**: Update tests to accommodate new recall functionality.

**Current code**:
```typescript
// existing recall test cases
```

**New code**:
```typescript
// new recall test cases with additional scenarios
```

## Testing Recommendations
- Test all new file handling functionalities, especially DOCX and XLSX read capabilities.
- Ensure permission changes do not break existing permission setups.
- Validate that new features do not introduce regressions in agent management.

## Potential Risks
- Changes in permission handling could affect existing session management if not properly integrated.
- New file support features (DOCX, XLSX, notebook) need thorough testing to prevent runtime errors.
```

{"prompt_tokens":18383,"completion_tokens":924,"total_tokens":19307}

[Session: fcd3f333-b571-4fbc-ae06-132c1ef787c2]
[Messages: 2, Tokens: 19307]

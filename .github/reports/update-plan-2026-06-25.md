```markdown
# Update Plan for Alexi

Generated: 2026-06-25
Based on upstream commits: [761b6339a, 3063fde72, cacb7d0, f55d8fa]

## Summary
- Total changes planned: 3
- Critical: 1 | High: 1 | Medium: 1 | Low: 0

## Changes

### 1. Implement Linux Sandbox Tests
**File**: `src/core/test/linux-sandbox.test.ts`
**Priority**: critical
**Type**: feature
**Reason**: To ensure compatibility with Linux systems and test sandbox functionalities effectively. This aligns Alexi with upstream changes that focus on Linux sandbox testing.

**New code**:
```typescript
import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
// ... additional imports

const linux = process.platform === "linux" ? test : test.skip;

function profile(
  allow: ReadonlyArray<string>,
  denyNames: ReadonlyArray<string> = [],
  mode: Profile["network"]["mode"] = "allow",
): Profile {
  return {
    filesystem: {
      allowWrite: allow.map((path) => ({ path, kind: "subtree" })),
      denyWrite: [],
      denyNames,
    },
    network: { mode, allowedHosts: [] },
    environment: { deny: [], set: {} },
  };
}

// ... further implementation
```

### 2. Enhance Autocomplete Service for Notebooks
**File**: `src/core/services/autocomplete/notebook.ts`
**Priority**: high
**Type**: feature
**Reason**: To extend the functionality of Alexi's autocomplete service, improving user experience when working with notebook documents.

**New code**:
```typescript
import * as vscode from "vscode";

export interface NotebookContext {
  contents: string;
  filepath: string;
  position: vscode.Position;
}

const resolutions = new WeakMap<vscode.Uri, NotebookResolution>();

function resolveNotebook(uri: vscode.Uri): NotebookResolution | undefined {
  const cached = resolutions.get(uri);
  // ... logic to resolve notebook
}

// ... further implementation
```

### 3. Remove Redundant Referral Backfill Script
**File**: `src/core/script/referral-backfill.ts`
**Priority**: medium
**Type**: refactor
**Reason**: To remove obsolete scripts and improve maintainability of the codebase. This script is no longer needed as indicated by upstream changes.

**Current code** (if modifying):
```typescript
// Entire content of referral-backfill.ts
```

**New code**:
```typescript
// File removed
```

## Testing Recommendations
- Verify Linux sandbox functionalities on Alexi's testing environment.
- Ensure autocomplete features in notebook environments work as expected.
- Check that the removal of referral-backfill.ts does not affect existing functionality.

## Potential Risks
- Changes to sandbox testing may expose untested areas; thorough testing is required.
- Autocomplete enhancements should be verified for performance impacts.
- Removal of scripts could inadvertently affect workflows if dependencies exist.
```

{"prompt_tokens":22161,"completion_tokens":650,"total_tokens":22811}

[Session: 712f5a81-2432-4962-a5c5-5cb563318436]
[Messages: 2, Tokens: 22811]

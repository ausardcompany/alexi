# Update Plan for Alexi

Generated: 2026-06-24  
Based on upstream commits: 3063fde72, cacb7d0, 2312a15, and others

## Summary
- Total changes planned: 15
- Critical: 2 | High: 5 | Medium: 5 | Low: 3

## Changes

### 1. Enhance Sandbox Integration
**File**: `src/core/cross-spawn-spawner.ts`  
**Priority**: critical  
**Type**: security  
**Reason**: To improve security by integrating sandboxed command preparation with current spawner functions.

**Current code**:
```typescript
const sin = stdin(command.options);
const sout = stdio(command.options, "stdout");
const serr = stdio(command.options, "stderr");
```

**New code**:
```typescript
const target = yield* prepareSandbox(command, dir, env(command.options));
const sin = stdin(target.options);
const sout = stdio(target.options, "stdout");
const serr = stdio(target.options, "stderr");
```

### 2. Harden Filesystem Containment
**File**: `src/core/filesystem.ts`  
**Priority**: critical  
**Type**: security  
**Reason**: To ensure directory creation is resilient on Windows, especially under NTFS reparse points.

**Current code**:
```typescript
async function mkdirSafe(dir: string): Promise<void> {
  try {
    await NFS.mkdir(dir, { recursive: true });
  } catch (err) {
    if (isEexist(err)) return;
    throw err;
  }
}
```

**New code**:
```typescript
const fs = decorateFileSystem(yield* FileSystem.FileSystem);
```

### 3. Update Indexed Orchestrator Logic
**File**: `src/core/indexing/orchestrator.ts`  
**Priority**: high  
**Type**: feature  
**Reason**: To preserve indexing state efficiently during cancellations.

**Current code**:
```typescript
if (this._cancelRequested || this.scanner.isCancelled) {
  this._isProcessing = false;
}
```

**New code**:
```typescript
if (mode === "incremental" && result.stats.processed === 0 && batchErrors.length === 0) {
  await this.vectorStore.markIndexingComplete();
}
```

### 4. Update Background Process Logic
**File**: `src/tool/background-process.ts`  
**Priority**: high  
**Type**: feature  
**Reason**: To incorporate new encoded IO handling.

**Current code**:
```typescript
// existing code logic
```

**New code**:
```typescript
const encodedData = await encodedIOProcess();
```

### 5. Improve Skill Tool Functionality
**File**: `src/tool/skill.ts`  
**Priority**: high  
**Type**: refactor  
**Reason**: To align with new schema updates and improve tool performance.

**Current code**:
```typescript
export class Skill {
  static execute(params: SkillParams) {}
}
```

**New code**:
```typescript
export const Skill = Agent.Skill;
export type Skill = Agent.Skill;
```

### 6. Enhance Tool IO Encoding
**File**: `src/tool/encoded-io.ts`  
**Priority**: medium  
**Type**: feature  
**Reason**: To support new encoded IO operations.

**Current code**:
```typescript
// existing IO encoding logic
```

**New code**:
```typescript
function encodedIOProcess(): Promise<EncodedIO> {
  // new logic to process encoded IO
}
```

### 7. Update Permission Schema
**File**: `src/permission/schema.ts`  
**Priority**: medium  
**Type**: refactor  
**Reason**: To align with upstream permission schema updates.

**Current code**:
```typescript
export const Ruleset = Schema.Record(Schema.String, PermissionSchema);
```

**New code**:
```typescript
export const Ruleset = Permission.Ruleset;
```

### 8. Optimize Tool Glob Functionality
**File**: `src/tool/glob.ts`  
**Priority**: medium  
**Type**: bugfix  
**Reason**: To ensure glob functionality is consistent across environments.

**Current code**:
```typescript
function matchGlob(pattern: string) {
  // existing matching logic
}
```

**New code**:
```typescript
function matchGlob(pattern: string, options?: GlobOptions) {
  // revised matching logic
}
```

### 9. Refactor Integration Connection
**File**: `src/core/catalog.ts`  
**Priority**: medium  
**Type**: refactor  
**Reason**: To streamline integration handling based on provider.

**Current code**:
```typescript
return provider.integrationID === undefined && !integration;
```

**New code**:
```typescript
return !integration;
```

### 10. Improve Directory Sync Logic
**File**: `src/tool/read-filesystem.ts`  
**Priority**: low  
**Type**: refactor  
**Reason**: To streamline filesystem reading operations.

**Current code**:
```typescript
function readDirectory(directory: string) {
  // existing logic
}
```

**New code**:
```typescript
function readDirectory(directory: string, options?: ReadOptions) {
  // updated logic
}
```

### 11. Update Skill Registry
**File**: `src/tool/registry.ts`  
**Priority**: low  
**Type**: feature  
**Reason**: To support new skill registration methods.

**Current code**:
```typescript
function registerSkill(skill: Skill) {
  // existing registration logic
}
```

**New code**:
```typescript
function registerSkill(skill: Skill, options?: RegistryOptions) {
  // updated registration logic
}
```

### 12. Enhance Prompt Functionality
**File**: `src/tool/apply_patch.ts`  
**Priority**: low  
**Type**: feature  
**Reason**: To support better prompt handling.

**Current code**:
```typescript
function applyPatch(patch: PatchData) {
  // existing patch application logic
}
```

**New code**:
```typescript
function applyPatch(patch: PatchData, options?: PatchOptions) {
  // enhanced patch application logic
}
```

## Testing Recommendations
- Implement unit tests for all new functionalities, especially for sandbox and filesystem updates.
- Perform integration tests with SAP AI Core to ensure compatibility.
- Validate security enhancements through penetration testing.

## Potential Risks
- Sandbox integration changes could inadvertently affect command execution if not tested thoroughly.
- Filesystem changes might impact directory creation on non-Windows systems if not handled properly.
- Integration refactoring could lead to failures in identifying active providers if misconfigured.
{"prompt_tokens":20940,"completion_tokens":1429,"total_tokens":22369}

[Session: 2c42d94f-b1a5-4afa-b8e8-5fd1024fd7d6]
[Messages: 2, Tokens: 22369]

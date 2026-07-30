```markdown
# Update Plan for Alexi

Generated: 2026-07-30
Based on upstream commits: 3b8bd23e1, 1b134cef7, f720490, 341c64c, 1e17856

## Summary
- Total changes planned: 5
- Critical: 1 | High: 2 | Medium: 1 | Low: 1

## Changes

### 1. Update core package version
**File**: `src/core/package.json`
**Priority**: critical
**Type**: version update
**Reason**: Ensure compatibility with latest upstream changes and dependencies

**Current code**:
```json
{
  "$schema": "https://json.schemastore.org/package.json",
  "version": "7.4.16",
  "name": "@alexi-ai/core",
  "type": "module",
  "license": "MIT",
}
```

**New code**:
```json
{
  "$schema": "https://json.schemastore.org/package.json",
  "version": "7.4.17",
  "name": "@alexi-ai/core",
  "type": "module",
  "license": "MIT",
}
```

### 2. Add public fetch compatibility flag in console
**File**: `src/cli/console.ts`
**Priority**: high
**Type**: feature
**Reason**: Enhance compatibility with public fetch API for broader deployment options

**Current code**:
```typescript
// existing functions
```

**New code**:
```typescript
const compatibilityFlag = true;

// use compatibilityFlag in relevant functions
```

### 3. Bump gitlab-ai-provider version
**File**: `src/providers/gitlab-ai-provider.ts`
**Priority**: high
**Type**: dependency update
**Reason**: Integrate latest provider updates for improved performance and bug fixes

**Current code**:
```typescript
const providerVersion = '6.12.0';
```

**New code**:
```typescript
const providerVersion = '6.12.1';
```

### 4. Discover Modal models
**File**: `src/providers/modal/models.ts`
**Priority**: medium
**Type**: feature
**Reason**: Introduce new modal models for enhanced AI functionalities

**New code**:
```typescript
export const discoverModalModels = (): ModalModel[] => {
  // logic to discover and return modal models
};
```

### 5. Update nix node_modules hashes
**File**: `infra/nix/hashes.json`
**Priority**: low
**Type**: chore
**Reason**: Maintain consistency in package management and build system

**Current code**:
```json
{
  "hashes": {
    // current hashes
  }
}
```

**New code**:
```json
{
  "hashes": {
    // updated hashes
  }
}
```

## Testing Recommendations
- Verify compatibility with SAP AI Core integration for core updates.
- Test the console with public fetch API to ensure flag is working correctly.
- Validate functionality of gitlab-ai-provider after version bump.
- Run unit tests for modal models discovery.
- Confirm build integrity with updated nix hashes.

## Potential Risks
- Version updates might introduce compatibility issues with existing integrations.
- New features could impact existing workflows; thorough testing is required.
- Dependency updates may require additional configuration changes.
```
{"prompt_tokens":7492,"completion_tokens":720,"total_tokens":8212,"cache_read_input_tokens":0}

[Session: b1e76bed-f156-43ae-87cd-7f11a40286a3]
[Messages: 2, Tokens: 8212]

# Testing Plan for Update Changes

## Overview
This document outlines the testing strategy for the changes implemented from the upstream update plan.

## Unit Tests Required

### 1. Permission Drain Tests
**File**: `tests/permission/drain.test.ts`

```typescript
describe('PermissionDrain', () => {
  it('should add and remove permission requests', () => {
    // Test addRequest and removeRequest
  });

  it('should drain stale requests after threshold', () => {
    // Test drainStale with requests older than 5 minutes
  });

  it('should not drain recent requests', () => {
    // Test that recent requests are preserved
  });

  it('should start and stop drain loop', () => {
    // Test startDrainLoop and stopDrainLoop
  });
});
```

### 2. Bash Tool Security Tests
**File**: `tests/tool/tools/bash.test.ts`

```typescript
describe('Bash Tool Security', () => {
  it('should deny semicolon operator', () => {
    // Test command with semicolon is rejected
  });

  it('should deny pipe operator', () => {
    // Test command with pipe is rejected
  });

  it('should deny redirect operators', () => {
    // Test >, >>, <, << are rejected
  });

  it('should deny command substitution', () => {
    // Test $() and backticks are rejected
  });

  it('should allow safe commands', () => {
    // Test normal commands work
  });
});
```

### 3. Agent Manager Tool Tests
**File**: `tests/tool/tools/agent-manager.test.ts`

```typescript
describe('Agent Manager Tool', () => {
  it('should create new session', () => {
    // Test create action
  });

  it('should list sessions', () => {
    // Test list action
  });

  it('should stop session', () => {
    // Test stop action with sessionId
  });

  it('should get session status', () => {
    // Test status action
  });

  it('should require sessionId for stop/status', () => {
    // Test validation
  });
});
```

### 4. Apply Patch Tool Tests
**File**: `tests/tool/tools/apply-patch.test.ts`

```typescript
describe('Apply Patch Tool', () => {
  it('should apply simple patch', () => {
    // Test basic patch application
  });

  it('should preserve file encoding', () => {
    // Test UTF-16 file encoding is preserved
  });

  it('should preserve BOM', () => {
    // Test BOM is maintained
  });

  it('should generate diff', () => {
    // Test diff output
  });

  it('should handle patch errors gracefully', () => {
    // Test error handling
  });
});
```

### 5. External Directory Permission Tests
**File**: `tests/permission/external-directory.test.ts`

```typescript
describe('External Directory Permission', () => {
  it('should allow read in allowed directory', () => {
    // Test read permission granted
  });

  it('should deny write in readonly directory', () => {
    // Test write permission denied
  });

  it('should deny access outside directory', () => {
    // Test path outside allowed directory
  });

  it('should normalize paths correctly', () => {
    // Test path normalization
  });

  it('should evaluate multiple configs', () => {
    // Test evaluateMultiple
  });
});
```

### 6. Tool Registry Indexing Tests
**File**: `tests/tool/registry.test.ts`

```typescript
describe('Tool Registry Indexing', () => {
  it('should initialize without indexing tools', () => {
    // Test core tools load first
  });

  it('should load indexing tools asynchronously', () => {
    // Test initializeIndexingAsync
  });

  it('should continue on indexing failure', () => {
    // Test non-fatal indexing errors
  });

  it('should report indexing ready status', () => {
    // Test isIndexingReady
  });
});
```

### 7. Agent Config Tests
**File**: `tests/agent/config.test.ts`

```typescript
describe('Agent Config', () => {
  it('should handle null steps', () => {
    // Test null steps value
  });

  it('should distinguish null from undefined', () => {
    // Test null vs undefined handling
  });

  it('should merge configs correctly', () => {
    // Test mergeAgentConfig
  });

  it('should get effective steps', () => {
    // Test getEffectiveSteps with defaults
  });
});
```

### 8. Truncation Config Tests
**File**: `tests/tool/truncate.test.ts`

```typescript
describe('Truncator', () => {
  it('should truncate by default limit', () => {
    // Test default truncation
  });

  it('should use per-tool limits', () => {
    // Test tool-specific limits
  });

  it('should truncate context', () => {
    // Test context truncation
  });

  it('should update config', () => {
    // Test updateConfig
  });

  it('should not truncate short content', () => {
    // Test content within limits
  });
});
```

### 9. Read Tool Streaming Tests
**File**: `tests/tool/tools/read.test.ts` (additions)

```typescript
describe('Read Tool Streaming', () => {
  it('should read file with streaming', () => {
    // Test readFileStreaming function
  });

  it('should handle UTF-8 correctly', () => {
    // Test UTF-8 encoding with streaming
  });

  it('should handle large files', () => {
    // Test streaming with large files
  });
});
```

## Integration Tests

### Security Integration
- Test bash tool rejects all dangerous operators in real scenarios
- Test permission system integrates with external directory permissions
- Test permission drain works with actual permission requests

### Tool Integration
- Test agent manager integrates with agent system
- Test apply patch works with edit workflow
- Test read tool streaming works with large codebases

### Performance Tests
- Test permission drain doesn't impact performance
- Test tool truncation doesn't slow down responses
- Test indexing isolation doesn't delay startup

## Manual Testing Checklist

### Bash Tool Security
- [ ] Try to execute `ls; rm -rf /tmp/test`
- [ ] Try to execute `cat file.txt | grep pattern`
- [ ] Try to execute `echo test > output.txt`
- [ ] Try to execute `$(malicious command)`
- [ ] Verify safe commands like `npm install` work

### Permission System
- [ ] Set up external directory permission
- [ ] Try to read from allowed directory
- [ ] Try to write to readonly directory
- [ ] Try to access outside allowed directory
- [ ] Check stale permissions are cleaned up after 5 minutes

### Agent Manager
- [ ] Create a new agent session
- [ ] List all sessions
- [ ] Stop a session
- [ ] Get session status
- [ ] Verify error handling for missing sessionId

### Apply Patch
- [ ] Apply patch to UTF-8 file
- [ ] Apply patch to UTF-16 file
- [ ] Verify encoding is preserved
- [ ] Check diff output is correct
- [ ] Test with invalid patch

### Truncation
- [ ] Configure custom truncation limits
- [ ] Verify per-tool limits work
- [ ] Check context truncation
- [ ] Test with very large outputs

## Regression Testing

### Existing Functionality
- [ ] All existing tools still work
- [ ] Permission system still functions
- [ ] Agent switching still works
- [ ] File operations maintain encoding
- [ ] Tool registry loads correctly

### SAP AI Core Compatibility
- [ ] Orchestration API calls still work
- [ ] Model routing unchanged
- [ ] Provider integration intact
- [ ] Session management works

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage for new code
- **Integration Tests**: Cover all major workflows
- **Security Tests**: 100% coverage of security features
- **Regression Tests**: All existing tests pass

## Continuous Integration

### Pre-commit Checks
- Run linter on changed files
- Run type checker
- Run unit tests for changed modules

### CI Pipeline
- Run full test suite
- Check code coverage
- Run security audit
- Build and verify artifacts

## Known Limitations

1. **Bash Tool**: Some legitimate use cases with pipes may be blocked
2. **Apply Patch**: Complex patches may need manual review
3. **Permission Drain**: 5-minute threshold may be too long/short for some cases
4. **Indexing Isolation**: Semantic search may not be available immediately

## Future Test Improvements

1. Add property-based testing for patch application
2. Add fuzzing for bash command validation
3. Add performance benchmarks for truncation
4. Add stress tests for permission drain
5. Add integration tests with real SAP AI Core instances

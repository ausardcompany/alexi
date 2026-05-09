# Migration Guide - Upstream Updates

## Overview

This guide helps you understand the changes from the upstream update and how they may affect your workflows.

## Breaking Changes

### Bash Tool Security Restrictions

**What Changed**: The bash tool now denies certain shell operators for security reasons.

**Denied Operators**:
- `;` - Command chaining
- `&&` - Logical AND
- `||` - Logical OR
- `|` - Pipe
- `>`, `>>` - Output redirection
- `<`, `<<` - Input redirection
- `` ` `` - Command substitution (backticks)
- `$()` - Command substitution

**Migration Strategy**:

Before (will now fail):
```bash
cd src && npm install
ls -la | grep .ts
echo "test" > output.txt
```

After (use separate commands):
```bash
# Use workdir parameter instead of cd
npm install  # with workdir: "src"

# Use grep tool instead of pipe
ls -la  # then use grep tool on output

# Use write tool instead of redirect
echo "test"  # then use write tool to save
```

**Why**: Prevents shell injection attacks and improves security.

## New Features

### 1. Agent Manager Tool

**What**: New tool for managing multiple agent sessions.

**Usage**:
```typescript
// Create session
agentManagerTool.execute({
  action: 'create',
  config: { mode: 'code', model: 'gpt-4' }
});

// List sessions
agentManagerTool.execute({ action: 'list' });

// Stop session
agentManagerTool.execute({ 
  action: 'stop',
  sessionId: 'session-123' 
});
```

**When to Use**: For orchestrating multiple concurrent agent workflows.

### 2. Apply Patch Tool

**What**: Apply unified diff patches while preserving file encoding.

**Usage**:
```typescript
applyPatchTool.execute({
  path: '/path/to/file.txt',
  patch: `@@ -1,3 +1,3 @@
-old line
+new line`
});
```

**Benefits**:
- Preserves UTF-8, UTF-16, and other encodings
- Maintains BOM markers
- Generates diff for review

### 3. External Directory Permissions

**What**: Support for readonly external directories (Ask mode).

**Configuration**:
```typescript
import { ExternalDirectoryPermission } from './permission/external-directory';

// Allow readonly access to directories
const configs = ExternalDirectoryPermission.allowReadOnly([
  '/external/docs',
  '/external/reference'
]);

// Evaluate permission
const result = ExternalDirectoryPermission.evaluate(
  configs[0],
  '/external/docs/file.txt',
  'read'  // allowed
);
```

**Use Case**: Safe access to reference documentation without write risk.

### 4. Permission Drain

**What**: Automatic cleanup of stale permission requests.

**Behavior**:
- Permission requests older than 5 minutes are automatically cleared
- Prevents stuck approval dialogs
- Runs cleanup every minute

**Impact**: Fewer stuck permission prompts, better UX.

### 5. Configurable Truncation

**What**: Per-tool output truncation limits.

**Configuration**:
```typescript
import { setTruncatorConfig } from './tool/truncate';

setTruncatorConfig({
  defaultLimit: 10000,
  toolLimits: {
    read: 50000,    // Read tool can return more
    bash: 15000,    // Bash output more limited
  },
  contextLimit: 100000
});
```

**Benefits**: Balance between detail and context window size.

## Enhanced Features

### Read Tool Streaming

**What Changed**: Read tool now uses streaming for better UTF-8 handling.

**Impact**:
- More reliable with large files
- Better handling of multi-byte characters
- No change to API

### Tool Registry Isolation

**What Changed**: Indexing tools (like semantic search) load asynchronously.

**Impact**:
- Faster startup time
- Non-fatal indexing failures
- Semantic search may not be immediately available

**Check Availability**:
```typescript
import { getToolRegistry } from './tool';

if (getToolRegistry().isIndexingReady()) {
  // Semantic search available
}
```

### Agent Configuration

**What Changed**: Agent steps configuration now properly handles null values.

**Usage**:
```typescript
import { normalizeAgentConfig, getEffectiveSteps } from './agent/config';

const config = normalizeAgentConfig({
  steps: null,  // Use default
  enabled: true
});

const steps = getEffectiveSteps(config, 50);  // Returns 50
```

## Compatibility

### SAP AI Core

✅ **All SAP AI Core integrations remain compatible**
- Orchestration API unchanged
- Model routing unchanged
- Provider integrations unchanged

### Existing Tools

✅ **All existing tools work as before**
- read, write, edit, glob, grep - unchanged
- webfetch, websearch - unchanged
- task, question, suggest - unchanged

### Permission System

✅ **Permission system enhanced, not changed**
- Existing rules still work
- New external directory support is additive
- Stale drain is automatic, no config needed

## Upgrade Steps

1. **Review Bash Commands**
   - Audit any bash tool usage for denied operators
   - Refactor to use separate commands or other tools
   - Test critical workflows

2. **Update Dependencies** (if needed)
   ```bash
   npm install
   ```

3. **Run Type Checker**
   ```bash
   npm run typecheck
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

5. **Test Critical Workflows**
   - Test bash commands
   - Test file operations
   - Test permission system
   - Test agent switching

## Troubleshooting

### Bash Commands Failing

**Problem**: Commands with pipes or redirects fail.

**Solution**: 
- Use the appropriate tool instead (grep, write, read)
- Run commands separately
- Use workdir parameter instead of `cd &&`

### Permission Requests Disappearing

**Problem**: Permission requests vanish after 5 minutes.

**Solution**: This is expected behavior (stale drain). Respond to prompts promptly or they'll be auto-cleared.

### Semantic Search Not Available

**Problem**: Semantic search tool not found at startup.

**Solution**: Wait a few seconds for indexing to complete. Check with `isIndexingReady()`.

### Encoding Issues

**Problem**: File encoding corrupted after edit.

**Solution**: 
- Use apply-patch tool for encoding-sensitive files
- The read and write tools already preserve encoding
- Check file has proper BOM if needed

## Rollback Plan

If issues arise:

1. **Identify Problem Area**
   - Bash security restrictions?
   - Permission system?
   - Tool behavior?

2. **Temporary Workarounds**
   - Use alternative tools
   - Adjust workflows
   - Manual intervention

3. **Report Issues**
   - Document specific failures
   - Provide reproduction steps
   - Include error messages

## Getting Help

- Check test plan: `.github/reports/testing-plan.md`
- Review changes: `.github/reports/changes-summary.md`
- File issues with specific examples
- Include version information

## Future Enhancements

Planned improvements:
- Configurable bash operator whitelist
- Adjustable permission drain timeout
- Enhanced patch validation
- More granular truncation control

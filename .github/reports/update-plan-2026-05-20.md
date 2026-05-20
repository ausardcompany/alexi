# Update Plan for Alexi

Generated: 2026-05-20
Based on upstream commits: kilocode 39affcc14..4c0e6987b (61 commits), opencode 13006d6..2339aac (41 commits)

## Summary
- Total changes planned: 8
- Critical: 0 | High: 3 | Medium: 4 | Low: 1

## Changes

### 1. Enhance Tool Registry to Tolerate Plugin Tool Definitions with Missing Arguments
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream opencode fixed a bug where plugin tool definitions with missing `args` property would cause errors. This defensive coding prevents runtime crashes when loading malformed tool configurations.

**Current code** (if modifying):
```typescript
// Assuming similar structure to opencode's registry
export function registerTool(definition: ToolDefinition) {
  const args = definition.args;
  // ... validation and registration logic
}
```

**New code**:
```typescript
export function registerTool(definition: ToolDefinition) {
  // Tolerate plugin tool defs with missing args - default to empty object
  const args = definition.args ?? {};
  
  // Validate args is an object
  if (typeof args !== 'object' || args === null) {
    console.warn(`Tool ${definition.name}: invalid args, defaulting to empty object`);
  }
  
  const normalizedDefinition = {
    ...definition,
    args: typeof args === 'object' && args !== null ? args : {}
  };
  
  // ... rest of validation and registration logic
}
```

### 2. Add Tool Registry Tests for Missing Arguments Edge Case
**File**: `src/tool/registry.test.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream added comprehensive tests for the tool registry including edge cases for malformed tool definitions. These tests ensure robustness of tool loading.

**New code**:
```typescript
import { describe, it, expect } from 'vitest';
import { registerTool, getToolRegistry } from './registry';

describe('Tool Registry', () => {
  describe('registerTool', () => {
    it('should handle tool definition with missing args', () => {
      const toolDef = {
        name: 'test-tool',
        description: 'A test tool',
        // args intentionally omitted
      };
      
      expect(() => registerTool(toolDef as any)).not.toThrow();
      
      const registry = getToolRegistry();
      const registeredTool = registry.get('test-tool');
      expect(registeredTool).toBeDefined();
      expect(registeredTool?.args).toEqual({});
    });

    it('should handle tool definition with null args', () => {
      const toolDef = {
        name: 'null-args-tool',
        description: 'A tool with null args',
        args: null,
      };
      
      expect(() => registerTool(toolDef as any)).not.toThrow();
      
      const registry = getToolRegistry();
      const registeredTool = registry.get('null-args-tool');
      expect(registeredTool?.args).toEqual({});
    });

    it('should handle tool definition with undefined args', () => {
      const toolDef = {
        name: 'undefined-args-tool',
        description: 'A tool with undefined args',
        args: undefined,
      };
      
      expect(() => registerTool(toolDef)).not.toThrow();
    });
  });
});
```

### 3. Improve Config Parsing to Tolerate Invalid Permission JSON
**File**: `src/core/config.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream opencode added defensive handling for invalid `ALEXI_PERMISSION` environment variable JSON. This prevents application crashes when users provide malformed configuration.

**Current code** (if modifying):
```typescript
export function loadPermissionConfig(): PermissionConfig {
  const envValue = process.env.ALEXI_PERMISSION;
  if (envValue) {
    return JSON.parse(envValue);
  }
  return getDefaultPermissionConfig();
}
```

**New code**:
```typescript
export function loadPermissionConfig(): PermissionConfig {
  const envValue = process.env.ALEXI_PERMISSION;
  if (envValue) {
    try {
      const parsed = JSON.parse(envValue);
      if (typeof parsed !== 'object' || parsed === null) {
        console.warn('ALEXI_PERMISSION must be a JSON object, using defaults');
        return getDefaultPermissionConfig();
      }
      return validatePermissionConfig(parsed);
    } catch (error) {
      console.warn(`Invalid ALEXI_PERMISSION JSON: ${error instanceof Error ? error.message : 'unknown error'}, using defaults`);
      return getDefaultPermissionConfig();
    }
  }
  return getDefaultPermissionConfig();
}

function validatePermissionConfig(config: unknown): PermissionConfig {
  const defaults = getDefaultPermissionConfig();
  if (typeof config !== 'object' || config === null) {
    return defaults;
  }
  
  return {
    ...defaults,
    ...(config as Partial<PermissionConfig>),
  };
}
```

### 4. Fix Agent/Command Name Resolution from Relative Paths
**File**: `src/core/entry-name.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fixed an issue where agent and command names were not properly resolved from relative file paths. This ensures consistent naming when loading custom agents from various path formats.

**New code**:
```typescript
import path from 'path';

/**
 * Extracts a canonical entry name from a file path.
 * Handles both absolute and relative paths, normalizing to a consistent format.
 * 
 * @example
 * resolveEntryName('./agents/my-agent.ts') // 'my-agent'
 * resolveEntryName('/full/path/to/custom-command.ts') // 'custom-command'
 * resolveEntryName('agents/nested/deep-agent.ts') // 'deep-agent'
 */
export function resolveEntryName(filePath: string): string {
  // Normalize the path to handle different OS separators
  const normalized = path.normalize(filePath);
  
  // Get the base name without extension
  const baseName = path.basename(normalized, path.extname(normalized));
  
  // Handle index files by using parent directory name
  if (baseName === 'index') {
    const parentDir = path.dirname(normalized);
    return path.basename(parentDir);
  }
  
  return baseName;
}

/**
 * Resolves agent name from a configuration path entry.
 * Supports both string names and file path references.
 */
export function resolveAgentName(entry: string): string {
  // If it looks like a path (contains separator or extension)
  if (entry.includes(path.sep) || entry.includes('/') || path.extname(entry)) {
    return resolveEntryName(entry);
  }
  // Otherwise treat as a direct name
  return entry;
}

/**
 * Resolves command name from a configuration path entry.
 */
export function resolveCommandName(entry: string): string {
  return resolveAgentName(entry); // Same logic applies
}
```

### 5. Add Entry Name Resolution Tests
**File**: `src/core/entry-name.test.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Tests for the entry name resolution logic to ensure proper handling of various path formats.

**New code**:
```typescript
import { describe, it, expect } from 'vitest';
import { resolveEntryName, resolveAgentName, resolveCommandName } from './entry-name';

describe('Entry Name Resolution', () => {
  describe('resolveEntryName', () => {
    it('should extract name from relative path with extension', () => {
      expect(resolveEntryName('./agents/my-agent.ts')).toBe('my-agent');
    });

    it('should extract name from absolute path', () => {
      expect(resolveEntryName('/home/user/project/agents/custom.ts')).toBe('custom');
    });

    it('should handle index files by using parent directory', () => {
      expect(resolveEntryName('./agents/my-agent/index.ts')).toBe('my-agent');
    });

    it('should handle paths without extension', () => {
      expect(resolveEntryName('./agents/simple-agent')).toBe('simple-agent');
    });

    it('should handle Windows-style paths', () => {
      expect(resolveEntryName('.\\agents\\win-agent.ts')).toBe('win-agent');
    });
  });

  describe('resolveAgentName', () => {
    it('should return direct name when no path indicators', () => {
      expect(resolveAgentName('my-agent')).toBe('my-agent');
    });

    it('should resolve from path when path-like', () => {
      expect(resolveAgentName('./custom/agent.ts')).toBe('agent');
    });
  });

  describe('resolveCommandName', () => {
    it('should work identically to resolveAgentName', () => {
      expect(resolveCommandName('my-command')).toBe('my-command');
      expect(resolveCommandName('./commands/test.ts')).toBe('test');
    });
  });
});
```

### 6. Update Autocomplete Model Comment for Mercury Edit 2
**File**: `src/providers/autocomplete/templates.ts`
**Priority**: low
**Type**: refactor
**Reason**: Upstream updated documentation to reflect that Mercury Edit 2 (not Mercury Edit) is now the exposed autocomplete model alongside Codestral.

**Current code** (if modifying):
```typescript
// Fill in the middle prompts
//
// We only expose Codestral and Mercury Edit as autocomplete models — every
// other FIM template in the upstream continuedev list is unreachable.
```

**New code**:
```typescript
// Fill in the middle prompts
//
// We only expose Codestral and Mercury Edit 2 as autocomplete models — every
// other FIM template in the upstream continuedev list is unreachable.
```

### 7. Add Shell Mode Support for CLI Run Command
**File**: `src/cli/cmd/run/prompt.ts`
**Priority**: medium
**Type**: feature
**Reason**: Upstream opencode added shell mode to the run command prompt, allowing users to switch between different input modes. This enhances the CLI user experience.

**Current code** (if modifying):
```typescript
export interface PromptOptions {
  message: string;
  defaultValue?: string;
}

export async function showPrompt(options: PromptOptions): Promise<string> {
  // existing prompt implementation
}
```

**New code**:
```typescript
export type PromptMode = 'default' | 'shell' | 'multiline';

export interface PromptOptions {
  message: string;
  defaultValue?: string;
  mode?: PromptMode;
}

export interface PromptState {
  mode: PromptMode;
  input: string;
}

export function createPromptState(initialMode: PromptMode = 'default'): PromptState {
  return {
    mode: initialMode,
    input: '',
  };
}

export function toggleShellMode(state: PromptState): PromptState {
  return {
    ...state,
    mode: state.mode === 'shell' ? 'default' : 'shell',
  };
}

export async function showPrompt(options: PromptOptions): Promise<string> {
  const mode = options.mode ?? 'default';
  
  if (mode === 'shell') {
    return showShellPrompt(options);
  }
  
  // existing default prompt implementation
  return showDefaultPrompt(options);
}

async function showShellPrompt(options: PromptOptions): Promise<string> {
  // Shell mode shows a $ prefix and enables shell-specific completions
  const shellOptions = {
    ...options,
    message: `$ ${options.message}`,
    // Enable shell completion hints
  };
  
  return showDefaultPrompt(shellOptions);
}

async function showDefaultPrompt(options: PromptOptions): Promise<string> {
  // existing prompt implementation
}
```

### 8. Add Feature Flag for Native Anthropic API Key Routing
**File**: `src/core/flags.ts`
**Priority**: medium
**Type**: feature
**Reason**: Upstream opencode added the ability to route Anthropic API-key models through a native runtime, improving performance and reducing latency. This should be configurable via feature flag.

**Current code** (if modifying):
```typescript
export interface FeatureFlags {
  enableExperimentalTools: boolean;
  enableDebugLogging: boolean;
}

export const defaultFlags: FeatureFlags = {
  enableExperimentalTools: false,
  enableDebugLogging: false,
};
```

**New code**:
```typescript
export interface FeatureFlags {
  enableExperimentalTools: boolean;
  enableDebugLogging: boolean;
  /**
   * When enabled, routes Anthropic API-key authenticated models through
   * the native runtime instead of the standard provider SDK.
   * This can improve latency and reduce overhead for direct API calls.
   */
  enableNativeAnthropicRuntime: boolean;
}

export const defaultFlags: FeatureFlags = {
  enableExperimentalTools: false,
  enableDebugLogging: false,
  enableNativeAnthropicRuntime: false,
};

/**
 * Checks if native runtime should be used for a given provider.
 */
export function shouldUseNativeRuntime(
  provider: string,
  flags: FeatureFlags
): boolean {
  if (provider === 'anthropic' && flags.enableNativeAnthropicRuntime) {
    return true;
  }
  return false;
}
```

## Testing Recommendations

1. **Tool Registry Tests**
   - Run all tool registry tests to verify missing args handling
   - Test loading custom tools from various path formats
   - Verify tool registration with malformed definitions doesn't crash

2. **Config Parsing Tests**
   - Test with valid JSON in ALEXI_PERMISSION
   - Test with invalid JSON (malformed syntax)
   - Test with valid JSON but wrong type (array, string, number)
   - Verify defaults are used when parsing fails

3. **Entry Name Resolution Tests**
   - Test with various path formats (relative, absolute, Windows, Unix)
   - Test index.ts file handling
   - Test paths with and without extensions

4. **Integration Tests**
   - Verify SAP AI Core integration still works with all changes
   - Test end-to-end tool loading with custom configurations
   - Verify CLI commands work with new shell mode option

## Potential Risks

1. **Config Parsing Changes**: The more permissive config parsing could mask configuration errors that users should be aware of. Consider adding a strict mode or warning level configuration.

2. **Entry Name Resolution**: Changes to path resolution could affect existing custom agent/command configurations if they relied on specific path handling behavior. Test with existing configurations before deployment.

3. **Native Anthropic Runtime**: The feature flag is disabled by default, but when enabled, it changes the execution path for Anthropic models. Thorough testing with SAP AI Core proxy configurations is recommended before enabling.

4. **Shell Mode**: New CLI feature may have different behavior expectations across operating systems. Test on Windows, macOS, and Linux environments.
{"prompt_tokens":18239,"completion_tokens":3877,"total_tokens":22116}

[Session: 83e3f484-719f-41cb-96c7-7b1b7d1fc3f5]
[Messages: 2, Tokens: 22116]

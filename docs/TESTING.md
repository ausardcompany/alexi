# Testing Guide

This document provides comprehensive testing guidelines for Alexi, including testing strategies, test commands, coverage expectations, and best practices.

## Table of Contents

- [Testing Strategy](#testing-strategy)
- [Test Commands](#test-commands)
- [Test Coverage](#test-coverage)
- [Testing Tool System](#testing-tool-system)
- [Testing Providers](#testing-providers)
- [Testing Routing](#testing-routing)
- [Best Practices](#best-practices)

## Testing Strategy

Alexi employs a multi-layered testing strategy to ensure reliability and maintainability:

```mermaid
graph TB
    subgraph "Testing Layers"
        Unit[Unit Tests]
        Integration[Integration Tests]
        E2E[End-to-End Tests]
    end
    
    subgraph "Test Coverage Areas"
        Tools[Tool System Tests]
        Providers[Provider Tests]
        Router[Router Tests]
        Core[Core Logic Tests]
    end
    
    Unit --> Tools
    Unit --> Router
    Unit --> Core
    Integration --> Providers
    Integration --> Tools
    E2E --> Core
    
    style Unit fill:#4CAF50
    style Integration fill:#2196F3
    style E2E fill:#FF9800
```

### Testing Layers

1. **Unit Tests**: Test individual functions and modules in isolation
   - Tool implementations
   - Routing logic
   - Utility functions
   - Permission management

2. **Integration Tests**: Test interactions between components
   - Provider integrations with SAP AI Core
   - Tool execution with permission system
   - Session management with persistence

3. **End-to-End Tests**: Test complete user workflows
   - CLI command execution
   - Multi-turn conversations
   - Auto-routing decisions

## Test Commands

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Specific Test Files

```bash
# Run tool tests
npm test -- tests/tool/tools/

# Run specific test file
npm test -- tests/tool/tools/write.test.ts

# Run tests matching pattern
npm test -- --grep "write tool"
```

### Test Framework

Alexi uses **Vitest** as its testing framework, chosen for:
- Native TypeScript support
- Fast execution with ESM support
- Compatible with Node.js 22
- Built-in mocking capabilities

## Test Coverage

### Coverage Expectations

| Component | Target Coverage | Current Status |
|-----------|----------------|----------------|
| Tool System | 90%+ | ✅ Achieved |
| Core Logic | 85%+ | 🔄 In Progress |
| Providers | 80%+ | 🔄 In Progress |
| Router | 90%+ | 🔄 In Progress |
| CLI | 70%+ | 🔄 In Progress |

### Coverage Reports

Coverage reports are generated in the `coverage/` directory:

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

## Testing Tool System

The tool system has comprehensive unit tests covering file operations, permissions, and error handling.

### Tool Test Architecture

```mermaid
graph LR
    subgraph "Tool Test Setup"
        TempDir[Temporary Directory]
        Context[Tool Context]
        Mock[Permission Mock]
    end
    
    subgraph "Test Execution"
        Execute[Execute Tool]
        Verify[Verify Results]
        Cleanup[Cleanup Resources]
    end
    
    TempDir --> Context
    Mock --> Context
    Context --> Execute
    Execute --> Verify
    Verify --> Cleanup
    
    style Execute fill:#4CAF50
    style Verify fill:#2196F3
```

### Example: Testing Write Tool

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';

// Mock the tool index module to bypass permission checks
vi.mock('../../../src/tool/index.js', async () => {
  const actual = await vi.importActual('../../../src/tool/index.js');
  return {
    ...actual,
    defineTool: (def: any) => ({
      ...def,
      execute: def.execute,
      executeUnsafe: def.execute,
      toFunctionSchema: () => ({
        name: def.name,
        description: def.description,
        parameters: {},
      }),
    }),
  };
});

import { writeTool } from '../../../src/tool/tools/write.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('Write Tool', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    // Create a temporary directory for tests
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'write-tool-test-'));
    context = { workdir: tempDir };
  });

  afterEach(async () => {
    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should create a new file with content', async () => {
    const filePath = path.join(tempDir, 'new-file.txt');
    const content = 'Hello, World!';

    const result = await writeTool.execute({ filePath, content }, context);

    expect(result.success).toBe(true);
    expect(result.data?.created).toBe(true);
    expect(result.data?.path).toBe(filePath);
    expect(result.data?.bytesWritten).toBe(Buffer.byteLength(content, 'utf-8'));

    // Verify file was actually created
    const actualContent = await fs.readFile(filePath, 'utf-8');
    expect(actualContent).toBe(content);
  });
});
```

### Tool Test Coverage

All file operation tools have comprehensive test coverage:

| Tool | Test File | Test Cases |
|------|-----------|------------|
| `read` | `tests/tool/tools/read.test.ts` | 20+ cases |
| `write` | `tests/tool/tools/write.test.ts` | 18+ cases |
| `edit` | `tests/tool/tools/edit.test.ts` | 15+ cases |
| `glob` | `tests/tool/tools/glob.test.ts` | 16+ cases |
| `grep` | `tests/tool/tools/grep.test.ts` | 20+ cases |

### TUI Command Test Coverage

TUI slash commands are tested through the `useCommands` hook with React context mocking:

| Command | Test File | Test Cases |
|---------|-----------|------------|
| `/image`, `/clear-images` | `tests/commands-image.test.tsx` | 10+ cases |

### Test Categories

Each tool is tested across multiple categories:

1. **Basic Operations**
   - Normal usage scenarios
   - Edge cases (empty files, large files)
   - Special characters and unicode

2. **Path Handling**
   - Absolute paths
   - Relative paths with workdir
   - Nested directory creation
   - Path normalization

3. **Error Handling**
   - Non-existent files/directories
   - Permission errors
   - Invalid parameters
   - Malformed patterns (glob/grep)

4. **Tool Metadata**
   - Correct tool names
   - Description presence
   - Schema generation

5. **Line Ending Preservation** (Edit Tool)
   - Detect and preserve CRLF vs LF line endings
   - Normalize parameters to match file's line ending style
   - Ensure replacements maintain original file format

### Testing Permission System

The permission system includes comprehensive tests for new features:

#### Config File Protection Tests

```typescript
import { describe, it, expect } from 'vitest';
import { ConfigProtection } from '../src/permission/config-paths.js';

describe('ConfigProtection', () => {
  it('should detect .alexi config directory', () => {
    expect(ConfigProtection.isRelative('.alexi/config.json')).toBe(true);
    expect(ConfigProtection.isRelative('.alexi/')).toBe(true);
  });

  it('should exclude plan directories', () => {
    expect(ConfigProtection.isRelative('.alexi/plans/feature.md')).toBe(false);
  });

  it('should detect root-level config files', () => {
    expect(ConfigProtection.isRelative('alexi.json')).toBe(true);
    expect(ConfigProtection.isRelative('AGENTS.md')).toBe(true);
  });

  it('should detect write permission requests', () => {
    expect(ConfigProtection.isRequest({
      permission: 'write',
      patterns: ['.alexi/config.json']
    })).toBe(true);
  });

  it('should not detect read permission requests', () => {
    expect(ConfigProtection.isRequest({
      permission: 'read',
      patterns: ['.alexi/config.json']
    })).toBe(false);
  });
});
```

#### Permission Drain Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { drainCovered } from '../src/permission/drain.js';

describe('drainCovered', () => {
  it('should auto-approve pending permissions covered by new allow rules', async () => {
    const mockResolve = vi.fn();
    const pending = {
      'req-1': {
        info: {
          id: 'req-1',
          sessionID: 'session-1',
          permission: 'write',
          patterns: ['src/file.ts']
        },
        ruleset: [],
        resolve: mockResolve,
        reject: vi.fn()
      }
    };

    const approved = [
      { permission: 'write', pattern: 'src/**', action: 'allow' }
    ];

    await drainCovered(pending, approved, mockEvaluate, mockEvents, MockDeniedError);

    expect(mockResolve).toHaveBeenCalled();
  });

  it('should not auto-resolve config file edits', async () => {
    const mockResolve = vi.fn();
    const pending = {
      'req-1': {
        info: {
          id: 'req-1',
          sessionID: 'session-1',
          permission: 'write',
          patterns: ['.alexi/config.json']
        },
        ruleset: [],
        resolve: mockResolve,
        reject: vi.fn()
      }
    };

    const approved = [
      { permission: 'write', pattern: '**', action: 'allow' }
    ];

    await drainCovered(pending, approved, mockEvaluate, mockEvents, MockDeniedError);

    // Config file edit should NOT be auto-resolved
    expect(mockResolve).not.toHaveBeenCalled();
  });
});
```

#### Pattern Matching Tests

```typescript
import { describe, it, expect } from 'vitest';
import { matchesPattern } from '../src/permission/next.js';

describe('matchesPattern', () => {
  it('should match exact paths', () => {
    expect(matchesPattern('file.ts', 'file.ts')).toBe(true);
    expect(matchesPattern('file.ts', 'other.ts')).toBe(false);
  });

  it('should match wildcard patterns', () => {
    expect(matchesPattern('*.ts', 'index.ts')).toBe(true);
    expect(matchesPattern('*.ts', 'dir/index.ts')).toBe(false);
  });

  it('should match globstar patterns', () => {
    expect(matchesPattern('src/**/*.ts', 'src/core/index.ts')).toBe(true);
    expect(matchesPattern('src/**/*.ts', 'src/a/b/c/file.ts')).toBe(true);
  });

  it('should match question mark patterns', () => {
    expect(matchesPattern('file?.ts', 'file1.ts')).toBe(true);
    expect(matchesPattern('file?.ts', 'file10.ts')).toBe(false);
  });
});
```

### Testing Agent System

#### Agent Registration Tests

```typescript
import { describe, it, expect } from 'vitest';
import { getAgentRegistry } from '../src/agent/index.js';

describe('Agent Registry', () => {
  it('should register custom agents', () => {
    const registry = getAgentRegistry();
    const agent = registry.register({
      id: 'test-agent',
      name: 'Test Agent',
      description: 'Test description',
      mode: 'all',
      systemPrompt: 'Test prompt'
    });

    expect(agent.id).toBe('test-agent');
    expect(registry.get('test-agent')).toBeDefined();
  });

  it('should prevent removal of built-in agents', () => {
    const registry = getAgentRegistry();
    
    expect(() => {
      registry.remove('code');
    }).toThrow('Cannot remove built-in agent: code');
  });

  it('should prevent removal of organization agents', () => {
    const registry = getAgentRegistry();
    
    // Register org agent
    registry.register({
      id: 'org-agent',
      name: 'Org Agent',
      description: 'Organization agent',
      mode: 'all',
      systemPrompt: 'Org prompt',
      options: { source: 'organization' }
    });

    expect(() => {
      registry.remove('org-agent');
    }).toThrow('Cannot remove organization agent');
  });

  it('should populate displayName from org options', () => {
    const registry = getAgentRegistry();
    
    const agent = registry.register({
      id: 'org-mode',
      name: 'Org Mode',
      description: 'Test',
      mode: 'all',
      systemPrompt: 'Test',
      options: { displayName: 'Organization Mode' }
    });

    expect(agent.displayName).toBe('Organization Mode');
  });
});
```

### Testing Error Backoff

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { ErrorBackoff, extractStatusCode } from '../src/core/error-backoff.js';

describe('ErrorBackoff', () => {
  let backoff: ErrorBackoff;

  beforeEach(() => {
    backoff = new ErrorBackoff({
      initialDelayMs: 1000,
      maxDelayMs: 60000,
      multiplier: 2,
      maxRetries: 3
    });
  });

  it('should calculate exponential backoff delays', () => {
    expect(backoff.shouldBackoff()).toBe(false);

    backoff.recordError();
    expect(backoff.shouldBackoff()).toBe(true);
    expect(backoff.getRemainingBackoffMs()).toBeGreaterThan(0);
  });

  it('should reset on success', () => {
    backoff.recordError();
    backoff.recordError();
    expect(backoff.getConsecutiveErrors()).toBe(2);

    backoff.recordSuccess();
    expect(backoff.getConsecutiveErrors()).toBe(0);
    expect(backoff.shouldBackoff()).toBe(false);
  });

  it('should detect fatal 4xx errors', () => {
    backoff.recordError(400);
    expect(backoff.isFatal()).toBe(true);

    backoff.reset();
    backoff.recordError(500);
    expect(backoff.isFatal()).toBe(false);
  });

  it('should cap delay at maxDelayMs', () => {
    for (let i = 0; i < 10; i++) {
      backoff.recordError();
    }

    const delay = backoff.getRemainingBackoffMs();
    expect(delay).toBeLessThanOrEqual(60000);
  });
});

describe('extractStatusCode', () => {
  it('should extract 4xx status codes', () => {
    expect(extractStatusCode('Error: status: 400')).toBe(400);
    expect(extractStatusCode('Request failed with status: 404')).toBe(404);
  });

  it('should extract 5xx status codes', () => {
    expect(extractStatusCode('Error: status: 500')).toBe(500);
    expect(extractStatusCode('status: 503 Service Unavailable')).toBe(503);
  });

  it('should return undefined for no status code', () => {
    expect(extractStatusCode('Unknown error')).toBeUndefined();
    expect(extractStatusCode('Error: something went wrong')).toBeUndefined();
  });
});
```

### Testing MCP Server Initialization

```typescript
import { describe, it, expect, vi } from 'vitest';
import { McpClientManager } from '../src/mcp/client.js';

describe('MCP Client Manager', () => {
  it('should handle graceful server failures', async () => {
    const manager = new McpClientManager();
    
    // Mock config with multiple servers
    const mockConfig = {
      servers: [
        { name: 'server1', enabled: true, autoConnect: true },
        { name: 'server2', enabled: true, autoConnect: true },
        { name: 'server3', enabled: true, autoConnect: true }
      ]
    };

    // Mock connect to fail for server2
    const connectSpy = vi.spyOn(manager, 'connect');
    connectSpy.mockImplementation(async (server) => {
      if (server.name === 'server2') {
        throw new Error('Connection failed');
      }
      return { status: 'connected', tools: [] };
    });

    // Should not throw even if one server fails
    await expect(manager.connectFromConfig()).resolves.not.toThrow();
  });
});
```

#### Testing Line Ending Preservation

The edit tool preserves line endings when performing replacements:

```typescript
describe('edit tool line endings', () => {
  it('should preserve CRLF line endings', async () => {
    // Create file with CRLF endings
    const content = 'line1\r\nline2\r\nline3\r\n';
    await fs.writeFile(filePath, content, 'utf-8');

    // Perform edit with LF in parameters
    const result = await editTool.execute({
      filePath,
      oldString: 'line2\n',
      newString: 'modified\n'
    }, context);

    expect(result.success).toBe(true);

    // Verify CRLF preserved in output
    const updated = await fs.readFile(filePath, 'utf-8');
    expect(updated).toContain('\r\n');
    expect(updated).toBe('line1\r\nmodified\r\nline3\r\n');
  });

  it('should preserve LF line endings', async () => {
    const content = 'line1\nline2\nline3\n';
    await fs.writeFile(filePath, content, 'utf-8');

    const result = await editTool.execute({
      filePath,
      oldString: 'line2',
      newString: 'modified'
    }, context);

    expect(result.success).toBe(true);

    const updated = await fs.readFile(filePath, 'utf-8');
    expect(updated).not.toContain('\r\n');
    expect(updated).toBe('line1\nmodified\nline3\n');
  });
});
```

## Testing Providers

Provider tests verify integration with SAP AI Core and proper message formatting.

### Provider Test Strategy

```mermaid
sequenceDiagram
    participant Test as Test Suite
    participant Provider as Provider Implementation
    participant Mock as Mock SAP AI Core
    participant Validator as Response Validator
    
    Test->>Provider: Initialize with config
    Provider->>Mock: Send request
    Mock->>Provider: Return mock response
    Provider->>Validator: Validate format
    Validator->>Test: Assert expectations
    
    Note over Test,Validator: Verify message format, streaming, error handling
```

### Example: Testing Provider Integration

```typescript
describe('OpenAI Compatible Provider', () => {
  it('should format messages correctly', async () => {
    const provider = new OpenAICompatibleProvider(config);
    
    const messages = [
      { role: 'user', content: 'Hello' }
    ];
    
    const result = await provider.sendMessage(messages, {
      model: 'gpt-4o',
      temperature: 0.7
    });
    
    expect(result.content).toBeDefined();
    expect(result.role).toBe('assistant');
  });
  
  it('should handle streaming responses', async () => {
    // Test streaming implementation
  });
  
  it('should handle API errors gracefully', async () => {
    // Test error handling
  });
});
```

## Testing Routing

Router tests verify automatic model selection based on prompt analysis.

### Router Test Flow

```mermaid
graph TD
    Input[Test Input Prompt] --> Classifier[Prompt Classifier]
    Classifier --> Complexity[Complexity Score]
    Classifier --> Category[Task Category]
    
    Complexity --> Router[Router Logic]
    Category --> Router
    Config[Routing Config] --> Router
    
    Router --> Model[Selected Model]
    Model --> Verify[Verify Selection]
    
    style Input fill:#E3F2FD
    style Router fill:#4CAF50
    style Verify fill:#2196F3
```

### Example: Testing Routing Decisions

```typescript
describe('Auto Router', () => {
  it('should select cheap model for simple prompts', async () => {
    const router = new AutoRouter(config);
    
    const result = await router.selectModel({
      prompt: 'What is 2+2?',
      preferCheap: true
    });
    
    expect(result.model).toBe('gpt-4o-mini');
    expect(result.confidence).toBeGreaterThan(0.8);
  });
  
  it('should select powerful model for complex tasks', async () => {
    const router = new AutoRouter(config);
    
    const result = await router.selectModel({
      prompt: 'Analyze this codebase and suggest architectural improvements...',
      preferCheap: false
    });
    
    expect(result.model).toBe('claude-4-sonnet');
  });
  
  it('should respect routing rules', async () => {
    // Test rule-based routing
  });
});
```

## Best Practices

### 1. Test Isolation

Always use temporary directories and clean up after tests:

```typescript
beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-'));
  context = { workdir: tempDir };
});

afterEach(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});
```

### 2. Mock External Dependencies

Mock SAP AI Core API calls and file system operations when appropriate:

```typescript
vi.mock('../../../src/tool/index.js', async () => {
  const actual = await vi.importActual('../../../src/tool/index.js');
  return {
    ...actual,
    defineTool: (def: any) => ({
      ...def,
      execute: def.execute,
      executeUnsafe: def.execute,
    }),
  };
});
```

### 3. Test Both Success and Failure Cases

```typescript
describe('error handling', () => {
  it('should handle non-existent file', async () => {
    const result = await readTool.execute(
      { filePath: '/nonexistent.txt' },
      context
    );
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('File not found');
  });
});
```

### 4. Verify Actual File System Changes

Don't just check return values - verify actual changes:

```typescript
it('should create file on disk', async () => {
  const result = await writeTool.execute({ filePath, content }, context);
  
  expect(result.success).toBe(true);
  
  // Verify file actually exists
  const actualContent = await fs.readFile(filePath, 'utf-8');
  expect(actualContent).toBe(content);
});
```

### 5. Test Edge Cases

```typescript
describe('edge cases', () => {
  it('should handle empty files', async () => { /* ... */ });
  it('should handle unicode content', async () => { /* ... */ });
  it('should handle files with spaces in name', async () => { /* ... */ });
  it('should handle deeply nested directories', async () => { /* ... */ });
});
```

### 6. Use Descriptive Test Names

```typescript
// Good
it('should create parent directories if they do not exist', async () => {
  // ...
});

// Bad
it('test write', async () => {
  // ...
});
```

### 7. Test Tool Metadata

Verify tool definitions are correct:

```typescript
describe('tool metadata', () => {
  it('should have correct name', () => {
    expect(writeTool.name).toBe('write');
  });

  it('should have a description', () => {
    expect(writeTool.description).toBeDefined();
    expect(writeTool.description.length).toBeGreaterThan(0);
  });
});
```

### 8. Test TUI Commands with Context Mocking

TUI commands require mocking React contexts and using ink-testing-library:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

// Mock contexts before importing hooks
const mockPasteFromClipboard = vi.fn().mockResolvedValue(undefined);
const mockAddFromFile = vi.fn().mockResolvedValue(undefined);
const mockClearAll = vi.fn();

vi.mock('../src/cli/tui/context/AttachmentContext.js', () => ({
  useAttachments: () => ({
    pending: [],
    reading: false,
    error: null,
    pasteFromClipboard: mockPasteFromClipboard,
    addFromFile: mockAddFromFile,
    clearAll: mockClearAll,
  }),
}));

// Import after mocks
import { useCommands } from '../src/cli/tui/hooks/useCommands.js';

describe('/image command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call pasteFromClipboard when no args given', async () => {
    let captured;
    function CommandCapture() {
      captured = useCommands();
      return <Text>ready</Text>;
    }
    
    render(<CommandCapture />);
    
    const handled = await captured.handleCommand('/image');
    expect(handled).toBe(true);
    expect(mockPasteFromClipboard).toHaveBeenCalledOnce();
  });

  it('should call addFromFile when path provided', async () => {
    let captured;
    function CommandCapture() {
      captured = useCommands();
      return <Text>ready</Text>;
    }
    
    render(<CommandCapture />);
    
    await captured.handleCommand('/image ./screenshot.png');
    expect(mockAddFromFile).toHaveBeenCalledWith('./screenshot.png');
  });
});
```

Key patterns for TUI command testing:

1. **Mock Before Import**: Declare all vi.mock() calls before importing the hook
2. **Capture Hook Return**: Use a component to capture the hook's return value
3. **Render with Ink**: Use ink-testing-library's render() function
4. **Test Command Dispatch**: Call handleCommand() and verify behavior
5. **Clear Mocks**: Use vi.clearAllMocks() in beforeEach()

## Testing with SAP AI Core

### Local Development Testing

For local testing without SAP AI Core:

```bash
# Use mock provider
export ALEXI_MOCK_PROVIDER=true
npm test
```

### Integration Testing

For integration tests with real SAP AI Core:

```bash
# Set required environment variables
export AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...",...}'
export AICORE_RESOURCE_GROUP='default'

# Run integration tests
npm run test:integration
```

### CI/CD Testing

GitHub Actions workflows use secrets for SAP AI Core credentials:

```yaml
- name: Run Tests
  env:
    AICORE_SERVICE_KEY: ${{ secrets.AICORE_SERVICE_KEY }}
    AICORE_RESOURCE_GROUP: ${{ secrets.AICORE_RESOURCE_GROUP }}
  run: npm test
```

## Continuous Integration

Tests run automatically on:
- Pull requests to main/master
- Push to main/master
- Manual workflow dispatch

### Test Workflow

```mermaid
graph LR
    PR[Pull Request] --> Install[Install Dependencies]
    Install --> Build[Build Project]
    Build --> Lint[Run Linting]
    Lint --> Test[Run Tests]
    Test --> Coverage[Generate Coverage]
    Coverage --> Report[Upload Report]
    
    style Test fill:#4CAF50
    style Coverage fill:#2196F3
```

## Troubleshooting

### Common Test Issues

1. **Tests fail with "File not found"**
   - Ensure temporary directories are created in `beforeEach`
   - Check that file paths use `path.join(tempDir, ...)`

2. **Permission errors in CI**
   - Verify tool mocking is configured correctly
   - Check that `defineTool` mock bypasses permission checks

3. **Timeout errors**
   - Increase timeout for slow operations: `it('test', { timeout: 10000 }, async () => {})`
   - Check for hanging async operations

4. **Flaky tests**
   - Use proper cleanup in `afterEach`
   - Avoid shared state between tests
   - Use unique temporary directories per test

## Contributing Tests

When contributing new features:

1. Write tests first (TDD approach)
2. Ensure coverage for new code is above 80%
3. Test both success and failure paths
4. Include edge cases
5. Update this documentation with new testing patterns

For more information on contributing, see [CONTRIBUTING.md](CONTRIBUTING.md).

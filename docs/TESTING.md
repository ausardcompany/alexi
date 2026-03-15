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
| TUI Components | 85%+ | ✅ Achieved |
| Tool System | 90%+ | ✅ Achieved |
| Core Logic | 85%+ | ✅ Achieved |
| Context System | 85%+ | ✅ Achieved |
| Agent System | 80%+ | ✅ Achieved |
| Git Integration | 80%+ | ✅ Achieved |
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

## Testing TUI Components

The TUI components use ink-testing-library for React component testing.

### TUI Test Architecture

```mermaid
graph LR
    subgraph "Test Setup"
        Render[Render Component]
        Context[Mock Context Providers]
        Props[Mock Props]
    end

    subgraph "Test Execution"
        Interact[Simulate User Input]
        Wait[Wait for Updates]
        Assert[Assert Output]
    end

    subgraph "Cleanup"
        Unmount[Unmount Component]
        Restore[Restore Mocks]
    end

    Render --> Context
    Context --> Props
    Props --> Interact
    Interact --> Wait
    Wait --> Assert
    Assert --> Unmount
    Unmount --> Restore

    style Render fill:#4CAF50
    style Assert fill:#2196F3
```

### Example: Testing TUI Components

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';
import React from 'react';
import { Header } from '../../../src/cli/tui/components/Header.js';

describe('Header Component', () => {
  it('should display model, agent, and session info', () => {
    const { lastFrame } = render(
      <Header
        model="gpt-4o"
        agent="code"
        agentColor="#00ff00"
        sessionId="abc-123"
        tokenCount={1500}
        autoRoute={true}
      />
    );

    const output = lastFrame();
    expect(output).toContain('gpt-4o');
    expect(output).toContain('code');
    expect(output).toContain('abc-123');
    expect(output).toContain('1500');
  });

  it('should show auto-route indicator when enabled', () => {
    const { lastFrame } = render(
      <Header
        model="gpt-4o"
        agent="code"
        agentColor="#00ff00"
        sessionId="abc-123"
        tokenCount={1500}
        autoRoute={true}
      />
    );

    const output = lastFrame();
    expect(output).toContain('auto-route');
  });
});
```

### Testing Context Providers

```typescript
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import React from 'react';
import { ThemeProvider, useTheme } from '../../../src/cli/tui/context/ThemeContext.js';

describe('ThemeContext', () => {
  it('should provide default dark theme', () => {
    let theme: any;

    function TestComponent() {
      theme = useTheme();
      return null;
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(theme.current).toBe('dark');
    expect(theme.colors).toBeDefined();
  });

  it('should toggle theme', () => {
    let theme: any;

    function TestComponent() {
      theme = useTheme();
      return null;
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(theme.current).toBe('dark');
    theme.toggle();
    expect(theme.current).toBe('light');
  });
});
```

### Testing Hooks

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useStreamChat } from '../../../src/cli/tui/hooks/useStreamChat.js';

describe('useStreamChat Hook', () => {
  it('should initialize with empty messages', () => {
    const { result } = renderHook(() => useStreamChat({
      model: 'gpt-4o',
      autoRoute: false,
    }));

    expect(result.current.messages).toEqual([]);
    expect(result.current.isStreaming).toBe(false);
  });

  it('should send message and update state', async () => {
    const { result } = renderHook(() => useStreamChat({
      model: 'gpt-4o',
      autoRoute: false,
    }));

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.messages.length).toBeGreaterThan(0);
    expect(result.current.messages[0].content).toBe('Hello');
  });
});
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

## Testing Multimodal Features

Multimodal support includes clipboard image detection and validation.

### Testing Clipboard Detection

```typescript
import { describe, it, expect, vi } from 'vitest';
import { detectClipboardCapabilities, readClipboardImage } from '../src/utils/clipboard.js';

describe('Clipboard Detection', () => {
  it('should detect available clipboard tools', async () => {
    const capabilities = await detectClipboardCapabilities();
    
    expect(capabilities).toBeInstanceOf(Array);
    expect(capabilities.length).toBeGreaterThan(0);
    
    const available = capabilities.find(c => c.available);
    if (available) {
      expect(available.tool).toMatch(/pngpaste|xclip|wl-paste|powershell/);
    }
  });

  it('should read clipboard image when available', async () => {
    const result = await readClipboardImage();
    
    if (result.success) {
      expect(result.data).toBeInstanceOf(Buffer);
      expect(result.format).toMatch(/png|jpeg|gif|webp/);
    } else {
      expect(result.error).toBeDefined();
    }
  });
});
```

### Testing Image Validation

```typescript
import { describe, it, expect } from 'vitest';
import { validateImage, detectImageFormat } from '../src/utils/imageValidation.js';

describe('Image Validation', () => {
  it('should validate PNG images', () => {
    const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const result = validateImage(pngSignature);
    
    expect(result.valid).toBe(true);
    expect(result.format).toBe('png');
  });

  it('should detect image format from buffer', () => {
    const jpegSignature = Buffer.from([0xff, 0xd8, 0xff]);
    const format = detectImageFormat(jpegSignature);
    
    expect(format).toBe('jpeg');
  });

  it('should reject invalid image data', () => {
    const invalidData = Buffer.from([0x00, 0x00, 0x00, 0x00]);
    const result = validateImage(invalidData);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should enforce size limits', () => {
    const largeBuffer = Buffer.alloc(20 * 1024 * 1024); // 20MB
    const result = validateImage(largeBuffer);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('size');
  });
});
```

### Testing Multimodal Message Building

```typescript
import { describe, it, expect } from 'vitest';
import { buildMultimodalMessage } from '../src/utils/multimodal.js';

describe('Multimodal Message Building', () => {
  it('should build text-only message', () => {
    const message = buildMultimodalMessage({
      text: 'Hello, world!',
      images: [],
    });
    
    expect(message.role).toBe('user');
    expect(message.content).toHaveLength(1);
    expect(message.content[0].type).toBe('text');
    expect(message.content[0].text).toBe('Hello, world!');
  });

  it('should build message with image', () => {
    const imageData = Buffer.from('fake-image-data').toString('base64');
    const message = buildMultimodalMessage({
      text: 'Look at this:',
      images: [{
        id: '123',
        data: imageData,
        mediaType: 'image/png',
        size: 1024,
      }],
    });
    
    expect(message.content).toHaveLength(2);
    expect(message.content[0].type).toBe('text');
    expect(message.content[1].type).toBe('image');
    expect(message.content[1].source.type).toBe('base64');
    expect(message.content[1].source.media_type).toBe('image/png');
  });

  it('should handle multiple images', () => {
    const message = buildMultimodalMessage({
      text: 'Compare these:',
      images: [
        { id: '1', data: 'data1', mediaType: 'image/png', size: 100 },
        { id: '2', data: 'data2', mediaType: 'image/jpeg', size: 200 },
      ],
    });
    
    expect(message.content).toHaveLength(3);
    expect(message.content.filter(c => c.type === 'image')).toHaveLength(2);
  });
});
```

## Testing Context System

The context system includes repository mapping and symbol extraction.

### Testing Repository Map

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateRepoMap } from '../src/context/repoMap.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';

describe('Repository Map', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repo-map-test-'));
    
    // Create test files
    await fs.writeFile(
      path.join(tempDir, 'index.ts'),
      'export function hello() { return "world"; }'
    );
    await fs.writeFile(
      path.join(tempDir, 'utils.ts'),
      'export const PI = 3.14;'
    );
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should generate repository map', async () => {
    const map = await generateRepoMap({
      workdir: tempDir,
      tokenBudget: 2000,
    });
    
    expect(map).toBeDefined();
    expect(map.files).toBeInstanceOf(Array);
    expect(map.files.length).toBeGreaterThan(0);
  });

  it('should extract symbols from files', async () => {
    const map = await generateRepoMap({
      workdir: tempDir,
      tokenBudget: 2000,
    });
    
    const indexFile = map.files.find(f => f.relativePath === 'index.ts');
    expect(indexFile).toBeDefined();
    expect(indexFile.symbols).toBeInstanceOf(Array);
    expect(indexFile.symbols.some(s => s.name === 'hello')).toBe(true);
  });

  it('should respect token budget', async () => {
    const map = await generateRepoMap({
      workdir: tempDir,
      tokenBudget: 100,
    });
    
    expect(map.tokenCount).toBeLessThanOrEqual(100);
  });
});
```

### Testing Symbol Extraction

```typescript
import { describe, it, expect } from 'vitest';
import { extractSymbols } from '../src/context/symbols.js';

describe('Symbol Extraction', () => {
  it('should extract function definitions', () => {
    const code = `
      export function greet(name: string): string {
        return \`Hello, \${name}!\`;
      }
    `;
    
    const symbols = extractSymbols(code, 'typescript');
    
    expect(symbols).toBeInstanceOf(Array);
    const greetSymbol = symbols.find(s => s.name === 'greet');
    expect(greetSymbol).toBeDefined();
    expect(greetSymbol.type).toBe('function');
  });

  it('should extract class definitions', () => {
    const code = `
      export class User {
        constructor(public name: string) {}
      }
    `;
    
    const symbols = extractSymbols(code, 'typescript');
    
    const userSymbol = symbols.find(s => s.name === 'User');
    expect(userSymbol).toBeDefined();
    expect(userSymbol.type).toBe('class');
  });

  it('should extract interface definitions', () => {
    const code = `
      export interface Config {
        apiKey: string;
        timeout: number;
      }
    `;
    
    const symbols = extractSymbols(code, 'typescript');
    
    const configSymbol = symbols.find(s => s.name === 'Config');
    expect(configSymbol).toBeDefined();
    expect(configSymbol.type).toBe('interface');
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

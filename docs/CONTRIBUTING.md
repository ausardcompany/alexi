# Contributing to Alexi

Thank you for your interest in contributing to Alexi! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Documentation](#documentation)
- [Automation System](#automation-system)

## Code of Conduct

This project follows a professional code of conduct. We expect all contributors to:

- Be respectful and inclusive
- Provide constructive feedback
- Focus on technical merit
- Maintain professional communication

## Getting Started

### Prerequisites

- Node.js 22 or higher
- npm or yarn package manager
- Git
- SAP AI Core account with valid credentials
- TypeScript knowledge

### Initial Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone git@github.com:YOUR_USERNAME/alexi.git
   cd alexi
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your SAP AI Core credentials
   ```

5. Build the project:
   ```bash
   npm run build
   ```

6. Verify the setup:
   ```bash
   node dist/cli/program.js --help
   ```

### Environment Configuration

Create a `.env` file (never commit this file) with:

```bash
# Proxy configuration (for OpenAI-compatible models)
SAP_PROXY_BASE_URL=http://127.0.0.1:3001/v1
SAP_PROXY_API_KEY=your_secret_key
SAP_PROXY_MODEL=gpt-4o

# Native SAP AI Core (for Claude models)
AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}'
AICORE_RESOURCE_GROUP=your-resource-group-id
```

## Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `feature/*`: New features
- `fix/*`: Bug fixes
- `docs/*`: Documentation updates
- `refactor/*`: Code refactoring

### Development Process

```mermaid
graph LR
    A[Create Branch] --> B[Make Changes]
    B --> C[Write Tests]
    C --> D[Run Tests]
    D --> E[Commit]
    E --> F[Push]
    F --> G[Create PR]
    G --> H[Code Review]
    H --> I[Address Feedback]
    I --> J[Auto-Generate Docs]
    J --> K[Merge]
```

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following coding standards

3. Write or update tests for your changes

4. Run tests locally:
   ```bash
   npm test
   ```

5. Build and verify:
   ```bash
   npm run build
   npm run lint
   ```

6. Commit your changes with descriptive messages:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

7. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

8. Create a pull request on GitHub

## Coding Standards

### TypeScript Guidelines

1. **Type Safety**: Always use explicit types, avoid `any`
   ```typescript
   // Good
   function processMessage(message: string): Promise<Response> {
     // ...
   }
   
   // Bad
   function processMessage(message: any): any {
     // ...
   }
   ```

2. **Interfaces over Types**: Prefer interfaces for object shapes
   ```typescript
   // Good
   interface ToolContext {
     workdir: string;
     signal?: AbortSignal;
   }
   
   // Acceptable for unions/intersections
   type PermissionAction = 'read' | 'write' | 'execute';
   ```

3. **Async/Await**: Use async/await over raw promises
   ```typescript
   // Good
   async function fetchData(): Promise<Data> {
     const response = await fetch(url);
     return await response.json();
   }
   
   // Avoid
   function fetchData(): Promise<Data> {
     return fetch(url).then(r => r.json());
   }
   ```

4. **Error Handling**: Always handle errors appropriately
   ```typescript
   try {
     const result = await riskyOperation();
     return { success: true, data: result };
   } catch (err) {
     const message = err instanceof Error ? err.message : String(err);
     return { success: false, error: message };
   }
   ```

5. **Null Safety**: Use optional chaining and nullish coalescing
   ```typescript
   // Good
   const value = context?.workdir ?? process.cwd();
   
   // Avoid
   const value = context && context.workdir ? context.workdir : process.cwd();
   ```

6. **Unused Variables**: Remove or prefix with underscore
   ```typescript
   // Good - Remove if truly unused
   const lines = content.split(lineEnding);
   const startIdx = Math.max(0, params.startLine - 1);
   const endIdx = Math.min(lines.length, params.endLine);
   searchContent = lines.slice(startIdx, endIdx).join(lineEnding);
   
   // Good - Prefix with underscore if needed for future use
   function processData(_context: Context, data: Data): Result {
     return transform(data);
   }
   
   // Bad - Declared but never used
   let lineOffset = 0;
   const startIdx = Math.max(0, params.startLine - 1);
   ```

7. **Graceful Degradation**: Handle optional dependencies gracefully
   ```typescript
   // Good - Return null if initialization fails
   function getTsParser(): Parser | null {
     if (!Parser) {
       return null;
     }
     if (!tsParser) {
       tsParser = new Parser();
       tsParser.setLanguage(TypeScript.typescript);
     }
     return tsParser;
   }
   
   // Usage - Check for null before using
   const parser = getTsParser();
   if (!parser) {
     return null; // Skip parsing, don't fail
   }
   const tree = parser.parse(source);
   ```

8. **Zod Schema Naming**: Use private schema constants to avoid ESLint naming conflicts
   ```typescript
   // Good - Private schema constant with underscore prefix
   const _ToolIDSchema = z.string().describe('Unique identifier for a tool');
   export type ToolID = z.infer<typeof _ToolIDSchema>;
   
   const _ToolMetadataSchema = z.object({
     id: _ToolIDSchema,
     name: z.string(),
     description: z.string(),
   });
   export type ToolMetadata = z.infer<typeof _ToolMetadataSchema>;
   
   // Bad - Schema and type with same name causes ESLint errors
   export const ToolID = z.string().describe('Unique identifier for a tool');
   export type ToolID = z.infer<typeof ToolID>;
   ```

9. **Dynamic Tool Registration**: Support runtime tool management for plugins
   ```typescript
   // Register a dynamic tool at runtime
   const customTool = defineTool({
     name: 'custom-search',
     description: 'Custom search implementation',
     parameters: z.object({ query: z.string() }),
     execute: async (params, context) => {
       // Tool implementation
       return { success: true, data: results };
     }
   });
   
   // Register and unregister dynamically
   registerDynamicTool(customTool);
   
   // Later, remove when no longer needed
   unregisterDynamicTool('custom-search');
   
   // Note: Dynamic tools cannot conflict with built-in tool names
   ```

### File Organization

```
src/
├── cli/              # CLI-related code
│   ├── program.ts    # Main CLI entry point
│   └── commands/     # Individual CLI commands
├── core/             # Core orchestration logic
│   ├── orchestrator.ts
│   ├── router.ts
│   └── agenticChat.ts
├── providers/        # LLM provider implementations
│   ├── openai/
│   ├── bedrock/
│   └── anthropic/
├── tool/             # Tool system
│   ├── index.ts      # Tool framework
│   └── tools/        # Individual tool implementations
├── permission/       # Permission system
│   └── index.ts
├── session/          # Session management
└── bus/              # Event bus system
```

### Naming Conventions

- **Files**: camelCase for TypeScript files (`orchestrator.ts`)
- **Classes**: PascalCase (`class ToolRegistry`)
- **Functions**: camelCase (`function defineTool()`)
- **Constants**: UPPER_SNAKE_CASE (`const MAX_LINES = 2000`)
- **Interfaces**: PascalCase (`interface ToolContext`)
- **Types**: PascalCase (`type PermissionAction`)

### Code Style

- Use 2 spaces for indentation
- Maximum line length: 100 characters (flexible for readability)
- Use single quotes for strings
- Include trailing commas in multi-line objects/arrays
- Use semicolons

### Documentation Comments

Use JSDoc for functions and classes:

```typescript
/**
 * Define a new tool with lazy initialization
 * 
 * @param definition - Tool definition with parameters and execution logic
 * @returns Tool instance with execution methods
 */
export function defineTool<TParams extends z.ZodType, TResult>(
  definition: ToolDefinition<TParams, TResult>
): Tool<TParams, TResult> {
  // ...
}
```

## Testing Guidelines

### Test Structure

- Place tests next to the code they test: `tool.test.ts` next to `tool.ts`
- Use descriptive test names
- Follow Arrange-Act-Assert pattern

```typescript
describe('defineTool', () => {
  it('should create tool with permission checks', async () => {
    // Arrange
    const definition = {
      name: 'test-tool',
      description: 'Test tool',
      parameters: z.object({ path: z.string() }),
      permission: {
        action: 'write' as const,
        getResource: (params) => params.path,
      },
      execute: async () => ({ success: true }),
    };
    
    // Act
    const tool = defineTool(definition);
    
    // Assert
    expect(tool.name).toBe('test-tool');
    expect(tool.toFunctionSchema()).toBeDefined();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tool.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Run TUI command tests
npm test -- tests/commands-image.test.tsx

# Run tests matching a pattern
npm test -- --grep "line endings"

# Run recall tool tests
npm test -- tests/tool/tools/recall.test.ts
```

### Testing TUI Commands

TUI commands require special testing patterns with React context mocking:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

// Mock contexts BEFORE importing hooks
const mockPasteFromClipboard = vi.fn().mockResolvedValue(undefined);
const mockAddFromFile = vi.fn().mockResolvedValue(undefined);

vi.mock('../src/cli/tui/context/AttachmentContext.js', () => ({
  useAttachments: () => ({
    pasteFromClipboard: mockPasteFromClipboard,
    addFromFile: mockAddFromFile,
    clearAll: vi.fn(),
  }),
}));

// Import AFTER mocks
import { useCommands } from '../src/cli/tui/hooks/useCommands.js';

describe('TUI commands', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle /image command', async () => {
    let captured;
    function CommandCapture() {
      captured = useCommands();
      return <Text>ready</Text>;
    }
    
    render(<CommandCapture />);
    
    const handled = await captured.handleCommand('/image ./photo.png');
    expect(handled).toBe(true);
    expect(mockAddFromFile).toHaveBeenCalledWith('./photo.png');
  });
});
```

Key principles for TUI testing:
1. Mock all React contexts before importing hooks
2. Use ink-testing-library for rendering
3. Capture hook return values through a component
4. Clear mocks between tests with vi.clearAllMocks()
5. Test both command dispatch and context interactions

### Testing Tool Enhancements

When testing tools with enhanced features:

```typescript
describe('edit tool with line hints', () => {
  it('should use line number hints for faster matching', async () => {
    // Create file with known content
    const lines = Array.from({ length: 1000 }, (_, i) => `line ${i}`);
    const content = lines.join('\n');
    await fs.writeFile(filePath, content, 'utf-8');

    // Edit with line hints to narrow search scope
    const result = await editTool.execute({
      filePath,
      oldString: 'line 500',
      newString: 'modified line',
      startLine: 490,
      endLine: 510
    }, context);

    expect(result.success).toBe(true);
    expect(result.data?.startLine).toBe(501);
    expect(result.data?.endLine).toBe(501);
  });
});

describe('task tool security', () => {
  it('should prevent recursive subagent spawning', async () => {
    // Set context to simulate subagent session
    const subagentContext = {
      ...context,
      sessionId: 'subagent-123'
    };

    const result = await taskTool.execute({
      prompt: 'Do something',
      description: 'Test task',
      subagent_type: 'general'
    }, subagentContext);

    expect(result.success).toBe(false);
    expect(result.error).toContain('not available for subagent sessions');
  });

  it('should prevent spawning primary agents', async () => {
    const result = await taskTool.execute({
      prompt: 'Do something',
      description: 'Test task',
      subagent_type: 'primary'
    }, context);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Cannot spawn primary agents');
  });
});
```

## Pull Request Process

### Before Submitting

1. Ensure all tests pass
2. Update relevant documentation
3. Add entries to CHANGELOG.md if needed
4. Verify build succeeds
5. Run linter and fix issues

### PR Title Format

Use conventional commit format:

- `feat: add new feature`
- `fix: resolve bug in tool system`
- `docs: update API documentation`
- `refactor: simplify orchestrator logic`
- `test: add tests for permission system`
- `chore: update dependencies`

### PR Description

Include:

1. **Summary**: Brief description of changes
2. **Motivation**: Why this change is needed
3. **Changes**: List of specific changes made
4. **Testing**: How changes were tested
5. **Screenshots**: If UI changes (not applicable for CLI)

Example:

```markdown
## Summary
Enhanced write and edit tools with relative path resolution for permission checks.

## Motivation
In CI environments, the agentic system needs to resolve relative paths correctly
for permission checks to work with the workdir context.

## Changes
- Modified `getResource` in write.ts to accept ToolContext parameter
- Modified `getResource` in edit.ts to accept ToolContext parameter
- Updated tool index to pass context to getResource functions
- Added path resolution logic using workdir

## Testing
- Added unit tests for relative path resolution
- Verified in CI environment with documentation-update workflow
- Tested locally with various path configurations
```

### Automated Checks

Pull requests trigger automated workflows:

1. **CI**: Runs tests, linting, and build verification
2. **Documentation Update**: AI-powered documentation generation
   - Analyzes code changes
   - Updates relevant documentation files
   - Generates Mermaid diagrams
   - Updates CHANGELOG.md
3. **CI Auto-Fix** (for auto/* branches): Automatically fixes CI failures
   - Collects failure logs
   - Applies quick fixes (lint:fix, format)
   - Uses Alexi agent to fix remaining issues
   - Verifies fixes and commits changes

The documentation update workflow will automatically:
- Detect which documentation files need updating based on changed code
- Generate accurate technical documentation using Claude AI
- Commit documentation changes to your PR branch
- Ensure documentation stays in sync with code

For auto/* branches, if CI fails, the CI Auto-Fix workflow will:
- Analyze failure logs with exact error messages
- Apply deterministic fixes (linting, formatting)
- Use Alexi agent mode to fix complex issues
- Verify all fixes pass the original checks
- Commit fixes back to the PR branch
- Rate-limited to 2 runs per branch per day

### Code Review

All PRs require:
- At least one approval from a maintainer
- Passing CI checks
- Passing documentation generation
- No merge conflicts

Reviewers will check:
- Code quality and style
- Test coverage
- Documentation accuracy
- Performance implications
- Security considerations

## Documentation

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview and quick start |
| `docs/ARCHITECTURE.md` | System architecture and design |
| `docs/API.md` | API reference and usage examples |
| `docs/ROUTING.md` | Routing system documentation |
| `docs/PROVIDERS.md` | Provider integration guide |
| `docs/CONFIGURATION.md` | Configuration options |
| `docs/TESTING.md` | Testing guide |
| `docs/AUTOMATION.md` | CI/CD and automation |
| `docs/CONTRIBUTING.md` | This file |
| `CHANGELOG.md` | Version history |

### Documentation Standards

1. Use clear, technical language
2. Include code examples from actual codebase
3. Add Mermaid diagrams for complex concepts
4. Keep examples up-to-date with code changes
5. Use proper markdown formatting

### Mermaid Diagrams

Include at least 3 Mermaid diagrams in major documentation:

```mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[End]
```

Supported diagram types:
- Flowcharts (`graph`)
- Sequence diagrams (`sequenceDiagram`)
- Class diagrams (`classDiagram`)
- State diagrams (`stateDiagram`)

## Automation System

### Autonomous Sync

Alexi includes an autonomous upstream synchronization system:

```mermaid
graph LR
    A[Daily Schedule] --> B[Sync Forks]
    B --> C[Analyze Changes]
    C --> D[Generate Plan]
    D --> E[Execute Updates]
    E --> F[Create PR]
    F --> G[Auto-Merge]
```

The system:
- Runs daily at 06:00 UTC
- Syncs from kilocode, opencode, and claude-code repositories
- Uses AI to analyze and apply relevant changes
- Creates PRs with detailed change descriptions
- Auto-merges after CI passes

### Agentic File Operations

The tool system supports autonomous file operations with:

**Automatic Permission Configuration**:
```typescript
// High-priority allow rules for agentic mode
{
  id: 'agentic-allow-write',
  priority: 200,
  actions: ['write'],
  paths: ['<workdir>/**'],
  decision: 'allow'
}
```

**Relative Path Resolution**:
```typescript
// Tools resolve relative paths using workdir context
getResource: (params, context) => {
  if (path.isAbsolute(params.filePath)) {
    return params.filePath;
  }
  return path.join(context?.workdir || process.cwd(), params.filePath);
}
```

### Contributing to Automation

When modifying workflows:

1. Test with manual dispatch first
2. Use dry-run mode for sync workflows
3. Update `docs/AUTOMATION.md`
4. Document new secrets or configuration
5. Ensure backward compatibility

## Getting Help

- Open an issue for bugs or feature requests
- Join discussions for questions
- Check existing issues before creating new ones
- Provide minimal reproducible examples for bugs

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Recognition

Contributors are recognized in:
- GitHub contributors page
- Release notes for significant contributions
- Project documentation when appropriate

Thank you for contributing to Alexi!

# Contributing to Alexi

This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Documentation](#documentation)
- [Automation System](#automation-system)

## Getting Started

### Prerequisites

- Node.js >= 22.12.0
- npm package manager
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
# SAP AI Core credentials
AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}'
AICORE_RESOURCE_GROUP=your-resource-group-id

# Optional: Proxy configuration
SAP_PROXY_BASE_URL=http://127.0.0.1:3001/v1
SAP_PROXY_API_KEY=your_secret_key
```

## Development Workflow

### Branch Strategy

- `main` / `master`: Production-ready code
- `feature/*`: New features
- `fix/*`: Bug fixes
- `auto/*`: Automated branches (CI, sync, implementation)
- `docs/*`: Documentation updates
- `refactor/*`: Code refactoring

### Development Process

```mermaid
graph LR
    A[Create Branch] --> B[Make Changes]
    B --> C[Write Tests]
    C --> D[Run Tests + Lint]
    D --> E[Commit]
    E --> F[Push]
    F --> G[Create PR]
    G --> H[CI + Auto-Docs]
    H --> I[Review]
    I --> J[Merge]
```

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make changes following coding standards
3. Write or update tests
4. Run quality checks locally:
   ```bash
   npm test
   npm run lint
   npm run typecheck
   npm run format:check
   ```
5. Commit with conventional commit format:
   ```bash
   git commit -m "feat(core): add reactive context compaction"
   ```
6. Push and create a pull request

### Build Commands

```bash
npm run build          # Compile TypeScript to dist/
npm run typecheck      # Type-check without emitting files
npm run dev            # Run in development mode with tsx
npm run lint           # Run ESLint on src/ and tests/
npm run lint:fix       # Auto-fix ESLint issues
npm run format         # Format code with Prettier
npm run format:check   # Check formatting without changes
npm test               # Run all tests once
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

## Coding Standards

### TypeScript Configuration

- **Target**: ES2022
- **Module**: NodeNext
- **Strict mode**: Enabled
- **JSX**: react-jsx (for Ink components)

### Formatting (Prettier)

- 2 spaces indentation
- 100 character line width
- Single quotes
- Semicolons required
- Trailing commas (ES5 style)
- LF line endings

### Import Conventions

```typescript
// Always use .js extension for local imports (required for ES Modules)
import { routePrompt } from './router.js';
import { SessionManager } from '../core/sessionManager.js';

// External imports first, then internal imports
import { z } from 'zod';
import * as fs from 'fs/promises';

import { defineTool } from '../index.js';
import type { ToolContext } from '../tool/index.js';
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | camelCase | `orchestrator.ts`, `sessionManager.ts` |
| Functions | camelCase | `sendChat()`, `routePrompt()` |
| Classes | PascalCase | `SessionManager`, `ToolRegistry` |
| Interfaces/Types | PascalCase | `ToolContext`, `PermissionAction` |
| Constants | UPPER_SNAKE_CASE | `MAX_LINES`, `MAX_BYTES` |
| Unused params | Prefix with `_` | `_context`, `_config` |

### TypeScript Guidelines

1. **Type Safety**: Avoid `any` -- use `unknown` and narrow types
   ```typescript
   // Good
   function processMessage(message: string): Promise<ToolResult> { }
   
   // Bad
   function processMessage(message: any): any { }
   ```

2. **Interfaces over Types**: Prefer interfaces for object shapes
   ```typescript
   interface ToolContext {
     workdir: string;
     signal?: AbortSignal;
   }
   type PermissionAction = 'read' | 'write' | 'execute' | 'network' | 'admin';
   ```

3. **Async/Await**: Always use async/await over raw promises
   ```typescript
   async function fetchData(): Promise<Data> {
     const response = await fetch(url);
     return await response.json();
   }
   ```

4. **Error Handling**: Use the Result pattern or typed error classes
    ```typescript
    // Result pattern for tool returns
    try {
      const result = await riskyOperation();
      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }

    // Typed error hierarchy (see src/reference/repository-cache.ts)
    export class CacheError extends Error {
      readonly _tag = 'CacheError';
      constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'CacheError';
      }
    }
    export class CacheMissError extends CacheError {
      readonly _tag = 'CacheMissError';
      constructor(public readonly key: string) {
        super(`Cache miss for key: ${key}`);
        this.name = 'CacheMissError';
      }
    }
    ```

    For network errors, use the `NetworkError` class from `src/core/network.ts`:
    ```typescript
    throw new NetworkError('Max reconnection attempts exceeded', { cause: error });
    ```

5. **Null Safety**: Use optional chaining and nullish coalescing
   ```typescript
   const value = context?.workdir ?? process.cwd();
   ```

6. **Unused Variables**: Prefix with underscore
   ```typescript
   const { action, config: _config } = params;
   ```

7. **Non-null Assertion Placement**: Assert on the correct operand
   ```typescript
   // Good
   const taskId = taskResult.data!.taskId;
   
   // Bad (confusing precedence)
   const taskId = taskResult.data?.taskId!;
   ```

8. **Explicit Type Assertions**: Use `as` when control flow cannot narrow
   ```typescript
   queueBackgroundTask(taskId as string, taskData, agent, config);
   ```

9. **Stream Options**: Use `undefined` instead of `null`
   ```typescript
   const stream = createReadStream(filePath, { encoding: undefined });
   ```

10. **Permission Actions**: Use standard taxonomy
     ```typescript
     // Standard: 'read' | 'write' | 'execute' | 'network' | 'admin'
     permission: { action: 'admin', getResource: (params) => params.action }
     ```

11. **Event Definitions**: Use Zod schemas with the event bus (see `src/bus/index.ts`)
      ```typescript
      import { defineEvent } from '../bus/index.js';
      import { z } from 'zod';

      export const ToolExecutionStarted = defineEvent(
        'tool.execution.started',
        z.object({
          toolName: z.string(),
          toolId: z.string(),
          parameters: z.record(z.string(), z.unknown()),
          timestamp: z.number(),
        })
      );
      ```

12. **Event Subscriptions**: Subscriptions are acquired eagerly; handlers are added immediately to the handler set to prevent race conditions between subscribe and first event emission.

13. **Plugin Tool Compatibility**: When creating plugin tools, ensure `ask` returns a `Promise<string>` (not an Effect). Use `createPluginToolWrapper()` from `src/tool/plugin-tools.ts` to adapt plugin interfaces.

14. **Tool Registry Resolution**: Register dynamic tool resolvers via `EnhancedToolRegistry.registerPromptResolver()` for tools that need session/agent context to resolve.

### ESLint Rules

Key rules enforced:
- `no-console: warn` -- Use logger utilities
- `eqeqeq: error` -- Always use `===` and `!==`
- `curly: error` -- Always use braces for control statements
- `prefer-const: error` -- Use `const` when not reassigned
- `@typescript-eslint/no-explicit-any: warn`
- `@typescript-eslint/no-unused-vars: error`

## Testing Guidelines

### Test Framework

Alexi uses **Vitest** with:
- Native TypeScript/ESM support
- React plugin for Ink TUI testing
- V8 coverage provider

### Test Structure

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Component Name', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-'));
    context = { workdir: tempDir };
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('feature', () => {
    it('should do something specific', async () => {
      // Arrange, Act, Assert
    });
  });
});
```

### Mocking

```typescript
// Mock modules before importing
vi.mock('../src/providers/index.js', () => ({
  getProviderForModel: vi.fn(),
  getDefaultModel: vi.fn(),
}));

// Import after mocking
import { sendChat } from '../src/core/orchestrator.js';
```

### Testing Async/Background Operations

For feature-flagged functionality:
```typescript
let originalEnv: string | undefined;

beforeEach(() => {
  originalEnv = process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS;
});

afterEach(() => {
  if (originalEnv === undefined) {
    delete process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS;
  } else {
    process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS = originalEnv;
  }
  getTaskStore().clear();
});
```

Use generous timeouts for CI:
```typescript
// 2x expected duration for CI scheduling variability
await new Promise((resolve) => setTimeout(resolve, 2000));
```

### Running Tests

```bash
npm test                              # All tests
npm test -- tests/tool/tools/         # Directory
npm test -- tests/hooks/blockCap.test.ts  # Single file
npm test -- --grep "compaction"       # Pattern match
npm run test:coverage                 # With coverage
```

## Pull Request Process

### Before Submitting

1. All tests pass: `npm test`
2. No lint errors: `npm run lint`
3. Types check: `npm run typecheck`
4. Format is correct: `npm run format:check`
5. Build succeeds: `npm run build`

### Commit Message Format

Uses conventional commits: `type(scope): description`

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `revert`

**Scopes**: `cli`, `core`, `providers`, `config`, `server`, `agent`, `tools`, `ci`, `deps`, `tests`

**Examples**:
```
feat(core): add reactive context compaction with overflow seeding
fix(tools): resolve type error in read tool stream options
test(hooks): add blockCap and continueOnBlock test suites
chore(deps): bump marked to ^15.0.12 for marked-terminal compatibility
ci(agent): add daily PR merge workflow with Kilo CLI automation
```

### PR Description Template

```markdown
## Summary
Brief description of changes.

## Motivation
Why this change is needed.

## Changes
- List of specific changes made

## Testing
How changes were tested.
```

### Automated Checks

Pull requests trigger:
1. **CI**: Tests, linting, build verification
2. **Documentation Update**: AI-powered docs generation from code changes
3. **CI Auto-Fix** (auto/* branches): Automatic fix for CI failures

### Code Review Expectations

Reviewers check:
- Code quality and adherence to TypeScript strict mode
- Test coverage for new code (target 80%+)
- Documentation accuracy
- Performance implications
- Security considerations (no secrets in code)

## Documentation

### Documentation Files

| File | Location | Purpose |
|------|----------|---------|
| ARCHITECTURE.md | `docs/` | System architecture with Mermaid diagrams |
| API.md | `docs/` | CLI commands and TypeScript interfaces |
| CONFIGURATION.md | `docs/` | All configuration options |
| TESTING.md | `docs/` | Testing guide and patterns |
| AUTOMATION.md | `docs/` | CI/CD workflows |
| CONTRIBUTING.md | `docs/` | This file |
| CHANGELOG.md | Root | Version history (Keep a Changelog format) |
| AGENTS.md | Root | AI agent coding guidelines |

### Documentation Standards

1. Use clear, professional technical language (no emojis)
2. Include code examples from actual codebase
3. Add Mermaid diagrams for complex flows
4. Keep examples up-to-date with code changes
5. Use proper markdown formatting

## Automation System

### Autonomous Sync

Alexi automatically syncs from upstream repositories daily. The sync applies upstream changes and then runs the CI auto-fix pipeline to ensure consistent formatting:

```mermaid
graph LR
    A[Daily 06:00 UTC] --> B[Sync Forks]
    B --> C[Analyze Changes]
    C --> D[AI Planning]
    D --> E[AI Execution]
    E --> F[Style Auto-Fix]
    F --> G[Create PR]
    G --> H[CI + Auto-Merge]
```

Sync commits follow the pattern `feat(sync): apply upstream changes (YYYY-MM-DD)` followed by a `style(ci): auto-fix lint/format issues [alexi-bot]` commit if formatting adjustments are needed.

### CI Autohealing

When CI fails on auto/* branches:
1. Failure logs collected and analyzed
2. Quick fixes applied (lint:fix, format)
3. Alexi agent applies targeted fixes
4. Fixes verified and committed
5. Rate-limited: max 2 runs/branch/day

### Style Auto-Fix

The CI pipeline automatically applies formatting and linting corrections on eligible branches. These changes are committed with the message format:

```
style(ci): auto-fix lint/format issues [alexi-bot]
```

This ensures consistent code style (trailing whitespace removal, blank line normalization, Prettier formatting) across all modules without manual intervention. Examples of auto-fixed patterns include:
- Trailing whitespace in class definitions and function bodies
- Inconsistent blank lines between code blocks
- Missing or extra trailing newlines at end of file

### Daily PR Merge

At 18:00 UTC daily, Kilo CLI processes open PRs:
- Checks merge eligibility
- Resolves simple conflicts
- Reports merge results
- Supports dry-run mode

### Contributing to Automation

When modifying workflows:
1. Test with manual dispatch and dry-run first
2. Update `docs/AUTOMATION.md`
3. Document new secrets or configuration
4. Use concurrency groups to prevent parallel runs
5. Set appropriate timeouts

## Adding New Slash Commands

When adding a new interactive REPL command (like `/rewind`):

1. **Add to completer registry** (`src/cli/utils/completer.ts`):
   ```typescript
   { name: 'mycommand', description: 'What it does', category: 'session' }
   ```

2. **Implement handler** in `src/cli/interactive.ts` under the `handleCommand` switch:
   ```typescript
   case 'mycommand': {
     // Implementation
     return true;
   }
   ```

3. **Create implementation module** in `src/command/mycommand.ts` for complex logic

4. **Write tests** in `tests/command/mycommand.test.ts` following the pattern in `tests/command/rewind.test.ts`

5. **Update documentation** in `docs/API.md` under Interactive Mode Commands

## Getting Help

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Provide minimal reproducible examples for bugs
- Reference specific file paths and line numbers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

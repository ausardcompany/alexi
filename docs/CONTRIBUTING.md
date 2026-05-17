# Contributing Guide

This document covers the development workflow, coding standards, and contribution guidelines for Alexi.

## Table of Contents

- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Autonomous Sync System](#autonomous-sync-system)

## Development Setup

### Prerequisites

- Node.js >= 22.12.0
- npm (included with Node.js)
- Git

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/ausardcompany/alexi.git
cd alexi

# Install dependencies
npm ci

# Copy environment template
cp .env.example .env
# Edit .env with your SAP AI Core credentials

# Verify setup
npm run typecheck
npm run lint
npm test
```

### Development Commands

```bash
# Run in development mode (tsx - no build needed)
npm run dev

# Build TypeScript to dist/
npm run build

# Type-check without emitting files
npm run typecheck

# Run ESLint
npm run lint
npm run lint:fix

# Format code with Prettier
npm run format
npm run format:check

# Run tests
npm test
npm run test:watch
npm run test:coverage
```

## Development Workflow

### Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` / `master` | Production-ready code |
| `auto/*` | Automated PRs (sync, implementations) |
| `feature/*` | Manual feature development |
| `fix/*` | Bug fixes |

### Feature Development

1. Create a branch from `main`:
   ```bash
   git checkout -b feature/my-feature main
   ```

2. Develop with type checking:
   ```bash
   npm run dev  # Run with tsx for fast iteration
   ```

3. Ensure quality gates pass:
   ```bash
   npm run typecheck && npm run lint && npm test
   ```

4. Commit using conventional commits (see below)

5. Push and create a PR targeting `main`

### Automated Workflows

When you open a PR, several automated processes run:
- **CI Pipeline**: Lint, typecheck, test, build
- **Documentation Update**: Generates/updates documentation for your changes
- **Daily Merge**: Passing PRs are automatically merged daily at 18:00 UTC

If CI fails on an `auto/*` branch, the CI Auto-Fix workflow attempts to resolve issues automatically.

## Coding Standards

### TypeScript Configuration

- **Target**: ES2022
- **Module**: NodeNext (ES Modules)
- **Strict mode**: Enabled
- **No implicit any**: Enforced

### Formatting (Prettier)

| Setting | Value |
|---------|-------|
| Indentation | 2 spaces |
| Quotes | Single quotes |
| Semicolons | Always |
| Line width | 100 characters |
| Trailing commas | ES5 style |
| Line endings | LF |

### Import Conventions

```typescript
// External imports first
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

// Internal imports second - always use .js extension
import { defineTool } from '../index.js';
import type { ToolContext } from '../tool/index.js';
import { routePrompt } from './router.js';
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | camelCase | `orchestrator.ts`, `sessionManager.ts` |
| Functions | camelCase | `sendChat()`, `routePrompt()` |
| Classes | PascalCase | `SessionManager`, `HookManagerImpl` |
| Interfaces/Types | PascalCase | `ToolContext`, `HookDefinition` |
| Constants | UPPER_SNAKE_CASE | `MAX_LINES`, `MAX_BYTES`, `DEFAULT_TIMEOUT` |
| Unused params | Prefix with `_` | `_context`, `_unused` |

### Type Guidelines

```typescript
// Prefer interfaces for object shapes
interface ToolContext {
  workdir: string;
  signal?: AbortSignal;
}

// Use type for unions/intersections
type PermissionAction = 'read' | 'write' | 'execute' | 'network' | 'admin';
type HookType = 'command' | 'http' | 'script';

// Use Zod for runtime validation
const ParamsSchema = z.object({
  filePath: z.string().describe('Absolute path to the file'),
  offset: z.number().optional(),
});

// Avoid `any` - use `unknown` and narrow types
function handleError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
```

### Error Handling

```typescript
// Standard result pattern
interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Async error handling
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  return { success: false, error: message };
}
```

### ESLint Rules

Key rules enforced in the codebase:

| Rule | Setting | Note |
|------|---------|------|
| `no-console` | warn | Use logger utilities instead |
| `eqeqeq` | error | Always use `===` and `!==` |
| `curly` | error | Always use braces for control statements |
| `no-throw-literal` | error | Throw Error objects, not strings |
| `prefer-const` | error | Use `const` when not reassigned |
| `@typescript-eslint/no-explicit-any` | warn | Use `unknown` instead |
| `@typescript-eslint/no-unused-vars` | error | Prefix unused with `_` |

## Testing Guidelines

### Test Framework

Alexi uses **Vitest** for testing with the following patterns:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Component Name', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should do something specific', async () => {
    // Arrange, Act, Assert
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

// Mock after import for spying
import { myModule } from '../src/module.js';
vi.spyOn(myModule, 'method').mockResolvedValue(result);
```

### Running Tests

```bash
# All tests
npm test

# Single file
npm test -- tests/hooks/preToolUse.test.ts

# Pattern match
npm test -- --grep "block cap"

# Directory
npm test -- tests/compaction/

# With coverage
npm run test:coverage
```

### Test Requirements

- All new features must include unit tests
- Bug fixes should include a regression test
- Use temporary directories for file operations
- Never make real API calls in unit tests (mock providers)
- Clean up resources in `afterEach`
- Set appropriate timeouts for async tests

## Commit Conventions

Alexi uses [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD changes |
| `revert` | Reverts a previous commit |

### Scopes

| Scope | Area |
|-------|------|
| `cli` | CLI commands and program |
| `core` | Orchestrator, router, session |
| `providers` | SAP AI Core provider |
| `config` | Configuration system |
| `server` | HTTP server mode |
| `agent` | Agent system |
| `tools` | Tool implementations |
| `ci` | CI/CD workflows |
| `deps` | Dependencies |
| `tests` | Test infrastructure |

### Examples

```
feat(tools): add background task support to task tool
fix(core): resolve context overflow during long conversations
docs(config): document hook configuration options
test(hooks): add block cap enforcement tests
ci(agent): add daily PR merge workflow
refactor(compaction): extract chunked compaction to separate module
```

### Commitlint

Commits are validated by commitlint via Husky pre-commit hook. The configuration enforces:
- Conventional commit format
- Lowercase type
- No period at end of subject
- Subject line max 100 characters

## Pull Request Process

### Creating a PR

1. Ensure all quality gates pass locally:
   ```bash
   npm run typecheck && npm run lint && npm test
   ```

2. Push your branch and create a PR via GitHub

3. The CI pipeline and documentation workflow will run automatically

4. Address any review feedback

### PR Requirements

- All CI checks must pass (lint, typecheck, test, build)
- PR title should follow conventional commit format
- Include a description of changes and motivation
- Reference related issues where applicable

### Automated Merge

Passing PRs are eligible for the daily automated merge at 18:00 UTC. The Kilo CLI evaluates each PR and merges those that:
- Pass all CI checks
- Have no merge conflicts
- Are not marked as draft

### Review Standards

Code review focuses on:
- Type safety and proper TypeScript patterns
- Error handling completeness
- Test coverage for new functionality
- Consistent naming and style conventions
- No `any` types without justification
- Proper async/await usage
- Clean separation of concerns

## Autonomous Sync System

Alexi automatically syncs changes from three upstream repositories:

| Upstream | Purpose |
|----------|---------|
| Kilo-Org/kilocode | Primary feature source |
| anomalyco/opencode | Architecture patterns |
| anthropics/claude-code | Tool and agent patterns |

### How It Works

1. **Daily at 06:00 UTC**: The sync workflow runs automatically
2. **Fork sync**: Updates local forks from upstream
3. **Diff analysis**: Compares changes since last sync
4. **AI analysis**: Kilo CLI agent analyzes diffs for relevant changes
5. **PR creation**: Creates PRs with analyzed changes on `auto/sync-*` branches

### Working with Sync PRs

Sync PRs are created by the bot and follow the pattern:
- Branch: `auto/sync-upstream-YYYY-MM-DD`
- Title: `feat(sync): apply upstream changes (YYYY-MM-DD)`
- Body: Contains diff analysis and applied changes

These PRs go through normal CI and are eligible for daily auto-merge.

### Manual Sync

To trigger a manual sync:
1. Go to Actions > "Sync Upstream Changes"
2. Click "Run workflow"
3. Optionally enable `dry_run` (analyze only) or `force_sync`

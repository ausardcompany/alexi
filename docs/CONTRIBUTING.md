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

### Optional: tree-sitter grammars

The AST-based symbol extraction path used by `src/context/**` and the AST
mode of the `definitions` tool relies on native tree-sitter grammars. These
grammars are optional; the `definitions` tool falls back to a built-in
regex-based extractor when they are missing. Contributors are encouraged to
install them so the tree-sitter test files run locally:

```bash
npm install tree-sitter tree-sitter-typescript tree-sitter-javascript tree-sitter-bash
```

CI always has the grammars installed (they are currently declared as regular
`dependencies` in `package.json`, with a planned migration to optional
dependencies tracked in a follow-up issue), so `npm run test:coverage`
exercises both paths on every PR. See
[`docs/TOOLS.md`](TOOLS.md#definitions-tool) for the AST-vs-regex comparison
and the [Optional Dependencies](../README.md#optional-dependencies) section
of the README for install size and platform caveats.

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

#### CLI command actions: dynamic-import the heavy graph (issue #1769)

Files under `src/cli/commands/*.ts` follow one extra rule that does not apply to the rest of the codebase: **heavy runtime modules used only inside the `.action(async (opts) => { ... })` closure must be loaded via dynamic `import(...)` inside the action, not statically at the top of the file.** The registration function (`registerXxxCommand(program)`) is called on every `alexi` invocation just to record Commander metadata for `--help`; a static import there transitively resolves the entire dependency graph, so `alexi --help` ends up loading the TUI, the orchestrator, and the SAP AI SDK for no reason.

The convention (see `src/cli/commands/chat.ts`, `agent.ts`, `interactive.ts`, `models.ts`, `server.ts` for reference implementations):

```typescript
// src/cli/commands/foo.ts
import { Option, type Command } from 'commander';
// Type-only imports stay top-level (erased at compile time).
import type { AutoCommitManager } from '../../git/autoCommit.js';

export function registerFooCommand(program: Command): void {
  program
    .command('foo')
    .description('Do foo')
    .action(async (opts: FooOptions) => {
      // Heavy imports live here, inside the action.
      const [
        { sendChat },
        { SessionManager },
        { createAutoCommitManager },
      ] = await Promise.all([
        import('../../core/orchestrator.js'),
        import('../../core/sessionManager.js'),
        import('../../git/autoCommit.js'),
      ]);
      // ... use the destructured locals
    });
}
```

Rules of thumb:

- **Type-only imports stay at the top.** `import type { Foo } from '...'` and `import { type Foo } from '...'` are erased by `tsc` so cost nothing at runtime. Prefer them over `ReturnType<typeof heavyFactory>` when the factory itself would otherwise be a static import.
- **Group dynamic imports into one `Promise.all([...])`.** The imports run concurrently, so batching gives a single microtask boundary and keeps the action body readable. Do not scatter individual `await import(...)` calls through the action body — the reader has to reconstruct the load graph manually and TypeScript cannot narrow the types as cleanly.
- **Register the specifier in `tests/cli/lazyLoading.test.ts`.** When you move an import out of the static graph, add the specifier to `BANNED_TOP_LEVEL_IMPORTS[<file>]` in the test. Both the static-import audit and the dynamic-import audit rely on that table; if you forget, the regression is undetected and the next reviewer who "cleans up" the dynamic import by making it static will not fail CI.
- **Exports used by other tests stay static.** If a helper you export is imported by a test (`import { runChatImageMode } from '../src/cli/commands/chat.js'`), its own dependencies MUST stay at the top level — the test would otherwise see undefined references. Only imports used purely inside the `.action(...)` body should be moved.
- **Non-command entry points are unaffected.** The TUI when spawned from `startTui` outside the CLI, the socket server, and programmatic `sendChat` callers all import their dependencies statically at the call site. The refactor is scoped to files that register Commander subcommands.

Non-command files should NOT copy this pattern. Dynamic imports have a real ergonomic cost (weakened type narrowing, harder to grep for callers, extra microtask on every call) and are only worth it when the alternative is paying the cost on every CLI startup.

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

10. **Return Type Inference for Helpers**: Prefer inferred return types on
     internal helpers when the annotation would restate what TypeScript
     already computes. The auto-formatter routinely collapses redundant
     annotations; write helpers that reflow cleanly under Prettier's
     100-column ceiling. Keep explicit annotations on the exported public
     API where the return type is part of the contract.
     ```typescript
     // Preferred: inferred return type on a Zod preprocessor helper
     function decodeJsonIfString<T extends z.ZodTypeAny>(schema: T) {
       return z.preprocess((value) => {
         if (typeof value !== 'string') { return value; }
         const trimmed = value.trim();
         if (!trimmed || (trimmed[0] !== '{' && trimmed[0] !== '[')) {
           return value;
         }
         try { return JSON.parse(trimmed); } catch { return value; }
       }, schema);
     }
     ```

11. **Permission Actions**: Use standard taxonomy
     ```typescript
     // Standard: 'read' | 'write' | 'execute' | 'network' | 'admin'
     permission: { action: 'admin', getResource: (params) => params.action }
     ```

12. **Event Definitions**: Use Zod schemas with the event bus (see `src/bus/index.ts`)
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

13. **Event Subscriptions**: Subscriptions are acquired eagerly; handlers are added immediately to the handler set to prevent race conditions between subscribe and first event emission.

     Notification events published from tool `execute` methods (e.g. `PlanOpened` in `src/tool/tools/open-plan.ts`) MUST wrap `publish(...)` in `try/catch` because the notification is not a correctness dependency of the tool. A schema-mismatch or throwing subscriber must never crash the tool:
     ```typescript
     try {
       PlanOpened.publish({ sessionId: context.sessionId, path: resolved, title, timestamp: Date.now() });
     } catch {
       // Non-fatal.
     }
     ```

14. **Plugin Tool Compatibility**: When creating plugin tools, ensure `ask` returns a `Promise<string>` (not an Effect). Use `createPluginToolWrapper()` from `src/tool/plugin-tools.ts` to adapt plugin interfaces.

15. **Tool Registry Resolution**: Register dynamic tool resolvers via `EnhancedToolRegistry.registerPromptResolver()` for tools that need session/agent context to resolve.

### ESLint Rules

Key rules enforced:
- `no-console: warn` -- Use logger utilities
- `eqeqeq: error` -- Always use `===` and `!==`
- `curly: error` -- Always use braces for control statements
- `prefer-const: error` -- Use `const` when not reassigned
- `@typescript-eslint/no-explicit-any: warn`
- `@typescript-eslint/no-unused-vars: error`
- `@typescript-eslint/no-namespace: error` -- New code must NOT use TypeScript `namespace` blocks. The only sanctioned exception is upstream-kilocode compat modules under `src/kilocode/**` and `src/core/session/recall-message-index.ts`, which re-export the upstream `namespace X { ... }` API shape so cross-repo diffs stay reviewable. Those files carry a line-scoped `// eslint-disable-next-line @typescript-eslint/no-namespace -- mirrors upstream kilocode API shape` immediately above the `export namespace` keyword. Do not apply a file-scoped disable — the suppression must remain line-scoped so the rule still fires on unrelated additions.

### Zod v4 record signature

The project uses Zod v4. The single-argument `z.record(z.unknown())` form is deprecated in v4; always write the explicit key/value form `z.record(z.string(), z.unknown())` (or the appropriate key schema) so the code type-checks and lints cleanly:

```typescript
// Preferred (Zod v4):
payload: z.record(z.string(), z.unknown()).optional();

// Deprecated (Zod v3 single-argument form):
payload: z.record(z.unknown()).optional();
```

This applies uniformly to tool parameter schemas (`src/tool/tools/*.ts`), persisted entity schemas (`src/kilocode/wakeup/schema.ts`), and event payload schemas registered via `defineEvent` (`src/bus/index.ts`). When porting an upstream kilocode module that still uses the single-argument form, migrate the call site in the same commit as the port so `npm run typecheck` and `npm run lint` stay green.

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

When testing anything that reads the dynamic model catalog (`src/providers/modelCatalog.ts`), mock `@sap-ai-sdk/ai-api` and call `invalidateCatalog()` in `beforeEach` — the module holds a process-wide cache that leaks across tests. See [`docs/TESTING.md#testing-the-dynamic-model-catalog`](./TESTING.md#testing-the-dynamic-model-catalog).

**Adding a new entry to `ORCHESTRATION_MODELS`.** Every new model id added to the static catalog in `src/providers/sapOrchestration.ts` MUST ship with a contract-pinning test in `src/providers/__tests__/modelCatalog.test.ts` (or a sibling file) that walks the id through the full matcher chain: `ORCHESTRATION_MODELS` membership, `isOrchestrationModel(id)`, `getAvailableModels()`, `isAvailableModel(id)`, `ORCHESTRATION_MODEL_METADATA[id]`, `modelHasCapability(id, 'tools')`, and (for reasoning-capable families) `modelSupportsReasoningEffort(id)` on the bare id, the uppercase form, and a `sap-ai-core/`-prefixed envelope. The canonical worked example is the `deepseek-v4.1-flash` suite added in commit `531a15c1` — see the "Testing static-catalog membership contracts" subsection of [`docs/TESTING.md`](./TESTING.md) for the full patterns. Prefer `.toEqual(siblingMeta?.capabilities)` cross-checks over duplicated capability literals so family-wide capability updates propagate without search-and-replace churn.

**Adding a family of ids at once.** When a single feed introduces several sibling ids together — for example, the Aider PR #5173 port (commit `9f0a65c8`, 2026-09-21) that added the five `anthropic--claude-*-YYYYMMDD` dated snapshots — factor the seven-assertion contract into a `describe` block with `it.each(family as const)` instead of duplicating the block per id. Pin BOTH the bare-id form AND the `sap-ai-core/<id>` router-envelope form for every capability assertion so the provider-prefix stripping in `modelHasCapability` is exercised on the first sibling instead of failing silently in the router hot loop. See the `Parametrised coverage for id families (Anthropic dated snapshots, Aider #5173)` subsection of [`docs/TESTING.md`](./TESTING.md) for the full reference suite. When the new ids inherit their capability profile from an existing sibling (moving tag ↔ dated snapshot in the same family), an exact-array assertion (`.toEqual(['tools'])`) is preferred over `.toContain('tools')` because it also catches an accidentally-seeded second tag.

**Do NOT `vi.spyOn` on Node builtin namespace exports.** Under Alexi's ESM configuration (`"type": "module"` + `module: NodeNext` + Node >= 22.12), entries on `fs/promises`, `node:fs`, `node:child_process`, `node:os`, and `node:path` are exposed as non-configurable own accessors on the namespace object. `vi.spyOn(fs, 'readdir')` — and, in most cases, `vi.mock('fs/promises', ...)` with a partial-override factory that spreads `vi.importActual(...)` — throws `TypeError: Cannot redefine property: <name>` at test load time. This is a Vitest ESM limitation documented at `https://vitest.dev/guide/browser/#limitations`, not a bug in Alexi's test setup. The correct alternatives are (in order of preference): (1) accept the I/O boundary as a function parameter (see [Injectable I/O boundaries (preferred over module mocks)](#injectable-io-boundaries-preferred-over-module-mocks) below) so the test can pass a stub directly; (2) route the call through a wrapper module you own (`src/utils/fs-wrapper.ts` or similar) which Vitest CAN mock because its exports are configurable ESM re-exports; (3) quarantine the case into a suite that runs under `vitest --pool=vmThreads`, accepting the CI-time cost that comes with it. Worked example, 2026-09-05, commit `400ccb7f` (`fix(tests): skip ESM-incompatible fs.readdir spy test in glob-timeout [alexi-bot]`): `tests/tool/tools/glob-timeout.test.ts` originally used `vi.spyOn(fs, 'readdir').mockImplementation(() => new Promise(() => {}))` to simulate a hung filesystem so the `GLOB_SEARCH_TIMEOUT_MS = 30_000` deadline was the only way the promise could settle. Under ESM the spy threw at load time and the whole file failed to collect. The negative case is now `it.skip` with the ESM rationale inlined at the call site; the positive case (`does not set timedOut on a successful fast search`) still runs unchanged. See [`docs/TESTING.md#testing-the-bounded-glob-deadline-kilocode-pr-13805-adaptation`](./TESTING.md#testing-the-bounded-glob-deadline-kilocode-pr-13805-adaptation) for the full three-option contributor guidance.

### Minify-safe class detection

Production bundlers (esbuild, Bun, terser, swc) rename local class identifiers to single letters, silently breaking any control-flow gate that reads `obj.constructor.name === 'SomeClass'`. When contributing telemetry, instrumentation, or any code that needs to detect an object's class at runtime, follow the reference pattern established by `src/utils/telemetry.ts`:

1. **Never use `constructor.name` as a control-flow gate.** It is safe for logging and error messages, but never for branch decisions. The rule is enforced by convention and by review — there is no ESLint rule for it because the bare pattern is legitimate in log strings.
2. **Export a structural interface (`FooLike`), not the concrete class.** Consumers should type-check against the required method surface, not against class identity.
3. **Export a duck-typed guard (`isFoo(obj: unknown): obj is FooLike`)** that checks every method on the required surface. Never weaken it to a single-method probe.
4. **Export the singleton reference (`fooInstance`)** so consumers can perform identity checks (`obj === fooInstance`) — the cheapest and most robust minify-immune check.
5. **Add a sibling `<module>-minify.test.ts`** that pipes the module through `esbuild.transform` with `minify: true` and asserts the structural helpers still work against the minified output. See [`docs/TESTING.md#testing-minify-safe-telemetry-detection`](./TESTING.md#testing-minify-safe-telemetry-detection) for the reference suite and [`docs/ARCHITECTURE.md#minify-safe-patterns`](./ARCHITECTURE.md#minify-safe-patterns) for the design rationale.

### Test import-path depth

Test files under `tests/` walk up to the repository root before descending into `src/`. The number of `../` segments needed depends on where the test file lives, and it must always land in `src/` — never in a sibling under `tests/` itself. Concrete rules:

| Test file location                                       | Relative prefix to `src/` |
| -------------------------------------------------------- | ------------------------- |
| `tests/*.test.ts` (top-level)                            | `../src/`                 |
| `tests/<category>/*.test.ts` (one nested directory)      | `../../src/`              |
| `tests/<category>/<sub>/*.test.ts` (two nested)          | `../../../src/`           |
| `tests/<a>/<b>/<c>/*.test.ts` (three nested)             | `../../../../src/`        |

A common failure mode is to omit the final `src/` segment and target a nested `tests/<category>/<name>.js` sibling that does not exist. Vitest reports this as `Failed to resolve import "..."` at collection time and every case in the file fails at import, not at assertion. Worked example, 2026-08-21, commit `b4fcb19a` (`fix(tests): correct import path in instance-watcher test [autohealing]`): `tests/core/filesystem/instance-watcher.test.ts` imported `../../core/filesystem/watcher.js` — which resolves to a nonexistent `tests/core/filesystem/watcher.js` — and was corrected to `../../../src/core/filesystem/watcher.js` (three parent segments to escape `tests/core/filesystem/`, then `src/core/filesystem/watcher.js`). Diff statistics: `1 file changed, 1 insertion(+), 1 deletion(-)`. All ten cases in the file — the two-instance state isolation regression from kilocode `b8984e468`, the idempotent-registration case, the `stop()` scoping case, the VCS-guard skip, the experimental-flag skip, the debounce-timer replace-and-cleanup case, and the backwards-compatible `startWatcher` shim delegation case — were failing at import-time until the prefix was fixed. See `CHANGELOG.md` `[Unreleased] > Fixed` and `docs/TESTING.md#testing-instancewatcher-and-debounce-timer-cleanup` for the corrected code example.

Reminder: every local import ends in `.js` even from `.ts` files (`AGENTS.md` under **ESM + import rules**). An import without `.js` will pass `tsc --noEmit` but fail at runtime and in Vitest.

### Injectable I/O boundaries (preferred over module mocks)

When code touches platform-specific I/O — filesystem, subprocess, `https`
agent state — prefer accepting the I/O boundary as a function parameter over
mocking `node:fs` / `node:child_process` globally. This keeps tests hermetic,
parallel-safe, and reviewable. The auto-CA harvester in `src/providers/ca.ts`
is the canonical example: `harvestLinuxCAs` accepts `reader` and `exists`
callbacks, `harvestMacosCAs` accepts a `SecurityRunner`, and
`installHarvestedCAs` accepts an `agent` override. Follow the same pattern for
new providers, tools, or hooks that touch external I/O. See
`docs/TESTING.md#testing-the-auto-ca-harvester` for a fully worked example.

**Test-only reset / probe hooks (preferred over module-level mutation).** When
a module maintains a process-wide cache that cannot easily be injected — the
canonical example is `detectShell` in `src/tool/tools/shell/id.ts`, which
caches the resolved shell path for a short TTL — expose two `_`-prefixed
exports that let tests bypass and reset the cache: `_resetXCacheForTests()`
and `_setXProbeForTests(probe | undefined)`. The nested-PowerShell suite in
`tests/tool/tools/shell/bash-powershell-unwrap.test.ts` uses this shape to
route `bashTool` through PowerShell on a POSIX developer box:

```typescript
import {
  _resetDetectShellCacheForTests,
  _setFsProbeForTests,
} from '../../../../src/tool/tools/shell/id.js';

afterEach(() => {
  _resetDetectShellCacheForTests();
  _setFsProbeForTests(undefined);
});

function forcePwsh(): void {
  _resetDetectShellCacheForTests();
  _setFsProbeForTests((p: string) => p === pwsh.path);
  process.env.SHELL = pwsh.path;
}
```

Rules for this pattern:

1. **The exports are prefixed with `_` and named `*ForTests`.** ESLint's
   `no-unused-vars` rule already allows `_`-prefixed imports; the `ForTests`
   suffix documents intent for grep and code review. Do not drop the suffix
   just because the export happens to also work in production.
2. **`afterEach` MUST reset both the cache AND the probe override.** A
   leaked probe pins every subsequent bash-tool test to the same fake shell
   binary and produces test failures that look like flakiness. Restoration
   is not optional.
3. **Do not use these hooks in production code.** They exist so a unit test
   can pin a hermetic view of the filesystem without spawning a real shell
   or mutating global `process.env` state permanently.

### Experimental flag gating (preferred over hard flag reads)

New behaviour that ports upstream features should be gated behind an `experimental.*` flag when the feature changes tool contracts, override defaults, or introduces new resolution paths. The canonical pattern lives in `src/config/userConfig.ts` — `experimental.task_model_selection` (2026-08-31, ports upstream `ab143253a`) demonstrates the full shape:

- Store the flag inside a top-level `experimental` object so new flags can coexist without schema migration.
- Provide a `getConfig<Name>()` reader that returns `false` for missing, non-object, array, or non-boolean values (never throw).
- Provide a `setConfig<Name>(enabled: boolean): void` writer that merges into the existing `experimental` object without clobbering peer flags.
- Callers gate at the tool boundary and return a `success: false` error pointing at the flag when the feature is invoked without opt-in. Do NOT silently ignore the caller's intent — a buggy call with the flag off should be visible.

Example from `src/config/userConfig.ts`:

```typescript
export function getConfigTaskModelSelection(): boolean {
  const config = loadFullConfig();
  const experimental = config.experimental;
  if (!experimental || typeof experimental !== 'object' || Array.isArray(experimental)) {
    return false;
  }
  const value = (experimental as Record<string, unknown>).task_model_selection;
  return value === true;
}

export function setConfigTaskModelSelection(enabled: boolean): void {
  const config = loadFullConfig();
  const existing =
    config.experimental &&
    typeof config.experimental === 'object' &&
    !Array.isArray(config.experimental)
      ? (config.experimental as Record<string, unknown>)
      : {};
  config.experimental = { ...existing, task_model_selection: enabled };
  saveFullConfig(config);
}
```

And the tool-side gate from `src/tool/tools/task.ts`:

```typescript
if (requestedModel || requestedProvider || requestedReasoning) {
  if (!getConfigTaskModelSelection()) {
    return {
      success: false,
      error:
        'Per-task model selection is disabled. Set experimental.task_model_selection=true in ~/.alexi/config.json to allow subagents to override model/provider/reasoning_effort.',
    };
  }
  // ... resolve model
}
```

Tests for experimentally-gated code should snapshot the flag with `vi.spyOn(userConfig, 'getConfigTaskModelSelection')`, mutate it per case, and restore in `afterEach` so per-test state does not leak. See `docs/TESTING.md#testing-per-task-model-selection` for the full pattern.

**Additional worked example — `experimental.sharedAgentBoard` (2026-09-03, ports upstream kilocode `162e30d23`; env-flag enable path 2026-09-11, ports upstream kilocode #14013).** The same shape is applied to gate the `kilo_board_read` / `kilo_board_write` tools. The registration site sits in `src/tool/tools/index.ts:128` inside `registerBuiltInTools()`, which reads the resolver once per process and registers the tools only when the flag is on:

```typescript
export function registerBuiltInTools(): void {
  for (const tool of builtInTools) {
    registerTool(tool as Tool<any, any>);
  }
  if (isBoardEnabled()) {
    registerTool(boardReadTool as Tool<any, any>);
    registerTool(boardWriteTool as Tool<any, any>);
  }
}
```

Prefer gating at **registration time** (as above) when the tool should be invisible to the model when the flag is off — the model does not learn about `kilo_board_*` at all when the flag is `false`, so it cannot mistakenly call them. Prefer gating at the **tool boundary** (returning a `success: false` error) when the tool is always present but its behaviour changes with the flag (e.g. per-task model selection on the `task` tool). Both patterns share the same `experimental.*` config helper contract.

**Multi-signal enable paths (config + env flags).** For experimental features that operators need to flip on temporarily (CI runs, Docker containers, one-off sessions), extend the base config helper with an `isXEnabled()` resolver that unions the persistent config key with one or more env flags. Alexi currently has two coexisting resolvers for the shared agent board — one under Alexi's own `KILO_*` env-var namespace, and one preserving upstream kilocode's `KILOCODE_*` namespace.

The Alexi-native shape (issue #1698) is `isBoardEnabled()` in `src/config/userConfig.ts:628`:

```typescript
export function isBoardEnabled(): boolean {
  return (
    getConfigSharedAgentBoard() ||
    process.env.KILO_EXPERIMENTAL_SHARED_AGENT_BOARD === '1' ||
    process.env.KILO_EXPERIMENTAL === '1'
  );
}
```

Contract:

1. **Boolean OR.** An explicit config `false` MUST NOT override a set env flag. This is what lets an operator flip a feature on without editing the persistent config file. If you need "env can only turn the feature OFF", introduce a separate `disable` flag — do not invert the OR semantics of the enable path.
2. **Strict-equality against the literal string `'1'`.** Any other value (`'0'`, `'true'`, empty, unset) is treated as unset. This keeps the enable path unambiguous and prevents `KILO_EXPERIMENTAL=0` from being misread as an opt-in. Never `Boolean(process.env.FOO)` — that pattern would enable on `'0'`, `'false'`, and every other non-empty string.
3. **Feature-specific flag first, umbrella flag second.** The specific flag (`KILO_EXPERIMENTAL_SHARED_AGENT_BOARD=1`) exists so operators can enable a single feature; the umbrella flag (`KILO_EXPERIMENTAL=1`) exists so CI configurations can enable every experimental feature at once. Both should be checked; order does not affect correctness (short-circuit `||`) but the feature-specific flag reads more naturally when it comes first.
4. **All call sites go through the resolver, not the raw config reader.** Every registration site and every tool-boundary gate should call `isXEnabled()`, not `getConfigX()`. Otherwise an operator who set only the env flag would see the tool listed (via the raw config reader) but rejected at execution time (via the resolver), or vice versa. Migrated call sites for the board port: `src/tool/tools/index.ts:129` (registration gate) and `src/tool/tools/task.ts:476` (swarm-identity attachment).
5. **Test the resolver through the real config file.** `isXEnabled()` and `getConfigX()` live in the same module, so `vi.mock` cannot intercept the intra-module call. Snapshot `~/.alexi/config.json` in `beforeEach` and restore in `afterEach`, and snapshot each env var at `describe` scope. See `docs/TESTING.md#testing-the-shared-agent-board-env-flag-enable-path` for the full 6-case reference suite.

**Upstream kilocode env flag mirror (2026-09-11, ports kilocode PR #14013).** In parallel, the upstream `KILOCODE_EXPERIMENTAL_SWARM_BOARD` env flag is exposed in its own module at `src/kilocode/board/enabled.ts` so downstream tooling that ports from kilocode continues to see the upstream env-var name:

```typescript
const TRUTHY = new Set(['1', 'true', 'yes', 'on']);
const FALSY = new Set(['0', 'false', 'no', 'off']);

export function isBoardEnabled(experimentalConfigFlag: boolean = false): boolean {
  const raw = process.env.KILOCODE_EXPERIMENTAL_SWARM_BOARD;
  if (raw !== undefined) {
    const lowered = raw.toLowerCase();
    if (TRUTHY.has(lowered)) return true;
    if (FALSY.has(lowered)) return false;
  }
  return experimentalConfigFlag === true;
}
```

Precedence contract (mirror-only; this module is not currently wired into tool registration — the `userConfig.ts` resolver above is the primary gate):

1. Env var explicit truthy → force on.
2. Env var explicit falsy → force off (overrides persisted config so operators can disable per-run).
3. Env var unset → fall back to the persisted `experimental.*` config passed in as the argument. The channel-default derivation lives in `src/flag/flag.ts` via `unstableDefault()` — expose that as a sibling constant (e.g. `Flag.KILOCODE_EXPERIMENTAL_SWARM_BOARD`) rather than duplicating the resolution logic here.

Keep both predicates sync and side-effect-free so they are safe to call from tool registration (which runs before any async subsystem is initialised).

### One-way config key migration with a one-shot deprecation warning

When a persisted-config key moves to a new canonical location (e.g. `context.compactionModel` → `models.compaction` in `1.22.18`, ports kilocode `f64c6646d`), the read/write helpers on `src/config/userConfig.ts` follow a fixed contract so the migration is safe against partial rollouts and stale operator configs.

**Read side:** first-non-empty-wins across (new canonical key) → (legacy key). When the legacy branch fires, emit a **one-shot per-process deprecation warning** guarded by a module-level flag, then return the legacy value. This lets operators upgrade at their own pace and the noise is bounded to a single line per process regardless of how many times the helper is called.

```typescript
let _warnedLegacyCompactionModel = false;

export function getConfigCompactionModel(): string | undefined {
  const config = loadFullConfig();

  // 1. New canonical location.
  const models = config.models;
  if (models && typeof models === 'object' && !Array.isArray(models)) {
    const value = (models as Record<string, unknown>).compaction;
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  // 2. Legacy location — emit ONE deprecation warning per process.
  const context = config.context;
  if (context && typeof context === 'object' && !Array.isArray(context)) {
    const legacy = (context as Record<string, unknown>).compactionModel;
    if (typeof legacy === 'string' && legacy.trim().length > 0) {
      if (!_warnedLegacyCompactionModel) {
        _warnedLegacyCompactionModel = true;
        // eslint-disable-next-line no-console
        console.warn(
          '[alexi] config: `context.compactionModel` is deprecated; ' +
            'use `models.compaction` instead.'
        );
      }
      return legacy.trim();
    }
  }

  return undefined;
}
```

**Write side:** always write to the NEW canonical key, AND clear the legacy key from the persisted file so subsequent reads never fall back to a stale value. The write is one-way — future reads will find the value at the new location only.

```typescript
export function setConfigCompactionModel(modelId: string): void {
  const trimmed = modelId.trim();
  if (trimmed.length === 0) {
    throw new Error('compaction model id must be a non-empty string');
  }
  const config = loadFullConfig();
  const existingModels =
    config.models && typeof config.models === 'object' && !Array.isArray(config.models)
      ? (config.models as Record<string, unknown>)
      : {};
  config.models = { ...existingModels, compaction: trimmed };

  // Clean up the legacy key so migration is one-way.
  if (config.context && typeof config.context === 'object' && !Array.isArray(config.context)) {
    const ctx = { ...(config.context as Record<string, unknown>) };
    if ('compactionModel' in ctx) {
      delete ctx.compactionModel;
      config.context = ctx;
    }
  }

  saveFullConfig(config);
}
```

**Test hook.** Expose a `@internal` helper that resets the one-shot warning flag so tests can re-observe the deprecation message across cases:

```typescript
/**
 * Test-only hook: reset the one-shot legacy-key deprecation warning cache.
 * @internal
 */
export function _resetLegacyCompactionModelWarning(): void {
  _warnedLegacyCompactionModel = false;
}
```

Guidelines for future config migrations following this convention:

1. **`console.warn` is allowed here.** `src/config/userConfig.ts` is one of the modules that intentionally violates the `no-console: warn` project-wide ESLint rule with a targeted `eslint-disable-next-line`. Do not switch to `logger.warn` — it would create an import cycle (`userConfig` is imported by `logger`'s configuration branch).
2. **Never remove the legacy key from the read helper in the same release that adds it to the write helper.** The migration must survive at least one minor version so operators upgrading across a version gap don't lose their setting. Remove the legacy branch in a documented deprecation cut later.
3. **Never write to both locations.** The point of the migration is that the on-disk config is canonical — a tool inspecting `~/.alexi/config.json` should see the value at the new location only.
4. **Test both the fresh-config and the migrating-config paths.** The regression suite MUST include (a) `models.compaction` present, legacy absent → new wins; (b) legacy present, new absent → legacy wins AND emits the warning; (c) both present → new wins AND no warning; (d) neither present → returns `undefined`; (e) `setConfigCompactionModel` with legacy present → new is written AND legacy is deleted.

### JSON-tolerant tool parameter decoding

Some LLM providers (Anthropic in particular) emit structured tool-call parameters as JSON-encoded strings rather than the native object shape. Tools with structural fields — `config`, `tasks`, `arguments` — should wrap those fields with a `decodeJsonIfString` preprocessor so the same tool works across providers without provider-specific pre-processing upstream. Canonical implementation: `src/tool/tools/agent-manager.ts` (2026-09-01, `1.22.8`, ports upstream kilocode `02df76976`).

Contract:

1. The preprocessor is a `z.preprocess(...)` wrapper. It inspects the raw input; if it is a string that starts with `{` or `[` after trimming, it attempts `JSON.parse()` and hands the parsed value to the wrapped schema.
2. Non-string values, empty strings, primitive-looking strings (`"foo"`, `"42"`), and strings that fail to parse ALL pass through unchanged so the wrapped schema still produces a descriptive validation error rather than a hard tool crash.
3. Apply the preprocessor only to fields that legitimately carry a JSON object or array. Never wrap a scalar string field — a valid `"model": "gpt-4o"` value would otherwise become a `SyntaxError`-driven schema failure.

Reference implementation (from `src/tool/tools/agent-manager.ts`):

```typescript
function decodeJsonIfString<T extends z.ZodTypeAny>(
  schema: T
): z.ZodEffects<T, z.infer<T>, unknown> {
  return z.preprocess((value) => {
    if (typeof value !== 'string') {
      return value;
    }
    const trimmed = value.trim();
    if (!trimmed || (trimmed[0] !== '{' && trimmed[0] !== '[')) {
      return value;
    }
    try {
      return JSON.parse(trimmed);
    } catch {
      // Fall through with the original string so the wrapped schema can
      // produce a descriptive validation error instead of a JSON parse
      // exception surfacing as a tool crash.
      return value;
    }
  }, schema);
}

const AgentManagerParamsSchema = z.object({
  // ...
  config: decodeJsonIfString(
    z
      .object({
        // ...
      })
      .nullable()
      .optional()
      .describe('Configuration for session creation')
  ),
});
```

Tests should cover the JSON-encoded path, the native object path, and the missing/`null` path. See `docs/TESTING.md#testing-json-encoded-tool-params-tolerance` for the reference regression suite.

### Cross-field Zod validation for action-scoped parameters

When a tool parameter is only meaningful for a subset of actions on a discriminated schema — e.g. `worktreeId` only applies when `action === 'create'` — enforce that constraint at the schema layer with a `.refine()` on the outer object, not inside the handler body. Canonical implementation: `src/tool/tools/agent-manager.ts` (2026-09-07, `1.22.15`, ports upstream opencode 2026-09 `worktreeID` start parameter).

Contract:

1. Validate the shape of each field independently first (inner `.refine()` on the field itself for value-level constraints such as "must not be blank").
2. Add the cross-field rule as a top-level `.refine()` on the object schema after every field is declared. Provide an explicit `path` on the error so the failure surfaces on the offending field, not the whole object.
3. Provide a runtime capability check inside the handler ONLY when the schema-passing path is not yet fully implemented. Fail loudly with an error that echoes the offending value back to the caller, rather than silently ignoring the field. This gives the model a signal to retry without the field and gives operators a searchable log line.

Reference implementation (from `src/tool/tools/agent-manager.ts`):

```typescript
const AgentManagerParamsSchema = z
  .object({
    action: z.enum(['create', 'list', 'stop', 'status', 'answer']).describe('Action to perform'),
    // ...
    worktreeId: z
      .string()
      .nullable()
      .optional()
      .refine((value) => value === null || value === undefined || value.trim().length > 0, {
        message: 'worktreeId must not be blank',
      })
      .describe(
        "Create action only. Existing managed worktree ID returned by action=list in the caller's project."
      ),
    // ...
  })
  // Cross-field rule: `worktreeId` only makes sense for a start (create) call.
  // Reject the combination early so we produce a descriptive Zod error instead
  // of silently ignoring the field deeper in the handler.
  .refine(
    (params) =>
      params.worktreeId === null || params.worktreeId === undefined || params.action === 'create',
    {
      message: 'worktreeId is only valid on action=create',
      path: ['worktreeId'],
    }
  );
```

Both `.refine()` predicates use the explicit two-arm form `x === null || x === undefined` rather than the shorter loose-equality idiom `x == null`. This is the standing convention for null-and-undefined narrowing under the project's `eqeqeq: error` ESLint rule — see the "Loose-null autohealing" pattern in the ESLint auto-fix section below and the worked example under commit `f33a09e5` (`fix(tools): replace loose null equality with strict checks [autohealing]`, 2026-09-07) which rewrote both `agent-manager.ts` predicates from their historical `== null` form.

Runtime capability gating pattern (same file):

```typescript
if (worktreeId) {
  return {
    success: false,
    error: `Managed worktrees are not available in this build (worktreeId=${worktreeId}). Omit worktreeId to create a session in the caller's directory.`,
  };
}
```

When the tool also has permission metadata, fold the action-scoped field into `permission.getResource` so approval prompts and audit logs distinguish "create in new worktree" from "resume in existing worktree":

```typescript
permission: {
  action: 'admin',
  getResource: (params) =>
    params.worktreeId ? `${params.action}:${params.worktreeId}` : params.action,
},
```

Alexi's permission layer does not have upstream opencode's structured `metadata` field, so encoding the target into the resource string is the portable equivalent. Tests should cover the schema-level rejection (blank value, wrong action), the runtime capability path, AND the backward-compat baseline (`action: 'create'` with no `worktreeId` still succeeds). See `docs/TESTING.md#testing-agent_manager-worktreeid-schema-and-capability-gating` for the reference regression suite.

### Defensively-constructed tool result payloads

Tool `ToolResult` payloads flow through downstream permission metadata, event buses, and MCP transport, all of which JSON-encode the payload at least once. `JSON.stringify` silently drops keys whose value is `undefined`, so a naive assignment like `data: { path, diff, movePath: someOptional }` will lose the `movePath` key on the wire without any error.

Contract:

1. Construct the payload as an intermediate typed object with only the fields you have a defined value for. Do not spread `{ ...maybe, foo: bar }` when `maybe` might contain `undefined` values.
2. Prefer conditional assignment (`if (movePath) { data.movePath = movePath; }`) over `foo ?? undefined`.
3. When adding a new field to a tool's `ToolResult` shape, add a JSON-round-trip regression test that iterates every top-level key in `result.data` and asserts `not.toBeUndefined()`. This is the assertion that catches the class of bug.

Canonical implementation: `src/tool/tools/apply-patch.ts:361-370` (2026-09-01, `1.22.8`, ports upstream kilocode `f7da00f`). Reference test: `src/tool/tools/__tests__/apply-patch.json-encoding.test.ts` — see `docs/TESTING.md#testing-json-encodable-tool-result-payloads` for the pattern.

### Pure-function helpers (preferred over stateful services)

For helpers that transform data without I/O — e.g., prompt-shape transforms
and result-filter helpers — write them as pure functions in a dedicated
module and export a stable named surface. Two current canonical examples:

- `src/providers/openai/prompt-cache.ts` — `applyCacheBreakpoint(prompt)`,
  `supportsPromptCacheBreakpoint(opts)`, and `isChatGPTSubscription(auth)` are
  pure functions with no I/O. They compose cleanly into
  `prepareRequest(ctx)` on the SAP orchestration provider and are trivially
  unit-testable without any mocking.
- `src/tool/grep-signal-controls.ts` — `applySignalControls(matches, controls)`
  is a pure filter/sort pipeline. `src/tool/grep.ts` re-exports it as a
  plan-anchored surface so callers can wire signal filtering into ad-hoc
  grep pipelines without reaching into the primary tool implementation at
  `src/tool/tools/grep.ts`.

Follow the same shape when adding new transforms: keep the module pure,
export both the callable and its input types, and avoid globals so parallel
tests do not need setup/teardown.

A more recent example (issue #1716, 2026-09-13) is
`src/core/inlineModelOverride.ts`. It exports two symbols:

- `INLINE_MODEL_PATTERN: RegExp` — the parser regex, exported so tooling
  can detect mentions without triggering the catalog lookup.
- `extractInlineModelOverride(message: string): string | undefined` — a
  first-match-wins parser that additionally validates the candidate via
  `isAvailableModel(candidateModel)` before returning it. Never throws.

Its callers — `sendChat` (`src/core/orchestrator.ts`) and `streamChat`
(`src/core/streamingOrchestrator.ts`) — do NOT reach into
`isAvailableModel` themselves. All catalog-validation logic stays in one
place so a future change to the validation contract (e.g. supporting
alias resolution) has exactly one edit site. When adding similar
"parse-and-validate" helpers, keep the shape:

1. **One exported callable + optional regex constant.** Callers should
   never re-implement the pattern.
2. **The helper owns validation.** Do not return an unvalidated
   candidate and expect the caller to check it — that duplicates the
   guard across every call site.
3. **Never throws.** Return `undefined` on any invalid or unknown input
   so the caller's fallback path is a single `??` operator, not a
   `try/catch`.
4. **Log operator-visibility warnings inline.** Unknown candidates
   should emit a `logger.warn` with the exact reason (`Model "<id>" not
   found in catalog, ignoring`) so operators see why the override was
   skipped, but tests must NOT assert on log output — the warning is
   best-effort visibility, not a public contract.

### Per-call detectors (preferred over module-scoped counters)

When a feature needs to observe a rolling condition across an agent's tool
loop (repeated identical calls, consecutive failures, hook rejections),
instantiate the detector **inside** the loop function that owns the run,
not at module scope. The canonical current example is issue #1692 (loop /
mistake steering), added 2026-09-09:

- `src/core/loopDetector.ts` — 102-line `LoopDetector` class with
  `record(toolName, argumentsJson)`, `hasTripped()`, `reset()`,
  `getConsecutiveCount()`, `getLimit()`. Fingerprints tool calls via a
  stable JSON stringify with sorted keys so semantically identical calls
  fingerprint the same; falls back to the raw string when the arguments
  are not valid JSON.
- `src/core/mistakeTracker.ts` — 65-line `MistakeTracker` class with the
  same surface but a boolean `record(success)`: a single success resets
  the counter, mirroring `ErrorBackoff.recordSuccess`.
- Both classes reject `limit < 2` and non-integer limits in the
  constructor with `limit must be an integer >= 2` — validate at
  construction rather than in `record()` so the failure surfaces at the
  call site.
- Instantiation lives in `src/core/agenticChat.ts:592-593` inside the
  main loop function, so long-running processes (a TUI session that
  reuses the same `sessionManager`) do NOT carry counters across
  independent user turns.

Rules that make this pattern work:

1. **The detector has no I/O.** It records observations and exposes trip
   state. Deciding what to do on a trip belongs to the caller (in our
   case, `agenticChat` delegating to `onConsecutiveMistakeLimitReached`).
   This keeps the class trivially unit-testable — see
   `src/core/__tests__/loopDetector.test.ts` and
   `src/core/__tests__/mistakeTracker.test.ts` (17 pure cases combined,
   no `vi.mock`, no test doubles).
2. **State is per-instance, not module-scoped.** Do not lift a counter
   to a module-level `let`; a stray unit test that forgets to reset it
   will poison every following test in the same worker.
3. **Expose a `reset()` method** even when the caller could re-instantiate
   — after a `'continue'` steering decision the same detector should
   pick up cleanly on the next iteration without re-triggering.
4. **Skip observations that are semantically not part of the tracked
   condition.** The loop detector deliberately does NOT fingerprint the
   `question` tool (`src/core/agenticChat.ts:937`) because repeated user
   prompts are not a stuck loop.

When callers can decide what to do on a trip (continue with steering vs.
stop the run), expose an optional callback with a discriminated-union
payload rather than a boolean flag. `ConsecutiveMistakeReason` in
`src/core/agenticChat.ts` (`{ kind: 'loop' | 'mistake', consecutiveCount,
toolName }`) is the current canonical shape and is re-exported from
`src/core/orchestrator.ts` and `src/core/streamingOrchestrator.ts` so
callers dispatching through those entry points can reference the same
type. A throwing callback MUST be caught and treated as the conservative
default (`'stop'` in this case, logged via `logger.warn`) so a hung UI
hook cannot crash a headless agent run.

### Keep detection, callback, and UI in three layers

The mistake-limit surface is the canonical example of this repo's rule
that detection, decision, and user interaction are three distinct
concerns and MUST live in three distinct modules:

1. **Detection** — `LoopDetector` / `MistakeTracker` (`src/core/loopDetector.ts`,
   `src/core/mistakeTracker.ts`): pure state machines, no I/O, no
   knowledge of `agenticChat`, unit-tested in isolation.
2. **Orchestration** — `agenticChat` (`src/core/agenticChat.ts`): owns the
   per-call instantiation of the detectors, the synchronisation point
   after each iteration's tool results, the callback contract
   (`onConsecutiveMistakeLimitReached`), and the actual
   steering-message injection (`<system-reminder>...</system-reminder>` +
   the fixed guidance string) when the callback returns `'continue'`.
   Never runs interactive I/O.
3. **User interaction** — `createMistakeLimitPrompt`
   (`src/cli/utils/mistakeLimitPrompt.ts`): builds a
   `MistakeLimitCallback` that decides whether to prompt the user, print
   a headless explanation, or auto-continue under `--yolo`. Owns the
   `readline` handle, the `AbortSignal` wiring, and the exact stderr
   phrasing. Injectable I/O (`stdin` / `stdout` / `stderr` / `isTTY`) so
   tests never touch the real process handles.

When adding a new host (a TUI panel, an HTTP endpoint, an editor plugin),
implement your own `MistakeLimitCallback` and pass it as
`onConsecutiveMistakeLimitReached`. Do NOT import from
`src/cli/utils/mistakeLimitPrompt.ts` and try to reuse its `readline`
plumbing — the CLI module is deliberately CLI-only. The shared surface
between layers is the `ConsecutiveMistakeReason` payload and the
`'continue' | 'stop'` decision, nothing else.

Rules that fell out of the mistake-limit implementation and generalise:

- **The decision function must not open I/O it does not use.** The yolo
  branch of `createMistakeLimitPrompt` returns before touching
  `readline`, and the test suite asserts
  `stdin.listenerCount('data') === 0` as a regression barrier. When
  writing a new callback host, arrange the branches so cheap deterministic
  outcomes (yolo, headless, quiet) short-circuit before any I/O handle is
  opened.
- **Empty input defaults to the safer answer.** `'stop'` is the safer
  answer for a mistake-limit trip because it stops burning budget on a
  clearly-broken run. For other callback surfaces, pick the conservative
  default at the design stage and pin it with a test case whose input is
  `''` (a bare Enter or EOF).
- **`AbortSignal` MUST close the I/O handle.** Any callback that opens a
  `readline` (or any long-lived resource) must attach an `abort` listener
  that closes it, register the listener before awaiting user input, and
  remove it in a `finally` block. This keeps a Ctrl+C from leaking event
  loop resources and stops the callback from wedging the surrounding
  `agenticChat` teardown.
- **Injectable I/O is a testing requirement, not a nice-to-have.** Any
  module that talks to `process.stdin` / `process.stdout` /
  `process.stderr` in production MUST expose those handles as options so
  tests can substitute a `Sink extends EventEmitter` writable and a fake
  stdin without patching the real process — see
  `tests/cli/utils/mistakeLimitPrompt.test.ts` for the canonical pattern.

### Breaking circular ESM imports (registry pattern preferred over `require`)

When two modules need to reference each other and one direction has to run
synchronously (a hot-path predicate or a router lookup), prefer a
`globalThis`-keyed function-pointer registry over a lazy `require('./x.js')`
inside a `try / catch`. The registry pattern is the canonical solution
adopted in commit `544ba4ef` (`fix(providers): replace require() with globalThis registry pattern`, 2026-08-29).

Contract:

1. The **downstream** module (the one that imports the other) is the one
   that registers a callback. It calls an `@internal`-marked setter
   (`_registerCatalogGuard(fn)` on the current canonical example) as a
   top-level side effect **after** the callback function has been defined.
2. The **upstream** module (the one that is imported) exposes the setter
   plus a private handle to `globalThis` typed via
   `globalThis as unknown as { __<prefix><Name>?: <Fn> }`. Prefix the key
   with `__alexi` (or your feature-specific short prefix) so unrelated
   dependencies cannot collide.
3. The upstream module's call-site invokes the callback via
   `_registry.__<prefix><Name>?.(args) ?? <fallback>`. The optional-chain
   + nullish-coalesce contract means the module continues to work correctly
   even when the downstream module has not been loaded (e.g. a unit test
   that mocks the whole downstream module — the fallback path is taken).
4. **Never** use dynamic `import('./x.js')` as a substitute for the
   registry when the call site is synchronous. Dynamic `import()` returns
   a Promise; wrapping every synchronous predicate call in an `await`
   would move a hot-path predicate onto the microtask queue and change
   the calling contract everywhere.

Canonical worked example: `src/providers/sapOrchestration.ts` (`isOrchestrationModel`, `_registerCatalogGuard`, `_catalogRegistry.__alexiCatalogIsAvailable`) paired with `src/providers/modelCatalog.ts:342` (`_registerCatalogGuard(isAvailableModel)` at module load). See the "Circular-import break: catalog guard registry" subsection of `docs/PROVIDERS.md` for the full source listing and rationale.

Anti-pattern to retire (do NOT copy into new code):

```typescript
// DO NOT — historical `require()` shim inside try/catch, obsolete since 2026-08-29
export function isOrchestrationModel(modelId: string): boolean {
  if (STATIC_LIST.includes(modelId)) return true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const catalog = require('./modelCatalog.js') as typeof import('./modelCatalog.js');
    return catalog.isAvailableModel(modelId);
  } catch {
    return false;
  }
}
```

Preferred pattern:

```typescript
// DO — globalThis registry, wired by the downstream module at its own load time
type IsAvailableModelFn = (id: string) => boolean;
const _catalogRegistry = globalThis as unknown as {
  __alexiCatalogIsAvailable?: IsAvailableModelFn;
};

/** @internal — called by modelCatalog.ts at load time */
export function _registerCatalogGuard(fn: IsAvailableModelFn): void {
  _catalogRegistry.__alexiCatalogIsAvailable = fn;
}

export function isOrchestrationModel(modelId: string): boolean {
  if (STATIC_LIST.includes(modelId)) return true;
  return _catalogRegistry.__alexiCatalogIsAvailable?.(modelId) ?? false;
}
```

Advantages over the `require` shim: no lint pragmas needed, no CJS interop path in a `"type": "module"` package, no runtime resolver work on every call, and TypeScript type-checks the registered function signature at both use sites.

### Process-local stores (require explicit teardown)

Modules that maintain process-local mutable state MUST expose an explicit
teardown/clear function and MUST be called from `afterEach` in tests and
from server-mode session teardown. The current canonical example is
`src/permission/provenance.ts`: `recordDenial(toolCallId, provenance)`
writes into an unbounded `Map<string, PermissionProvenance>`, and
`clearDenialStore()` is the paired teardown. Tests that seed the store MUST
call `clearDenialStore()` in `afterEach` to keep test suites parallel-safe
and avoid cross-test leakage.

### Verification-only regression suites (lock in a contract with tests + inline JSDoc)

Some upstream ports and behaviour fixes ship the runtime change in one PR and then a **verification-only** follow-up PR that adds no new behaviour, just a dedicated regression suite plus a JSDoc block on the helper stating the contract inline. This is the standing pattern for issue-tagged "verify coverage" tasks (currently issue #1713 for the `kilo_board_write` recipient-warning path). The rules that make the pattern useful:

1. **Ship no behaviour change in a verification-only PR.** The diff must be limited to (a) a new `tests/**/*.test.ts` file that exercises the existing implementation and (b) a JSDoc block on the target helper that restates the contract the tests now pin. If the reviewer catches a bug during authoring, split it into a separate `fix(...)` PR — the verification PR must remain reviewable as "these tests now enforce the current behaviour" without hidden behaviour drift.
2. **Enumerate the contract as numbered invariants.** In both the JSDoc block on the helper and the `describe` block header, list the invariants as `1. …`, `2. …`, `3. …`. This makes it obvious which test case pins which invariant, and it lets a reviewer skim the helper's JSDoc against the test file without cross-referencing implementation lines. See `src/tool/tools/board.ts:110-129` for the reference JSDoc block (five invariants) and `tests/tool/tools/board-write-recipient.test.ts` for the paired five-case suite.
3. **Cite the paired test file from the JSDoc.** The JSDoc block should end with a `Contract (locked in by tests/foo.test.ts, issue #NNNN verification):` header so a future reader knows the invariants are enforced, not aspirational. A regression that removes a test case will only be caught by CI if the docstring is not silently updated alongside — reviewers of the test-deletion PR must eyeball the docstring for mismatches.
4. **Mock at the module boundary, not at the tool.** Verification suites should not require the same native dependencies as production runs. For the board suite, `BoardStore` (the SQLite-backed persistence layer) is `vi.mock`ed at the module boundary and driven by `vi.fn()`s. This keeps the suite runnable in every worker without a working `better-sqlite3` binding, and it isolates the contract under test (the tool's recipient-probe logic) from the store's own coverage.
5. **Cover EVERY method the tool import chain touches, even the ones the tests never call.** A `vi.mock('.../boardStore.js', () => ({ BoardStore: { read: vi.fn(), write: vi.fn() } }))` factory that omits `__resetForTests` or `ensure` will explode with `TypeError: BoardStore.<method> is not a function` at test load time when any unrelated module imports the store expecting the full surface. Reference the current mock in `tests/tool/tools/board-write-recipient.test.ts:26-35`: it exposes `read`, `write`, `ensure`, `acknowledgeReads`, `reset`, `__resetForTests` — the union of every method reachable through the import chain, not just the two that the suite exercises.
6. **Reset process-local state in `beforeEach`, not `beforeAll`.** `BoardContext.__resetForTests()` + `BoardContext.attach(...)` runs before every case so that a test which forgets to re-attach (case 4 in the reference suite) fails deterministically instead of depending on prior test order.

Reference JSDoc block from `src/tool/tools/board.ts:110-129` that pairs with the suite:

```typescript
/**
 * Ports kilocode `7febec58f` (fix(cli): warn when board_post targets a
 * stopped subagent). We check the current board's message history for
 * any recent activity from the recipient session — if none is found we
 * cannot prove the recipient is stopped, but we can at least surface a
 * warning to the caller so silent-drop scenarios become visible in
 * tool output.
 *
 * Contract (locked in by `tests/tool/tools/board-write-recipient.test.ts`,
 * issue #1713 verification):
 *   - The probe scans at most the 100 most recent messages on the board.
 *   - "Stopped or missing" means the recipient session id does not appear
 *     as the author of ANY of those 100 messages.
 *   - The message is STILL written when the recipient looks stopped —
 *     `deliveryStatus: 'no-recipient'` and a human-readable `hint` are
 *     surfaced instead of failing the tool call, so the parent
 *     orchestrator (not this helper) decides how to react.
 *   - When no `recipient` is supplied (broadcast), this probe is skipped
 *     entirely and `deliveryStatus` stays `'delivered'`.
 */
async function recipientLooksStopped(boardId: string, recipient: string): Promise<boolean> {
  const recent = await BoardStore.read(boardId, { limit: 100 });
  return !recent.some((m) => m.sessionID === recipient);
}
```

See `docs/TESTING.md#testing-the-kilo_board_write-recipient-state-warning` for the full suite walkthrough and the five patterns that generalise to any future verification-only suite (mock the store, cover the mock surface exhaustively, reset per-test, assert on `hint` substrings not exact strings, use `.toMatchObject` for options-bag assertions).

### Abort propagation through delegating tools

Tools that delegate work to a child session (currently only `task`) MUST wire the child's lifetime to the parent's `AbortSignal` so that a Ctrl+C at the CLI immediately stops every descendant subagent — otherwise a runaway subagent chain will keep consuming API quota after the user has given up.

Contract for any new delegating tool:

1. **Read `context.sessionManager` and `context.signal`.** Both are optional on `ToolContext`. When either is absent, fall back to the previous stub behaviour rather than crash — unit tests and one-shot CLI paths intentionally omit them.
2. **Materialise a real child session.** Call `sessionManager.createSession(model, parentSessionId, { signal: context.signal })` so the child inherits parent-abort semantics from the moment it exists. Do NOT pass a plain child-created `AbortController` — parent-signal wiring is what makes cascade cancellation work across nesting depth.
3. **Check `context.signal?.aborted` before paying for a provider round-trip.** If the parent was already aborted at spawn time, return a cancelled result immediately (`{ success: false, error: 'Operation aborted', data: { status: 'cancelled' } }`) instead of wasting the cost tracker's budget on a request whose result no consumer will read.
4. **Bracket the work with `try` + `finally` `releaseSession`.** `sessionManager.releaseSession(childId)` is `endSessionRun` + `deleteSession`. Skipping the `finally` leaks the parent-signal listener for the lifetime of the parent signal, which for a long CLI session can add up.
5. **Do NOT re-implement abort classification.** `SessionManager.detectAbort(err)` recognises `DOMException{name:'AbortError'}`, `Error{name:'AbortError'}`, and Node's native `Error{code:'ABORT_ERR'}`. Use it in `catch` blocks.

The canonical reference is `src/tool/tools/task.ts:574-677`; the regression suites in `tests/core/sessionManager-abort.test.ts` and `tests/tool/tools/task-abort-propagation.test.ts` (277 + 233 lines) pin the contract.

### Headless-exit drain (always drain before `process.exit`)

Every headless CLI entry point that calls `process.exit(...)` MUST first `await SessionDrain.drain({ timeoutMs: 30_000 })`. Without a drain, in-flight tool events / session writes / telemetry flushes can race the exit and corrupt persisted state (issue traced through upstream opencode's headless-exit fix chain).

Rules:

- Import `SessionDrain` from `../../session/drain.js` (or `../../tool/registry.js` for parity with upstream call sites).
- 30 seconds is the standard budget. Only pass `0` (wait indefinitely) when a hard flush guarantee is required and you have another watchdog upstream.
- On the error path, wrap the drain in a `try / catch` that swallows failures — the process is already exiting with a non-zero code, and a drain error must not mask the underlying failure:
  ```typescript
  try { await SessionDrain.drain({ timeoutMs: 30_000 }); } catch { /* about to exit(1) */ }
  process.exit(1);
  ```
- Never call `SessionDrain.__resetForTests()` from production code. It is exposed only for the drain module's own test suite.

The canonical reference is every `process.exit(...)` call site in `src/cli/commands/chat.ts`.

### Filesystem-discovery modules (injectable `workdir` + `homedir`)

Modules that walk the filesystem to discover configuration or rule files — the canonical example is `src/config/rulesDiscovery.ts` — MUST accept both `workdir` and `homedir` as explicit options rather than reading `process.cwd()` and `os.homedir()` directly at every call site. This keeps unit tests hermetic (no need to mutate `process.env.HOME` or `chdir` across parallel workers) and lets callers point discovery at synthetic trees for regression testing.

Contract for a new discovery module:

1. **Every I/O-touching entry point takes an options bag** with `workdir?`, `homedir?`, and a `silent?` flag for log-suppression. Defaults resolve to `process.cwd()` / `os.homedir()` at call time (not at module load) so a test that sets `process.env.HOME` before the first call still sees the redirect.
2. **Never crash on missing directories, unreadable files, or malformed JSON.** All three degrade to safe defaults (empty result, empty array, or a synthesized `null` handle) and, when not `silent`, are surfaced through `logger.debug` / `logger.info` — never through a thrown exception. A broken user config MUST NOT break prompt assembly or session bootstrap.
3. **Emit startup logs at most once per unique input.** A discovery function that runs on every message turn (like `discoverRules` invoked from `agent/system.ts:loadInstructionFiles`) MUST be paired with a caller-side cache (`Set<string>` keyed by resolved workdir) so operators see the discovery summary once per session, not once per turn. Expose a `resetXCacheForTests()` function for test isolation and NEVER call it from production code.
4. **First-seen-wins for conflicts, with an explicit conflict record.** Return a discovery result bundle (`{ items, allItems, conflicts, scannedDirs }`) rather than raw items. Callers that only need the winners consume `items`; callers that need to audit the resolution (logs, health checks, `alexi doctor`) consume `allItems` and `conflicts`.
5. **Test with injected paths, not global state.** In tests, always pass `workdir` and `homedir` in the options bag and use `fs.mkdtempSync` for the roots. Do not mutate `process.cwd()`; do not mutate `process.env.HOME` unless the code under test genuinely reads it (integration tests via `buildAssembledSystemPrompt` fall into this category — see `docs/TESTING.md#testing-rules-file-discovery`).

The rules-discovery module (`src/config/rulesDiscovery.ts`) exemplifies the contract: `discoverRules({ workdir?, homedir?, customPaths?, silent? })` returns a `RulesDiscoveryResult` with `rules`, `allFiles`, `conflicts`, and `scannedDirs`; every branch that could throw is wrapped in a `try / catch` that degrades to `[]` or `null`; and `resetRulesDiscoveryLogCache()` in `src/agent/system.ts` is exposed only for tests. Adding a new default directory to `DEFAULT_PROJECT_RULE_DIRS` (as commit `6ce4ab8c` did for the Cline flat layout `.cline/`) MUST be accompanied by a companion test in `tests/rulesDiscovery.test.ts` that pins both the membership of the new entry AND its precedence relative to the surrounding entries — a directory rename or reorder that passes typecheck can still change which rule text lands in the assembled system prompt.

### Zero-result fallback paths (mutually-exclusive with the primary path)

When a tool's primary search returns zero results and a bounded fallback path takes over (the canonical example is `src/tool/tools/recall.ts` under commit `3516c8c0` — the title-level typo-tolerant scan added for issue #1745), test coverage MUST pin BOTH the mutual-exclusivity contract and the fallback-only invariants. A change that flipped the fallback to run in parallel with the primary path — or that always set the fallback marker flag regardless of which path fired — would silently corrupt every downstream renderer that uses the flag to decide whether to prompt the user to refine their query.

Contract to pin in tests:

1. **Explicit flag assertions on BOTH paths.** The fallback marker (`partialMatch: boolean | undefined` for recall) must be asserted with `toBe(true)` on the fallback path AND `toBeUndefined()` on the primary path. Without the second assertion, a regression that always sets `partialMatch: false` on success is invisible.
2. **Precedence via two-session (or two-input) fixtures.** A single-fixture test cannot distinguish "the fallback never fired" from "the fallback fired and happened to return the same result". Seed at least two inputs — one that matches the primary path, one that only matches the fallback — and assert on the winning result's identity as well as the flag.
3. **Distance / tolerance boundary on the load-bearing safety property.** For any tolerance-based fallback (distance-1 Levenshtein, prefix expansion, phonetic collapse), pin the failure case at distance+1 explicitly. A regression that widened the tolerance would flip the fallback into a fuzzy search and surface false positives — the boundary test is the guard.
4. **Aggregate result fields (`missingTerms`, `partialMatch`, `totalMatches`) tested in both empty-populated and non-empty forms.** For recall specifically: assert `missingTerms: []` when all query terms matched via typo, and assert `missingTerms: ['sapaicore']` (or similar) when a specific term failed both exact AND typo comparison. The empty-array-not-undefined case is the guard against regressions where the field is dropped from the payload on the "clean" fallback.
5. **`includeCurrentSession` / caller-scoped filters applied identically in both passes.** A fallback pass that forgot to re-apply the primary pass's filters would leak the current session (or a user-excluded scope) into results. Test by seeding a fixture that would ONLY hit the fallback, setting `context.sessionId` to that fixture, and asserting `results.length === 0`.

See [`docs/TESTING.md#testing-the-recall-tool-typo-tolerance-issue-1745`](./TESTING.md#testing-the-recall-tool-typo-tolerance-issue-1745) for the concrete test suite that pins the five properties above for the recall tool.

### Environment-driven detection (snapshot-and-restore)

Some detection modules read process-level environment variables directly and
cannot practically be refactored to inject the whole `process.env` — for
example, `src/tool/tools/shell/id.ts` reads `process.env.SHELL` and
`process.env.COMSPEC` to classify the active shell. For tests against such
modules, snapshot the variable at `describe` scope, mutate it inside each
`it`, and restore it in `afterEach` (deleting it when previously unset):

```typescript
const originalShell = process.env.SHELL;

afterEach(() => {
  if (originalShell === undefined) {
    delete process.env.SHELL;
  } else {
    process.env.SHELL = originalShell;
  }
});
```

Gate the suite with `describe.skipIf(isWindows)` (or the equivalent
`describe.skipIf(isPosix)`) when the variable being mutated is
platform-specific. The bash-tool shell-type suite in
`tests/tool/tools/bash.test.ts:41` is the canonical worked example; see
`docs/TESTING.md#testing-bash-tool-shell-type-reporting`.

The notifications module extends this pattern to `HOME`, `CI`, and
`ALEXI_NO_NOTIFICATIONS` because `~/.alexi/config.json` lives under `HOME`
and the interactive-context probe reads all three. `tests/core/notifications.test.ts`
snapshots each variable in `beforeEach`, redirects `HOME` to a `fs.mkdtempSync`
temp directory, and restores every variable (deleting when previously unset)
plus `fs.rmSync(tmpHome, { recursive: true, force: true })` in `afterEach`.
This keeps parallel test workers from racing on the real user config and
guarantees a test can never accidentally dispatch a real desktop notification.

The home / filesystem-root indexing guard (`src/core/kilocode/fff.ts`,
`src/utils/filesystem.ts`) uses a dedicated `ALEXI_TEST_HOME` env var
rather than reusing `HOME`. Rationale: `HOME` is read by unrelated
modules (notifications, rules discovery, `~/.alexi/config.json`), so
mutating it globally to test the indexing guard would leak into every
other subsystem that reads the same variable. `ALEXI_TEST_HOME` is
checked only by `allowed()` in the indexing guard, so tests can pin the
home anchor without touching real user state. Use the same
snapshot-and-restore pattern as above, and pair the env var with a
`fs.mkdtemp`-created fake-home directory so the fixture is fully
disposable. See
[`docs/TESTING.md#testing-the-home--filesystem-root-indexing-guard`](./TESTING.md#testing-the-home--filesystem-root-indexing-guard)
for the reference regression suite.

### Binary-optional native dependencies (cached dynamic import)

Modules that wrap a native-binary-backed npm package (e.g. `node-notifier`
in `src/core/notifications.ts`, or any future binding to `terminal-notifier`,
`notify-send`, `snoretoast`) SHOULD load the dependency via a cached
dynamic import rather than a top-level `import`. Two reasons:

1. **Startup cost.** A user who has denied the feature at the config layer
   must never pay the native-binary probe cost. Deferring the import to
   the first `allow` call means `alexi chat` starts in the same time on a
   Linux container without a notification daemon as it does on a macOS
   dev box.
2. **Missing-binary resilience.** A native probe that throws at import
   time will crash the CLI. A dynamic import failure inside a `try / catch`
   resolves to a cached `null` handle, and every subsequent call short-circuits
   without retrying the import — a broken feature stays disabled but the
   rest of the CLI keeps working.

Canonical pattern (from `src/core/notifications.ts`):

```typescript
// Three-state cache: undefined = never attempted, null = attempted and
// failed, NotifierLike = ready. This lets one failed probe silence every
// subsequent call without retrying the import.
let cachedNotifier: NotifierLike | null | undefined;

async function loadNotifier(): Promise<NotifierLike | null> {
  if (cachedNotifier !== undefined) return cachedNotifier;
  try {
    const mod = (await import('node-notifier')) as unknown as {
      default?: NotifierLike;
      notify?: NotifierLike['notify'];
    };
    if (mod.default && typeof mod.default.notify === 'function') {
      cachedNotifier = mod.default;
    } else if (typeof mod.notify === 'function') {
      cachedNotifier = { notify: mod.notify.bind(mod) };
    } else {
      cachedNotifier = null;
    }
  } catch (err) {
    logger.debug('node-notifier failed to load', err);
    cachedNotifier = null;
  }
  return cachedNotifier;
}

// Test-only escape hatch: expose a reset so unit tests can force a fresh
// import. NEVER call this from production code.
export function _resetNotifierCacheForTests(): void {
  cachedNotifier = undefined;
}
```

Guidelines when introducing a new module that follows this pattern:

- Define a minimum interface (`NotifierLike` above) that names ONLY the methods you call. This keeps the corresponding `@types/*` package as a devDependency rather than a hard runtime type import, and lets tests pass an inline mock object without stubbing a whole third-party API surface.
- Expose a `_resetXxxCacheForTests()` reset. Never import it from index barrels; only unit tests should call it.
- Accept a test-only override in the options bag (`__notifierOverride`, `__askOverride` in the notifications module) prefixed with `__` so it is visually flagged as non-production surface.
- Never let a load failure propagate. `logger.debug` and cache `null`.

### Testing streaming tools and bus events

Tools that consume a provider stream and publish `defineEvent`-produced bus
events (the canonical example is `image_gen` in `src/tool/tools/image-gen.ts`,
which publishes `ImageGenerationChunk` from `src/bus/index.ts`) have three
extra concerns beyond a standard tool test:

1. **Fake the provider with an async generator that can also throw.** Two
   shapes cover most cases: `makeProviderStub(chunks)` yields chunks and
   completes cleanly; `makeThrowingProviderStub(chunks, err)` yields chunks
   and then throws, which is the only way to reach the partial-success path
   where some payloads have already been persisted before the upstream stream
   fails. Cast the fake to `ReturnType<typeof getProviderForModel>` and only
   implement the `streamComplete` method the tool actually calls.
2. **Scope bus subscriptions per test.** `ImageGenerationChunk` (and any
   `defineEvent`-produced surface) is process-global; a stray subscriber will
   observe events from later tests and cause flakes under `--reporter=verbose`.
   Subscribe inside the `it` body and `unsub()` in a `try / finally` so the
   subscription is torn down even when an assertion throws.
3. **Assert on the partial-success contract explicitly.** A tool that emits
   `truncated: true` alongside `success: true` will silently regress under a
   test that only checks `success`. Assert on `truncated`, on the length of
   `data.images` (or the equivalent data field), and on the `hint` string
   both for the error classification and for the `"Partial result: N ..."`
   suffix.

The full worked example is in `docs/TESTING.md` under **Image-generation
tool tests**. New streaming tools with progress events (audio generation,
long-running search, streaming file transforms) should mirror the same three
patterns rather than reinventing bus-subscription bookkeeping.

The bash / shell tools follow the same three-part contract via
`BashOutputChunk` (`src/bus/index.ts:325`) plus a process-local command-log
registry at `src/tool/tools/bash-streaming.ts`. Tests at
`tests/tool/tools/bash-streaming.test.ts` cover:

1. **PID-reuse defence** — assert on `logId` correlation, not OS PID. Vary
   `startedAt` when writing PID-reuse tests so a matching PID alone does NOT
   surface the earlier entry.
2. **Retention window** — `cleanupCompletedLogs(now)` accepts an explicit
   timestamp so tests can be deterministic without `vi.useFakeTimers()`.
3. **Byte-cap eviction** — assert on the literal
   `[... older output evicted from streaming buffer ...]` marker; that
   string is part of the observable contract for reconnecting TUI clients.
4. **Reset between tests** — call `_resetStreamingStateForTests()` in
   `beforeEach` because the registry is process-local and survives across
   bash invocations by design.

The TUI wiring (`APPEND_TOOL_CALL_OUTPUT` reducer action in `src/cli/tui/
context/ChatContext.tsx`, `useToolEvents` subscription in `src/cli/tui/
hooks/useToolEvents.ts`) is tested at `tests/cli/tui/ChatContext.test.tsx`
and `tests/cli/tui/useToolEvents.test.tsx`. Key invariants: empty chunks
are no-ops; chunks for already-completed rows are silently dropped;
`ToolExecutionCompleted` replaces the streamed `output` with the aggregated
result payload (which may be normalised differently — carriage-return
collapsing, head-and-tail elision).

### Testing concurrent timer budgets with fake timers

Modules that expose per-entity timeout budgets (e.g. `McpClientManager.callTool`
creating one `AbortController` per server in `src/mcp/client.ts:537`) require
tests that assert two adjacent promises make independent progress on different
budgets. The canonical worked example is `tests/mcp/client-timeout.test.ts`
under the `per-server independence` describe block (issue #1532); see
`docs/TESTING.md#testing-per-server-timeout-independence-issue-1532` for the
full walkthrough. The load-bearing rules are:

1. **Fake timers only.** Use `vi.useFakeTimers()` in `beforeEach` and
   `vi.useRealTimers()` in `afterEach`. Real timers would make the 30 s / 60 s
   assertions unusably slow AND flaky under CI scheduling variability.
2. **Advance time explicitly per assertion.** Prefer
   `await vi.advanceTimersByTimeAsync(ms)` at each budget boundary so a
   regression that couples two supposedly-independent timers is detected as an
   ordering violation, not as a total-elapsed-time drift.
3. **Drain microtasks with `await Promise.resolve()` before asserting the
   pending-side of a concurrent call.** A newly-created promise is only
   observably unresolved after the current microtask queue drains; skipping
   this step is the most common source of flakes in concurrent-timer tests.
4. **Route shared mocks by request-shape, not by connection identity.** When a
   single mock handler serves two logical connections (as with the shared
   `mockClientCallTool` in the MCP test file), branch on a request field
   (`params.name` for MCP) rather than trying to stub two `Client` classes.
5. **Assert on error message shape, not just `success: false`.** The named
   source (`(request timeout for server 'X')`) and the numeric bound
   (`/^MCP callTool timed out after <ms>ms /`) are the operator-facing contract
   and must be pinned so a refactor cannot silently drop them.

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
npm test                                       # All tests (single pass, not watch)
npm test -- tests/tool/tools/                  # Directory
npm test -- tests/hooks/blockCap.test.ts       # Single file
npm test -- src/tool/skill.test.ts             # Co-located test next to source
npm test -- -t "compaction"                    # Pattern match (vitest uses -t / --testNamePattern, NOT --grep)
npm run test:coverage                          # With coverage
```

### Test File Locations

Vitest is configured (`vitest.config.ts`) to pick up tests from **both**
locations:

- `tests/**/*.test.{ts,tsx}` — the conventional out-of-tree test tree
- `src/**/*.test.{ts,tsx}` — co-located tests next to the source they cover

Either layout is acceptable. Co-located tests (e.g. `src/tool/skill.test.ts`)
are appropriate for narrow guards over a single module's exported surface;
broader integration or scenario tests should live under `tests/`. When adding a
co-located test, remember the ESM `.js` import rule still applies: imports of
local TypeScript files must end in `.js` even when the file is `.ts`.

### Ad-hoc profiling scripts (`scripts/*.ts`)

One-shot performance profiling scripts live under `scripts/` and are invoked
via `npx tsx scripts/<name>.ts` from the repo root. They are **not** part of
the default `npm test` budget — they typically seed larger fixtures (hundreds
or thousands of files) than a unit test would tolerate and emit results as a
Markdown table on stdout for pasting into a `docs/*-performance.md` writeup.

Rules for adding a new profiling script:

1. **Extend `tsconfig.eslint.json`, not `tsconfig.json`.** The `include`
   array in `tsconfig.eslint.json` already covers `scripts/**/*.ts` so the
   script is linted with the same TypeScript-aware ESLint pass as `src/`.
   The production `tsconfig.json` keeps `rootDir: src`, so scripts are never
   compiled into `dist/`.
2. **Clean up temp directories on exit.** Use `fs.mkdtempSync` +
   `fs.rmSync(dir, { recursive: true, force: true })` in a `try / finally`
   so re-runs are idempotent.
3. **Pair the script with a docs writeup and a regression test.** Numbers
   go in `docs/<topic>-performance.md`; loose regression bounds go in
   `tests/**/performance.test.ts` (or an equivalent co-located file). The
   test's assertions should be ~100x the measured baseline so CI variance
   never causes a flake. Reference: `scripts/profile-session-search.ts` +
   `docs/session-search-performance.md` + `tests/session/performance.test.ts`.
4. **Do not import from `dist/`.** Use `.js`-suffixed relative imports into
   `src/` exactly as the tests and CLI code do; `tsx` handles the on-the-fly
   compilation.
5. **Measure memory as well as wall time when the concern is CLI
   footprint.** The `measure()` helper in
   `scripts/profile-session-search.ts` samples `process.memoryUsage().rss`
   immediately before and after each timed region, issues a best-effort
   `global.gc()` when Node is running with `--expose-gc` (to reduce
   GC-timing noise), and emits the resident-set-size delta as
   `rssDeltaMb` in the Markdown output. This is the shape any new
   profiling script should copy when the underlying issue (like #1610)
   asks about "memory footprint" as well as latency. Companion tests can
   assert on `rssDeltaMb < ceiling` for regressions like
   `tests/session/performance.test.ts:136` (`listSessions at 200 sessions
   stays below 500 ms and 50 MB RSS delta`), which pins both the wall
   time and the memory footprint at the upper edge of the #1610
   thresholds table.

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

### Handling secrets and pasted credentials

Any code path that persists a user-supplied credential (API keys,
bearer tokens, OAuth refresh tokens, MCP `apiKey` fields) MUST route
the value through `sanitizeApiKey` from `src/providers/auth.ts` at the
write boundary before serialization. The helper strips Unicode control
characters (`\p{Cc}`) and formatting characters (`\p{Cf}`, including
BOM, zero-width spaces, and bidi marks), trims surrounding whitespace,
and returns `''` for both non-string input and whitespace-only /
invisibles-only input. The current reference call site is
`addMcpServer` in `src/mcp/config.ts`; when adding a new config
surface that stores credentials, adopt the same pattern:

```typescript
import { sanitizeApiKey } from '../providers/auth.js';

// At the write boundary — not the read boundary.
const cleaned = sanitizeApiKey(input.apiKey);
if (cleaned.length === 0) {
  delete record.apiKey; // treat whitespace-only paste as "clear the field"
} else {
  record.apiKey = cleaned;
}
```

Additional rules (see `docs/PROVIDERS.md#authentication-errors` for the
operator-facing context and `docs/TESTING.md#testing-sanitizeapikey-and-auth-error-rewriting`
for the test pattern):

- **Never log credential values.** The `sanitizeApiKey` docblock in
  `src/providers/auth.ts:65-66` explicitly forbids logging the input
  or the return value. ESLint does not catch this — reviewers must.
- **Never `throw new Error(credential)`.** A rejected fetch response
  should surface an operator-friendly hint (see the auth-rewrite path
  in `src/cli/interactive.ts:handleStreamingError`), not the raw key.
- **Prefer the write boundary over the read boundary.** Normalizing
  on read means every consumer needs to know about the invariant;
  normalizing on write means the on-disk config is always canonical.
- **Structural, status-based classification.** When surfacing
  provider errors, use `classifyProviderError` from
  `src/providers/format.ts` rather than string-matching the message
  body. A regression that started grepping for `unauthorized` in
  arbitrary error prose would incorrectly flag non-auth failures; the
  test `does not treat a generic Error mentioning "unauthorized" in
  prose as auth` in `tests/cli/interactive.abort.test.ts` locks this
  down.

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

Sync commits follow the pattern `feat(sync): apply upstream changes (YYYY-MM-DD)` followed by a `style(ci): auto-fix lint/format issues [alexi-bot]` commit if formatting adjustments are needed. On quiet upstream days (no new commits on any tracked upstream in the 24h window since the previous sync), the sync commit may be a version-only bump paired with a timestamp-refresh in `.github/last-sync-commits.json` — no runtime, config, tool, provider, or TUI surface is modified. The 2026-08-24 sync (commit `c9e6fa10`, `1.21.6` → `1.21.7`) is the canonical example: `opencode` advanced (`3a31c4ea` → `41616958`) while `kilocode` (`ff74e2ea`) and `claude-code` (`45bdfa96`) held steady, and no `.ts` files were modified. When reviewing a sync PR, verify against `git diff --stat` — if only `package.json` (version field) and `.github/last-sync-commits.json` (timestamps + optional commit hashes) are touched, no CHANGELOG surface additions are expected beyond the paired `### Changed` sync-tracking entry.

Most recent worked example of the low-touch sync shape, 2026-09-13, commit `e367030a` (`feat(sync): apply upstream changes (2026-09-13)`, `1.22.18` → `1.22.19`): a single-file `.github/last-sync-commits.json` refresh where `claude-code` advanced (`df52d04a` → `b5932767`) while `kilocode` (`c36e2263`) and `opencode` (`95daf906`) held steady. The sync commit itself modified only `.github/last-sync-commits.json`, `package.json` (version field), and the `.github/prompts/` + `.github/reports/` planner/executor artefacts — zero `.ts` files under `src/` or `tests/`. Runtime feature work landed independently earlier in the cycle (OTLP tracing relay in commit `486cbe03`, `KILO_*` env-flag enable path for the shared agent board in commit `4c20df6b`); the `1.22.19` version bump captures both under a single `### Changed` sync-tracking entry in `CHANGELOG.md`. When reviewing similar low-touch sync PRs, the invariant is: no source or test file changed, no dependency added or removed in `package.json`, and the paired CHANGELOG entry describes only the upstream tracking refresh — never invent surface additions that the diff does not support.

### CI Autohealing

When CI fails on auto/* branches:
1. Failure logs collected and analyzed
2. Quick fixes applied (lint:fix, format)
3. Alexi agent applies targeted fixes
4. Fixes verified and committed
5. Rate-limited: max 2 runs/branch/day

A common autohealing pattern is removing **broken upstream-sync stub files**: the daily upstream sync occasionally produces TypeScript scaffolds at non-canonical paths (for example, single-line placeholders directly under `src/tool/` instead of registered tools under `src/tool/tools/`, or stray `package.json` fragments inside source subdirectories). These fail `npm run build` and `npm run lint` because they reference packages that are not installed or contain JavaScript-style comments inside JSON. The autohealer detects the build/lint failure and deletes the offending stubs in a `fix(ci): remove broken stub files from upstream sync [autohealing]` commit. When reviewing such commits, verify that none of the deletions touch a registered tool in `src/tool/tools/` (those are the canonical tool implementations) — only stray paths under `src/tool/` itself or non-root `package.json` files should be removed.

Recent concrete examples of this pattern (see `CHANGELOG.md` `[Unreleased]` for the current cycle):

- `src/core/config/provider.ts` (2026-07-22 sync, commit `643087a9`; **removed** by autohealing in commit `8c174021`, 2026-07-22, `fix(ci): auto-fix CI failures [alexi-bot]`): 10-line orphan scaffold declaring a `providerConfig` object with a single `chunkTimeout` field (`Schema.optional(Schema.Union([PositiveInt, Schema.Literal(false)]))`) built against a non-existent `some-schema-library` import path. The file was broken on multiple axes: (1) `some-schema-library` is not a real package in `package.json` — a fresh clone would fail with `Cannot find module 'some-schema-library'` on first import; (2) `Schema.optional`, `Schema.Union`, `PositiveInt`, and `Schema.Literal` are Effect-Schema-style validation primitives, whereas Alexi standardises on Zod (`defineTool` schemas in `src/tool/index.ts`, `defineEvent` schemas in `src/bus/index.ts`); (3) `export default providerConfig` had no runtime consumer anywhere in `src/` or `tests/` — provider configuration in Alexi comes from `src/config/routingConfig.ts` (routing rules loaded from `routing-config.json`) and environment variables (`AICORE_SERVICE_KEY`, `AICORE_RESOURCE_GROUP`, `AICORE_MODEL`) consumed by `src/providers/index.ts`, not a nested `src/core/config/provider.ts` module; (4) the `src/core/config/` directory did not exist prior to the sync and has no other members — canonical configuration modules live in `src/config/` (a sibling of `src/core/`), not underneath it. Diff statistics: `1 file changed, 10 deletions(-)`. This is the canonical worked example of the "single-file scaffold at a fresh non-canonical subdirectory that imports a non-existent package" variant of the stub pattern. The companion 5-line `src/core/package.json` stub emitted by the same 2026-07-22 sync was subsequently **removed** by autohealing in commit `c3a88212` (2026-07-22, `fix(ci): remove stray src/core/package.json breaking ESM build [autohealing]`) — same ESM-boundary rationale as the 2026-07-17 `src/core/package.json` cleanup below. That stub declared `{ "dependencies": { "@ai-sdk/xai": "3.0.102" } }` with no `"type"` field; under `NodeNext` module resolution `tsc` walked to that nested manifest instead of the root `package.json`, emitted every file under `src/core/` as CommonJS, and the resulting mixed CJS/ESM tree failed at runtime with `SyntaxError: The requested module '../../core/sessionManager.js' does not provide an export named 'SessionManager'`. The `@ai-sdk/xai` reference itself was doubly wrong for Alexi: not imported anywhere in `src/` or `tests/`, and inconsistent with the sole-provider policy (SAP AI Core Orchestration via `src/providers/sapOrchestration.ts`). See the `[Unreleased] ### Removed` entry in `CHANGELOG.md` for commit `c3a88212` for the full rationale.
- `src/core/model.ts` (2026-07-17 sync, commit `a14eeca6`): 8-line orphan Zod schema referencing `z` and `ModelCostSchema` without any `import` statements and describing a BYOK provider surface (`byokProvider: 'openai' | 'anthropic' | 'google'`) that does not exist in Alexi — the sole provider is SAP AI Core Orchestration (`src/providers/`). Not imported by any module in `src/` or `tests/`. Still present at the time of writing; candidate for the next autohealing sweep.
- `infra/nix/hashes.json` (2026-07-30, commit `e708015a`, `fix(ci): remove invalid JSON comment from infra/nix/hashes.json [alexi-bot]`; **fixed** in-place, not deleted): Canonical worked example of the "JavaScript-style comments inside JSON" variant of the invalid-JSON pattern. The file had accumulated a `// updated hashes` line-comment nested inside the top-level `"hashes"` object, which is a `SyntaxError` under strict JSON parsing (JSON does not permit `//` or `/* */` comments per RFC 8259 §2, unlike JSON5 / JSONC). The autohealer removed the comment line and collapsed the now-empty object to `{ "hashes": {} }`. Diff statistics: `1 file changed, 1 insertion(+), 3 deletions(-)`. Unlike the orphan-stub variants above, `infra/nix/hashes.json` is a legitimate live metadata file consumed by the reproducible-build tooling under `infra/nix/` — the correct autohealing disposition was to **repair** the JSON syntax in-place, not to delete the file. When reviewing similar JSON-syntax-fix commits, verify that the file has a real downstream consumer (Nix flake, `jq` script, CI JSON-lint step, or editor schema binding) before choosing between the "repair" and "delete" dispositions.
- `src/core/package.json` (2026-07-17 sync, commit `a14eeca6`; **removed** by autohealing in commit `0305e95f`, 2026-07-17, `fix(ci): remove stray src/core/package.json breaking ESM build [autohealing]`): 3-line nested `{"version": "1.18.3"}` inside the source tree that created a package boundary conflicting with the top-level `"type": "module"` declaration and broke `npm run build`. The autohealer detected the ESM-build failure and deleted the file, restoring green CI. Diff statistics: `1 file changed, 3 deletions(-)`. This is the canonical worked example of the "stray `package.json` fragments inside source subdirectories" pattern called out above.
- `src/core/pty.node.ts` and `src/core/session.ts` (2026-07-21 sync, commit `5520cd54`; **removed** by autohealing in commit `7b47d5e0`, 2026-07-21, `fix(ci): remove broken stub files from upstream sync [autohealing]`): Two orphan TypeScript scaffolds imported from `sst/opencode`'s `packages/core/` subtree that referenced non-existent Alexi modules. `pty.node.ts` (19 lines) declared a `Proc` interface and a `spawn` wrapper around `node-pty` — a package that is not in Alexi's `package.json` because Alexi has no PTY-backed terminal surface (shell execution is handled by the `bash` tool at `src/tool/bash.ts` using `child_process.spawn`, not a pseudo-terminal). `session.ts` (11 lines) declared a `SessionRevert` schema using Effect-Schema primitives (`Schema.Struct`, `Schema.Literals`, `optionalOmitUndefined`) imported from `../utils/schema` and `PartID` from `../types`, neither of which exist in the source tree — Alexi uses Zod for validation (`src/tool/index.ts` `defineTool`, `src/bus/index.ts` `defineEvent`) and its canonical session type lives in `src/core/sessionManager.ts`, with revert/undo handled by `src/undo/` and `src/core/checkpoints.ts`. Diff statistics: `2 files changed, 30 deletions(-)`. Same invariant: verify against `src/providers/` and canonical runtime surfaces before treating an upstream-imported file as a live module.
- The canonical model metadata surface in Alexi is the runtime deployment list returned by the SAP AI Core Orchestration API and surfaced via `alexi models`, not a static Zod schema under `src/core/`. When reviewing autohealing PRs against these paths, verify against `src/providers/` (the sole provider surface) and the top-level `package.json` (which owns the single `"type": "module"` declaration for the whole tree). Session revert / undo semantics live in `src/undo/` and `src/core/checkpoints.ts`, and shell execution lives in the `bash` tool at `src/tool/bash.ts` — not in any top-level `src/core/session.ts` or `src/core/pty*.ts` file. Provider-level configuration (streaming timeouts, chunk watchdogs, credentials) is expressed through routing rules in `routing-config.json` (loaded via `src/config/routingConfig.ts`) and environment variables consumed by `src/providers/index.ts` — not through a nested `src/core/config/` schema module.
- **Four new orphan stubs under `src/agent/`, `src/cli/`, and `src/context/` (2026-07-26 sync, commit `0985297e`; pending autohealing)**: The 2026-07-26 upstream sync added four brand-new orphan TypeScript files with zero consumers in `src/` or `tests/`, each broken in a slightly different way. This is the same "single-file scaffolds emitted at non-canonical paths" variant of the stub pattern documented in the earlier entries above; unlike the 2026-07-24 `530351f4` regression, none of the 2026-07-26 stubs overwrote a previously-populated file, so all four must be **deleted** (not restored) by the next autohealing sweep. Per-file rationale for reviewers: (1) `src/agent/instance-advertisement.ts` (5 lines) exports `advertiseInstance(instanceId: string): void` whose only body is `console.log(...)`, violating the project-wide `no-console` ESLint rule — the canonical `AgentRegistry` surface lives at `src/agent/index.ts` (currently in the broken state from the 2026-07-24 sync), never in per-feature files directly under `src/agent/`; (2) `src/cli/remote.ts` (5 lines) declares a non-exported `executeRemoteCommand(command: string): void` that calls an undeclared `isValidCommand` — `TS2304` at typecheck time, and there is no `alexi remote` subcommand on Alexi's Commander.js program (`src/cli/program.ts`); (3) `src/context/global-sync/bootstrap.ts` (4 lines) exports `bootstrapGlobalSync(): void` calling an undeclared `initializeContext()`, and the fresh `src/context/global-sync/` directory has no other members — the canonical upstream-sync entrypoint is `.github/workflows/sync-upstream.yml`, not a runtime module; (4) `src/context/server-session-reducer.ts` (4 lines) declares a non-exported `reduceSession(session: Session): Session` referencing undeclared `Session` and `optimizeSessionData`, and — critically — has no `return` statement despite the `: Session` return-type annotation, producing three TypeScript errors on a single 4-line file (`TS2304`, `TS2304`, `TS2355`). When reviewing the autohealing PR for the 2026-07-26 cycle, verify that all four files are deleted, plus the empty `src/context/global-sync/` directory. Cross-reference the CHANGELOG `### Added` entry for 2026-07-26 for the full recovery specification, and note that the 2026-07-24 `530351f4` regression on `src/agent/index.ts` remains pending — the 2026-07-26 autohealing pass should either combine both cleanups or explicitly leave `src/agent/index.ts` recovery for a follow-up commit, whichever the autohealer's per-run scope covers.
- **Five new orphan stubs under `src/core/` and `src/tool/` (2026-07-29 sync, commit `719046d4`; **removed** by autohealing in commit `b44ac96f`, 2026-07-29, `fix(ci): remove orphan stub files from upstream sync [autohealing]`)**: The 2026-07-29 upstream sync added five brand-new orphan TypeScript files that were single-fragment code snippets copied verbatim from upstream `sst/opencode` sources — none of them parsed as TypeScript, none had valid module structure, and none were imported by any module in `src/` or `tests/`. Aggregate diff for the autohealing removal: `5 files changed, 20 deletions(-)`. Per-file rationale for reviewers: (1) `src/core/config/plugin/provider.ts` (1 line: `const integrationTransform = yield* integrations.transform()`) — `yield*` outside a generator is a `SyntaxError`, `integrations` is undeclared, and the fresh `src/core/config/plugin/` directory has no other members; canonical provider configuration in Alexi lives in `src/providers/sapOrchestration.ts` and `src/providers/index.ts`, not a nested `src/core/config/plugin/provider.ts`. (2) `src/core/credential.ts` (1 line: `readonly get: (id: ID) => Effect.Effect<Stored | undefined>`) — a bare interface member at the top level is a `SyntaxError`, `ID`/`Effect`/`Stored` are all undeclared, and `Effect.Effect<...>` is an Effect-TS pattern Alexi does not use; SAP AI Core credentials are read from environment variables (`AICORE_SERVICE_KEY`, `AICORE_RESOURCE_GROUP`) by `src/providers/auth.ts`. (3) `src/core/integration.ts` (1 line: `export const TextPrompt = Schema.Struct({`) — unterminated object literal is a `SyntaxError`, `Schema` is undeclared, and `Schema.Struct` is an Effect-Schema primitive Alexi does not use; Alexi standardises on Zod (`defineTool`, `defineEvent`). (4) `src/tool/code-mode-integration.test.ts` (1 line: `server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOL_DEFS }))`) — `server`/`ListToolsRequestSchema`/`TOOL_DEFS` are all undeclared, no `describe`/`it` block so Vitest would not register a test suite, and Alexi's MCP integration lives in `src/mcp/server.ts` without a `code-mode` tool. (5) `src/tool/code-mode.ts` (13-line unclosed `return yield* Effect.promise(async () => { ... })` block) — `return` and `yield*` outside a function body are both `SyntaxError`, and Alexi has no `code-mode` tool (canonical built-ins are `bash`, `read`, `write`, `edit`, `glob`, `grep`, `task`, `webfetch`, `task_status` registered via `src/tool/registry.ts`). This is a fresh worked example of the **single-fragment non-parseable snippet** variant of the stub pattern — different from the earlier "single-file scaffolds referencing non-existent packages" variant (2026-07-22 `src/core/config/provider.ts`) in that these files were never valid TypeScript at all. When reviewing autohealing PRs for this pattern, verify that all deletions correspond to non-parseable fragments (a `tsc --noEmit` on the file would fail with a `SyntaxError`, not just `TS2307`/`TS2304`), and that none of the deletions touch `src/tool/tools/` (registered tools) or `src/mcp/` (canonical MCP integration). See the `[Unreleased] ### Removed` entry in `CHANGELOG.md` for commit `b44ac96f` for the full per-file recovery specification.
- **`src/agent/index.ts` + four orphan `packages/...` stubs (2026-07-24 sync, commit `530351f4`; pending autohealing)**: The 2026-07-24 upstream sync introduced a new **destructive** variant of the stub pattern that must be handled differently from previous instances. Rather than emitting brand-new orphan files, the sync **overwrote** a 554-line runtime module (`src/agent/index.ts`, which owns the entire `AgentRegistry` / `stripInternalOptions` / `INTERNAL_OPTION_KEYS` / built-in-agents surface) with a 3-line broken import stub pointing at `packages/opencode/src/agent/agent`. Seven downstream modules (`src/core/agenticChat.ts`, `src/core/streamingOrchestrator.ts`, `src/cli/commands/chat.ts`, `src/config/modes-migrator.ts`, `src/server/index.ts`, `src/tool/tools/task.ts`, plus the tests in `src/agent/index.test.ts` and `src/core/__tests__/agenticChat.test.ts`) import from this file and are all failing to type-check. The same sync also emitted four brand-new 3-line `packages/...` orphan stubs at `src/core/migration.ts`, `src/core/project.ts`, `src/core/session.ts`, and `src/providers/openai.ts` (and one legitimate documentation entry — `docs(tools): document optional tree-sitter grammar dependencies (#1091)`, commit `9f9fad90` — that autohealing must not touch). **Recovery rule for this variant**: `src/agent/index.ts` must be **reverted** to its pre-sync content at parent commit `9f9fad90` (`git checkout 9f9fad90 -- src/agent/index.ts`), because seven runtime modules depend on its exported surface — deleting the file would break the CLI. The other four files must be **deleted**, not restored, because they had no pre-sync content in this repository. When reviewing autohealing PRs for the 2026-07-24 cycle, verify that: (a) `src/agent/index.ts` is restored, not deleted, and contains the `AgentSchema`, `INTERNAL_OPTION_KEYS`, `stripInternalOptions`, `AgentRegistry`, `builtInAgents`, `getAgentRegistry`, `getCurrentAgent`, `switchAgent`, `removeAgent`, `parseAgentSwitch`, and `parseAgentMention` symbols required by the grep in the paired CHANGELOG entry; (b) the four orphan stubs are deleted; (c) `src/providers/openai.ts` is treated as sync noise and not as an OpenAI provider — the sole provider is SAP AI Core Orchestration per `docs/PROVIDERS.md`; (d) the 2026-07-24 tree-sitter documentation PR (#1091) is preserved as a legitimate doc change. This is the canonical worked example of the **destructive-replacement** variant of the sync-stub pattern: same 3-line `packages/...` shape as previous instances, but overwriting a live module rather than emerging at a fresh path.

A **variant that must NOT be treated as an orphan stub** is the deliberate **placeholder for a pending upstream port**. When an upstream feature flag is wired up ahead of its runtime, autohealing sometimes ships a small stub module whose only purpose is to keep dynamic imports resolvable at type-check time and to expose a safe "unavailable" runtime that the caller degrades on. Distinguishing marker: the stub compiles cleanly, has a documented consumer (a dynamic import in a sibling module), and its exported factory returns a well-typed object that throws on dispatch so the caller falls back to a working code path. **Do not delete these** — deleting them re-breaks the loader wiring the moment the feature flag is turned on.

Worked example, 2026-09-18, commit `85e11d06` (`fix(ci): add code-mode-runtime stub and format registry [autohealing]`): 33-line stub at `src/tool/code-mode-runtime.ts` that exists solely so the `await import('./code-mode-runtime.js')` in `loadCodeMode()` (`src/tool/code-mode.ts:62`) resolves under `tsc --noEmit`. The stub exports `createCodeModeRuntime(): CodeMode` returning an `UnavailableCodeModeRuntime` instance whose `dispatch(_toolName, _args)` always throws (`'[code_mode] runtime not yet implemented in Alexi; falling back to direct tool dispatch.'`) and whose `dispose()` is a no-op. The caller in `loadCodeMode()` catches the throw, logs a debug message, and falls back to the direct-tool dispatch path — the agent turn is not aborted. When the real confined-JavaScript sandbox (`isolated-vm` / worker + MCP on-demand tool cache) lands from upstream kilocode `6b5e8a04e experimental.code_mode`, the exported factory's shape is unchanged so no downstream call site has to move. Reviewer checklist for this variant: (a) the file's header comment names the upstream commit / feature flag it is a placeholder for; (b) the exported symbol is imported by name from a documented consumer under `src/` (not a dead export); (c) the "unavailable" runtime throws with a clear error mentioning the feature it stubs, not a `TS2304` or `SyntaxError`; and (d) the throw is caught and treated as "feature disabled" by the caller — never propagated to the user. When all four checks pass, the stub is a legitimate wiring aid, not an autohealing target.

A second, less destructive class of autohealing target is **dead assignments and tautological locals in test files**. Vitest tests that were originally structured around a "does not hang the event loop" invariant sometimes accumulate `let flag = false; ... flag = true; expect(flag).toBe(true)` scaffolding whose only surviving purpose is to make the author's intent explicit in the source. ESLint's `no-unused-vars` rule (upgraded to `error` in Alexi — see the ESLint configuration section above) flags the assignment as unused, and the CI autohealer removes the variable, its reassignment, and the tautological `expect(...)` call in a `fix(ci): remove unused assignment and apply prettier formatting [autohealing]` commit. The correct replacement is a **direct assertion on the object under test's own accessor** (e.g. `expect(w.size()).toBe(0)`) that observes a real post-condition rather than a self-referential local. Worked example, 2026-08-21, commit `e42429f4`: `tests/core/filesystem/instance-watcher.test.ts:137` (case `'setDebounceTimer clears the previous timer for the same directory'`) previously declared `let firstCleared = false`, immediately reassigned it, and asserted `expect(firstCleared).toBe(true)` — the assertion could never fail because the code path between the assignment and the assertion did not touch the variable. Autohealing deleted the three lines and inserted `expect(w.size()).toBe(0)` after `w.dispose()`, which asserts the actual observable post-condition of the `InstanceWatcher.dispose()` contract (`src/core/filesystem/watcher.ts:161` — clears every debouncer timer and the watchers map, `size()` returns `0`). Aggregate diff: `1 file changed, 3 insertions(+), 5 deletions(-)`. When reviewing similar autohealing commits, verify that (a) the replacement assertion targets a real observable property of the module under test, not just another local, and (b) the load-bearing property of the case — in this instance, that a leaked 60s `setTimeout` would keep the Vitest event loop alive past the 5s default test timeout — is preserved by the surrounding scaffolding. See `docs/TESTING.md` under **Testing InstanceWatcher and Debounce-Timer Cleanup** for the full regression contract for this suite.

### Pre-Commit Hooks

The project uses **Husky** with **lint-staged** to enforce style at commit time. On every commit, the following runs automatically against staged `.ts` files:

```json
{
  "*.ts": ["eslint --fix", "prettier --write"]
}
```

Combined with **commitlint** (conventional commits), this ensures that local commits always pass basic quality checks before reaching CI.

### Style Auto-Fix

The CI pipeline automatically applies formatting and linting corrections on eligible branches. These changes are committed with the message format:

```
style(ci): auto-fix lint/format issues [alexi-bot]
```

This ensures consistent code style (trailing whitespace removal, blank line normalization, Prettier formatting) across all modules without manual intervention. Common auto-fixed patterns include:
- Trailing whitespace in object return statements and function bodies (e.g., permission modules, tool implementations)
- Extraneous blank lines between code blocks in tool definitions and shell prompt builders
- Missing or extra trailing newlines at end of file
- Inconsistent spacing in namespace and class method definitions
- Quote-style normalization from double to single quotes per Prettier `singleQuote: true` (applied across `src/` and `tests/`)
- Multi-line-vs-single-line reflows of imports, `await expect(...)` chains, nullish-coalescing chains, `throw new Error(...)` calls with template-literal messages, `vi.importActual<T>()` generic type-argument lists, and generic type-parameter blocks to satisfy the 100-column `printWidth`. Auto-fix also strips stale `// eslint-disable-next-line no-console` pragmas above `vi.spyOn(console, ...)` calls — the `no-console` rule targets the `console.*` call surface, not `vi.spyOn(console, 'warn')` which manipulates the object via property reference, so the pragma is inert. The same stripping applies to stale `// eslint-disable-next-line @typescript-eslint/no-var-requires` pragmas above lazy `require('./modelCatalog.js')`-style CJS interop calls when the ESLint config no longer configures `@typescript-eslint/no-var-requires` (the rule is deprecated in `@typescript-eslint` v8, superseded by `no-require-imports`, and Alexi does not enable the successor rule at present). **As of commit `544ba4ef` (`fix(providers): replace require() with globalThis registry pattern`, 2026-08-29) the last such lazy `require` in the runtime tree has been removed:** `src/providers/sapOrchestration.ts`'s `isOrchestrationModel(modelId)` guard no longer calls `require('./modelCatalog.js')`. The circular-import break is now expressed as a `globalThis`-keyed function-pointer registry (`_registerCatalogGuard(fn)` in `sapOrchestration.ts`, invoked at load time by `modelCatalog.ts` after it defines `isAvailableModel`) — see the "Circular-import break: catalog guard registry" section of `docs/PROVIDERS.md` for the full contract. Historically, when the same pattern reappears in a future ESM-cycle break, prefer the registry approach; the `require(...)` shim is retained ONLY in files that predate this refactor and cannot yet be migrated (currently: none in `src/`). Most recent worked example on the runtime tree: the 2026-08-29 pass in commit `6718772a` (`style(ci): auto-fix lint/format issues [alexi-bot]`) touched two modules produced by the preceding dynamic-model-catalog feature (`4bff052d`), applying three formatting-only edits with zero runtime impact — `src/cli/utils/completer.ts:13-16` reflowed the two-name `import { getAvailableModels as getCatalogModels, getCatalogStatus } from '../../providers/modelCatalog.js';` from a single 114-column line onto four lines with the braces on their own lines, `src/cli/utils/completer.ts:309-314` reflowed the `getCatalogStatus() === 'ready' ? getCatalogModels() : (ORCHESTRATION_MODELS as readonly string[])` ternary inside `completeModelName` onto four lines with `?` and `:` each starting an indented line (same live-catalog-vs-static-fallback contract preserved: newly deployed models still appear in `/model` `Tab` completion without a restart when the catalog is `ready`), and `src/providers/sapOrchestration.ts:1992` inside `isOrchestrationModel(modelId)` deleted a stale `// eslint-disable-next-line @typescript-eslint/no-var-requires` pragma above the deliberately-lazy `require('./modelCatalog.js')` inside the `try` block — the lazy `require` is retained so the module-load order stays `sapOrchestration` → `modelCatalog` → (lazy hop back) rather than a top-level cycle. Aggregate diff: `2 files changed, 8 insertions(+), 3 deletions(-)`. The bot-driven autohealing loop (`ci-auto-fix.yml`) picked this pass up automatically after the `feat(providers): dynamic model catalog from SAP AI Core` commit crossed the ESLint/Prettier gate on merge but before the `format:check` CI job ran on `master`. Preceding worked example: the 2026-08-20 pass in commit `cd5bc5f0` (`style(ci): auto-fix lint/format issues [alexi-bot]`) touched a single tool-implementation module, `src/tool/tools/agent-manager.ts`, collapsing two hand-authored five-line Zod field definitions on `AgentManagerParamsSchema` (`sessionId` and `worktreeId`, lines 14 and 15) onto the canonical single-line `z.string().nullable().optional().describe('...')` form. Both resulting lines fit at 89 and 87 columns respectively, well within `printWidth: 100`; Prettier prefers to keep short Zod chain expressions on a single line rather than breaking after each `.method(` call. Aggregate diff: `1 file changed, 2 insertions(+), 10 deletions(-)`. Pure formatting change with no runtime, validation, or type-safety impact — the schema still accepts `null` OR omitted values for both fields (preserving the nullable-friendly contract for strict providers), the `agent_manager` tool's permission entry (`{ action: 'admin', getResource: (params) => params.action }`) is unchanged, the enum on `action` is unchanged (`'create' | 'list' | 'stop' | 'status'`), and the `AgentManagerResult` interface is unchanged. The paired nested `config` field on the same schema is untouched because it does not fit on one line at 100 columns. Preceding worked example on the runtime tree: the 2026-08-18 pass in commit `576ea3d2` (`style(ci): auto-fix lint/format issues [alexi-bot]`) touched a single runtime module, `src/config/userConfig.ts`, collapsing a hand-authored three-line break of the `throw new Error(...)` inside `setConfigMcpToolDisplay(display: McpToolDisplay)` (line 278) onto the canonical single-line form. The template-literal error message `` `mcpToolDisplay must be 'expanded' or 'collapsed' (got '${String(display)}')` `` fits at 92 columns, well within `printWidth: 100`; Prettier prefers to keep short `throw new Error(<template>)` expressions on a single line rather than breaking after `new Error(`. Aggregate diff: `1 file changed, 1 insertion(+), 3 deletions(-)`. Pure formatting change with no runtime, validation, or type-safety impact — the runtime guard (`display !== 'expanded' && display !== 'collapsed'`) still throws for values outside the `McpToolDisplay = 'expanded' | 'collapsed'` union (defence-in-depth against callers that erase the type via `as McpToolDisplay` or dynamic import), the error message shape is preserved verbatim, and the paired reader `getConfigMcpToolDisplay()` still accepts both the camelCase `mcpToolDisplay` and the legacy snake_case `mcp_tool_display` keys and falls back to `'collapsed'` on corrupt input. Most recent worked example on the test tree: the 2026-08-13 pass in commit `2b2e5830` (`style(ci): auto-fix lint/format issues [alexi-bot]`) touched a single Vitest file, `tests/tool/tools/warpgrep.test.ts`, collapsing a hand-authored three-line break of `vi.importActual<\n  typeof import('../../../src/tool/tools/warpgrep.js')\n>('../../../src/tool/tools/warpgrep.js')` onto the canonical two-line form `vi.importActual<typeof import('../../../src/tool/tools/warpgrep.js')>(\n  '../../../src/tool/tools/warpgrep.js'\n)`. The `<...>` type-argument line fits at 96 columns, well within `printWidth: 100`; Prettier prefers to keep the generic type argument on the same line as the identifier and break only after the `(` for the runtime argument. Aggregate diff: `1 file changed, 3 insertions(+), 3 deletions(-)`. Pure formatting with no impact on assertion semantics, mock scope, coverage, or the tested surface — the `describe('WarpGrep built-in tool - removed from registry', ...)` suite still pins the same three-part contract for the retired `codebase_search` built-in tool (absent from `builtInTools` with or without `@morphllm/morphsdk`, `grep` description still surfaces the install hint). See `docs/TESTING.md` under **Test File Formatting** (pattern 3, `vi.importActual<T>()`) for the standing pattern. Prior worked example on the test tree: the 2026-08-12 pass in commit `9e2b9ca6` (`style(ci): auto-fix lint/format issues [alexi-bot]`) touched three Vitest files. `tests/config/global-invalidation.test.ts` had a stale `// eslint-disable-next-line no-console` pragma removed above a `vi.spyOn(console, 'warn').mockImplementation(() => {})` call (`+1/-1`). `tests/providers/reasoning-variants.test.ts` had a four-line named-import block for `deriveReasoningVariants` and `mergeProviderModels` from `src/providers/transform.ts` collapsed onto a single 90-column line (`+1/-4`). `tests/session/retry.test.ts` had two multi-line `await expect(withRetry(fn, ..., { maxAttempts, baseMs: 1 })).rejects.toBe(err)` chains collapsed onto single lines (`+2/-6`). Aggregate diff: `3 files changed, 4 insertions(+), 11 deletions(-)`. Pure formatting with no impact on assertion semantics, coverage, or the tested surfaces (`invalidateGlobalConfig`, `deriveReasoningVariants`, `mergeProviderModels`, `withRetry`). See `docs/TESTING.md` under **Test File Formatting** for the standing pattern. Prior worked example on the runtime source tree: the 2026-08-11 pass in commit `cf7e01de` (`style(ci): auto-fix lint/format issues [alexi-bot]`) collapsed the four-part `rule.tools?.[0] ?? rule.paths?.[0] ?? rule.commands?.[0] ?? rule.hosts?.[0]` fallback chain in `src/permission/index.ts` (the `matchedPattern` computation inside the last-match rule-provenance block) onto a single line, and expanded the `prepareRequest<T extends { prompt: LanguageModelV2Prompt }>(ctx: { providerId; modelId; auth; prompt } & T): T` signature in `src/providers/sapOrchestration.ts` from a single-line signature to a multi-line block (line 395-402). Diff statistics: `2 files changed, 9 insertions(+), 10 deletions(-)`. Both changes are pure formatting with no behavioural, API, or provider-routing impact — the fallback semantics (`??` order) and the intersection-type shape (`{ providerId; modelId; auth; prompt } & T`) are preserved verbatim. Unlike the orphan-stub pass documented above, these two files are **live runtime modules** (`PermissionManager.evaluate` and `prepareRequest<T>` respectively), so the auto-fix acts on real code rather than on autohealing-candidate scaffolds.
- `eqeqeq`-driven strict-inequality rewrites of `!= null` / `== null` null-and-undefined checks. `no-throw-literal` and quote-style fixes are cosmetic; `eqeqeq` (configured as `error` in Alexi — see the ESLint configuration section above) is a semantic-preserving rewrite that ESLint's autofixer will NOT apply automatically (the shortest-safe replacement is context-sensitive), so the autohealing bot performs it by hand. The canonical target is `x != null` → `x !== null && x !== undefined` (both operands checked explicitly). Worked example, 2026-08-25, commit `de9d1530` (`fix(ci): apply prettier formatting and use strict inequality [autohealing]`): `src/permission/agent-manager.ts:124` inside `isBlocked(agentId)` previously read `return blocker != null;` — a loose inequality that ESLint flagged and the autohealer rewrote to `return blocker !== null && blocker !== undefined;`. Semantic contract of `isBlocked` is unchanged: `null` and `undefined` still both mean "not blocked" (both return `false`); every other truthy `Blocker` value returns `true`; the `catch (err)` branch still fails closed with `return true` (per upstream port `98559c9d6`) so a store-lookup failure never lets a caller silently bypass a real block. Same commit also touched three sibling files with pure Prettier reflows (no semantic change): `src/core/session/processor.ts:38-39` collapsed the two-arm `CompletenessResult` discriminated union onto a single line (still `{ status: 'complete' } | { status: 'retry'; reason: 'reasoning-only' }`); `src/tool/tools/agent-manager.ts:14` collapsed the `.enum([...]).describe(...)` chain on the `action` field onto a single 92-column line (enum values `'create' | 'list' | 'stop' | 'status' | 'answer'` and describe metadata both unchanged); `src/tool/tools/shell/id.ts:89-91` reflowed the `pwshHits` `.filter((item): item is string => Boolean(item))` type-guard so the arrow follows the type predicate and `Boolean(item)` drops to the next line (same `PowerShell.pwsh() > PowerShell.probe() > cmd.exe` candidate order on Windows). Aggregate diff for the pass: `4 files changed, 5 insertions(+), 8 deletions(-)`. When reviewing similar autohealing commits, verify that (a) the strict-inequality rewrite preserves both branches of the loose check — replacing `!= null` with just `!== null` DROPS the `undefined` branch and is a semantic change, not a lint fix; and (b) the paired Prettier reflows do not silently reorder discriminants of a union, drop enum members, or move a type predicate off its original expression.
- Missing trailing semicolons on statements (e.g., bare `return` inside an early-exit branch, field declarations in object type literals, `const` statements) per Prettier `semi: true` -- recent examples include the semicolon added after the early `return` in `cancel(sessionID)` inside `src/session/prompt-queue.ts` (commit `8a005f03`), the bulk semicolon/quote-style/trailing-newline fixes applied to the orphan `inherited(input)` helper in `src/tool/task.ts` (commit `fe8b98c5`), the nine-file quote-style and trailing-newline pass on the 2026-06-22 upstream-sync stubs across `src/agent/index.ts`, `src/core/config.ts`, `src/core/index.ts`, `src/event/index.ts`, `src/plugin/provider.ts`, `src/session/index.ts`, `src/tool/parameters.test.ts.snap.ts`, `src/tool/task.ts`, and `src/tool/webfetch.ts` (commit `6dc4b883`), the single-line trailing-newline fix appended to the Express OpenAI-compatible route stub `src/router/openaiRoute.ts` (commit `25b45885`, 2026-07-19) immediately after the 2026-07-19 upstream sync (commit `3cca78f4`) imported it without a final LF, the four-file indent-normalisation pass (4-space → 2-space `tabWidth: 2`) on `src/agent/instance-advertisement.ts`, `src/cli/remote.ts`, `src/context/global-sync/bootstrap.ts`, and `src/context/server-session-reducer.ts` (commit `9a914b57`, 2026-07-26) immediately after the 2026-07-26 upstream sync, the three-file trailing-newline / `yield*` → `yield * ` / terminating-semicolon pass on `src/core/config/plugin/provider.ts`, `src/tool/code-mode.ts`, and `src/tool/code-mode-integration.test.ts` (commit `3a9b850b`, 2026-07-29) immediately after the 2026-07-29 upstream sync (commit `719046d4`), and the three-file quote-style-normalisation / trailing-newline pass on `src/permission/PermissionView.ts` (four double-to-single-quote conversions inside an `updatePermissionView(card, permission)` function referencing an unresolved `'utils'` bare-module import and an undeclared `syncDescription` free identifier), `src/tool/BaseSearchToolView.ts` (a trivially-infinite-recursive `bindHeader(parts)` function with an implicit-`any` parameter), and `src/tool/PatchBody.ts` (a top-level `return` statement — a `SyntaxError` in ES modules — inside an `if (diffLines.length > DIFF_MAX_LINES)` block with three undeclared identifiers and a `./DiffOverflow` import missing the mandatory `.js` extension per `NodeNext`) — commit `36ac95b2`, 2026-08-01, immediately after the 2026-08-01 upstream sync (commit `b8b9f01b`, version bump `1.18.17` → `1.18.18`) — all remain orphan stubs and are recorded in the corresponding `CHANGELOG.md` `### Fixed` entry as autohealing candidates. When writing new code, run `npm run format` locally to avoid these no-op fix-up commits from the autohealer. Note that orphan stubs emitted by the daily upstream sync (single-file scaffolds at non-canonical paths under `src/`, importing missing namespaces or referencing undeclared symbols such as `EventHandler`, `FetchOptions`, or the non-existent `'core'`, `'session'`, `'plugin'` packages, or referencing missing sibling directories such as `../handlers/openai`) routinely receive these formatting fix-ups in the commit immediately following the sync; they do not indicate that the stub is wired into the runtime. Verify the canonical implementation path before treating an auto-fixed file as a live module -- for tools, the canonical location is always `src/tool/tools/<name>.ts` registered via `src/tool/registry.ts`, never directly under `src/tool/`; for the event bus the canonical location is `src/bus/index.ts`, not `src/event/index.ts`; for sessions it is `src/core/sessionManager.ts`, not `src/session/index.ts`; for configuration it is `src/config/` (`routingConfig.ts`, `userConfig.ts`, `projectContext.ts`), not `src/core/config.ts`; and for HTTP surfaces it is `src/server/` (the documented server-mode entry point in `docs/API.md`), not `src/router/` (which currently holds orphan Express router stubs). Recall that Alexi's sole provider surface is SAP AI Core Orchestration (`src/providers/`); files under `src/router/` that appear to expose an OpenAI-compatible ingress route are upstream-sync scaffolds and are not part of Alexi's runtime.

Most recent worked example, 2026-09-01, commit `755ce518` (`style(ci): auto-fix lint/format issues [alexi-bot]`): a two-file follow-up applied after the `decodeJsonIfString<T extends z.ZodTypeAny>` helper was hand-edited in `src/tool/tools/agent-manager.ts:25-33`. Two independent Prettier reflows landed in the same commit: (1) the generic-parameter list on `decodeJsonIfString` was split across three lines so `<T extends z.ZodTypeAny>(schema: T)` and its `: z.ZodEffects<T, z.infer<T>, unknown>` return type each occupy their own line — the previous single-line form exceeded 100 columns; (2) the inline JSON-shape guard `if (!trimmed || (trimmed[0] !== '{' && trimmed[0] !== '['))` was collapsed from a hand-authored five-line form onto a single 63-column line because Prettier prefers the compact form when it fits under `printWidth`. Same commit also touched `src/tool/tools/__tests__/apply-patch.json-encoding.test.ts:38` where a seven-line unified-diff hunk array (`'@@ -1,3 +1,3 @@'`, ` line1`, `-line2`, `+lineTWO`, ` line3`, `''`) was collapsed onto a single-line `.join('\n')` invocation — see `docs/TESTING.md` under **Test File Formatting** for the standing pattern that fixture arrays whose joined form fits under 100 columns should be authored on one line to avoid the auto-fix follow-up commit. Semantic contract of `decodeJsonIfString` is unchanged: still a Zod `preprocess` transform, still parses only strings whose first non-whitespace character is `{` or `[`, still falls through with the original string on `JSON.parse` failure so the wrapped schema emits a descriptive validation error rather than the tool crashing on a parse exception. The `AgentManagerParamsSchema` shape (`action` enum with values `'create' | 'list' | 'stop' | 'status' | 'answer'`, `sessionId`, `agentId`, `answer`, `worktreeId`, `config`) and the paired `selectModel` / `isSelectModelError` re-imports from `src/tool/model-selection.ts` used by the `create` action are all untouched. `npm run typecheck` and `npm test` produce byte-identical output; the only observable delta is that `npm run format:check` now succeeds on both files.

Most recent worked example on the quote-style axis, 2026-09-08, commit `834d1abf` (`style(ci): auto-fix lint/format issues [alexi-bot]`): a two-file follow-up applied after the neighbouring `sourceSessionId` field of `AgentManagerParamsSchema` was hand-authored with a single-quoted literal containing two escaped apostrophes. The first hunk is a one-line Prettier `avoidEscape` rewrite on the `.describe(...)` argument of `sourceSessionId` at `src/tool/tools/agent-manager.ts:77`. The literal previously read `'Session that originated this message; the target agent\'s reply routes back here. Defaults to the caller\'s session when omitted.'` and Prettier rewrote it to the double-quoted form `"Session that originated this message; the target agent's reply routes back here. Defaults to the caller's session when omitted."` — exact same rule as the 2026-09-07 `worktreeId` example immediately below, applied to the sibling field on the same schema. Two `\'` escapes elided, one line changed. The second hunk in the same commit is a Prettier reflow on `src/tool/tools/__tests__/open-plan.test.ts:47` where the three-line invocation `await openPlanTool.executeUnsafe({ path: planPath }, { workdir: tempDir })` was collapsed onto a single 82-column line — see `docs/TESTING.md` under **Test File Formatting** point 5 for the standing pattern that short `tool.executeUnsafe(params, context)` call sites should be inlined when they fit under `printWidth: 100`. Semantic contract unaffected on both hunks: `sourceSessionId` remains `z.string().nullable().optional()` with the same describe metadata (the escape rewrite is byte-preserving on the rendered string that the LLM sees, so the tool description sent to the model is character-identical), and `openPlanTool.executeUnsafe` receives the same `{ path }` params and `{ workdir }` context. Diff statistics: `2 files changed, 2 insertions(+), 5 deletions(-)`. Convention reminder: for describe-metadata strings and error messages that embed English possessives or contractions on **any** Zod field (not just `worktreeId`), always author them as double-quoted literals from the start — `sourceSessionId` was the second field on the same schema to trip this pattern in the same release cycle.

Prior worked example on the quote-style axis, 2026-09-07, commit `75b27243` (`style(ci): auto-fix lint/format issues [alexi-bot]`): a one-line Prettier `avoidEscape` rewrite on the `.describe(...)` argument of the `worktreeId` field of `AgentManagerParamsSchema` at `src/tool/tools/agent-manager.ts:81`. The literal previously used single quotes with an escaped apostrophe (`'... in the caller\'s project. ... to use the caller\'s directory. ...'`) — a shape that satisfies the project's `singleQuote: true` Prettier setting on its face but that Prettier 3.x rewrites to a double-quoted literal (`"... in the caller's project. ... to use the caller's directory. ..."`) under its default `avoidEscape` semantics: when a string literal would need one or more `\'` escapes to survive as single-quoted, the double-quoted form is strictly shorter in source and is therefore preferred, `singleQuote: true` notwithstanding. This is the standing convention for describe-metadata strings and error messages that embed English possessives or contractions ("caller's", "don't", "won't", "it's") — do NOT hand-author them as single-quoted-with-`\'`-escape, because the pre-commit `prettier --write` hook (see `lint-staged` config above) will rewrite them on the very next commit and generate a spurious follow-up `style(ci)` auto-fix pass. Correct hand-authored shape: use a double-quoted literal from the start when the content contains an apostrophe. Semantic contract is unaffected: `worktreeId` remains a `z.string().nullable().optional()` field, the `.refine((value) => value == null || value.trim().length > 0, { message: 'worktreeId must not be blank' })` guard still rejects whitespace-only submissions, the cross-field rule that only permits `worktreeId` on `action: 'create'` still fires on any other action, and the tool's runtime behaviour (dispatch to `agentManagerService.create` / `list` / `stop` / `status` / `answer`) is byte-identical after the quote translation. Diff statistics: `1 file changed, 1 insertion(+), 1 deletion(-)`. Convention going forward: when a string literal in `src/` or `tests/` contains an apostrophe, author it as double-quoted; when it contains a double quote, author it as single-quoted; when it contains both, author it as a template literal — this mirrors what Prettier 3.x will produce anyway and avoids the round-trip through the auto-fix pass.

Most recent worked example on the `eqeqeq` axis, 2026-09-07, commit `f33a09e5` (`fix(tools): replace loose null equality with strict checks [autohealing]`): a two-hunk strict-equality rewrite inside `AgentManagerParamsSchema` at `src/tool/tools/agent-manager.ts:77` and `:115-122`. Both `.refine()` predicates on the `worktreeId` field were previously written with the `x == null` idiom — the field-level blank-value guard read `.refine((value) => value == null || value.trim().length > 0, ...)` and the object-level cross-field rule read `.refine((params) => params.worktreeId == null || params.action === 'create', ...)`. The autohealer rewrote both to the canonical explicit two-arm form `x === null || x === undefined`, so the field-level guard is now `.refine((value) => value === null || value === undefined || value.trim().length > 0, ...)` and the cross-field rule is now `.refine((params) => params.worktreeId === null || params.worktreeId === undefined || params.action === 'create', ...)`. The three-argument form on the cross-field rule made Prettier wrap the call across multiple lines, which is why the diff is 9 insertions / 5 deletions for what is semantically a two-token change. Semantic contract is byte-identical on both call sites: a `null` or `undefined` `worktreeId` remains a valid absent-value shape (the field is `.nullable().optional()`); a whitespace-only string still fails with `worktreeId must not be blank`; a non-null `worktreeId` on any action other than `create` still fails with `worktreeId is only valid on action=create` on the `worktreeId` path. Convention going forward: for Zod refinement predicates whose input type is `T | null | undefined`, always use `x === null || x === undefined || <predicate on non-null value>` — never `x == null || <predicate>`. The ternary-arm variant covered by the `bbc845c5` `isGpt5_6OrLater` example uses `!== undefined` alone because the operand is a regex-capture-group value that can never be `null`; when the operand's type genuinely permits both `null` and `undefined`, the two-arm form is required. Diff statistics: `1 file changed, 9 insertions(+), 5 deletions(-)`.

Worked example on the `eqeqeq` axis, 2026-09-05, commit `bbc845c5` (`fix(ci): auto-fix CI failures [alexi-bot]`): a one-line strict-equality rewrite inside `isGpt5_6OrLater` at `src/providers/openai/prompt-cache.ts:76`. The optional minor-version capture group in the GPT version parser (`/^gpt-(\d+)(?:\.(\d+))?/i`) was previously narrowed with `match[2] != null ? Number(match[2]) : 0` — a loose inequality that ESLint flagged. The autohealer rewrote it to `match[2] !== undefined ? Number(match[2]) : 0`. The two expressions are **behaviourally identical** on the output of `RegExp.exec`: an unmatched optional group is always `undefined`, never `null` (see ECMA-262 §22.2.7.2). The strict form satisfies `eqeqeq` without a local `// eslint-disable-next-line eqeqeq` disable pragma and communicates the exact narrowing contract at the call site — the branch fires only when the regex captured an explicit minor component. `isGpt5_6OrLater('gpt-6')` still returns `true` (missing minor defaults to `0`, tuple `(6, 0) >= (5, 6)`); `isGpt5_6OrLater('gpt-5.6')` still returns `true`; `isGpt5_6OrLater('gpt-5.5')`, `isGpt5_6OrLater('gpt-4o')`, and `isGpt5_6OrLater('gpt-x')` still return `false`. The paired `supportsPromptCacheBreakpoint`, `applyCacheBreakpoint`, `isChatGPTSubscription`, and the `prepareRequest` helper on the SAP orchestration provider observe the same boolean for every input. Convention going forward: when narrowing on a `RegExpExecArray` optional group, always use `match[N] !== undefined` — never `match[N] != null` — because `null` is not a value `RegExp.exec` ever emits for an unmatched group, so the `!== undefined` form encodes both the correct semantics and the correct type-narrowing. Diff statistics: `1 file changed, 1 insertion(+), 1 deletion(-)`.

Most recent worked example on the combined quote-style / parameter-reflow axis, 2026-09-23, commit `27562609` (`style(ci): auto-fix lint/format issues [alexi-bot]`): a single-file, two-hunk Prettier + ESLint `avoidEscape` follow-up on `src/tool/tools/context.ts` — the file that houses the two experimental self-inspection tools (`context_inspect` and `context_summarize`) gated behind `experimental.contextTools`. Both hunks are cosmetic-only; no runtime, schema, or tool-description-string change reaches the model. (1) **Parameter-reflow, expand direction, on a Zod schema builder chain** — `src/tool/tools/context.ts:21-25` previously declared `ContextInspectParamsSchema` as a single-line 100-column chain `const ContextInspectParamsSchema = z.object({}).describe('Report current session token usage and distance to the compaction threshold. No parameters.');` and Prettier expanded it onto five lines with the `.object({})` receiver on its own line, the `.describe(...)` call on its own line, and the argument string wrapped inside so the whole chain fits under `printWidth: 100` without a trailing dangling argument. Same rule as the 2026-09-15 `setConfigSharedAgentBoard` guard expansion in `src/config/userConfig.ts:754-758` immediately in the block below — a source line that overflows the 100-column ceiling belongs across multiple lines with the fluent-chain builder pattern. (2) **Quote-style, `avoidEscape` on the tool `description` string** — `src/tool/tools/context.ts:42` previously used a single-quoted literal that escaped an English possessive apostrophe (`'Report the current session\'s approximate token usage, message count, and ' + ...`); Prettier rewrote it to the double-quoted form (`"Report the current session's approximate token usage, message count, and " + ...`) under its default `avoidEscape` semantics — exact same rule as the 2026-09-08 `sourceSessionId` and 2026-09-07 `worktreeId` `.describe(...)` rewrites in `src/tool/tools/agent-manager.ts` in the block above, applied here to a `defineTool({ ..., description: ... })` string-concatenation head. The subsequent two concatenation arms on lines 43-45 (both without embedded apostrophes) remain single-quoted, matching the standing convention that `singleQuote: true` is the default and double-quoted literals are used ONLY where `\'` escapes would otherwise be needed. Diff statistics: `1 file changed, 6 insertions(+), 4 deletions(-)`. Semantic contract of `contextInspectTool` is byte-identical: the tool name (`context_inspect`), the Zod schema shape (`z.object({})` with the same describe metadata), the `ContextInspectResult` interface (`messageCount`, `tokens`, `budget`, `utilization`, `nearThreshold`), the executor's early-return paths (`context.sessionManager` missing / no current session), the token estimator call (`estimateMessagesTokens(session.messages)`), the private-field access on `SessionManager.maxContextTokens` via the double `as unknown as` cast, the `utilization` derivation (`tokens / budget` when `budget > 0`, else `null`), and the `nearThreshold` predicate (`utilization !== null && utilization >= 0.9`) are all untouched. Same goes for the paired `contextSummarizeTool` further down the file — the schema, the executor, and the `ContextSummarizeResult` shape did not need to be touched by this pass. Convention reminder covering both axes touched by this commit: (a) for a Zod builder chain whose full single-line form exceeds `printWidth: 100`, hand-author it in the expanded form from the start (`z.object({})\n  .describe(\n    '...'\n  )`) so the pre-commit `prettier --write` hook does not generate a spurious follow-up `style(ci)` auto-fix pass; (b) for a `defineTool({ ..., description: '...' })` string that concatenates multiple arms and contains an English possessive or contraction in ANY arm, use a double-quoted literal for that arm only — do NOT hand-author a single-quoted-with-`\'`-escape form.

Prior worked example on the parameter-reflow axis, 2026-09-18, commit `85e11d06` (`fix(ci): add code-mode-runtime stub and format registry [autohealing]`) and its follow-up commit `7c88ce19` (`style(ci): auto-fix lint/format issues [alexi-bot]`): a single-hunk Prettier collapse on the `ToolCategory` union alias at `src/tool/registry.ts:99`. The seven-arm string-literal union (`'read' | 'write' | 'execute' | 'network' | 'agent' | 'meta' | 'other'`) was hand-authored across eight lines with one arm per line (`export type ToolCategory =\n  | 'read'\n  | 'write'\n  | 'execute'\n  | 'network'\n  | 'agent'\n  | 'meta'\n  | 'other';`), and Prettier collapsed it onto a single 90-column line because the collapsed form fits under the 100-column `printWidth` ceiling. Same rule as the `isCurrentExplicit` example immediately below — a right-hand side of a `type` alias or `const` initialiser that fits under 100 columns belongs on one line. Diff statistics: `1 file changed, 1 insertion(+), 8 deletions(-)`. Semantic contract of `ToolCategory` is byte-identical: the seven-value taxonomy (read filesystem/repo/git lookups, write filesystem/edit/patch, execute shell/subprocess, network outbound HTTP/MCP, agent orchestration, meta tool-about-tool-system, other unclassified — documented in the JSDoc block immediately above the alias) is unchanged, and every downstream `ToolResolutionContext.categories?: readonly ToolCategory[]` filter on `EnhancedToolRegistry` sees the same string literals. Convention going forward: for a discriminated string-literal union whose arms plus separators plus `export type <Name> = ` prefix fit under `printWidth: 100`, author it on one line — do NOT hand-author the pipe-per-line form for short unions because the pre-commit `prettier --write` hook (see `lint-staged` config above) will collapse it on the very next commit and generate a spurious follow-up `style(ci)` auto-fix pass.

Prior worked example on the combined quote-style / parameter-reflow axis, 2026-09-17, commit `ffdfa8e4` (`style(ci): auto-fix lint/format issues [alexi-bot]`): a two-file follow-up on the session-model-preference reconciler module (`src/core/modelPreference.ts` — see `docs/ARCHITECTURE.md` under **Session Model Preferences**) and its co-located Vitest suite (`src/core/__tests__/modelPreference.test.ts`). Three independent hunks landed under one commit, each exercising a different sub-axis of the standing convention. (1) **Parameter-reflow, collapse direction, on runtime source** — `src/core/modelPreference.ts:66-70` had the `isCurrentExplicit` short-circuit inside `resolveSessionModelPreference(current, incoming, configDefault)` hand-authored across two lines (`const isCurrentExplicit =\n    current?.source === 'user-explicit' || current?.source === 'inherited';`) and Prettier collapsed it onto a single 96-column line because the collapsed form fits under `printWidth: 100`. Same rule as the 2026-09-15 `createdTs` reflow in `src/tool/tools/recall.ts` immediately below — a `const` initialiser whose right-hand side is a boolean-`||` chain that fits under the ceiling belongs on one line. (2) **Quote-style, `singleQuote: true` on a test title** — `src/core/__tests__/modelPreference.test.ts:26` had the `it(...)` case title hand-authored with a double-quoted literal (`it("does NOT overwrite a user-explicit choice with a default incoming update", () => { ... })`); Prettier rewrote it to single-quoted (`it('does NOT overwrite a user-explicit choice with a default incoming update', () => { ... })`) because the title contains no apostrophe or embedded single quote that would trigger the `avoidEscape` clause. Standing convention: default to single quotes for string literals with no apostrophe; use double quotes ONLY when the literal would otherwise need `\'` escapes (the 2026-09-08 `sourceSessionId` and 2026-09-07 `worktreeId` examples on the quote-style axis above are the double-quote-preferred inverse). (3) **Parameter-reflow, expansion direction, on test fixture** — `src/core/__tests__/modelPreference.test.ts:45-50` had the `current` fixture inside the "merges a fresh effort update into a user-explicit choice without swapping model" case hand-authored on a single line (`const current = userExplicitPreference('sap-ai-core/claude-3.5-sonnet', 'sap-ai-core', 'medium');` at 102 columns after the trailing semicolon) and Prettier wrapped it across four lines with one argument per line because the source line overflowed the 100-column ceiling. This is the parameter-reflow rule inverted, applied to a factory-call fixture — the exact same rule the 2026-09-15 `setConfigSharedAgentBoard` guard triggered on runtime source. Semantic contract byte-identical across all three hunks: `resolveSessionModelPreference` still fires Rule 1 (a `'user-explicit'` OR `'inherited'` current preference survives a non-explicit incoming update while merging in a fresh `reasoningEffort`) and Rule 2 (fall back to `incoming ?? configDefault` for brand-new sessions) on exactly the same inputs; the `SessionModelPreferenceSource = 'user-explicit' | 'default' | 'inherited'` union, the `SessionModelPreference` interface (`modelID`, `providerID`, `reasoningEffort?`, `source`), the `userExplicitPreference` / `defaultPreference` / `migrateLegacyPreference` public helpers, and the six-case regression suite for `resolveSessionModelPreference` plus the two-case suite for `migrateLegacyPreference` are all unchanged. Diff statistics: `2 files changed, 7 insertions(+), 4 deletions(-)`. Convention reminder covering all three hunks in one place: hand-author `it("...")` / `describe("...")` titles with single quotes when no apostrophe forces a double-quoted literal; write factory-call fixtures on one line when the full statement fits under `printWidth: 100` and only wrap when Prettier says so; write short boolean-`||` initialisers on one line when they fit. All three sub-axes have the same failure mode when violated — a follow-up `style(ci): auto-fix lint/format issues [alexi-bot]` commit lands on the very next push. See `docs/TESTING.md` under **Test File Formatting** point 6 for the paired test-file convention and the same worked example applied to the test suite in isolation.

Prior worked example on the parameter-reflow axis, 2026-09-15, commit `64fc6676` (`style(ci): auto-fix lint/format issues [alexi-bot]`): a two-file Prettier reflow that lands on both sides of the axis at once. In `src/config/userConfig.ts:754-758` the three-condition guard inside `setConfigSharedAgentBoard(enabled)` — the setter that persists the top-level `sharedAgentBoard` flag and strips a legacy `experimental.sharedAgentBoard` key from the config on the same write — was split from a single-line 106-column `if (config.experimental && typeof config.experimental === 'object' && !Array.isArray(config.experimental))` onto four lines so each `&&`-joined predicate occupies its own line. This is the parameter-reflow rule inverted: the source line overflowed `printWidth: 100`, so Prettier expanded rather than collapsed. In `src/tool/tools/recall.ts:153` (inside `scanSessionFast(session, file, params, allowedRoles): RecallHit[]`) and `:194` (inside `scanSessionSlow(session, file, params): RecallHit[]`) the timestamp fallback `const createdTs = session?.metadata?.created?.toString() ?? new Date().toISOString();` was collapsed from a hand-authored two-line form onto a single 82-column line — same rule as the `recipientLooksStopped` example immediately below, applied to a `const` initialiser whose right-hand side is a nullish-coalescing chain that fits under `printWidth: 100`. Semantic contract of every touched call site is byte-identical: `setConfigSharedAgentBoard` still writes `config.sharedAgentBoard = enabled`, still removes a legacy `experimental.sharedAgentBoard` boolean when it exists, still deletes the whole `experimental` block when it becomes empty, and still calls `saveFullConfig(config)`; `scanSessionFast` and `scanSessionSlow` still fall back to `new Date().toISOString()` when a session record has no `metadata.created` timestamp so the resulting `RecallHit.timestamp` (returned to the `recall` tool caller) is never an empty string. Convention reminder covering both hunks: hand-authoring an `&&`-joined `if` condition that overflows `printWidth: 100` will produce a follow-up `style(ci)` auto-fix that wraps each predicate onto its own line; conversely, hand-authoring a nullish-coalescing fallback across two lines when the single-line form fits under `printWidth: 100` will produce a follow-up `style(ci)` auto-fix that collapses it. Diff statistics: `2 files changed, 7 insertions(+), 5 deletions(-)`.

Prior worked example on the parameter-reflow axis, 2026-09-11, commit `31a9aa0f` (`style(ci): auto-fix lint/format issues [alexi-bot]`): a one-file, one-hunk Prettier reflow on `src/tool/tools/board.ts:118`. The internal helper `recipientLooksStopped` previously declared its parameter list across three lines (`async function recipientLooksStopped(\n  boardId: string,\n  recipient: string\n): Promise<boolean> {`) — a hand-authored shape from the initial port of kilocode `7febec58f` (`fix(cli): warn when board_post targets a stopped subagent`). Both parameter types are 15-column identifiers plus the return type; the collapsed single-line form `async function recipientLooksStopped(boardId: string, recipient: string): Promise<boolean> {` measures 87 columns and fits under Prettier's `printWidth: 100` ceiling, so Prettier prefers the compact form. Diff statistics: `1 file changed, 1 insertion(+), 4 deletions(-)`. Semantic contract of `recipientLooksStopped` is byte-identical: still an `async` helper that reads the most recent 100 board messages via `BoardStore.read(boardId, { limit: 100 })` and returns `true` when the `recipient` session has never posted to (or acknowledged reads on) the board, so the caller (`boardWriteTool.execute` at `src/tool/tools/board.ts:126`) can emit the `deliveryStatus: 'no-recipient'` hint on `BoardWriteResult`. The paired `BoardWriteParamsSchema` shape, the `BoardContext.resolve(context.sessionId)` gate that returns `success: false` when no board is attached, and the module-level `experimental.sharedAgentBoard` config gate in `src/tool/tools/index.ts:118` are all untouched. Convention reminder: hand-authoring a two- or three-parameter function signature across multiple lines when it fits on one line under `printWidth: 100` will always produce a follow-up `style(ci)` auto-fix commit — write signatures on one line when they fit, and let Prettier wrap them only when they overflow (typically at four or more parameters, or two parameters where at least one has a complex generic type).

Prior worked example, 2026-09-02, commit `89b23fa5` (`style(ci): auto-fix lint/format issues [alexi-bot]`): a single-file Prettier reflow on `src/session/drain.ts` — the module-singleton `SessionDrainImpl` that guarantees background session work settles before a headless `alexi chat` or `alexi agent` process exits. Inside `drain(options: DrainOptions = {}): Promise<void>` at `src/session/drain.ts:125-128` the waiter-snapshot expression `const snapshot: TrackedWork[] = Array.from(this.pending.entries()).map(([id, promise]) => ({ id, promise }))` was reflowed from a hand-authored three-line form (with the `.map` argument list wrapped across two lines and the object literal on a single continuation) onto Prettier's preferred shape where `.map(([id, promise]) => ({` opens on the same line as the receiver and `id,` / `promise,` each occupy their own line before `}))` closes the call. The `TrackedWork` annotation and the immediately-following `Promise.allSettled(snapshot.map((entry) => entry.promise))` call are byte-identical. Semantic contract of `drain()` is unchanged: the drain remains one-shot per lifecycle (`this.drained` early return, terminal `this.drained = true; this.pending.clear();`), the waiter set is still snapshotted BEFORE awaiting so a handler that schedules follow-up work during its own settle cannot mutate the collection being iterated (upstream "snapshot drain waiters before resuming them" fix noted in the module header at lines 15-16), the 30-second default `timeoutMs` (`options.timeoutMs ?? 30_000`) is unchanged, the `timeoutMs > 0` branch still races `Promise.allSettled(...)` against a `setTimeout`-backed sentinel, the `timeoutMs === 0` branch still awaits `settle` indefinitely, and on timeout the drain still swallows late settle rejections via `settle.catch(...)` so unhandled rejections cannot fire after teardown. The companion `track(id, promise): () => void` no-op-when-drained early return, the auto-untrack `.catch(...).finally(() => this.pending.delete(id))` chain, the `untrack(id)`, `size()`, and test-only `__resetForTests()` methods, the `TrackedWork` and `DrainOptions` interfaces, and the exported `SessionDrain` module-level singleton (`export const SessionDrain = new SessionDrainImpl()`) are all untouched. Diff statistics: `1 file changed, 4 insertions(+), 3 deletions(-)`. `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`, and `npm run build` all remain green on the branch — the only observable delta is that `npm run format:check` now passes on this file where it previously reported a diff. This is the canonical worked example of the "reflow a `.map` callback whose object-literal argument spans two lines when the surrounding statement's return-type annotation forces the wrap" variant of the auto-fix pattern; when authoring similar `Array.from(...).map(([a, b]) => ({ a, b }))` idioms, prefer the Prettier-preferred continuation shape from the outset (`.map(([a, b]) => ({\n  a,\n  b,\n}))`) to avoid the auto-fix follow-up commit.

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

When adding a new interactive REPL command (like `/rewind` or `/code-review`):

1. **Add to completer registry** (`src/cli/utils/completer.ts`):
   ```typescript
   { name: 'mycommand', description: 'What it does', category: 'general' }
   ```

2. **Implement handler in the legacy REPL** (`src/cli/interactive.ts`) under the
   `handleCommand` switch. If the command runs a long-running async task, swap in a
   dedicated `AbortController` so Ctrl+C cancels only the task and not the session,
   then restore the previous controller in `finally`:
   ```typescript
   case 'mycommand': {
     const taskAbort = new AbortController();
     const prev = state.abortController;
     state.abortController = taskAbort;
     try {
       const { executeMyCommand } = await import('../command/mycommand.js');
       await executeMyCommand({ signal: taskAbort.signal });
     } finally {
       state.abortController = prev;
     }
     return true;
   }
   ```

3. **Wire the Ink TUI slash command** (`src/cli/tui/hooks/useCommands.ts`) by appending
   to the array returned from `buildCommands`. Use `addSystemMessage` to surface output:
   ```typescript
   {
     name: 'mycommand',
     description: 'What it does',
     category: 'general',
     execute: async (args, _ctx) => {
       const { executeMyCommand } = await import('../../../command/mycommand.js');
       const result = await executeMyCommand({ /* ... */ });
       deps.addSystemMessage(result.output);
       return true;
     },
   }
   ```

4. **Create the implementation module** in `src/command/mycommand.ts`. Keep it
   self-contained (no `process.exit`, no direct stdout writes) so it can be reused
   by the CLI subcommand and both interactive surfaces. Accept an `AbortSignal` and
   an `onProgress` callback when applicable.

5. **Add a non-interactive CLI subcommand** in `src/cli/commands/mycommand.ts` and
   register it in `src/cli/commands/index.ts` (`registerAllCommands`):
   ```typescript
   import { registerMyCommand } from './mycommand.js';
   // inside registerAllCommands:
   registerMyCommand(program);
   ```

6. **Write tests** in two places:
   - `tests/command/mycommand.test.ts` -- core executor (mock external deps like
     `child_process` or `sendChat`). See `tests/command/codeReview.test.ts` for a
     reference covering effort routing, cancellation, and an empty-input fast path.
   - `src/cli/commands/__tests__/mycommand.test.ts` -- Commander wiring smoke test
     using `Command.exitOverride()`. See `src/cli/commands/__tests__/codeReview.test.ts`.

7. **Update documentation**:
   - `docs/API.md` under both **CLI Commands** (subcommand) and **Interactive Mode
     Commands** (slash command)
   - `docs/ARCHITECTURE.md` if the command introduces a non-trivial flow
   - `docs/TESTING.md` if the test pattern differs from existing commands
   - `CHANGELOG.md` under `[Unreleased]`

## Getting Help

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Provide minimal reproducible examples for bugs
- Reference specific file paths and line numbers

## Factoring TUI Components

Effective 1.20.2, TUI components under `src/cli/tui/components/` should follow a two-layer separation:

1. **Pure string / logic helpers** live in `src/cli/tui/utils/*.ts` and never import from `ink` or `react`. Example: `formatBashCommand`, `truncateOutput`, `formatParamsPreview`, `formatDuration`, `guessLanguageFromPath` in `src/cli/tui/utils/formatToolOutput.ts`.
2. **Render-only components** live in `src/cli/tui/components/*.tsx` and consume the helpers above. Example: `ToolRow.tsx` delegates all string formatting to `formatToolOutput.ts` and focuses on layout, colors, and disclosure state.

This split lets pure helpers be unit-tested without booting an Ink render harness (see `docs/TESTING.md#pure-string-helpers-testable-without-ink`). If you find yourself writing complex string manipulation inside a component's render body, move it to `utils/` first.

When a component's public prop shape is stable and external consumers import it by name, prefer a thin backwards-compatible wrapper over a rename. `ToolCallBlock.tsx` is the reference example — it re-exports `ToolRowProps` as `ToolCallBlockProps` and delegates to `ToolRow` in ~4 lines.

### Environment-gated terminal features (OSC-8 hyperlinks and similar)

Effective 2026-09-10, TUI features that emit terminal-specific escape sequences (OSC-8 hyperlinks, images, kitty graphics, sixel, etc.) MUST route through a capability probe with a well-defined fallback and MUST accept `FORCE_*` / `NO_*` environment overrides. The `src/cli/tui/utils/hyperlink.ts` + `src/cli/tui/utils/linkify.ts` pair is the reference:

1. **Capability probe returns `false` off-TTY.** `supportsHyperlinks()` bails when `stream.isTTY` is falsy, which covers CI, pipes, and redirects. Any new probe MUST do the same — never emit escape sequences into a stream that will not consume them.
2. **`FORCE_<FEATURE>=1` and `NO_<FEATURE>=1` overrides.** The probe consults env first so tests, headless agents, and operators debugging a terminal issue have deterministic control. Naming convention: `FORCE_HYPERLINK`, `NO_HYPERLINK`, `FORCE_IMAGES`, `NO_IMAGES`, etc.
3. **Plain-text fallback is byte-identical when the label matches the value.** `hyperlink(url)` returns `url` verbatim when unsupported; `hyperlink(url, label)` returns `label (url)` only when `label !== url`. Match this shape so pipelines that grep tool output do not need to strip escapes conditionally.
4. **Wrap-once, apply late.** `linkify()` is applied as the LAST transform on tool-output text (after `truncateOutput`) so truncation math still runs on the raw string. When adding a new wrapper, apply it after every truncation, redaction, and word-wrap step so those upstream steps never have to know about the escape bytes.
5. **Tests stub the env with `vi.stubEnv` and undo in `afterEach`.** See `docs/TESTING.md#testing-linkify--deterministic-osc-8-assertions` for the pattern. Do NOT `process.env.FORCE_HYPERLINK = '1'` directly — that leaks state across tests.

### Streaming-friendly transforms on tool output (issue #1807)

Effective 2026-09-22, any pure string transform applied per-render to a streaming tool output buffer (`linkify`, syntax highlight, redact, word-wrap) MUST be shaped so the cost is amortised across chunk arrivals — otherwise a long-running bash command that emits thousands of chunks (`npm install --verbose`, `git log --all`) degrades to O(n^2) over the lifetime of the row. The `src/cli/tui/utils/incrementalLinkify.ts` module is the reference for a line-boundary-safe cache; the same pattern extends to any transform whose regex or parser state cannot cross `\n`.

Rules for adding a new streaming-friendly transform:

1. **Verify the underlying transform is line-boundary-safe.** `linkify()` qualifies because its two regexes stop at whitespace (URLs) and require path characters bounded by a lookbehind (`path:line`). A syntax highlighter that tracks multi-line comment state does NOT qualify without extra work — cache at the block level instead.
2. **Return an `IncrementalXxx` closure with a `reset()` method and a `lastCachedChars()` introspection hook.** `reset()` is called by parent components when the underlying row is reused; `lastCachedChars()` is what tests use to prove the fast path fired. Do not skip the introspection hook — a suite that only asserts output correctness cannot distinguish an incremental implementation from a full-rescan implementation that happens to produce the right bytes.
3. **Cache-miss policy: reset when the incoming buffer is not a strict extension of the cached prefix.** Buffer shrunk, buffer diverged, or first call — all reset to a full scan. Never try to align partial prefixes; that is where correctness bugs live.
4. **Hold one instance per component via `useRef` + `useMemo`.** `ToolRow.tsx` (`src/cli/tui/components/ToolRow.tsx:139`) is the reference: the ref survives React re-renders, `useMemo(() => ..., [])` initialises on first render, and the closure lives for the lifetime of the row. Do NOT put the factory in the module scope — a single shared instance across rows would swap cache state on every re-render.
5. **Byte-identity tests are the correctness gate.** For any input the caller might pass, the incremental transform must produce the same output as calling the underlying transform on the whole buffer. Compare with the underlying function directly in the test (`expect(inc(buf)).toBe(linkify(buf, cwd))`) rather than reconstructing the expected output by hand. See `docs/TESTING.md#testing-the-incremental-linkifier-issue-1807`.
6. **Benchmark with a ratio, not an absolute budget.** CI runners are too noisy for hardcoded ms thresholds. Use `naiveMs / incMs > 1.5` as a conservative lower bound; the actual speedup on `linkify` is 5-20x.

## Introducing Retry-Aware Modules

Any new module that calls out to SAP AI Core (or another network dependency) should:

1. Use `withRetry` from `src/core/session/retry.ts` for retries — do not roll your own loop.
2. Supply a `shouldRetry` predicate that consults the transient-vs-permanent contract in `AGENTS.md#error-classification-retry-vs-config-fix`. The canonical implementations live in `src/core/error-backoff.ts` — prefer `isRetryableError(err)` for the coarse "is this transient?" check; use `isRateLimitError`, `isXAICapacityError`, and `isPermanentAuthFailure` directly when you need to distinguish sub-cases (e.g. render a rate-limit-specific UX).
3. Tune `RetryOptions` for the workload: interactive chat uses the defaults (8 attempts × 30s cap); background jobs may prefer a lower `maxAttempts` and a higher `maxMs`.
4. In tests, pass `jitter: false` so the exponential curve is deterministic.

Never re-add unconditional retries. Retrying an expensive model call on a permanent failure (401, 403, 400, `model_not_found`) just burns tokens.

When adding a new transient-error classifier to `src/core/error-backoff.ts` (as with `isXAICapacityError` in 1.21.4), also wire it into `isRetryableError` so higher-level drivers pick it up automatically. Extend the transient-error table in `docs/ARCHITECTURE.md#error-classification-tables` and add a coverage matrix under `src/core/__tests__/error-backoff.test.ts` — a false positive here means real config failures get retried and waste provider budget, so the test suite must cover both positive and negative cases.

For code paths that wrap a single provider invocation (a single agent turn, a single completion call), prefer `retryProviderCall` from `src/agent/index.ts` over rolling a per-call `withRetry` inline. The wrapper owns the turn-level budget contract (3 attempts, `1 s → 2 s → 4 s`, cap 15 s), the streaming guard (never retry after content has been emitted), and the `Retry-After` hint precedence — all of which compose correctly with the provider-layer `ErrorBackoff` and route-classification layers. New streaming call sites that adopt the wrapper MUST supply a `StreamingStateTracker` whose `hasEmittedContent()` returns `true` as soon as any content delta or tool call surfaces; non-streaming callers omit the tracker. Test the new call site with the `setTurnRetrySleep` hook (see [`docs/TESTING.md#testing-the-turn-level-retry-wrapper`](TESTING.md#testing-the-turn-level-retry-wrapper)) — never wait real seconds on the backoff schedule.

For code paths that fetch a **catalog / model list** rather than a chat completion — `alexi models`, `refreshModelCatalog`, upstream health probes — prefer `fetchWithRetry` from `src/providers/modelFetchErrors.ts` over rolling a per-call loop. The helper is stateless (unlike `ErrorBackoff` which is a circuit breaker for the chat hot path), wraps failures in a typed `ModelFetchError` whose `.reason` is safe to render to a user, and matches the same transient-vs-permanent contract as the CI workflow retry regex so a manual re-run of a failing agent workflow makes the same retry decision the runtime does. Reference implementation and consumer wiring in [`docs/PROVIDERS.md#model-fetch-error-surfacing-issue-1824`](PROVIDERS.md#model-fetch-error-surfacing-issue-1824); test patterns for the `sleep` seam and structural error classification in [`docs/TESTING.md#testing-model-fetch-error-classification-testsprovidersmodelfetcherrorststs`](TESTING.md#testing-model-fetch-error-classification-testsprovidersmodelfetcherrorststs).

## Config-Derived Caches

If your module maintains a cache derived from `~/.alexi/config.json` (routing config, provider config, permission ruleset, model list, etc.), register a disposer via `registerInstanceCache` from `src/config/invalidation.ts` at module load. `updateGlobal(updates, { dispose: true })` will then flush your cache whenever the user rewrites global config.

Do not read the config file synchronously on every operation — cache the parsed result and rely on invalidation for freshness.

## Per-Instance State

Effective 1.21.4, module-level singleton state that is unsafe to share between concurrent Alexi sessions (multiple SAP AI Core workspaces in the same process, headless `alexi agent` alongside the interactive TUI, subagents, ...) MUST be refactored into a per-instance class. `src/core/filesystem/watcher.ts` is the reference: an `InstanceWatcher` class owns the `Map<directory, disposer>` and every debounce timer, plus a module-level `defaultInstance` and `startWatcher(...)` shim to keep pre-refactor call sites compiling.

Contract for a new per-instance module:

1. Encapsulate the state on the instance. No `Map` or `Set` at module scope — those become cross-session bombs.
2. Expose `dispose()` and make it idempotent (iterate a snapshot when disposers mutate the map during iteration).
3. Provide a backwards-compatible module-level shim only if there are existing call sites that cannot be migrated in the same PR. Every new call site owns its own instance.
4. Add a `getDefault<Thing>Instance()` accessor gated on test use so tests can assert on the default instance's behaviour without touching internals.
5. Cover isolation between two instances in the tests (see `tests/core/filesystem/instance-watcher.test.ts` for the reference pattern) — this is the regression the refactor exists to prevent.

## Line-Ending Normalization When Writing Files

Effective the 2026-08-25 write-tool EOL patch (commit `d0dec417`), any tool or module that produces file bytes destined for the user's working tree MUST route through the helpers in `src/tool/eol-normalizer.ts` rather than writing raw model output directly. Two functions cover the two cases:

1. **New file** — `normalizeNewFileLineEndings(content)` rewrites the content to `os.EOL` (LF on POSIX, CRLF on Windows). Windows contributors on `core.autocrlf=true` no longer see whole-file diffs for LF-only model output.
2. **Overwrite existing file** — `preserveExistingLineEndings(newContent, existingContent)` detects the existing file's line-ending style via `detectLineEnding` and rewrites the new content to match. Overwriting a CRLF file with LF content (or vice versa) is what causes spurious full-file diffs; preserving the existing style keeps the diff scoped to the actual textual change.

The canonical integration is `src/tool/tools/write.ts:84-103`. Contract for a new file-writing tool:

- Branch on whether the target file exists before normalization. Read the existing bytes for the overwrite case; fall back to `normalizeNewFileLineEndings` when the read fails so a permissions error does not block the write.
- Decode the existing file as UTF-8 for EOL sniffing. `\r` and `\n` are ASCII in every encoding the tool layer supports, so a UTF-8 decode is safe even for a file whose actual encoding is UTF-16 or a legacy code page.
- Apply normalization AFTER any BOM / encoding handling and BEFORE `encodeWithEncoding`, so the buffer sent to `fs.writeFile` reflects the final byte sequence.
- Do NOT normalize when the caller has explicitly asked for LF-only output (e.g. a code generator that emits JSON or a config file with a required LF terminator). The current default is "match the platform / preserve the existing style"; opt-out is caller-provided.

Testing guidance: co-locate pure-function tests next to the module (`src/tool/eol-normalizer.test.ts` is the reference), and add end-to-end integration tests that drive the tool via `executeUnsafe` against a `fs.mkdtempSync` temp directory. Simulate the opposite platform by mocking `getPlatformEol` via `vi.doMock` + `vi.resetModules` + dynamic `await import(...)` — see `docs/TESTING.md#simulating-windows-on-a-linux-ci-runner` for the worked pattern.

### Apply-patch tools use a detect/normalize/re-encode pipeline instead

Tools that mutate an existing file via a unified-diff patch (canonical example: `apply_patch` at `src/tool/tools/apply-patch.ts`) do NOT go through `preserveExistingLineEndings`. The line-based hunk parser splits on `'\n'`, so a CRLF file leaves a stray `\r` on every context and deletion line and the patch fails to match. Effective the 2026-08-29 CRLF-preservation patch (commit `3adb7ec8`), the tool uses a three-step pipeline expressed via three exported helpers in `src/tool/tools/apply-patch.ts`:

1. `detectLineEndingStyle(rawOriginalContent)` — count CRLF vs bare LF in the decoded file bytes BEFORE any normalization, and pick the majority style. Empty / no-line-ending content falls back to `os.EOL`.
2. `normalizeToLf(...)` — applied to both the original file content AND `params.patch` before invoking the hunk parser. Both inputs must be LF-only for the parser's `.startsWith(' ')` / `.startsWith('-')` / `.startsWith('+')` checks to see the actual content byte.
3. `applyLineEndingStyle(patchedContent, lineEndingStyle)` — applied AFTER the parser succeeds, BEFORE `encodeWithEncoding` and `fs.writeFile`. The `crlf` branch relies on the pipeline invariant that `patchedContent` is LF-only (guaranteed by the `normalizeToLf` pre-pass), so it can safely `.replace(/\n/g, '\r\n')` without emitting `\r\r\n`.

Contract for any new patch-application or diff-application tool:

- **Detect first, normalize second.** Do NOT sniff the line ending style from the LF-normalized copy — you will always get `'lf'`. Sniff from the raw decoded string BEFORE `normalizeToLf`.
- **Normalize both sides of the parser.** The file content and the patch text must BOTH be LF-only when they reach a line-based parser. A CRLF patch applied to an LF file is just as broken as an LF patch applied to a CRLF file, in symmetric ways.
- **Re-encode BEFORE `encodeWithEncoding`.** The buffer written to disk must reflect the final EOL choice. Re-encoding after `encodeWithEncoding` would flip already-encoded bytes and corrupt UTF-16 / legacy code page files.
- **Never mix `eol-normalizer.ts` and `apply-patch.ts` helpers in the same pipeline.** The former is for whole-content writes (`normalizeNewFileLineEndings` / `preserveExistingLineEndings` decide the style and rewrite in one step), the latter is for a parse-then-re-encode round trip where the intermediate representation MUST be LF-only. Choose one pipeline per tool.

Testing guidance mirrors the write-tool pattern: put pure-function tests in the same test file as the tool's other suites (see `tests/tool/tools/apply-patch.test.ts` `describe('line ending helpers')` and `describe('line ending preservation')`), drive the tool via a real `applyPatchTool.execute` call against a `fs.mkdtemp` temp directory, and assert on both the exact output and the absence of the opposite line-ending style (regex `/(?:^|[^\r])\n/` for a stray-LF check, `.includes('\r\n')` for a stray-CRLF check). See `docs/TESTING.md#testing-the-apply_patch-line-ending-preservation` for the worked pattern.

### Apply-patch tools must classify ADD vs UPDATE before touching the file system

Effective commit `00962f1c` (`feat(tools): support ADD operations in apply_patch [alexi-bot]`), the `apply_patch` tool accepts unified-diff patches for both file creation and in-place mutation. The classification is driven by the `--- /dev/null` marker in the patch header, which is the canonical `git diff` / `diff -u -N` / OpenAI `apply_patch` convention for "no prior content". Two new exported helpers back the split:

- `detectPatchOperation(patch: string): 'ADD' | 'UPDATE'` (`src/tool/tools/apply-patch.ts:94`) — inspects the FIRST `---` header in the patch and returns `'ADD'` when it matches `/\/dev\/null(\s|$)/` (tolerates a trailing timestamp such as `--- /dev/null\t2026-09-05 10:00:00`), otherwise `'UPDATE'`. Missing `---` header → `'UPDATE'` (safe default). Only the first `---` header is inspected — multi-file patches are out of scope for this tool.
- `stripPatchHeaders(patch: string): string` (`src/tool/tools/apply-patch.ts:120`) — removes unified-diff file-level header lines (`diff --git`, `index`, `--- `, `+++ `) that appear BEFORE the first `@@` hunk header, so the line-based hunk parser does not misread `--- a/foo` as a deletion line (it starts with `-`) or `+++ b/foo` as an addition line. Lines inside a hunk body are preserved verbatim.

Contract for any new patch-application or diff-application tool:

- **Classify BEFORE the existence check.** Read `detectPatchOperation(patch)` first, then decide whether the target file must exist (UPDATE) or must NOT exist (ADD). Returning a generic `File not found` for a `/dev/null`-headed patch is wrong — it will confuse both LLMs and human callers who intended a file-creation flow.
- **ADD must fail-fast on collision, never silently overwrite.** If the classification is `'ADD'` but the target file already exists on disk, return `{ success: false, error: 'Cannot ADD: file already exists: <path>' }` and do NOT touch the file. This guards against the Cline #13835 regression class where an LLM re-emits a creation patch for a file it does not know already exists, and the tool silently overwrites unrelated content. Tests must assert both the `error` string AND that the on-disk content is preserved untouched.
- **ADD must create parent directories.** ADD to a missing nested path (`nested/deeply/newfile.txt` under a fresh temp dir) is a legitimate use case. Call `fs.mkdir(path.dirname(filePath), { recursive: true })` before `fs.writeFile` for the ADD branch specifically. UPDATE should NEVER call `mkdir` — its target must already exist, and creating parent directories underneath an existing-file path would mask real bugs.
- **ADD uses canonical seeds; UPDATE preserves detected values.** For ADD, seed the encoder with `{ encoding: 'utf-8', confidence: 1, hasBOM: false }`, use `''` as the original content, and pick the platform default line ending (`os.EOL === '\r\n' ? 'crlf' : 'lf'`). For UPDATE, read the existing file, detect its encoding via `detectEncoding(buffer)`, and detect its line-ending style via `detectLineEnding(filePath)` fast-path with `detectLineEndingStyle(rawOriginalContent)` fallback for the `'mixed'` case. Do NOT reuse the UPDATE detection path for ADD — there is no prior file to detect against, and the empty-string fallback would land in `detectLineEndingStyle`'s platform-default branch anyway.
- **Always call `stripPatchHeaders` after `normalizeToLf`.** Both LLM-emitted and hand-authored patches routinely carry a `diff --git` / `index` / `--- a/foo` / `+++ b/foo` preamble. The strip step is unconditional and applies to both ADD and UPDATE. Skipping it would revive the pre-`00962f1c` bug where `--- a/foo` was interpreted as a deletion of `-- a/foo`.

Testing guidance: pure-function tests for `detectPatchOperation` and `stripPatchHeaders` go in the same test file as the tool's other suites (see `tests/tool/tools/apply-patch.test.ts` `describe('detectPatchOperation')` and `describe('stripPatchHeaders')`). Integration cases in `describe('ADD semantics')` and `describe('UPDATE semantics')` drive `applyPatchTool.execute` against a `fs.mkdtemp` temp directory and assert on both the successful outcome and the collision/not-found error paths. Coverage must include: ADD to missing file succeeds, ADD to existing file rejects AND preserves on-disk content, ADD to missing nested path creates parents, UPDATE to missing file rejects with `File not found`, UPDATE with `---`/`+++` headers strips and applies correctly. See `docs/TESTING.md#testing-the-apply_patch-add-operation` for the worked pattern.

### Shared line-ending detection: `src/utils/line-ending.ts`

Effective 2026-08-30, generic line-ending classification lives in `src/utils/line-ending.ts` and is the preferred entry point for any new tool or module that needs to know a file's convention without loading it fully. Two exports, both pure and both safe to call from any layer:

- `detectLineEndingFromString(content: string): 'LF' | 'CRLF' | 'mixed'` — for callers that already have the file content in memory (e.g. a tool that has just decoded a buffer through `decodeWithEncoding`). Returns `'mixed'` when both `\r\n` and bare `\n` occur, `'LF'` for the empty string or content with no line endings, and never treats a lone `\r` as a line ending.
- `detectLineEnding(filePath: string): Promise<'LF' | 'CRLF' | 'mixed'>` — for callers that only have a path. Opens the file with `fs.open`, reads at most `LINE_ENDING_SAMPLE_BYTES` (8 KiB, also exported) from offset 0, decodes as UTF-8 with `fatal: false`, and delegates to `detectLineEndingFromString`. The file handle is always closed via `finally`.

Contract for choosing between the shared module and the older `apply-patch.ts` helpers:

- **Prefer `src/utils/line-ending.ts` for new code.** It returns the three-value `'LF' | 'CRLF' | 'mixed'` union so callers can branch explicitly on the `'mixed'` case, and its sample-based file-path variant keeps detection cheap on multi-megabyte files. The `apply_patch` tool now uses this helper as its fast path and only falls back to the majority-count logic when the sample returns `'mixed'`.
- **Keep using `detectLineEndingStyle` from `apply-patch.ts` when you need the platform-default fallback.** The shared helper returns `'LF'` for content with no line endings at all (canonical for TypeScript / Node source); `detectLineEndingStyle` falls back to `os.EOL` in that case (`'crlf'` on Windows, `'lf'` elsewhere). If your tool is writing a brand-new file whose EOL style must match the platform, that fallback is the right one — but for existing files with a detectable convention, the shared helper is the fast path.
- **Never treat a bare `\r` as a line ending.** Both helpers deliberately drop old-MacOS-style CR-only files into the `'LF'` bucket. If a future tool needs to handle CR-only content, add a fourth union member and update the helper in one place — do NOT count bare `\r` occurrences locally in a new tool.

Testing guidance: pure-function tests for both helpers live in `tests/utils/line-ending.test.ts` and follow the standard `fs.mkdtemp` / `fs.rm` pattern for the file-path variant. The `LINE_ENDING_SAMPLE_BYTES` constant is exported specifically so tests can construct a file whose first 8 KiB is pure LF and whose tail is pure CRLF — the detector must return `'LF'`, which is the load-bearing guarantee that lets the fast path avoid full-file reads. See `docs/TESTING.md#testing-the-shared-srcutilsline-endingts-helpers` for the worked pattern.

## `displayRole` for Hidden Instrumentation

Effective 1.21.4 (issue #1466), messages that must reach the model but stay out of the user-facing transcript should be persisted with `displayRole: 'system'` on the `Message` interface. The provider still receives the message with its logical `role` (`'user'`, `'assistant'`, `'system'`); `displayRole` is a UI-only filter honoured by `MessageArea`, `SessionReplay`, and any future transcript surface.

Contract for hook / instrumentation authors:

- Use `sessionManager.addMessage(role, content, tokens, { displayRole: 'system' })` when persisting a message the user should not see. Do NOT set `role: 'system'` unless the message is genuinely part of the system prompt — `role` is the model-facing dimension.
- Auto-title generation skips any message carrying `displayRole`, so a `displayRole: 'system'` hook message will not become the session title.
- If you add a new transcript view (a `sessions view` subcommand, an HTTP `/api/session/:id` endpoint, an MCP resource), you MUST honour `displayRole: 'system'` as a hard-hide. Tests should cover both the "user message is visible" and "displayRole=system is hidden even when showSystemMessages=true" cases.

## Adding a Runtime-Reload Target

Modules that own long-lived runtime state (a plugin loader, a hooks table, an in-process cache derived from an on-disk config) should plug themselves into the `alexi reload` pass rather than owning their own bespoke re-read flow. The registration surface lives in `src/cli/commands/reload.js`:

```typescript
import {
  registerRefresher,
  IN_FLIGHT_MARKER,
  type Refresher,
} from '../cli/commands/reload.js';

const refreshMyPlugin: Refresher = async () => {
  if (isMyPluginBusy()) {
    // Skip, don't fail — a reload during an active request is a valid outcome.
    throw new Error(`${IN_FLIGHT_MARKER} plugin request in flight`);
  }
  await reloadMyPluginState();
};

registerRefresher('my-plugin', refreshMyPlugin);
```

Guidelines when adding a new refresher:

- **Idempotence.** Registering the same name overwrites the previous function reference, so bootstrap order does not matter and multiple bootstrap paths can safely call `registerRefresher` for the same subsystem.
- **In-flight is a skip.** Throw an `Error` whose message starts with `IN_FLIGHT_MARKER` (exported constant `'IN_FLIGHT:'`) when the module cannot safely re-read state because a request is in flight. The reload pass classifies these as `skipped: true` and does NOT flip the exit code to `1`.
- **Failure is not fatal.** A refresher that throws any other error surfaces as `outcome.ok === false` with the error message on `outcome.reason`, but the reload pass continues with the next refresher. Do NOT try to catch and recover inside the refresher just to avoid the failure being reported — the aggregated report is exactly the mechanism operators use to see which subsystems are unhealthy.
- **Dynamic imports for expensive state.** Follow the pattern in `registerDefaultRefreshers` and use `await import('./path.js')` inside the refresher body rather than a top-level import; that keeps the reload module cold-start cheap and avoids pulling the full config / skill / plugin graph into memory just to satisfy the CLI dispatcher.
- **Tests.** Add a case to `src/cli/commands/__tests__/reload.test.ts` (or a sibling file) that (1) registers your refresher via `registerRefresher`, (2) uses `_resetRefreshersForTest()` in `beforeEach`, and (3) asserts the `ReloadOutcome` shape returned by `executeReload()`.

See [ARCHITECTURE.md — `/reload` Command Primitive](./ARCHITECTURE.md#reload-command-primitive-srcclicommandsreloadts) for the design contract and [API.md — reload](./API.md#reload) for the full programmatic API.

## Threading User Feedback Through New Permission Surfaces

Any new tool-permission surface (a custom prompt UI, a headless approval hook, an alternative TUI dialog) MUST honour the permission-rejection feedback contract introduced in 1.22.20:

1. **Publish feedback on the `PermissionResponse` event.** The bus schema (`src/bus/index.ts`) accepts an optional `feedback: string` field. Emit it when the user supplied a natural-language reason on a rejection; leave it absent (or empty) on approvals and plain denies.
2. **Do NOT re-arm the approval shortcut while capturing feedback.** The CLI closes the primary readline BEFORE opening the feedback prompt; the TUI dialog uses a `pendingDeny` state to swallow shortcut keys. A stray `a` in a reason must not fire the approve path (parity with kilocode fix `845565872`).
3. **Feedback is denial-only.** An approval carrying a `feedback` string is silently dropped by `PermissionManager.askUser` — do not build UX that relies on collecting feedback for a granted call.
4. **Whitespace-only feedback is `undefined`.** The manager trims the payload; consumers always see either a non-empty trimmed string or nothing.

Callers reading `PermissionResult.feedback` should prefer it over the generic action/resource descriptor when building the rejection reason the tool result forwards to the model — `defineTool` (`src/tool/index.ts`) and the sandboxed-git-write path in `src/tool/tools/shell.ts` are the reference implementations.

See [ARCHITECTURE.md — Permission-Rejection Feedback Flow](./ARCHITECTURE.md#permission-rejection-feedback-flow).

## Draining Prompts With `PromptQueue`

Any new interactive or headless driver that maintains a user-message loop across an agent goal MUST route incoming prompts through `PromptQueue` (`src/core/promptQueue.ts`) instead of implementing its own preempt policy. The queue enforces the invariant that a new prompt appends behind the active goal and does NOT cancel it; only `interrupt(reason)` cancels.

Two mistakes the queue exists to prevent:

- **Message-arrival that masquerades as an interrupt.** Do not call `handle.cancel(...)` from your enqueue path. Route Ctrl+C, `/stop`, and abort signals through `queue.interrupt(reason)` — that is the single documented cancel channel.
- **Draining before the goal settles.** Call `queue.finishGoal()` in a `finally` block after the active turn resolves (success or failure), then `queue.drain()` on the next tick to pick up any prompts that arrived mid-turn. The queue does not automatically drain — that decision belongs to the driver.

Tests for a new driver should assert (a) `enqueue()` never invokes `handle.cancel`, (b) `interrupt(reason)` invokes `handle.cancel(reason)` exactly once, and (c) `drain()` after `finishGoal()` returns prompts in enqueue order.

See [ARCHITECTURE.md — Prompt Queue](./ARCHITECTURE.md#prompt-queue-srccorepromptqueuets) and [API.md — Prompt Queue API](./API.md#prompt-queue-api).

## Config-Key Promotion Pattern (`sharedAgentBoard`, 2026-09-15)

When an upstream sync promotes a config key out of `experimental.*` to the top-level config namespace, follow the pattern established for `sharedAgentBoard` (`src/config/userConfig.ts:721-767`). The pattern is deliberately conservative so operator config files continue to work across sync boundaries.

**Resolution order (three tiers):**

1. **New preferred location** — top-level config key (e.g. `config.sharedAgentBoard`). This is the canonical read path; return immediately on a boolean hit.
2. **Legacy location** — the old `experimental.<key>` slot, still accepted for backwards compatibility. Reading from this path MUST log a one-time deprecation warning naming both the old and new locations so operators can migrate.
3. **Default** — the value the promotion PR chose (the promotion often flips the default from `false` to `true` — always call this out explicitly in the docstring).

**Write behaviour:**

- Always write to the new top-level key.
- If the legacy key is present, delete it in the same write so the config file converges on the new shape on the next round-trip.
- If deleting the legacy key leaves the `experimental` object empty, delete the parent key too. A dangling empty `experimental: {}` is confusing when an operator later inspects the file.

**Deprecation warning latch:**

- Use a module-scoped `let _<key>DeprecationWarned = false` boolean plus a `warn<Key>LegacyOnce()` helper so the warning fires exactly once per process even when the accessor is called on every tool-registration event.
- Import `logger` lazily via `import('../utils/logger.js').then(...)` so a bare `require` of `userConfig` from a test harness that wants no console noise still reaches the accessors without triggering a module cycle.
- Export a test-only `_reset<Key>DeprecationWarningLatchForTests()` helper so consecutive fixtures can each observe the warning without spawning a fresh process. Mark it `@internal` in the docstring so production code cannot lean on it.

**Testing:**

- Cover all three tiers: (a) top-level key present, (b) legacy key present + deprecation warning fires exactly once, (c) neither key present + default applies.
- Assert that `set<Key>(value)` after (b) removes the legacy entry AND drops the `experimental` parent if empty.
- Reset the deprecation-warning latch in `beforeEach` (or `afterEach`) so tier (b) can be re-observed across cases.

Worked example: `getConfigSharedAgentBoard` / `setConfigSharedAgentBoard` in `src/config/userConfig.ts:721-767`.

## Adding a New Entry to `mcp-servers.example.json`

`mcp-servers.example.json` at the repo root is the template operators copy into `~/.alexi/mcp-servers.json` on first setup. Two regression tests in `tests/mcp-config.test.ts` (introduced with the Playwright scaffold in commit `ae461291`) enforce that the file stays valid against the schema in `src/mcp/config.ts` and that shipped disabled scaffolds keep their opt-in shape. When adding a new example entry, follow this checklist so the tests keep passing:

1. **Ship disabled and non-autoconnecting.** New scaffolds MUST set `enabled: false` and `autoConnect: false`. Operators opt in by flipping `enabled: true` — a commit that accidentally ships the entry pre-enabled would auto-run the referenced binary against every fresh `alexi` session and is caught by the structural test.
2. **Validate the entry against the schema before committing.** Run `npm test -- tests/mcp-config.test.ts` locally. The `validates the checked-in mcp-servers.example.json against the schema` case exercises the exported `validateMcpConfig(raw)` from `src/mcp/config.ts` against the on-disk file and fails on any unrecognised field or missing required key. It is faster than round-tripping through the CLI to catch a typo.
3. **Set a `timeout` shape appropriate for the server's startup profile.** The shared global default is `{ startup: 5000, request: 8000 }`; a browser MCP server, a JVM warmup, or any `npx -y <package>` cold-cache launch typically needs a larger `startup` (Playwright ships with `startup: 10000`). Assert the full `timeout` object via `.toEqual({...})` in any new per-entry structural test — a per-field chain would miss a stray key.
4. **Add a per-entry structural test if the entry documents opt-in defaults.** For scaffolds where the shipped `timeout` / `retry` / `env` values ARE the documented default (as with Playwright's 10 s startup and 3-attempt retry policy), add a companion test that locates the entry by `s.name === '<your-name>'` and pins those fields. The Playwright case in `tests/mcp-config.test.ts` is the canonical worked example — see `docs/TESTING.md#testing-the-mcp-serversexamplejson-schema-guard-commit-ae461291` for the pattern.

   **For entries backed by an external binary (browser, JVM, native compiler), also add an end-to-end registration contract suite alongside the structural test.** `tests/mcp/playwright.test.ts` (commit `bf9eb149`, 369 lines) is the canonical worked example. It pins four axes: (1) schema validation of the example scaffold plus a cross-check against the committed `mcp-servers.example.json` file, (2) generic startup retry with an `ECONNRESET`-then-success pair (asserting `attemptCount === 2` and a single 1000 ms backoff via a spy on the manager's private `delay` method), (3) graceful degradation on `spawn ENOENT` (permanent classification — `attemptCount === 1`, retry budget preserved, connection remains visible via `manager.getStatus()`, error names the `'command'` field to fix), and (4) tool-schema passthrough (advertised tools flow through `listAllTools` with their `inputSchema` verbatim and the `serverName` / qualified-name prefix Alexi adds for cross-server disambiguation). Mock `child_process.spawn` and `@modelcontextprotocol/client` at the module boundary so no live binary is required in CI, but import the REAL `validateMcpConfig` and `resolveRetryPolicy` via `vi.importActual` so registration validation exercises the actual Zod schema. See `docs/TESTING.md#testing-the-playwright-mcp-registration-contract-testsmcpplaywrighttestts` for the full walkthrough.
5. **Locate the file via `fileURLToPath(import.meta.url)`, not `process.cwd()`.** Vitest may run from a nested directory in the future; anchor the path to the test file's compiled location:
   ```typescript
   import { fileURLToPath } from 'url';
   const here = path.dirname(fileURLToPath(import.meta.url));
   const examplePath = path.resolve(here, '..', 'mcp-servers.example.json');
   ```
6. **Document any new environment-variable references.** When an entry declares `env: { KEY: '${VAR}' }`, list the variable in the repo `.env.example` (if broadly useful) or at minimum in the entry's `description` field. The `resolveEnvVars` helper in `src/mcp/config.ts:496` substitutes `${VAR}` at load time and silently leaves unresolved references as literals — operators who miss the required export get a runtime failure at first invocation rather than a clear "missing env var" at startup.

Do NOT mock `validateMcpConfig` in the example-config suite. The load-bearing property being tested is that the on-disk file matches the real schema; a mock would defeat the purpose.

## Wakeup Subsystem Testing

The wakeup subsystem (`src/kilocode/wakeup/`) is filesystem-backed — each `Wakeup.schedule` call writes a JSON file under `~/.alexi/wakeups/`. When adding tests, follow the same temp-dir pattern used by tool tests:

- Redirect `os.homedir()` to a per-test tempdir via `vi.spyOn(os, 'homedir').mockReturnValue(WAKEUP_TMP)` in `beforeEach` and tear it down in `afterEach` so parallel test runs and pre-existing user wakeups do not interfere. `src/kilocode/wakeup/index.ts` reads `os.homedir()` at module load time; call `vi.resetModules()` after mounting the spy and dynamically `await import('../index.js')` inside each `it` block so the fresh homedir is picked up.
- Do NOT mock `Wakeup.schedule` / `Wakeup.cancel` — exercise the real filesystem code path so schema drift shows up in the test suite.
- To exercise `Wakeup.fireDue` deterministically, schedule with a relative `when` value (`normalizeWhen('0s', now)` or a past ISO timestamp) and pass an explicit `now: Date` to `fireDue(now)`. Do not rely on wall-clock timing.
- The companion tools (`schedule_wakeup`, `cancel_wakeup`) refuse without an active `context.sessionId`. Test both the happy path (with a session id) and the session-gate refusal.
- **Session-instance semantics (2026-09-16).** When adding a cancel test that supplies `instanceID`, always cover the mismatching-instance branch — a `cancel({ sessionID, instanceID: 'inst-2', wakeupID })` against an entry scheduled with `instanceID: 'inst-1'` MUST return `{ cancelled: false }` and leave the on-disk entry pending. The canonical suite is `src/kilocode/wakeup/__tests__/instance-cancel.test.ts`; new tests should follow the same shape.
- **Bulk-cancel path.** The `SessionManager.deleteSession` sweep calls `Wakeup.cancel({ sessionID, reason: 'session-delete' })` with no `wakeupID`. When adding a bulk-cancel test, schedule two or more wakeups under the same `sessionID` and assert `cancelledCount` on the result. Bulk-cancel publishes a single `WakeupCancelled` event (with `cancelledCount > 1`), not one per entry — a test that asserts one event per swept entry is testing the wrong contract.
- **Bus events.** All three lifecycle events (`WakeupScheduled`, `WakeupCancelled`, `WakeupFired`) publish through the shared bus. Subscribe with `WakeupScheduled.subscribe(payload => …)` before triggering the code path under test, and remember to unsubscribe in `afterEach` — the bus retains subscriptions across `it` blocks in the same file. Publish failures are swallowed by design; do NOT write a test that asserts a broken subscriber crashes the wakeup path.

## Malformed Tool-Call Cap

The agentic loop (`src/core/agenticChat.ts`) caps consecutive malformed tool calls per turn at `MAX_MALFORMED_TOOL_CALLS_PER_TURN = 3`. When adding a code path that returns a `ToolResult` with `success: false`, keep the two prefixes the cap recognises stable:

- `Invalid JSON in tool arguments …` — emitted when the model's function-call arguments string fails `JSON.parse` and cannot be repaired.
- `Unknown tool …` — emitted when the model calls a name that the registry does not know.

Any other error message is scored as a normal failure (counts against `MistakeTracker`, not `malformedToolCallCount`). If a new failure mode should participate in the cap, extend the prefix check in `src/core/agenticChat.ts:956` and add a test to `src/core/__tests__/agenticChat.test.ts` mirroring the existing `aborts the turn after repeated malformed tool calls` case.

## Session Model Preference (`SessionModelPreference`)

Added in the 2026-09-17 sync. When wiring a new code path that picks a model for a session — a new CLI flag, a TUI affordance, a routing rule that fires mid-session — always route the choice through `src/core/modelPreference.ts` rather than writing to a session field directly. The provenance guard (`source: 'user-explicit' | 'inherited' | 'default'`) only works if every writer sets the field.

Contributor rules:

- User-facing affordances (`/model <id>` slash command, `--model` CLI flag, TUI model picker) MUST call `userExplicitPreference(modelID, providerID, reasoningEffort?)`. Never construct the object literal in place — a missing `source` field breaks the override guard.
- Config-derived defaults (routing-config, `AICORE_MODEL`, built-in fallback) MUST call `defaultPreference(...)`. This keeps brand-new sessions overwritable by the next config reload as before.
- Session hydration from disk MUST route the raw JSON through `migrateLegacyPreference(...)` before handing it to `resolveSessionModelPreference(...)`. Legacy records without a `source` are treated as `'user-explicit'` — the conservative choice.
- Effort-only mid-session updates (`/effort high`, TUI effort picker) MUST pass an incoming payload with ONLY `reasoningEffort` set and NO `source: 'user-explicit'`. The reconciler's merge branch depends on this distinction to preserve the current model while refreshing the effort intent.

Add coverage in `src/core/__tests__/modelPreference.test.ts` for any new code path — the reconciler is pure, so tests are cheap and pin the contract without mocks.

## Session Busy Transitions (`SessionBusyTracker`)

Added in the 2026-09-17 sync. The tracker in `src/core/sessionBusy.ts` now enforces "clear-before-publish, write-after-publish" ordering. When adding a new caller or a new publisher (event bus, WebSocket broadcast, telemetry sink):

- Wrap the busy region in `try / finally` with `markFree` in the `finally`. `markFree` is guaranteed to leave the session free even if the publisher throws, so this shape is safe.
- Do NOT persist a "session is busy" flag alongside the tracker in a separate store — the internal `busySessions` Map is the source of truth. A parallel store would drift under the rollback branch on failed publish.
- Publisher implementations should return promises (`SessionBusyPublisher = (event) => void | Promise<void>`), but MUST NOT rely on the tracker awaiting them. `markBusy` and `markFree` are synchronous — a rejected promise triggers a best-effort deferred rollback via `.catch`, but there is no back-pressure. If a subscriber needs guaranteed delivery, buffer internally.
- New failure modes should surface `SessionBusyError` unchanged. HTTP callers translate it to 409 via `toBusyResponse`; CLI callers should log the operation name from `error.operation` and exit with a distinct code.

## Subagent Approval Boundaries (`deriveSubagentSessionPermission`)

Added in commit `d37f77ba` (ports cline PR #14225). Any code path that spawns a subagent through the `task` tool — or a new tool that plays the same role — MUST route the permission derivation through `deriveSubagentSessionPermission` in `src/agent/subagent-permissions.ts`. Do NOT reintroduce inheritance of parent-session `allow` / `ask` rules; the contract is deliberately "restrictions inherit, approvals do not".

Contributor rules:

- **Never re-add `inheritPermissions: true` to `SubagentOptions`.** The field is retained as `@deprecated` for source-compat only and is intentionally ignored by `buildSubagentConfig`. A future refactor that dereferences it should first delete the field from the interface.
- **Route new callers through `TaskTool.buildSubagentConfig(context, subagent, options)`.** The three-argument shape is the supported entry point; it composes `parentAgent`, `parentSessionPermission`, `allowedTools`, and (for the `explore` agent) `bashRules` in the correct order. Bypassing the helper and calling `deriveSubagentSessionPermission` directly is acceptable in tests but discouraged in runtime code — the helper is the one place we detect the explore agent and merge its bash rule map.
- **Pass `parentSessionPermission` verbatim from the parent's live ruleset.** The derivation performs the `allow` / `ask` filtering itself; a caller that pre-filters loses the ability to forward parent `deny` and `external_directory` rules to the subagent.
- **When adding a new dangerous tool to the registry, extend the internal `potentiallyDangerous` list in `deriveSubagentSessionPermission`.** The list drives the explicit-deny loop that fires when `allowedTools` is provided. A tool that lands in the registry without an entry here would be implicitly allowed under `allowedTools: []` — the exact bug this contract exists to prevent. Update `tests/tool/tools/task-approval-boundary.test.ts` to cover the new name in the `denies every non-baseline tool NOT in the list` case.
- **Baseline tools require an entry in `BASELINE_SUBAGENT_TOOLS`.** The baseline is the set of read-only exploration primitives (`read`, `glob`, `grep`, `list`, `ls`, `task_status`) that must remain reachable to a subagent even under `allowedTools: []`. Adding a new read-only tool that a subagent should always be able to call means updating both the constant and the "empty `allowedTools`" test case to prove the new tool is not accidentally denied.
- **Delegated agents (agents that cannot answer interactive prompts) MUST supply a `bashRules` map through `buildSubagentConfig`.** `getExploreAgentBashRules()` is the canonical source for the `explore` agent. If a new delegated agent is introduced, expose a sibling helper (e.g. `getReviewAgentBashRules()`) and wire it through `buildSubagentConfig` before adding the agent to the registry. `deny`-marked patterns become priority-1500 command-based deny rules; `allow` / `ask` entries are dropped because the bash tool's own permission map already covers them.
- **Update the four task-tool test files together.** `task-approval-boundary.test.ts`, `task-abort-propagation.test.ts`, `task-depth-limit.test.ts`, and `task-failure-paths.test.ts` all mock `src/agent/index.js`. Any change to that module's shape (a new export, a renamed helper) must be reflected in the `vi.importActual + spread` factories in each of the four files or the suites fail to load. See [TESTING.md — Testing subagent approval boundaries](TESTING.md#testing-subagent-approval-boundaries) for the current mock pattern.
- **The pure-function contract belongs in `src/agent/subagent-permissions.test.ts`.** The co-located suite added in commit `82dbef06` pins the three-decision contract (ALLOW dropped, ASK dropped, DENY + `external_directory` retained) directly against `deriveSubagentSessionPermission` without going through the tool wiring. Any change that touches the internal filter (e.g. adding a fourth decision shape, tightening the `external_directory` retention rule, or altering the fail-closed default when `allowedTools` omits a tool the parent had allowed) MUST land with a matching case here — the mock-free suite is the fast-path regression guard that fails before the integration suite even loads its mocks. Do NOT delete or fold this suite into the tool-level file; keeping the derivation function testable in isolation is what lets `subagent-permissions.ts` be refactored without breaking the tool contract.

## Draft Cache (`DraftCache`)

Added in the 2026-09-17 sync. The in-memory cache in `src/session/draft.ts` is the canonical place for TUI in-progress prompt state. When adding a new place that reads or writes the buffer:

- Do NOT persist an empty string to the cache — `set(id, '')` and `set(id, '   ')` both evict, so if a call site wants to explicitly clear a draft it can just pass `''`. The distinction between `undefined` (no draft) and `''` (empty draft) is intentionally collapsed in the store.
- Route submit paths through `promote(id, buffer)` rather than `get` + `delete` + trim — `promote` guarantees the eviction happens in both branches (empty and non-empty), which is the whole point of the upstream fix (`0d2fee251`).
- Do NOT add a `stat`-like method that returns `boolean`. Callers should just check `get(id) === undefined`. Adding a separate presence method creates a two-source-of-truth problem when a persistent store is added later.
- Prefer constructing a local `new DraftCache(customStore)` in tests over mutating the global singleton via `getDraftCache()` — see [TESTING.md — Testing the Draft Cache](TESTING.md#testing-the-draft-cache).

If a durable variant is added (crash-recovery across process restart), it MUST implement the `DraftCacheStore` interface (`get` / `set` / `delete` / `clear`) and preserve the empty-value eviction semantics — the reconciler and the callers depend on it.

## Programmatic Tool Calling (`experimental.code_mode`)

Added in the 2026-09-18 sync. `src/tool/code-mode.ts` is the ONLY entry point that should observe `experimental.code_mode`. When wiring a caller that wants to route MCP tool calls through the confined runtime:

- Call `loadCodeMode()` — do NOT read the config flag directly. The helper folds in three orthogonal gates (config, network-restriction env, runtime-load failure) and every regression on any one gate is caught by the unit tests in `src/tool/__tests__/code-mode.test.ts` (add coverage there for any new gate).
- Treat a `null` return as the normal fallback — the direct-tool path stays fully supported. Do NOT hard-fail or log an error when `null` is returned; the runtime returns `null` on purpose in air-gapped SAP AI Core deployments.
- Do NOT import `./code-mode-runtime.js` statically. The dynamic import in `loadCodeMode()` keeps users who never enable the flag from paying an import cost.
- When persisting the flag through the config setter, use `setConfigCodeMode(enabled)` — it preserves sibling `experimental.*` keys via a spread merge. Never write a fresh `{ code_mode: enabled }` object into `config.experimental` directly, or you will wipe unrelated experimental settings (`task_model_selection`, `background_tasks`, …).

## Stalled Permission Approval Recovery (`recoverStalledPermissions`)

Added in the 2026-09-18 sync. `src/permission/recovery.ts` is the recovery surface for pending `askUser()` prompts disrupted by an abort / hot-reload / provider re-init. When adding a new place that calls `askUser()` or persists a permission rule:

- Wrap the in-flight prompt with `trackPendingPermission(id, resolver)` at the start and `clearPendingPermission(id)` when the response arrives normally. Missing either half leaves the entry either recovered-as-denied while the user IS answering (dropped answer) or permanently pending (memory leak).
- Callers that do not persist a rule (transient one-shot approvals) still need the tracker so a session abort mid-prompt does not stall the tool pipeline.
- Do NOT invoke `recoverStalledPermissions()` from inside a tool. The sweep is owned by `SessionManager.createSession()`; adding a second call site would race the dynamic import and log spurious warnings.
- Recovery results are ALWAYS denials (`approved: false`). Never author a code path that treats a `stalled_recovery` or `save_aborted` result as an approval — that would silently escalate a tool call the user never sanctioned.
- Add tests under `tests/permission/recovery.test.ts` (or `src/permission/__tests__/`) using `_resetPendingPermissionsForTests()` in `beforeEach` and `_getPendingPermissionCountForTests()` for assertions.

## Sandbox `gh` Classification

Added in the 2026-09-18 sync. `src/kilocode/sandbox/gh.ts` classifies GitHub CLI subcommands into `'readonly' | 'auth-gated' | 'write'`. When adding a new call site that shells out to `gh` or a new `gh` subcommand to the allow-list:

- Consult `classifyGh(args)` or `isGhReadOnly(tokens)` rather than allow-listing the entire `gh` executable — the point of the classifier is that read-only subcommands do NOT trigger a permission prompt while writes and auth still do.
- When adding a new subcommand to `GH_READONLY_SUBCOMMANDS`, prefer the two-word form (`'issue view'`, `'pr checks'`) so the classifier picks it up via the two-word key. Single-token entries (`'browse'`, `'help'`) exist only for subcommands that do not have a two-word shape.
- Do NOT add anything that creates / updates / deletes remote state to the read-only set. In particular, `gh pr create`, `gh issue edit`, `gh release create`, and anything that opens an editor or uses `--web` must stay classified as `'write'`.
- `gh auth *` subcommands stay in `GH_AUTH_SUBCOMMANDS` regardless of shape. Read-only-looking auth calls (`auth status`, `auth token`) still need the permission gate because the underlying auth material is sensitive.
- New tests belong under `tests/kilocode/sandbox/gh.test.ts` (or the colocated `src/kilocode/sandbox/__tests__/gh.test.ts`). Cover the empty argv → `'readonly'` case, the flags-only case (`gh --version`), and both single-token and two-word matches.

## Sandbox Git Masked-Mutation Detection

Also in the 2026-09-18 sync. `isGitWrite()` in `src/kilocode/sandbox/git.ts` now flags read-only-shaped git invocations as writes when they carry a mutating flag (`-c`, `--config`, `--exec-path`, `--upload-pack`, `--receive-pack`, `--work-tree`, `--git-dir`). When adding a new global git flag to Alexi's shell tool or the classifier:

- If the flag can change what binary runs (`--exec-path`, `--upload-pack`, `--receive-pack`), a config value (`-c`, `--config`), or the repo scope (`--work-tree`, `--git-dir`), it belongs in `MASKED_MUTATION_FLAGS`. Otherwise (e.g. `-C <path>`, which only changes cwd), it does not.
- `expandShortFlagClusters` deliberately preserves numeric-tail short flags (`-n1`, `-C10`). Do NOT change this rule to split them — git's numeric short flags encode a value, not a flag list, and splitting `-n1` into `-n -1` would spuriously classify count-limited log queries as writes.
- Ordering matters: the masked-mutation check MUST run BEFORE the read-only subcommand check so write intent wins. If you refactor `isGitWrite()`, keep this ordering explicit — a regression here would let `git -c core.hooksPath=... log` slip through the sandbox.
- Add coverage for both `-c key=value` (single token) and `-c key=value` split into `-c`, `key=value` (two tokens). Both shapes exercise the same detector but through different tokeniser paths.

## Deferred Session Title Generation (`ensureTitle`)

Added in the 2026-09-18 sync. `src/kilocode/session/title.ts` defers title generation until after the first substantive user activity. When adding a new place that seeds a session title (a resume-from-JSON path, an import command, a TUI affordance):

- Call `ensureTitle(sessionId, message, generate)` — do NOT bypass the gating rules by writing directly to the session's `title` field. The gating (attempt budget, backoff window, minimum message length) is the point of the module.
- The `generate: TitleGenerator` callback stays caller-supplied so this module is decoupled from `src/providers/`. Do NOT hard-wire a specific provider inside `title.ts` — pass it in.
- Call `resetTitleState(sessionId)` when closing a session so a re-used id starts fresh. `resetTitleState()` (no argument) is for test cleanup, not production close paths.
- Do NOT lower `TITLE_MIN_MESSAGE_LENGTH` below `8` without pairing evidence — the threshold exists so a one-word ack ("yes", "ok", "no") does not seed a permanent title. If a lower threshold is really needed, add a per-caller override rather than moving the module constant.
- Tests belong under `src/kilocode/session/__tests__/title.test.ts` using `_peekTitleStateForTests` for assertions and `_TITLE_*_FOR_TESTS` for constant references so the tests do not silently break if the constants are re-tuned.

## Shell Permission Pattern Masking (`patternFor`)

Added in the 2026-09-19 sync (upstream kilocode `c33d81690..a85ae672a`). `src/tool/shell-pattern.ts` renders the permission `resource` for shell commands from a tree-sitter parse instead of the raw text, so anywhere-match deny globs (`*|*`, `*>*`, `*;*`, `*$(*`) do not fire on operator characters that live inside quoted strings, `/dev/null` redirects, or fd duplication. The shell tool (`src/tool/tools/shell.ts`) is the only production caller today.

When adding a new place that needs to compute a permission pattern for a shell command:

- Call `patternFor(command, shellType)` — do NOT reach for `pattern(node, kind, raw)` unless you already have a parsed `TreeSitterSyntaxNode` in hand. The convenience wrapper handles the parse-source call and the null-node fallback in one place.
- The masker is length-preserving and byte-position-preserving. If you add a position-anchored rule to a read-only ruleset, it will see the same offsets in the masked pattern as it saw in the raw command — do NOT bypass the masker on the assumption that mask characters shift positions.
- Non-POSIX shells (`powershell`, `cmd`) return the raw command unchanged. If you add a new shell type that shares the bash operator glossary (`sh`, `zsh`, `bash` are the current allow-list), update the `kind !== 'bash' && kind !== 'sh' && kind !== 'zsh'` early-return in `pattern()` — otherwise the masker's output falls through to the raw command and the rulesets go back to over-denying.
- Tree-sitter is an optional peer dependency. The masker MUST NOT throw when `tree-sitter-bash` is unavailable — the outer `try / catch` around `render(node)` and the `!node` guard exist for this reason. If you refactor the render loop, keep the exception-swallowing behaviour: a parse failure resolves to the raw command, matching upstream.
- Do NOT re-lex the command text to compute the mask. The whole point of the port is that regex-based operator masking is unsafe (it cannot tell a quoted `|` from a real pipe). If a future case needs finer-grained masking (e.g. `${var}` expansions), extend the tree-walker in `render()`, not a sibling regex pass.
- New tests belong colocated in `src/tool/shell-pattern.test.ts` and MUST use the `describeIfBash` pattern (see `docs/TESTING.md`) so cases that need the grammar skip cleanly on grammar-less installations.

## Compaction Trigger Projection (`shouldCompact`)

Also in the 2026-09-19 sync (upstream kilocode `f607bf0e0` + `030412ea0` + `e28ec562b`). `shouldCompact` in `src/core/compaction.ts` now supports an options bag that projects the next-turn cost from the provider's reported baseline instead of re-estimating the whole transcript. When wiring a new caller into the compaction system:

- Prefer the options-bag call shape: `shouldCompact(messages, maxContextTokens, { threshold, reserveOutputTokens, reportedUsage, systemPromptTokens, toolContentTokens })`. The legacy `shouldCompact(messages, max, 80)` form still works but takes the slower whole-transcript estimation path and cannot benefit from the projection.
- The caller — NOT `shouldCompact` — owns the `reportedUsage` value. After a cancelled / aborted response the caller MUST clear `reportedUsage` back to `undefined` (or `0`) before the next call, otherwise a stale baseline keeps the projection inflated on every subsequent trigger check. There is no side-effect in `shouldCompact` that would reset it for you.
- Count `systemPromptTokens` at most ONCE against the projection. The upstream bug that this port fixes was `systemPromptTokens` being folded into the transcript estimator once per message; do NOT re-add per-turn accumulation of the system prompt anywhere in the pipeline.
- `toolContentTokens` is for tool outputs that have landed since the last provider-reported usage (build logs, grep dumps, large `read` responses). If your caller keeps the tool outputs as regular messages with recorded `tokens.input` / `tokens.output`, they are already in `reportedUsage` on the next turn — do NOT double-count by also passing them via `toolContentTokens`.
- Tests belong alongside existing compaction coverage in `tests/core/compaction.test.ts` (or the colocated `src/core/__tests__/`). See `docs/TESTING.md — Testing the compaction trigger projection` for the recommended case matrix.

## MCP Remote-Transport Probe Content-Type Classification (`classifyProbeContentType`)

Added in the 2026-09-21 sync. `src/mcp/sse-probe.ts` renders the
"what kind of MCP endpoint is at this URL?" answer as a pure function of the
HTTP `Content-Type` header. `src/mcp/client.ts`'s `connectRemote` uses it to
reject `text/html` login pages and other reverse-proxy misconfigurations as
permanent errors, while `classifyConnectError` in the same file maps the
resulting error message to `'config'` so the retry budget is preserved. When
adding a new call site that reads the probe header or extending the classifier:

- **Never inline case-sensitive string comparisons on `Content-Type`.** Real
  proxies (nginx, Cloudflare, SAP AI Core's fabric) freely rewrite the
  casing of header names AND values. `contentType === 'text/event-stream'`
  is a regression waiting to happen. Use `classifyProbeContentType(header)`
  or the `isSseContentType(header)` boolean wrapper.
- **Split on the first `;` before matching.** The classifier does
  `contentType.split(';', 1)[0]?.trim().toLowerCase()` for a reason —
  `text/event-stream; charset=utf-8` is a valid SSE advertisement and
  MUST resolve to `'sse'`. If you add a new accepted media type, keep
  the same split-then-lowercase pipeline; do NOT introduce a per-type
  ad-hoc regex.
- **Return `'other'` for `null` / `undefined` / `''` / non-strings.** The
  fail-closed default is the whole point of the classifier — a peer that
  answered without a `Content-Type` is not a transport Alexi can safely
  handshake with. `connectRemote` deliberately does NOT throw when the
  header is absent (it falls through to the "transport not yet
  implemented" branch), but only because the classifier's `'other'`
  result is opt-in for the caller. Do not change this to throw.
- **Extend the `'other'` -> permanent config error mapping in `client.ts`
  as one change.** The permanent-error path in `connectRemote` and the
  `classifyConnectError` regex (`/unexpected Content-Type '/`) must stay
  in sync — if either drifts, the CI retry loop or the operator-facing
  "check the 'url' field in mcp-servers.json" hint stops firing.
- **Tests belong in `tests/mcp/sse-probe.test.ts`.** The classifier is
  pure and can be exercised without booting a transport; add a case for
  every new media type in the same describe block. See
  [TESTING.md — Testing the SSE probe content-type classifier](TESTING.md#testing-the-sse-probe-content-type-classifier-testsmcpsse-probetestts).
- **Do NOT observe the `Content-Type` from inside the transport client.**
  The probe is the last chance to reject a permanent misconfiguration
  before entering the transport handshake, which is where the retry
  budget starts being spent. Pushing the check into the transport layer
  would defeat that separation.

## Session Retention Policy (`getConfigSessionRetention` / `setConfigSessionRetention`)

Added in the 2026-09-21 sync. `src/config/userConfig.ts` gained a
`SessionRetentionPolicy` type plus paired reader / writer for the top-level
`retention` key on `~/.alexi/config.json`. Alexi ships the schema only; the
background retention runner is intentionally deferred. When touching this
surface:

- **Do NOT persist an empty object when nothing changed.**
  `setConfigSessionRetention({})` is a valid no-op — the spread merge
  preserves any prior `enabled` / `maxAgeDays` values. If you add a third
  field, follow the same pattern: only write it when it appears in the
  partial input, and preserve siblings otherwise. Never wipe the
  `retention` object wholesale from a `config set` subcommand.
- **Reject non-positive `maxAgeDays` at write time.** The writer already
  throws `Error('retention.maxAgeDays must be a positive integer >= 1 ...')`
  for negative / non-finite input. Reader-side robustness is the mirror
  contract — a hand-edited config with a garbage `maxAgeDays` MUST fall
  back to the 30-day default, not throw. If you add a new field with a
  numeric constraint, follow the same asymmetric contract: strict at
  the writer, lenient at the reader, so a corrupt config never wedges
  the CLI.
- **`enabled` MUST default to `false`.** Deletion is permanent, and the
  feature is strictly opt-in. Never introduce a code path that treats an
  unset `retention` key as "retention active with default 30d" — that
  is a data-loss risk on any operator who has not yet noticed the
  feature exists.
- **When the runner lands, honour `enabled: false` as a hard veto.**
  Even a debug-level log MUST NOT delete a session when `enabled` is
  false. Compare against the session file's `updatedAt` (not
  `createdAt`) so an actively used session is never reaped, and fail
  closed on any I/O error (skip the candidate, do not delete).
- **Do NOT read `retention` from outside `src/config/userConfig.ts`.**
  Route all callers through `getConfigSessionRetention()` so any future
  clamp / migration / validation logic lives in one place. The upstream
  opencode schema is expected to grow additional fields (retention
  cadence, per-directory overrides) and centralising the read is what
  keeps the migration cheap.
- **Tests.** The reader / writer are pure w.r.t. the filesystem and can
  be exercised via a temp `HOME` (see `tests/config/` for the
  established pattern). Cover both the missing-key branch (reader
  returns defaults) and the corrupt-key branch (`retention: 42`,
  `retention: []`, `retention: { maxAgeDays: 'foo' }`) so the fall-back
  contract does not silently drift.

## MCP Git Plugin Resolver (`src/mcp/git-resolver.ts`)

Added in the 2026-09-23 sync from Kilocode PR #14485. The resolver parses, validates, clones, and revalidates the git URLs the upcoming `mcp install` command will accept. The module is self-contained and covered by `src/mcp/__tests__/git-resolver.test.ts` — no other module in Alexi depends on it today, so the invariants below are the contract callers will need to honour when the CLI surface lands.

- **Every ref that reaches argv MUST have gone through `validateRef` first.** `parseGitUrl`, `cloneGitRepo`, and `revalidateMutableRef` all call `validateRef` before the ref is spliced into a `git clone --branch <ref>` / `git ls-remote <url> <ref>` argv. When adding a new entry point that accepts an operator-controlled ref, call `validateRef(ref)` at the top of the function AND add a `it('rejects an option-injection ref before touching argv')` test that asserts the underlying `GitRunner` was never invoked (`expect(calls.length).toBe(0)`). Refs starting with `-`, containing `^--`, containing whitespace / control chars / shell metacharacters, or matching `..` / `//` / trailing `/` / trailing `.lock` are permanent errors — do NOT try to sanitise or coerce them; reject.
- **Never build the git argv with string concatenation.** The resolver invariably passes `args: string[]` to `GitRunner` and separates URL from flags with a `--` sentinel (`args.push('--', normalizedUrl, tempPath)`). If you introduce a new git call, follow the same shape — the whole point of `execFile` over a shell string is that argv boundaries are honoured. A regression to `` `git clone ${url} ${branch}` `` would re-open option injection even with `validateRef` upstream.
- **Shell out through `currentRunner`, not directly through `execFile`.** The `GitRunner` seam (`setGitRunner` / `resetGitRunner`) is what makes the suite in `src/mcp/__tests__/git-resolver.test.ts` cheap and network-free. New git helpers MUST call `currentRunner(args, { cwd?, env? })` so tests can substitute a mock. Do not add a second private `execFile` call site inside the module.
- **Windows drive-less file URLs go through `normalizeFileUrl` FIRST.** `cloneGitRepo` and `revalidateMutableRef` both call `normalizeFileUrl(url)` before any downstream processing; the same must be true of any new call site that accepts a `file://` URL. Bare-string comparison against `file:///C:/...` is a Windows-only regression that CI (Linux runners) will never catch.
- **Symlink escapes are rejected via `checkContainment`, not by pre-flight string checks.** `checkContainment` calls `fs.realpath` on the resolved subpath and then computes `path.relative(resolvedRepo, resolvedSubpath)` — a symlinked `target -> /etc` inside the cloned repo is only visible AFTER the realpath call. Do NOT try to gate this at the string level (e.g. rejecting `..` in the subpath) — a symlink can escape without any `..` appearing textually. Absolute subpaths are rejected at the string level (cheaper, clearer error), but the containment check itself must always run against realpath.
- **Atomic-rename the final path; never write into `<cacheDir>/<identity>` directly.** `cloneGitRepo` clones into `<cacheDir>/<identity>.tmp-<pid>-<epoch>` and only renames to the final path after `git rev-parse HEAD` succeeds. If your feature needs to modify a cached clone in place (e.g. `git fetch --tags`), do the work in a sibling temp directory and rename on success. A partially updated final directory is worse than a stale one — concurrent readers must never see a half-written worktree.
- **Namespace plugin identities with `git:`, use `identityToCacheKey` to derive filenames.** `getPluginIdentity` prefixes every returned identity with `git:` so it cannot collide with npm / local plugin ids in a shared cache. `identityToCacheKey` reduces the identity to `[A-Za-z0-9._-]+` for use as a directory name. New plugin sources (`npm:...`, `local:...`, hypothetical `oci:...`) MUST pick a distinct prefix and route through the same `identityToCacheKey` pipeline so cache dirs stay filesystem-safe and non-colliding.
- **Mutable-ref revalidation is TTL-driven, not commit-driven.** `shouldRevalidate(record, ttl?, now?)` compares `record.resolvedAt` against `now - ttl` and returns `true` when the record is missing / older than TTL. When wiring the resolver into the `mcp install` command, persist a `ResolutionRecord` per identity (`identity`, `commit`, `resolvedAt`) alongside the cached clone, call `shouldRevalidate` on lookup, and only invoke `revalidateMutableRef` when it returns `true`. Do NOT `git ls-remote` on every lookup — the TTL exists so mutable refs (branches, tags) get re-resolved at bounded frequency without paying the network cost per invocation.
- **`revalidateMutableRef` returns `true` when a reclone is required.** Callers must treat the boolean as an instruction to re-invoke `cloneGitRepo`, not as an opinion about state. The comparison is case-insensitive on the SHA (some git remotes echo uppercase), so do not layer a second case-sensitive check on top.
- **`sshKey` is a per-call option, never a module-level default.** `cloneGitRepo` accepts an `sshKey` via `CloneOptions` OR as the legacy positional `string` (kept for compatibility with the Kilocode signature). `GIT_SSH_COMMAND` is set on the env for THAT call only; public HTTPS clones remain on the standard git config. Do not introduce a module-level `SSH_KEY` env-var read — the caller must decide, per identity, whether an SSH key is in play.
- **Tests live in `src/mcp/__tests__/git-resolver.test.ts`.** Colocation is deliberate: the suite is the only regression net for a security-sensitive module, so keeping it next to the SUT makes the review boundary obvious. Follow the `setGitRunner(mockRunner(...))` + `resetGitRunner()` + `fs.mkdtemp` + `afterEach` cleanup pattern for any new case. See [TESTING.md — Testing the MCP git plugin resolver](TESTING.md#testing-the-mcp-git-plugin-resolver-srcmcp__tests__git-resolvertestts) for the full pattern catalogue.
- **Do NOT introduce a second git wrapper for MCP.** `src/mcp/git-resolver.ts` is the single source of truth for shelling out to `git` from the MCP subsystem. If a future feature needs additional plumbing (`git fetch`, `git tag --list`, `git submodule update`), extend the resolver — do not add a parallel helper in `src/mcp/` that bypasses `validateRef` / `normalizeFileUrl` / `GitRunner`. The security review budget lives on one module, not two.

## Diagnostic output must go through `redact()`

Added in the 2026-09-24 sync (`src/cli/commands/debug/redact.ts`, port of opencode PR #50956). Any new diagnostic command that dumps configuration, environment variables, or provider metadata to stdout MUST route the payload through `redact()` before printing. Direct `console.log(config)` calls that could reach `AICORE_SERVICE_KEY`, `clientsecret`, or bearer tokens are treated as a security regression at review.

Contract for adding a diagnostic command:

- Import `redact` from `src/cli/commands/debug/redact.ts` — do NOT hand-roll a custom mask function. The pattern list is exported (`SECRET_KEY_PATTERNS` is module-private, but `isSecretKey` is exported so tests can assert on individual keys) and should be extended in that one file rather than duplicated per command.
- Prefer building a `buildRedactedSnapshot(): unknown` helper that assembles the shape, then feeding it through `redact()`. The `debug config` command follows this shape — `buildRedactedConfigSnapshot()` is testable without spawning Commander.
- Split the environment slice: filter `process.env` to the alexi-relevant prefix (`^(AICORE|SAP_PROXY|ALEXI)_` for now) BEFORE calling `redact`. This is defence-in-depth — if a new secret pattern is missed, unrelated shell secrets like `GITHUB_TOKEN` still never enter the pipeline.
- Adding a new secret pattern: append a regex to `SECRET_KEY_PATTERNS` in `src/cli/commands/debug/redact.ts` AND add a test case in the redact suite that asserts a key matching the new pattern is masked. Patterns are case-insensitive by convention; use `/pattern/i`.
- The one-line eslint escape `// eslint-disable-next-line no-console` for `console.log` in the debug command action is intentional and permitted — diagnostic output must render exactly, not go through the log router. This is one of the few call sites permitted to bypass `src/utils/logger.ts`.

## Session retention: never bypass the safety guards

`SessionManager.cleanupExpiredSessions` (`src/core/sessionManager.ts:828`) is destructive by construction — deleted sessions cannot be recovered. When editing the runner or the scheduler (`src/core/retentionScheduler.ts`), preserve these invariants:

- **Opt-in floor.** `retention.enabled === false` MUST short-circuit before any directory scan. Do not add code paths that scan the sessions directory when the policy is disabled.
- **Active-run guard.** `hasActiveRun(sessionId)` is populated by `beginSessionRun` / `endSessionRun`. A session with an in-flight run must NEVER be deleted regardless of its `metadata.updated` age. If a new code path bypasses `beginSessionRun` (e.g. a background subagent that runs off the main SessionManager), it MUST register its own in-flight state before the sweep can observe it.
- **Recent-write guard.** `RECENT_WRITE_WINDOW_MS = 3_600_000` (1 hour). A session whose LAST message `timestamp` falls inside this window is held back regardless of `metadata.updated`. Do not lower this window without a corresponding change to the sessionManager retention tests — the guard exists to catch sessions that were actively receiving writes right up to the age boundary.
- **Cooldown state is written BEFORE the sweep runs.** `triggerRetentionSweep` writes `~/.alexi/last-retention-run` first so an unhandled error inside `cleanupExpiredSessions` cannot cause the next startup to re-run immediately. Do not reorder these two operations.
- **`alexi sessions --cleanup` intentionally bypasses the 24h cooldown.** The flag is the operator escape hatch — for example, before rebuilding the FTS index or running a diagnostic pass. Do not gate the flag on `shouldRun()`.
- **Failures are best-effort and captured in `summary.errors[]`.** A single corrupted JSON blob or `EACCES` on delete must NEVER abort the sweep. New failure modes should be caught and pushed onto `summary.errors[]` with a descriptive message.

See [ARCHITECTURE.md — Session Retention Lifecycle](ARCHITECTURE.md#session-retention-lifecycle) for the pipeline diagram and [TESTING.md — `tests/core/sessionManager-retention.test.ts`](TESTING.md) for the regression contract.

## Agent Manager Worktree Status Registry

Introduced by commit `8b372ad7` (issue #1826). If you are adding a subsystem that needs to publish Agent Manager worktree lifecycle events into the TUI, or wiring a new consumer of the status panel, respect the invariants below. See [ARCHITECTURE.md - Agent Manager Worktree Status Registry](ARCHITECTURE.md#agent-manager-worktree-status-registry-issue-1826) for the runtime contract and [API.md - Worktree Status Registry API](API.md#worktree-status-registry-api) for the public TypeScript surface.

- **The registry is UI state, not transport state.** `src/agent/worktreeStatus.ts` has zero dependencies on `src/core/agent-manager/orchestration-api.ts` by design — that module is transport-layer forwarding, this one is the state consumed by the Sidebar. Do NOT add cross-imports; a new publisher on the transport side should call `setWorktreeStatus` explicitly, not reach into the orchestration API from the registry.
- **Every entry MUST reach the registry through `setWorktreeStatus` / `removeWorktreeStatus`.** The module-scoped `Map` and `Set` are intentionally not exported. Callers that need to seed state (e.g. from a persisted session index on TUI startup) must funnel every insert through `setWorktreeStatus` so the emit / freeze / de-duplication invariants fire uniformly.
- **Never remove an entry on `error`.** The "explicit deleted event drops the owner entry" clause from Kilocode PR #14487 is deliberate: an errored worktree stays visible until the operator dismisses it. If a new tear-down code path fires alongside an error emit, keep the emit-error and the remove separate — do not chain `setWorktreeStatus({ status: 'error' })` immediately followed by `removeWorktreeStatus(id)` in the same synchronous scope.
- **Redundant idempotent writes are free.** `setWorktreeStatus(id, update)` short-circuits when `(label, status, detail)` all match the current entry. Publishers that periodically re-affirm state (heartbeats, redundant `idle` events during a quiet period) do NOT need to de-duplicate at the call site. Do NOT introduce a caller-side cache — it would drift from the registry-side cache and defeat the freeze invariant.
- **The status vocabulary is a closed union.** If you need a new status, expand the union in `src/agent/worktreeStatus.ts` AND update `STATIC_STATUS_ICONS`, `statusColor`, and every switch that references `WorktreeStatus`. The `const _exhaustive: never = status` guard in `statusColor` and the exclusion in `STATIC_STATUS_ICONS`'s `Record<Exclude<WorktreeStatus, 'running'>, string>` type will fail compilation if any callsite is missed — treat those failures as required checklist items, not as bugs to patch out.
- **New TUI consumers use `useWorktreeStatus`, not `subscribe` directly.** The hook already handles the `useState` / `useEffect` / cleanup pattern correctly. A component that reaches into `subscribe(...)` directly is at risk of leaking a listener across a StrictMode double-mount or forgetting to seed state on the initial render.
- **Snapshot tests MUST pass `animateWorktrees={false}` to `<Sidebar />`.** The `ink-spinner` frame cycle is timing-dependent and would produce non-deterministic snapshot output. Follow the pattern in `tests/cli/tui/Sidebar.test.tsx` when adding new snapshot coverage that involves a `running` worktree.
- **Tests reset the registry in `beforeEach`.** The registry is a module-scoped singleton, so `beforeEach(() => __resetWorktreeStatusRegistry())` is required in every test file that touches it. Importing `__resetWorktreeStatusRegistry` directly from `src/agent/worktreeStatus.ts` (not through a barrel) is the documented pattern — it exists solely for tests and should never be reached from runtime code. See [TESTING.md - Testing the Worktree Status Registry](TESTING.md#testing-the-worktree-status-registry) for the full suite recipe.
- **Publisher on the orchestrator side handles the lifecycle transitions.** A minimal publisher publishes `running` at turn start, `blocked` around permission prompts / `question` tool calls, `idle` on normal completion, and `error` on unrecoverable failure — leaving the error entry in place until the operator dismisses it via `removeWorktreeStatus(id)`. Do NOT split the state machine across multiple publishers; if a new subsystem needs to influence a worktree's status, funnel its signal through the existing publisher rather than emitting from a second call site.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

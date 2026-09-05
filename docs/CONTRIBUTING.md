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

**Additional worked example — `experimental.sharedAgentBoard` (2026-09-03, ports upstream kilocode `162e30d23`).** The same shape is applied to gate the `kilo_board_read` / `kilo_board_write` tools. The registration site sits in `src/tool/tools/index.ts:118` inside `registerBuiltInTools()`, which reads the flag once per process and registers the tools only when the flag is on:

```typescript
export function registerBuiltInTools(): void {
  for (const tool of builtInTools) {
    registerTool(tool as Tool<any, any>);
  }
  if (getConfigSharedAgentBoard()) {
    registerTool(boardReadTool as Tool<any, any>);
    registerTool(boardWriteTool as Tool<any, any>);
  }
}
```

Prefer gating at **registration time** (as above) when the tool should be invisible to the model when the flag is off — the model does not learn about `kilo_board_*` at all when the flag is `false`, so it cannot mistakenly call them. Prefer gating at the **tool boundary** (returning a `success: false` error) when the tool is always present but its behaviour changes with the flag (e.g. per-task model selection on the `task` tool). Both patterns share the same `experimental.*` config helper contract.

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

The rules-discovery module (`src/config/rulesDiscovery.ts`) exemplifies the contract: `discoverRules({ workdir?, homedir?, customPaths?, silent? })` returns a `RulesDiscoveryResult` with `rules`, `allFiles`, `conflicts`, and `scannedDirs`; every branch that could throw is wrapped in a `try / catch` that degrades to `[]` or `null`; and `resetRulesDiscoveryLogCache()` in `src/agent/system.ts` is exposed only for tests.

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

Most recent worked example, 2026-09-02, commit `89b23fa5` (`style(ci): auto-fix lint/format issues [alexi-bot]`): a single-file Prettier reflow on `src/session/drain.ts` — the module-singleton `SessionDrainImpl` that guarantees background session work settles before a headless `alexi chat` or `alexi agent` process exits. Inside `drain(options: DrainOptions = {}): Promise<void>` at `src/session/drain.ts:125-128` the waiter-snapshot expression `const snapshot: TrackedWork[] = Array.from(this.pending.entries()).map(([id, promise]) => ({ id, promise }))` was reflowed from a hand-authored three-line form (with the `.map` argument list wrapped across two lines and the object literal on a single continuation) onto Prettier's preferred shape where `.map(([id, promise]) => ({` opens on the same line as the receiver and `id,` / `promise,` each occupy their own line before `}))` closes the call. The `TrackedWork` annotation and the immediately-following `Promise.allSettled(snapshot.map((entry) => entry.promise))` call are byte-identical. Semantic contract of `drain()` is unchanged: the drain remains one-shot per lifecycle (`this.drained` early return, terminal `this.drained = true; this.pending.clear();`), the waiter set is still snapshotted BEFORE awaiting so a handler that schedules follow-up work during its own settle cannot mutate the collection being iterated (upstream "snapshot drain waiters before resuming them" fix noted in the module header at lines 15-16), the 30-second default `timeoutMs` (`options.timeoutMs ?? 30_000`) is unchanged, the `timeoutMs > 0` branch still races `Promise.allSettled(...)` against a `setTimeout`-backed sentinel, the `timeoutMs === 0` branch still awaits `settle` indefinitely, and on timeout the drain still swallows late settle rejections via `settle.catch(...)` so unhandled rejections cannot fire after teardown. The companion `track(id, promise): () => void` no-op-when-drained early return, the auto-untrack `.catch(...).finally(() => this.pending.delete(id))` chain, the `untrack(id)`, `size()`, and test-only `__resetForTests()` methods, the `TrackedWork` and `DrainOptions` interfaces, and the exported `SessionDrain` module-level singleton (`export const SessionDrain = new SessionDrainImpl()`) are all untouched. Diff statistics: `1 file changed, 4 insertions(+), 3 deletions(-)`. `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`, and `npm run build` all remain green on the branch — the only observable delta is that `npm run format:check` now passes on this file where it previously reported a diff. This is the canonical worked example of the "reflow a `.map` callback whose object-literal argument spans two lines when the surrounding statement's return-type annotation forces the wrap" variant of the auto-fix pattern; when authoring similar `Array.from(...).map(([a, b]) => ({ a, b }))` idioms, prefer the Prettier-preferred continuation shape from the outset (`.map(([a, b]) => ({\n  a,\n  b,\n}))`) to avoid the auto-fix follow-up commit.

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

## Introducing Retry-Aware Modules

Any new module that calls out to SAP AI Core (or another network dependency) should:

1. Use `withRetry` from `src/core/session/retry.ts` for retries — do not roll your own loop.
2. Supply a `shouldRetry` predicate that consults the transient-vs-permanent contract in `AGENTS.md#error-classification-retry-vs-config-fix`. The canonical implementations live in `src/core/error-backoff.ts` — prefer `isRetryableError(err)` for the coarse "is this transient?" check; use `isRateLimitError`, `isXAICapacityError`, and `isPermanentAuthFailure` directly when you need to distinguish sub-cases (e.g. render a rate-limit-specific UX).
3. Tune `RetryOptions` for the workload: interactive chat uses the defaults (8 attempts × 30s cap); background jobs may prefer a lower `maxAttempts` and a higher `maxMs`.
4. In tests, pass `jitter: false` so the exponential curve is deterministic.

Never re-add unconditional retries. Retrying an expensive model call on a permanent failure (401, 403, 400, `model_not_found`) just burns tokens.

When adding a new transient-error classifier to `src/core/error-backoff.ts` (as with `isXAICapacityError` in 1.21.4), also wire it into `isRetryableError` so higher-level drivers pick it up automatically. Extend the transient-error table in `docs/ARCHITECTURE.md#error-classification-tables` and add a coverage matrix under `src/core/__tests__/error-backoff.test.ts` — a false positive here means real config failures get retried and waste provider budget, so the test suite must cover both positive and negative cases.

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

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

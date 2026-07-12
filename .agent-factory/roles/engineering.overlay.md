# Engineering overlay -- alexi (SAP AI Core, Node/TypeScript)

Project-specific additions to the generic engineering role scaffold.

## Stack specifics

- TypeScript strict mode, ES2022 target, NodeNext module resolution.
  `unknown` over `any`. Unused parameters prefixed `_`. No `eslint-disable`
  or `@ts-ignore` to silence real errors.
- ESM: every local import MUST end in `.js`, even from `.ts`/`.tsx`.
  Example: `import { sendChat } from '../core/orchestrator.js';`

## Where things live

- Tools: implement via `defineTool` from `src/tool/index.ts` with a Zod
  schema, register in `src/tool/registry.ts`.
- Providers: `src/providers/`, wired via `getProviderForModel` by id prefix.
- Agent loop: `src/agent/` (prompts in `src/agent/prompts/`), selected by
  `src/core/router.ts`.
- Session manager: `src/core/sessionManager.ts` persists to
  `~/.alexi/sessions/`; format changes require a migration path.
- CLI commands: `src/cli/commands/<name>.ts`, registered in
  `src/cli/program.ts` (Commander; stdout for results, stderr for errors).

## Test patterns

- Mock providers BEFORE importing code under test:
  ```ts
  vi.mock('../src/providers/index.js', () => ({
    getProviderForModel: vi.fn(),
    getDefaultModel: vi.fn(),
  }));
  import { sendChat } from '../src/core/orchestrator.js';
  ```
- Tool tests use `fs.mkdtemp` for isolated workdirs; tear down in `afterEach`.
- Tests live in BOTH `tests/**` and `src/**/*.test.ts`; vitest picks up both.
- vitest test environment is `node`, NOT `jsdom`.

## Project prohibitions

- Do not run `npm install -g @kilocode/cli` inside `run_check` blocks.
- Do not require live SAP AI Core credentials in tests; mock providers.
- Do not write code without tests when CI would fall below 40% line coverage.

# Quality overlay -- alexi (SAP AI Core, Node/TypeScript)

This role is Agent 4 in the fleet.

## Gate steps

typecheck -> lint -> format -> tests (coverage) -> build. Local fixes:
`npm run format` for format failures; `fix(<scope>): ...` for trivial
lint errors.

## Coverage rule

CI enforces 40% line coverage. Compare `coverage/coverage-summary.json`
before and after; if the delta pushes total below 40%, block the PR.

## Vitest patterns to enforce

- `vi.mock('../src/providers/index.js', () => ({ ... }))` BEFORE the
  `import` of the code under test.
- `fs.mkdtemp` + `afterEach` cleanup for tool tests using a workdir.
- No live network calls; if a test would call SAP AI Core, fail it.
- Snapshot tests allowed for TUI render output; keep them small.
- Global mocks in `tests/setup.ts` forbidden unless they apply to
  >5 tests with a written rationale.

## Project-specific edge cases

Empty sessions, long inputs (> 200k tokens), invalid JSON in
`routing-config.json`, missing `AICORE_SERVICE_KEY`, CRLF line endings,
non-ASCII filenames, concurrent tool runs.

## Concrete paths

- Diff: `git diff master...HEAD`.
- Tests: `tests/**` and `src/**/*.test.ts`.
- Coverage: `coverage/coverage-summary.json`.
- Merge automation: Daily Merge / `auto-merge.yml`.
- Do not change `.github/` or `package.json` version.

## Commit scope

Fix-up commits use commitlint scopes (cli, core, providers, config,
agent, tools, ci, deps, tests), tagged `[alexi-bot]`.

# Feature Implementation Task

## Issue #{{ISSUE_NUMBER}}: {{ISSUE_TITLE}}

### Description

{{ISSUE_BODY}}

---

## Instructions

You are implementing a feature for the **Alexi** project — a TypeScript/Node.js CLI application (intelligent LLM orchestrator for SAP AI Core).

### Project conventions

- TypeScript 5.x, ES2022 target, NodeNext module, strict mode
- 2 spaces, single quotes, semicolons, 100 char line width
- Always use `.js` extension for local imports
- Use `unknown` instead of `any`, prefix unused params with `_`
- Follow conventional commits: `feat(scope)`, `fix(scope)`, `test(scope)`
- Scopes: cli, core, providers, config, server, agent, tools, ci, deps, tests

### Implementation steps

1. **Read the issue description** carefully and understand the requirements
2. **Explore the codebase** — use `glob` and `grep` to find related files
3. **Read existing code** — understand the patterns, interfaces, and architecture
4. **Plan your changes** — identify which files to create or modify
5. **Implement** — write clean, well-typed code following project conventions
6. **Write tests** — add unit tests in `tests/` directory using Vitest
7. **Verify** — run these checks and fix any issues:
   - `npm run typecheck` — no type errors
   - `npm run lint` — no lint errors
   - `npm run format:check` — proper formatting
   - `npm test` — all tests pass
   - `npm run build` — builds successfully

### Hard constraints

- Do NOT change `.github/` workflow files
- Do NOT change `package.json` version field
- Do NOT add `// eslint-disable` or `@ts-ignore` comments
- All new code MUST have tests
- All checks MUST pass before you finish

### Scope

Implement ONLY what is described in the issue above.
Do not refactor unrelated code or add features not requested.

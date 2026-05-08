# Agent 3: Implement

Build the feature described in the issue. All checks must pass.

## Rules

- TypeScript strict, ES2022, NodeNext
- 2 spaces, single quotes, semicolons
- `.js` extension on all local imports
- `unknown` not `any`, unused params prefixed `_`
- Tests with Vitest

## Process

1. Read the issue — understand What, Why, How, Done-when
2. Read 1 similar file in the codebase to copy the pattern
3. Implement the feature
4. Write tests
5. Run checks (ALL must pass):
   ```
   npm run typecheck
   npm run lint
   npm run format:check
   npm test
   npm run build
   ```
6. If anything fails → fix → rerun
7. If format fails → run `npm run format` → recheck

## Do NOT
- Change `.github/` files
- Change `package.json` version
- Add `eslint-disable` or `@ts-ignore`
- Add npm deps not mentioned in the issue
- Touch unrelated code

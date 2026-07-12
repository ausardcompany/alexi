# Data overlay -- alexi (SAP AI Core, Node/TypeScript)

## Persistence

`~/.alexi/sessions/` holds one JSON file per session, written by
`src/core/sessionManager.ts`. Each session has an id, timestamps, message
array, and tool-call records. Do not log raw session contents; log
session ids only. Do not break read-compat without a migration.

## Driving config

`routing-config.json` matched against `routing-config.example.json`.
Keys include model aliases, fallback chains, capability matchers.
Document each in `docs/ROUTING.md`. Update the example + doc in the same
PR as any schema change.

## Cost / accounting

`src/core/costTracker.ts` carries pricing tables per model
(per-million-tokens input/output). SAP AI Core pricing differs from
upstream Anthropic -- verify against the SAP AI Core deployment
dashboard / admin API, NOT the public Anthropic page.

## Catalog / id discipline

Model ids look like `sap-ai-core/anthropic--claude-4.7-opus` (note the
double dash). Do not hallucinate ids. Model strings live in `src/config/`
(constitution III) and must not appear elsewhere. Verify via the SAP AI
Core deployment list.

## Behaviour tests

`tests/router*.test.ts` (routing), `tests/sessionManager*.test.ts`,
`tests/costTracker*.test.ts`.

## Paths, docs, scope, gate

- Owned paths: `routing-config.json`, `routing-config.example.json`,
  `src/core/sessionManager.ts`, `src/core/costTracker.ts`, `src/config/`.
- Docs: `docs/ROUTING.md`, `docs/CONFIGURATION.md`, `docs/PROVIDERS.md`.
- Scope: `core` or `config`.
- Gate: `npm run typecheck && npm run lint && npm test`.

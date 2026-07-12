# Security overlay -- alexi (SAP AI Core, Node/TypeScript)

## Secret scanner and credential shapes

gitleaks default ruleset plus a custom rule for the `AICORE_SERVICE_KEY`
JSON shape (`"clientid":`, `"clientsecret":`, `"url":` triplet). The full
service key is a JSON blob -- never log it, never paste it (even truncated).

## Secrets surface

`AICORE_SERVICE_KEY`, `AICORE_RESOURCE_GROUP`, `GH_PAT`, `NPM_TOKEN`,
`SAP_PROXY_*`. All live in GitHub Actions secrets and `.env` (gitignored);
`.env.example` documents shape only. Do not commit `.env` or anything
under `~/.alexi/`.

## Dependency-bot specifics

Dependabot. Known peer-dep trap: `marked` vs `marked-terminal` (burned us
twice). Audit tool: `npm audit` / `npm audit --json` / `npm audit --omit=dev`.
Never run `npm audit fix --force` blindly. Lockfile: `package-lock.json`.

## Permission layer

`src/permission/`; tests in `tests/permission*.test.ts`. `agentic-allow`
rules describe pre-approved automation paths.

## Principle alignment

Constitution principle I (SAP AI Core-First): provider SDK calls outside
`src/providers/` are a security finding.

## Paths, workflow, scopes

- Security workflow: `.github/workflows/security.yml`, scope `ci(ci)`.
- PR diffs of interest: `package.json`, `package-lock.json`,
  `src/permission/`, `src/mcp/`, `**/auth*`, `**/credential*`.
- Docs: `docs/permission-system.md`, `docs/permission-prompt-quick-ref.md`.
- Fix scopes: `fix(core)`, `fix(tools)`; findings issue label: `security`.

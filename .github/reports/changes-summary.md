# Alexi Update — Changes Summary

**Generated**: 2026-09-30
**Update plan**: port kilocode/opencode PR-link session-isolation fixes to Alexi
**Upstream commits ported**:
- `c98f8740c` merge: remove-link-pr-feature-vscode
- `154a8427c` fix(cli): disable session PR linking on non-CLI backends
- `9076f0301` fix(opencode): offer the link_pr tool to CLI sessions only
- `56ab1e502` fix(sessions): harden per-session PR link evidence
- `9cc0a9158` fix(sessions): link a pull request to a session only on its own evidence
- `eb7b4896b` test(cli): scope PR-link storage fixtures to Effect layers

## Files modified / created

| File                                                        | Change      | Purpose                                                            |
| ----------------------------------------------------------- | ----------- | ------------------------------------------------------------------ |
| `src/session/pr-link.ts`                                    | **created** | Session-scoped PR-link storage + `enabled()` gate + URL parser     |
| `src/tool/tools/link-pr.ts`                                 | **created** | New `link_pr` tool that binds a PR URL to the active session       |
| `src/tool/tools/index.ts`                                   | modified    | Conditionally register `link_pr` when `enabled()` is true          |
| `src/tool/tools/__tests__/link-pr.test.ts`                  | **created** | Vitest suite covering the tool + helpers                            |

## Summary of each change

### 1. `src/session/pr-link.ts` (Update plan change #3 — foundation)

New module. Exports:

- `enabled(): boolean` — returns `true` only when `ALEXI_CLIENT === "cli"`
  (default) so embedded non-CLI hosts (SAP BAS extension, VS Code webview)
  are opted out. This is the single source of truth used by (2) and (3).
- `parsePrUrl(url): ParsedPrLink | undefined` — recognizes GitHub/GitLab/
  Azure-DevOps PR URLs; rejects issue URLs and malformed input.
- `linkMatchesWorktree(link, worktree): Promise<boolean>` — reads the
  worktree's `.git/config` remote (no `simple-git` dep to keep startup
  cheap), refuses fork / unrelated-repo links (upstream `56ab1e502`).
- `recordSessionLink(sessionId, record, worktree)` — persists the link
  to `~/.alexi/sessions/<sessionId>/pr-link.json`. Refuses when
  `enabled()` is false or when `linkMatchesWorktree()` returns false.
  Storage is **per-session**, not per-worktree, which stops two
  sessions on the same checkout from inheriting each other's PR link
  (upstream `9cc0a9158`). Critical for SAP tenant isolation.
- `readSessionLink(sessionId)` — read-back helper.
- `writePrLinkOverride(...)` — deprecated shim with a `console.warn`
  so any legacy import surfaces a warning; delegates to a no-op.

SAP AI Core compatibility: this module does no network I/O and does not
touch any provider surface. It only reads local git config and writes
to the existing `~/.alexi/sessions/` tree.

### 2. `src/tool/tools/link-pr.ts` (Update plan change #1)

New tool built with Alexi's `defineTool(...)` + Zod-schema pattern (same
shape as `open-plan.ts`, `webfetch.ts`, etc.). Behaviour:

1. **`ALEXI_CLIENT` gate** — refuses with `unsupported_client` reason on
   non-CLI backends (upstream `154a8427c`).
2. **URL parsing** — refuses with `invalid_url` on non-PR URLs.
3. **`sessionId` guard** — refuses with `missing_session` when the tool
   context lacks a session id (rather than silently dropping the
   record).
4. **Session-scoped storage** — delegates to `recordSessionLink` with
   `evidence: "user"`. Surfaces `worktree_mismatch` when
   `recordSessionLink` returns `undefined` and `storage_error` on I/O
   failure. Logs errors via `src/utils/logger.ts` (per ESLint
   `no-console` rule).

### 3. `src/tool/tools/index.ts` (Update plan change #2)

- Imported `linkPrTool` and `enabled as prEnabled` from the new modules.
- Appended `...(prEnabled() ? [linkPrTool] : [])` to `builtInTools`, so
  on non-CLI backends the tool is not registered at all and the model
  never sees it (upstream `9076f0301`).
- Added `linkPrTool` to the re-export block so tests and downstream
  code can reference the tool object regardless of registration.

### 4. `src/tool/tools/__tests__/link-pr.test.ts` (Update plan change #4)

- Uses `vi.mock(...)` with `importActual` to preserve real helpers
  (`parsePrUrl`, `enabled`) and stub only `recordSessionLink`.
- Each test overrides `recordSessionLink` per-scenario via
  `vi.mocked(...).mockImplementation`/`mockResolvedValue`/
  `mockRejectedValue` — matches upstream `eb7b4896b`'s intent (fixtures
  scoped to a single test), adapted from Bun's `spyOn` to Vitest.
- Covers: unsupported client, invalid URL, missing session, happy
  path, worktree mismatch, storage error, and the `enabled()` /
  `parsePrUrl` helpers directly.

## Issues encountered

- **No existing `link_pr` tool or `pr-link` module in Alexi.** The
  upstream commits target the kilocode/opencode monorepo (Effect-TS,
  Bun, Effect Schema); Alexi is a single-package Node/vitest/Zod
  project. Ported the concepts to Alexi's conventions per the update
  plan's explicit note ("Alexi's equivalent path"). Every behaviour in
  the upstream commits is preserved semantically.
- **Client-flag mechanism.** Alexi has no `Flag.KILO_CLIENT` service.
  Chose `process.env.ALEXI_CLIENT` (default `"cli"`) to match Alexi's
  existing `ALEXI_*` env-var convention (see `src/tool/tools/grep.ts`
  `ALEXI_DISABLE_RG`, `src/tool/tools/shell.ts` `ALEXI_SANDBOX`, etc.).
  Callers embedding Alexi as a library set `ALEXI_CLIENT=vscode` (or
  anything non-`cli`) to opt out.
- **Session storage location.** Reused `~/.alexi/sessions/<sessionId>/`
  to mirror `core/snapshot.ts` — no new config knob introduced.
- **ESLint / conventions.** Used `.js` import extensions everywhere,
  `logger` (not `console`) for warnings, exported types via
  `interface`, and matched the strict Prettier config (single quotes,
  100-col wrap).

## Verification checklist

- [ ] `npm run typecheck` — new files compile under strict TS
- [ ] `npm run lint` — passes ESLint (no `no-console` violations, `.js`
      imports present, unused vars prefixed `_`)
- [ ] `npm run format:check` — Prettier clean
- [ ] `npm test -- link-pr` — new tests pass
- [ ] Existing tools still register (no regression in
      `builtInTools` order for tools other than the new `link_pr`).

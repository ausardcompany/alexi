# Tasks - 2026-10-25 Planning Cycle

Derived from: `.github/research/2026-10-25-plan.md`

## Task 1: Plugin Activation Gate (plugin, race-condition, heisenbug)

**Size**: MEDIUM (~4-6h)  
**Priority**: HIGH (Value/Effort = HIGH/MEDIUM)  
**Category**: plugin

### Implementation Steps

1. **Audit plugin lifecycle** (`src/plugin/index.ts`)
   - Trace registration → activation flow
   - Identify async gaps where tools may be invoked before activation completes
   - Document current assumptions (tools available immediately after registration?)

2. **Add activation gate** (`src/plugin/index.ts`)
   - Add `activate(): Promise<void>` method to plugin interface
   - Implement timeout wrapper (default 5s) to prevent indefinite hangs
   - Return readiness Promise that resolves when all async setup completes

3. **Inject orchestrator wait** (`src/core/orchestrator.ts`)
   - Before first tool call in a session, await plugin activation gate
   - Add one-time check per session (cache "plugins ready" flag)
   - Emit warning if activation exceeds timeout

4. **Update dynamic tool injection** (`src/tool/plugin-tools.ts`)
   - Ensure plugin-provided tools are NOT added to registry until activation completes
   - Add guard: if tool requested before plugin ready → throw descriptive error

5. **Test coverage** (`src/plugin/__tests__/activation.test.ts` + `tests/orchestrator.test.ts`)
   - Unit: plugin activation Promise resolves/rejects/times out
   - Integration: orchestrator waits for plugins before first tool call
   - Regression: plugin tool invoked before activation → clear error message

### Files Modified
- `src/plugin/index.ts` (activation interface + gate)
- `src/tool/plugin-tools.ts` (tool injection guard)
- `src/core/orchestrator.ts` (orchestrator wait)
- `src/plugin/__tests__/activation.test.ts` (new test file)
- `tests/orchestrator.test.ts` (integration test)

### Acceptance Criteria
- [ ] Plugin interface has `activate(): Promise<void>` method
- [ ] Orchestrator waits for plugins ready before first tool call
- [ ] Timeout (5s default) prevents indefinite hangs
- [ ] Plugin tool invoked before activation → descriptive error
- [ ] Tests cover: resolve, reject, timeout, orchestrator wait
- [ ] CI passes: lint, typecheck, format, test:coverage (40%), build

---

## Task 2: Subagent Edit-Tool Config Inheritance (agent, tool, config, inheritance)

**Size**: MEDIUM (~6-8h)  
**Priority**: MEDIUM (Value/Effort = MEDIUM/MEDIUM)  
**Category**: tool

### Implementation Steps

1. **Audit current config flow** (`src/session/sessionContext.ts`, `src/config/index.ts`)
   - Trace session config propagation from parent → child (subagent spawn)
   - Check if edit-tool preferences (diff-edit vs full-file-edit, custom instructions) are copied
   - Document gap: are tool-specific configs inherited?

2. **Compare with upstream Kilocode** (reference PR from 2026-10-19 research)
   - Identify Kilocode's fix pattern (explicit config copy at spawn time?)
   - Note any Alexi-specific differences (Kilocode uses Effect-TS, Alexi uses plain TS)

3. **Add explicit config inheritance** (`src/core/agent-manager/*.ts`)
   - When spawning subagent, copy parent's edit-tool config to child session context
   - Include: `diffEdit`, `fullFileEdit`, `editInstructions`, `maxEditLines` (if exists)
   - Preserve override: child-specific config (if passed) takes precedence over inherited

4. **Test coverage** (`src/core/agent-manager/__tests__/config-inheritance.test.ts`)
   - Unit: parent config copied to child session
   - Integration: nested subagent (grandparent → parent → child) inherits correctly
   - Override: child-specific config overrides inherited values

5. **Regression check** (`tests/agent-manager.test.ts`)
   - Run existing agent-manager tests to ensure no breakage
   - Add explicit test: edit tool behavior in subagent matches parent

### Files Modified
- `src/core/agent-manager/*.ts` (subagent spawn logic)
- `src/session/sessionContext.ts` (config inheritance)
- `src/tool/edit.ts` (if config reading needs update)
- `src/core/agent-manager/__tests__/config-inheritance.test.ts` (new test)
- `tests/agent-manager.test.ts` (regression test)

### Acceptance Criteria
- [ ] Audit confirms gap (or confirms no gap — if no gap, close issue)
- [ ] Parent edit-tool config copied to child session at spawn time
- [ ] Nested hierarchies (3+ levels) inherit correctly
- [ ] Child-specific config overrides inherited values
- [ ] Tests cover: single-level, multi-level, override
- [ ] CI passes: lint, typecheck, format, test:coverage (40%), build

---

## Task 3: MCP Parallel Shutdown (mcp, perf, shutdown)

**Size**: SMALL (~2-3h)  
**Priority**: LOW (Value/Effort = LOW/SMALL)  
**Category**: mcp

### Implementation Steps

1. **Audit current shutdown** (`src/mcp/index.ts`)
   - Locate sequential MCP server shutdown loop
   - Measure latency: N servers × avg shutdown time = total delay

2. **Replace with parallel shutdown** (`src/mcp/index.ts`)
   - Change `for await (const server of servers)` → `Promise.all(servers.map(s => s.shutdown()))`
   - Add per-server timeout (5s default) to prevent one stuck server from blocking others
   - Use `Promise.allSettled` to collect all results (succeed or fail individually)

3. **Handle shutdown errors gracefully** (`src/mcp/index.ts`)
   - Log individual server shutdown failures (don't throw)
   - Continue shutting down remaining servers even if one fails

4. **Test coverage** (`src/mcp/__tests__/shutdown.test.ts`)
   - Unit: parallel shutdown completes in max(individual times), not sum
   - Timeout: one stuck server times out, others complete
   - Error: one server throws, others shut down successfully

### Files Modified
- `src/mcp/index.ts` (parallel shutdown logic)
- `src/session/sessionClose.ts` (if shutdown orchestration needs update)
- `src/mcp/__tests__/shutdown.test.ts` (new test)

### Acceptance Criteria
- [ ] MCP servers shut down in parallel (Promise.all)
- [ ] Per-server timeout (5s default) prevents hangs
- [ ] Individual failures logged, don't block other servers
- [ ] Tests cover: parallel timing, timeout, error handling
- [ ] CI passes: lint, typecheck, format, test:coverage (40%), build

---

## Task 4: Dependabot Floor Lifts Audit (deps, security, dependabot)

**Size**: SMALL (~2-3h)  
**Priority**: LOW (Value/Effort = LOW/SMALL unless advisories exist)  
**Category**: config

### Implementation Steps

1. **Run security audit** (local)
   - `npm audit` → check for HIGH/CRITICAL advisories
   - Cross-reference with `.github/dependabot.yml` ignore rules

2. **Identify safe lifts** (manual review)
   - For each ignored major version bump, check:
     - Is there an open advisory?
     - What breaking changes exist in the new major?
     - Can we lift without breaking Alexi?
   - Prioritize: security advisories > breaking-change compatibility

3. **Lift floors selectively** (`.github/dependabot.yml`, `package.json`)
   - Remove ignore rule for packages with open advisories (if upgrade is safe)
   - Test locally: `npm install` + full CI gate sequence
   - Document why each lift is safe (commit message)

4. **Verify no regressions** (local)
   - Run full CI sequence: `npm run lint && npm run typecheck && npm run format:check && npm run test:coverage && npm run build`
   - If any gate fails, revert lift and document why

### Files Modified
- `.github/dependabot.yml` (remove selective ignore rules)
- `package.json` (version bumps if manual upgrade needed)
- `package-lock.json` (lockfile regenerated by npm)

### Acceptance Criteria
- [ ] `npm audit` run shows no new HIGH/CRITICAL advisories after lifts
- [ ] Only packages with open advisories OR trivial breaking changes are lifted
- [ ] Full CI gate passes locally before commit
- [ ] Commit message documents rationale for each lift
- [ ] CI passes: lint, typecheck, format, test:coverage (40%), build

---

## Task 5: Known Throttle Detection (provider, error-backoff, rate-limit)

**Size**: SMALL (~2-3h)  
**Priority**: MEDIUM (Value/Effort = MEDIUM/SMALL)  
**Category**: provider

### Implementation Steps

1. **Audit current throttle detection** (`src/core/error-backoff.ts`)
   - Review `isRateLimitError()` function (lines 92-105)
   - Identify: does it already distinguish "known throttle" (e.g., `Retry-After` header) from generic 429?

2. **Add known throttle pattern** (`src/core/error-backoff.ts`)
   - Extract `Retry-After` header from rate-limit errors (if present)
   - Add `isKnownThrottle(err): boolean` helper that checks for `Retry-After` or provider-specific throttle signals
   - Update `isFatal()` logic: known throttles are NOT fatal (transient), but missing `Retry-After` may be (depends on provider)

3. **Prevent overflow compaction** (`src/core/compaction.ts` or orchestrator)
   - When a known throttle is detected, mark it as "expected delay" (not overflow-trigger)
   - Ensure context compaction is NOT triggered by a known throttle response

4. **Test coverage** (`src/core/__tests__/error-backoff.test.ts`)
   - Unit: known throttle (with `Retry-After`) detected correctly
   - Unit: generic 429 (no `Retry-After`) handled separately
   - Integration: known throttle does NOT trigger overflow compaction

### Files Modified
- `src/core/error-backoff.ts` (known throttle detection)
- `src/core/compaction.ts` (if overflow trigger needs update)
- `src/core/__tests__/error-backoff.test.ts` (test coverage)

### Acceptance Criteria
- [ ] `isKnownThrottle(err)` helper added to `error-backoff.ts`
- [ ] `Retry-After` header extracted from rate-limit errors
- [ ] Known throttles do NOT trigger overflow compaction
- [ ] Tests cover: known throttle detection, generic 429, compaction behavior
- [ ] CI passes: lint, typecheck, format, test:coverage (40%), build

---

## Summary Table

| # | Task                              | Category  | Size   | Priority | Effort | Impact |
|---|-----------------------------------|-----------|--------|----------|--------|--------|
| 1 | Plugin Activation Gate            | plugin    | MEDIUM | HIGH     | 4-6h   | HIGH   |
| 2 | Subagent Edit-Tool Inheritance    | tool      | MEDIUM | MEDIUM   | 6-8h   | MEDIUM |
| 3 | MCP Parallel Shutdown             | mcp       | SMALL  | LOW      | 2-3h   | LOW    |
| 4 | Dependabot Floor Lifts Audit      | config    | SMALL  | LOW      | 2-3h   | LOW    |
| 5 | Known Throttle Detection          | provider  | SMALL  | MEDIUM   | 2-3h   | MEDIUM |

**Total estimated effort**: 16-23 hours  
**Implementation cap**: 5 issues (as specified in task prompt)

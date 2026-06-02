/**
 * Integration tests for plugin `command`-source rule contributions
 * (B007 / parent tracker #633).
 *
 * Exercises the full path:
 *
 *   plugin.json manifest
 *     → PluginManager.loadFromManifest (resolves rule descriptors)
 *     → materializeCommandRule (spawns + caches stdout per scope)
 *     → buildAssembledSystemPrompt (formats rules into the prompt block)
 *
 * Cases (verbatim from the issue body):
 *   1. Happy path: a fixture plugin declares a `command` rule; output
 *      reaches the assembled system prompt verbatim.
 *   2. Timeout: command exceeds `timeoutMs`; rule omitted from the prompt
 *      content (it carries a truncation marker only), error logged, and
 *      a sibling inline rule still loads.
 *   3. Oversized stdout: > 32 KB output → truncated at 32 KB with a single
 *      trailing line noting truncation; the prompt receives the truncated
 *      content.
 *   4. `scope: 'session'` cache: same session id reuses the cached output
 *      across two loader invocations; a different session id triggers a
 *      re-spawn.
 *   5. `scope: 'always'` cache: subsequent calls (any session) do not
 *      re-spawn for the lifetime of the test process.
 *   6. Secret denylist: a `command` rule whose argv echoes
 *      `process.env.AICORE_SERVICE_KEY` returns empty (env stripped). The
 *      env value is set via `vi.stubEnv` so we don't depend on real
 *      credentials (per AGENTS.md §"Environment").
 *
 * The lower-level component tests (schema, tokenizer, env scrubber, raw
 * runner) live in `tests/plugin/ruleCommand.test.ts` — this file
 * intentionally drives the manifest → prompt-assembly path end-to-end so
 * regressions in the assembly glue layer surface here.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  PluginManager,
  clearRuleCommandCache,
  materializeCommandRule,
  type ResolvedPluginRule,
} from '../index.js';
import { buildAssembledSystemPrompt } from '../../agent/system.js';
import logger from '../../utils/logger.js';

const NODE = process.execPath;

/**
 * Counter-script body. Each spawn reads, increments, and rewrites the
 * counter file at `counterPath`, then writes the rule body to stdout. The
 * counter file lets the test observe the *real* spawn count without
 * monkey-patching `child_process`.
 */
function counterScript(counterPath: string, body: string): string {
  return [
    `const fs = require('fs');`,
    `let n = 0;`,
    `try { n = parseInt(fs.readFileSync(${JSON.stringify(counterPath)}, 'utf-8'), 10) || 0; } catch {}`,
    `n += 1;`,
    `fs.writeFileSync(${JSON.stringify(counterPath)}, String(n));`,
    `process.stdout.write(${JSON.stringify(body)});`,
  ].join('');
}

function readCounter(file: string): number {
  try {
    return parseInt(fs.readFileSync(file, 'utf-8'), 10) || 0;
  } catch {
    return 0;
  }
}

function writeManifest(pluginRoot: string, manifest: Record<string, unknown>): void {
  fs.mkdirSync(pluginRoot, { recursive: true });
  fs.writeFileSync(path.join(pluginRoot, 'plugin.json'), JSON.stringify(manifest, null, 2));
}

/**
 * Materialize a list of resolved rules. Inline / file rules are passed
 * through unchanged; `command` rules are resolved via
 * {@link materializeCommandRule} so the cache is exercised end-to-end.
 */
async function materializeAll(
  rules: ResolvedPluginRule[],
  sessionId?: string
): Promise<ResolvedPluginRule[]> {
  return Promise.all(
    rules.map(async (rule) => {
      if (rule.source !== 'command') {
        return rule;
      }
      const content = await materializeCommandRule(rule, sessionId);
      return { ...rule, content };
    })
  );
}

describe('plugin rule contributions — command source (integration)', () => {
  let tmpdir: string;
  let projectRoot: string;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-rule-cmd-int-'));
    projectRoot = path.join(tmpdir, 'project');
    fs.mkdirSync(projectRoot, { recursive: true });
    clearRuleCommandCache();
    warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    clearRuleCommandCache();
    fs.rmSync(tmpdir, { recursive: true, force: true });
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  // -------------------------------------------------------------------------
  // 1. Happy path
  // -------------------------------------------------------------------------
  it('happy path: command stdout reaches the assembled system prompt verbatim', async () => {
    const pluginRoot = path.join(projectRoot, 'happy-plugin');
    const RULE_BODY = '# Today\n- ship feature B007\n- write integration tests';
    writeManifest(pluginRoot, {
      name: 'happy-plugin',
      version: '0.0.1',
      rules: [
        {
          name: 'todos',
          source: 'command',
          argv: [NODE, '-e', `process.stdout.write(${JSON.stringify(RULE_BODY)})`],
        },
      ],
    });

    const mgr = new PluginManager(projectRoot);
    const loadResult = await mgr.loadFromManifest(pluginRoot);
    expect(loadResult.success).toBe(true);

    const enabled = mgr.getEnabledRules();
    const materialized = await materializeAll(enabled, 'sess-happy');
    expect(materialized[0].content).toBe(RULE_BODY);

    const prompt = buildAssembledSystemPrompt({
      workdir: projectRoot,
      skipEnv: true,
      skipAgentsMd: true,
      pluginRules: materialized,
    });

    // Verbatim: the entire rule body appears in the prompt as-is.
    expect(prompt).toContain(RULE_BODY);
    // And it's wrapped in the per-plugin section header so the model can
    // attribute the guidance.
    expect(prompt).toContain('## Rules from plugin "happy-plugin"');
  });

  // -------------------------------------------------------------------------
  // 2. Timeout — sibling inline rule must survive
  // -------------------------------------------------------------------------
  it('timeout: failing command rule does not block sibling inline rules', async () => {
    const pluginRoot = path.join(projectRoot, 'timeout-plugin');
    const SIBLING_BODY = 'inline rule body — must survive sibling timeout';
    writeManifest(pluginRoot, {
      name: 'timeout-plugin',
      version: '0.0.1',
      rules: [
        {
          name: 'slow',
          source: 'command',
          // Print nothing, sleep well past timeoutMs.
          argv: [NODE, '-e', 'setTimeout(() => {}, 5000)'],
          timeoutMs: 100,
        },
        {
          name: 'survivor',
          source: 'inline',
          content: SIBLING_BODY,
        },
      ],
    });

    const mgr = new PluginManager(projectRoot);
    const loadResult = await mgr.loadFromManifest(pluginRoot);
    expect(loadResult.success).toBe(true);

    const enabled = mgr.getEnabledRules();
    expect(enabled).toHaveLength(2);
    const materialized = await materializeAll(enabled, 'sess-timeout');

    const prompt = buildAssembledSystemPrompt({
      workdir: projectRoot,
      skipEnv: true,
      skipAgentsMd: true,
      pluginRules: materialized,
    });

    // The sibling inline rule must reach the prompt regardless of the
    // command rule's failure mode.
    expect(prompt).toContain(SIBLING_BODY);

    // The command rule's failure must have been logged via logger.warn.
    const warnCalls = warnSpy.mock.calls.map((args: unknown[]) => String(args[0]));
    const sawTimeoutWarn = warnCalls.some(
      (m: string) => m.includes('timeout-plugin/slow') && m.toLowerCase().includes('timed out')
    );
    expect(sawTimeoutWarn).toBe(true);
  });

  // -------------------------------------------------------------------------
  // 3. Oversized stdout — truncated at 32 KB with a single trailing marker
  // -------------------------------------------------------------------------
  it('oversized stdout: prompt receives 32 KB-truncated content with a single trailing marker', async () => {
    const pluginRoot = path.join(projectRoot, 'oversize-plugin');
    // Emit ~64 KB of a recognisable byte so we can verify truncation
    // happened at the cap boundary.
    const SCRIPT = 'process.stdout.write("A".repeat(64*1024))';
    writeManifest(pluginRoot, {
      name: 'oversize-plugin',
      version: '0.0.1',
      rules: [
        {
          name: 'big',
          source: 'command',
          argv: [NODE, '-e', SCRIPT],
        },
      ],
    });

    const mgr = new PluginManager(projectRoot);
    const loadResult = await mgr.loadFromManifest(pluginRoot);
    expect(loadResult.success).toBe(true);

    const enabled = mgr.getEnabledRules();
    const materialized = await materializeAll(enabled, 'sess-big');

    const ruleContent = materialized[0].content;
    // Truncation marker appended exactly once, on its own trailing line.
    // The marker is `\n\n[... truncated: ...]`, so the captured stdout body
    // ends right before the leading `\n\n` separator.
    const TRUNC_MARKER = '[... truncated: command rule stdout exceeded cap ...]';
    const FULL_MARKER = `\n\n${TRUNC_MARKER}`;
    expect(ruleContent).toContain(TRUNC_MARKER);
    const markerOccurrences = ruleContent.split(TRUNC_MARKER).length - 1;
    expect(markerOccurrences).toBe(1);
    // The captured stdout body (everything before the marker's leading
    // separator) must respect the 32 KB cap exactly.
    const stdoutBody = ruleContent.slice(0, ruleContent.indexOf(FULL_MARKER));
    expect(Buffer.byteLength(stdoutBody, 'utf-8')).toBeLessThanOrEqual(32 * 1024);
    // And it must be substantial — close to (but not over) the cap, since
    // the upstream emitted ~64 KB.
    expect(Buffer.byteLength(stdoutBody, 'utf-8')).toBeGreaterThan(16 * 1024);

    const prompt = buildAssembledSystemPrompt({
      workdir: projectRoot,
      skipEnv: true,
      skipAgentsMd: true,
      pluginRules: materialized,
    });

    // The prompt receives the truncated content plus the single marker.
    expect(prompt).toContain(TRUNC_MARKER);
    expect(prompt.split(TRUNC_MARKER).length - 1).toBe(1);

    // Logger should have flagged the truncation.
    const warnCalls = warnSpy.mock.calls.map((args: unknown[]) => String(args[0]));
    expect(warnCalls.some((m: string) => m.includes('oversize-plugin/big'))).toBe(true);
  });

  // -------------------------------------------------------------------------
  // 4. `scope: 'session'` cache
  // -------------------------------------------------------------------------
  it('scope: "session" cache — same session reuses, different session re-spawns', async () => {
    const pluginRoot = path.join(projectRoot, 'session-plugin');
    const counter = path.join(tmpdir, 'counter-session');
    writeManifest(pluginRoot, {
      name: 'session-plugin',
      version: '0.0.1',
      rules: [
        {
          name: 'sess-rule',
          source: 'command',
          // scope defaults to 'session' for command rules — assert via the
          // schema-default path rather than passing it explicitly.
          argv: [NODE, '-e', counterScript(counter, 'session-rule-body')],
        },
      ],
    });

    const mgr = new PluginManager(projectRoot);
    const loadResult = await mgr.loadFromManifest(pluginRoot);
    expect(loadResult.success).toBe(true);
    expect(mgr.getEnabledRules()[0].scope).toBe('session');

    // Two materializations under the same session id → single spawn.
    const a1 = await materializeAll(mgr.getEnabledRules(), 'sess-A');
    const a2 = await materializeAll(mgr.getEnabledRules(), 'sess-A');
    expect(a1[0].content).toBe('session-rule-body');
    expect(a2[0].content).toBe('session-rule-body');
    expect(readCounter(counter)).toBe(1);

    // Different session id → re-spawn.
    const b1 = await materializeAll(mgr.getEnabledRules(), 'sess-B');
    expect(b1[0].content).toBe('session-rule-body');
    expect(readCounter(counter)).toBe(2);

    // Re-using sess-B keeps the cache warm.
    const b2 = await materializeAll(mgr.getEnabledRules(), 'sess-B');
    expect(b2[0].content).toBe('session-rule-body');
    expect(readCounter(counter)).toBe(2);

    // The fully-assembled prompt still carries the rule.
    const prompt = buildAssembledSystemPrompt({
      workdir: projectRoot,
      skipEnv: true,
      skipAgentsMd: true,
      pluginRules: b2,
    });
    expect(prompt).toContain('session-rule-body');
  });

  // -------------------------------------------------------------------------
  // 5. `scope: 'always'` cache
  // -------------------------------------------------------------------------
  it('scope: "always" cache — never re-spawns for the lifetime of the test process', async () => {
    const pluginRoot = path.join(projectRoot, 'always-plugin');
    const counter = path.join(tmpdir, 'counter-always');
    writeManifest(pluginRoot, {
      name: 'always-plugin',
      version: '0.0.1',
      rules: [
        {
          name: 'always-rule',
          source: 'command',
          scope: 'always',
          argv: [NODE, '-e', counterScript(counter, 'always-rule-body')],
        },
      ],
    });

    const mgr = new PluginManager(projectRoot);
    const loadResult = await mgr.loadFromManifest(pluginRoot);
    expect(loadResult.success).toBe(true);
    expect(mgr.getEnabledRules()[0].scope).toBe('always');

    // First materialization populates the cache.
    const first = await materializeAll(mgr.getEnabledRules(), 'sess-X');
    expect(first[0].content).toBe('always-rule-body');
    expect(readCounter(counter)).toBe(1);

    // Subsequent calls — including from a different session id — must not
    // re-spawn. The counter file is the source of truth.
    await materializeAll(mgr.getEnabledRules(), 'sess-X');
    await materializeAll(mgr.getEnabledRules(), 'sess-Y');
    await materializeAll(mgr.getEnabledRules(), undefined);
    expect(readCounter(counter)).toBe(1);

    // Even after dropping a session-scoped cache entry, the always-cache
    // remains intact.
    clearRuleCommandCache('sess-X');
    const final = await materializeAll(mgr.getEnabledRules(), 'sess-Z');
    expect(final[0].content).toBe('always-rule-body');
    expect(readCounter(counter)).toBe(1);

    const prompt = buildAssembledSystemPrompt({
      workdir: projectRoot,
      skipEnv: true,
      skipAgentsMd: true,
      pluginRules: final,
    });
    expect(prompt).toContain('always-rule-body');
  });

  // -------------------------------------------------------------------------
  // 6. Secret denylist — AICORE_SERVICE_KEY must not leak into a rule
  // -------------------------------------------------------------------------
  it('secret denylist: AICORE_SERVICE_KEY is stripped from the spawned env', async () => {
    // Use a fake env value via vi.stubEnv so the test doesn't depend on
    // real SAP credentials (per AGENTS.md §"Environment").
    const FAKE_SECRET = 'fake-aicore-service-key-do-not-leak';
    vi.stubEnv('AICORE_SERVICE_KEY', FAKE_SECRET);

    const pluginRoot = path.join(projectRoot, 'secret-plugin');
    // The script echoes the env var as seen by the child. With the secret
    // scrub in place, the variable is undefined and we emit the empty
    // string.
    const SCRIPT = 'process.stdout.write(process.env.AICORE_SERVICE_KEY || "")';
    writeManifest(pluginRoot, {
      name: 'secret-plugin',
      version: '0.0.1',
      rules: [
        {
          name: 'leaky',
          source: 'command',
          argv: [NODE, '-e', SCRIPT],
        },
      ],
    });

    const mgr = new PluginManager(projectRoot);
    const loadResult = await mgr.loadFromManifest(pluginRoot);
    expect(loadResult.success).toBe(true);

    const enabled = mgr.getEnabledRules();
    const materialized = await materializeAll(enabled, 'sess-secret');

    // The rule's content must be empty — the secret env var was scrubbed
    // before spawn, so the child saw `undefined`.
    expect(materialized[0].content).toBe('');

    const prompt = buildAssembledSystemPrompt({
      workdir: projectRoot,
      skipEnv: true,
      skipAgentsMd: true,
      pluginRules: materialized,
    });

    // Critical: the fake secret must NOT appear anywhere in the assembled
    // prompt.
    expect(prompt).not.toContain(FAKE_SECRET);

    // Empty-content rules are dropped from the prompt block (see
    // formatPluginRules), so the per-plugin header is also absent for this
    // plugin in this case.
    expect(prompt).not.toContain('## Rules from plugin "secret-plugin"');
  });
});

/**
 * Tests for B005 — strict loader wiring inside
 * `resolvePluginRulesForPrompt` (`src/plugin/index.ts`).
 *
 * Verifies the contract from issue #652:
 *   - When no active session is available, a synthetic `'no-session'` id is
 *     used so `scope: 'session'` rules still cache deterministically.
 *   - When the strict runner (`runRuleCommand` from B001) rejects, the
 *     offending rule is omitted from the resolved set, a warning is logged
 *     via the existing plugin logger, and *sibling rules continue loading*.
 *   - Successful command rules are materialized + cached normally.
 *
 * The existing legacy `materializeCommandRule` (lenient runner) tests live
 * in `ruleCommand.test.ts`; this file focuses purely on the new B005 path.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  clearRuleCommandCache,
  resolvePluginRulesForPrompt,
  getPluginManager,
  NO_SESSION_ID,
} from '../../src/plugin/index.js';
import { sessionCache } from '../../src/plugin/ruleCache.js';
import logger from '../../src/utils/logger.js';

const NODE = process.execPath;

function writeManifest(pluginRoot: string, manifest: Record<string, unknown>): void {
  fs.mkdirSync(pluginRoot, { recursive: true });
  fs.writeFileSync(path.join(pluginRoot, 'plugin.json'), JSON.stringify(manifest, null, 2));
}

describe('resolvePluginRulesForPrompt — B005 strict wiring', () => {
  let tmpdir: string;
  let projectRoot: string;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-b005-'));
    projectRoot = path.join(tmpdir, 'project');
    fs.mkdirSync(projectRoot, { recursive: true });
    clearRuleCommandCache();
    // Reset the global plugin manager between tests — `resolvePluginRulesForPrompt`
    // reads from it, and other tests may have populated it.
    await getPluginManager().clear();
    warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
  });

  afterEach(async () => {
    clearRuleCommandCache();
    await getPluginManager().clear();
    fs.rmSync(tmpdir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it("falls back to the 'no-session' id when sessionId is undefined", async () => {
    expect(NO_SESSION_ID).toBe('no-session');

    const pluginRoot = path.join(projectRoot, 'pluginA');
    writeManifest(pluginRoot, {
      name: 'pluginA',
      version: '0.0.1',
      rules: [
        {
          name: 'todos',
          // session-scope so the cache key lands in the per-session map.
          scope: 'session',
          source: 'command',
          argv: [NODE, '-e', 'process.stdout.write("hello-from-cmd")'],
        },
      ],
    });

    const result = await getPluginManager().loadFromManifest(pluginRoot);
    expect(result.success).toBe(true);

    const resolved = await resolvePluginRulesForPrompt(undefined);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].source).toBe('command');
    expect(resolved[0].content).toBe('hello-from-cmd');

    // Confirm the cache landed under the synthetic session id.
    expect(sessionCache.has(NO_SESSION_ID)).toBe(true);
    expect(sessionCache.get(NO_SESSION_ID)?.get('pluginA::todos')).toBe('hello-from-cmd');
  });

  it('uses the supplied sessionId when one is provided', async () => {
    const pluginRoot = path.join(projectRoot, 'pluginA');
    writeManifest(pluginRoot, {
      name: 'pluginA',
      version: '0.0.1',
      rules: [
        {
          name: 'todos',
          scope: 'session',
          source: 'command',
          argv: [NODE, '-e', 'process.stdout.write("session-keyed")'],
        },
      ],
    });

    await getPluginManager().loadFromManifest(pluginRoot);
    const resolved = await resolvePluginRulesForPrompt('sess-123');

    expect(resolved).toHaveLength(1);
    expect(resolved[0].content).toBe('session-keyed');
    expect(sessionCache.get('sess-123')?.get('pluginA::todos')).toBe('session-keyed');
    // The synthetic id was NOT used.
    expect(sessionCache.has(NO_SESSION_ID)).toBe(false);
  });

  it('omits a single command rule that fails (non-zero exit) and keeps siblings', async () => {
    const pluginRoot = path.join(projectRoot, 'pluginMixed');
    writeManifest(pluginRoot, {
      name: 'pluginMixed',
      version: '0.0.1',
      rules: [
        {
          name: 'good-inline',
          source: 'inline',
          content: 'inline-survives',
        },
        {
          name: 'bad-cmd',
          source: 'command',
          argv: [NODE, '-e', 'process.stderr.write("oops");process.exit(7)'],
        },
        {
          name: 'good-cmd',
          source: 'command',
          argv: [NODE, '-e', 'process.stdout.write("good-cmd-content")'],
        },
      ],
    });

    const load = await getPluginManager().loadFromManifest(pluginRoot);
    expect(load.success).toBe(true);

    const resolved = await resolvePluginRulesForPrompt('sess-1');

    // `bad-cmd` is omitted; the inline + good command rule survive.
    const names = resolved.map((r) => r.name).sort();
    expect(names).toEqual(['good-cmd', 'good-inline']);

    const goodCmd = resolved.find((r) => r.name === 'good-cmd');
    expect(goodCmd?.content).toBe('good-cmd-content');

    const inline = resolved.find((r) => r.name === 'good-inline');
    expect(inline?.content).toBe('inline-survives');

    // Plugin logger received a warning naming the offending rule.
    expect(warnSpy).toHaveBeenCalled();
    const warnCalls = warnSpy.mock.calls.map((args) => String(args[0]));
    expect(warnCalls.some((m) => m.includes('pluginMixed') && m.includes('bad-cmd'))).toBe(true);

    // Failed rule is NOT cached (the loader threw, getOrLoad must not store).
    expect(sessionCache.get('sess-1')?.has('pluginMixed::bad-cmd')).toBe(false);
  });

  it('omits a command rule that times out and keeps siblings', async () => {
    const pluginRoot = path.join(projectRoot, 'pluginTimeout');
    writeManifest(pluginRoot, {
      name: 'pluginTimeout',
      version: '0.0.1',
      rules: [
        {
          name: 'survives',
          source: 'inline',
          content: 'I survived',
        },
        {
          name: 'slow',
          source: 'command',
          // Hang well beyond timeoutMs so the strict runner rejects with TIMEOUT.
          argv: [NODE, '-e', 'setTimeout(()=>{},5000)'],
          timeoutMs: 100,
        },
      ],
    });

    await getPluginManager().loadFromManifest(pluginRoot);
    const resolved = await resolvePluginRulesForPrompt('sess-T');

    expect(resolved.map((r) => r.name)).toEqual(['survives']);
    expect(resolved[0].content).toBe('I survived');

    const warnCalls = warnSpy.mock.calls.map((args) => String(args[0]));
    expect(warnCalls.some((m) => m.includes('pluginTimeout') && m.includes('slow'))).toBe(true);
  });

  it('caches successful command rule output across calls (single spawn)', async () => {
    const counterFile = path.join(tmpdir, 'spawn-counter');
    const pluginRoot = path.join(projectRoot, 'pluginCache');
    writeManifest(pluginRoot, {
      name: 'pluginCache',
      version: '0.0.1',
      rules: [
        {
          name: 'count',
          scope: 'session',
          source: 'command',
          argv: [
            NODE,
            '-e',
            [
              `const fs = require('fs');`,
              `let n = 0;`,
              `try { n = parseInt(fs.readFileSync(${JSON.stringify(counterFile)}, 'utf-8'), 10) || 0; } catch {}`,
              `n += 1;`,
              `fs.writeFileSync(${JSON.stringify(counterFile)}, String(n));`,
              `process.stdout.write('count=' + n);`,
            ].join(''),
          ],
        },
      ],
    });

    await getPluginManager().loadFromManifest(pluginRoot);

    const a = await resolvePluginRulesForPrompt('sess-cache');
    const b = await resolvePluginRulesForPrompt('sess-cache');

    expect(a[0].content).toBe('count=1');
    expect(b[0].content).toBe('count=1');
    // Counter file written exactly once → second call hit the cache.
    expect(parseInt(fs.readFileSync(counterFile, 'utf-8'), 10)).toBe(1);
  });

  it('passes through inline and file rules unchanged', async () => {
    const pluginRoot = path.join(projectRoot, 'pluginPassthrough');
    fs.mkdirSync(pluginRoot, { recursive: true });
    fs.writeFileSync(path.join(pluginRoot, 'extra.md'), 'from-file');
    writeManifest(pluginRoot, {
      name: 'pluginPassthrough',
      version: '0.0.1',
      rules: [
        { name: 'a', source: 'inline', content: 'inline-a' },
        { name: 'b', source: 'file', path: 'extra.md' },
      ],
    });

    await getPluginManager().loadFromManifest(pluginRoot);
    const resolved = await resolvePluginRulesForPrompt();

    expect(resolved).toHaveLength(2);
    const byName = new Map(resolved.map((r) => [r.name, r.content]));
    expect(byName.get('a')).toBe('inline-a');
    expect(byName.get('b')).toBe('from-file');
  });

  it('returns an empty array when no plugins are loaded', async () => {
    const resolved = await resolvePluginRulesForPrompt();
    expect(resolved).toEqual([]);
  });

  it('handles multiple plugins independently when one has a failing rule', async () => {
    const goodRoot = path.join(projectRoot, 'pluginGood');
    writeManifest(goodRoot, {
      name: 'pluginGood',
      version: '0.0.1',
      rules: [
        {
          name: 'ok',
          source: 'command',
          argv: [NODE, '-e', 'process.stdout.write("from-good")'],
        },
      ],
    });

    const badRoot = path.join(projectRoot, 'pluginBad');
    writeManifest(badRoot, {
      name: 'pluginBad',
      version: '0.0.1',
      rules: [
        {
          name: 'broken',
          source: 'command',
          argv: [NODE, '-e', 'process.exit(1)'],
        },
      ],
    });

    await getPluginManager().loadFromManifest(goodRoot);
    await getPluginManager().loadFromManifest(badRoot);

    const resolved = await resolvePluginRulesForPrompt('sess-multi');
    expect(resolved.map((r) => `${r.pluginName}::${r.name}`)).toEqual(['pluginGood::ok']);
    expect(resolved[0].content).toBe('from-good');
  });
});

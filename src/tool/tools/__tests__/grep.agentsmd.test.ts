import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { grepTool, _resetRgDetectionForTests } from '../grep.js';
import type { ToolContext } from '../../index.js';

describe('grep tool — per-directory AGENTS.md reminders', () => {
  let workdir: string;
  const prevDisableRg = process.env.ALEXI_DISABLE_RG;

  beforeEach(() => {
    // Force the JS path so the test is deterministic regardless of host rg.
    process.env.ALEXI_DISABLE_RG = '1';
    _resetRgDetectionForTests();
    workdir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'grep-agentsmd-')));
  });

  afterEach(() => {
    if (prevDisableRg === undefined) {
      delete process.env.ALEXI_DISABLE_RG;
    } else {
      process.env.ALEXI_DISABLE_RG = prevDisableRg;
    }
    _resetRgDetectionForTests();
    try {
      fs.rmSync(workdir, { recursive: true, force: true });
    } catch {
      // best-effort
    }
  });

  it('emits exactly one reminder when matches span apps/api/src and apps/web/src but only apps/api has AGENTS.md', async () => {
    const apiSrc = path.join(workdir, 'apps', 'api', 'src');
    const webSrc = path.join(workdir, 'apps', 'web', 'src');
    fs.mkdirSync(apiSrc, { recursive: true });
    fs.mkdirSync(webSrc, { recursive: true });
    fs.writeFileSync(path.join(workdir, 'apps', 'api', 'AGENTS.md'), 'API_TEAM_RULES_GREP');
    fs.writeFileSync(path.join(apiSrc, 'foo.ts'), 'const SENTINEL_TOKEN = 1;\n');
    fs.writeFileSync(path.join(webSrc, 'bar.ts'), 'const SENTINEL_TOKEN = 2;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await grepTool.executeUnsafe(
      { pattern: 'SENTINEL_TOKEN', path: workdir },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.matches.length).toBeGreaterThanOrEqual(2);
    const reminders = result.metadata?.systemReminders;
    expect(reminders).toBeDefined();
    expect(reminders).toHaveLength(1);
    if (reminders) {
      expect(reminders[0].source).toBe(path.join('apps', 'api', 'AGENTS.md'));
      expect(reminders[0].content).toBe('API_TEAM_RULES_GREP');
    }
  });

  it('emits exactly two reminders (no duplicates) when both apps/api and apps/web have AGENTS.md', async () => {
    const apiSrc = path.join(workdir, 'apps', 'api', 'src');
    const webSrc = path.join(workdir, 'apps', 'web', 'src');
    fs.mkdirSync(apiSrc, { recursive: true });
    fs.mkdirSync(webSrc, { recursive: true });
    fs.writeFileSync(path.join(workdir, 'apps', 'api', 'AGENTS.md'), 'API_TEAM_RULES_GREP');
    fs.writeFileSync(path.join(workdir, 'apps', 'web', 'AGENTS.md'), 'WEB_TEAM_RULES_GREP');
    // Two matches per directory to verify dedupe within a directory.
    fs.writeFileSync(path.join(apiSrc, 'a.ts'), 'const SENTINEL_TOKEN = 1;\n');
    fs.writeFileSync(path.join(apiSrc, 'b.ts'), 'const SENTINEL_TOKEN = 2;\n');
    fs.writeFileSync(path.join(webSrc, 'c.ts'), 'const SENTINEL_TOKEN = 3;\n');
    fs.writeFileSync(path.join(webSrc, 'd.ts'), 'const SENTINEL_TOKEN = 4;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await grepTool.executeUnsafe(
      { pattern: 'SENTINEL_TOKEN', path: workdir },
      context
    );

    expect(result.success).toBe(true);
    const reminders = result.metadata?.systemReminders;
    expect(reminders).toBeDefined();
    expect(reminders).toHaveLength(2);
    if (reminders) {
      const sources = reminders.map((r) => r.source).sort();
      expect(sources).toEqual([
        path.join('apps', 'api', 'AGENTS.md'),
        path.join('apps', 'web', 'AGENTS.md'),
      ]);
      const byPath = new Map(reminders.map((r) => [r.source, r.content]));
      expect(byPath.get(path.join('apps', 'api', 'AGENTS.md'))).toBe('API_TEAM_RULES_GREP');
      expect(byPath.get(path.join('apps', 'web', 'AGENTS.md'))).toBe('WEB_TEAM_RULES_GREP');
    }
  });

  it('does not re-emit reminders on a second grep call sharing the same agentsMdSeen', async () => {
    const apiSrc = path.join(workdir, 'apps', 'api', 'src');
    const webSrc = path.join(workdir, 'apps', 'web', 'src');
    fs.mkdirSync(apiSrc, { recursive: true });
    fs.mkdirSync(webSrc, { recursive: true });
    fs.writeFileSync(path.join(workdir, 'apps', 'api', 'AGENTS.md'), 'API_TEAM_RULES_GREP');
    fs.writeFileSync(path.join(workdir, 'apps', 'web', 'AGENTS.md'), 'WEB_TEAM_RULES_GREP');
    fs.writeFileSync(path.join(apiSrc, 'foo.ts'), 'const SENTINEL_TOKEN = 1;\n');
    fs.writeFileSync(path.join(webSrc, 'bar.ts'), 'const SENTINEL_TOKEN = 2;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const firstResult = await grepTool.executeUnsafe(
      { pattern: 'SENTINEL_TOKEN', path: workdir },
      context
    );
    const secondResult = await grepTool.executeUnsafe(
      { pattern: 'SENTINEL_TOKEN', path: workdir },
      context
    );

    expect(firstResult.metadata?.systemReminders).toHaveLength(2);
    expect(secondResult.metadata?.systemReminders).toBeUndefined();
  });

  it('attaches no reminder metadata when context.agentsMdSeen is undefined', async () => {
    const apiSrc = path.join(workdir, 'apps', 'api', 'src');
    fs.mkdirSync(apiSrc, { recursive: true });
    fs.writeFileSync(path.join(workdir, 'apps', 'api', 'AGENTS.md'), 'API_TEAM_RULES_GREP');
    fs.writeFileSync(path.join(apiSrc, 'foo.ts'), 'const SENTINEL_TOKEN = 1;\n');

    const context: ToolContext = { workdir };

    const result = await grepTool.executeUnsafe(
      { pattern: 'SENTINEL_TOKEN', path: workdir },
      context
    );

    expect(result.success).toBe(true);
    expect(result.metadata?.systemReminders).toBeUndefined();
  });
});

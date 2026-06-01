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

  it('emits metadata.systemReminders for AGENTS.md above matched files', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    const srcDir = path.join(apiDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES_GREP');
    fs.writeFileSync(path.join(srcDir, 'foo.ts'), 'const SENTINEL_TOKEN = 1;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await grepTool.executeUnsafe(
      { pattern: 'SENTINEL_TOKEN', path: workdir },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.matches.length).toBeGreaterThan(0);
    const reminders = result.metadata?.systemReminders;
    expect(reminders).toBeDefined();
    expect(reminders).toHaveLength(1);
    if (reminders) {
      expect(reminders[0].source).toBe(path.join('apps', 'api', 'AGENTS.md'));
      expect(reminders[0].content).toBe('API_TEAM_RULES_GREP');
    }
  });

  it('does not re-emit a reminder for an already-seen AGENTS.md across calls', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    const srcDir = path.join(apiDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES_GREP');
    fs.writeFileSync(path.join(srcDir, 'foo.ts'), 'const SENTINEL_TOKEN = 1;\n');
    fs.writeFileSync(path.join(srcDir, 'bar.ts'), 'const SENTINEL_TOKEN = 2;\n');

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

    expect(firstResult.metadata?.systemReminders).toHaveLength(1);
    expect(secondResult.metadata?.systemReminders).toBeUndefined();
  });

  it('stays silent when context.agentsMdSeen is omitted', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    const srcDir = path.join(apiDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES_GREP');
    fs.writeFileSync(path.join(srcDir, 'foo.ts'), 'const SENTINEL_TOKEN = 1;\n');

    const context: ToolContext = { workdir };

    const result = await grepTool.executeUnsafe(
      { pattern: 'SENTINEL_TOKEN', path: workdir },
      context
    );

    expect(result.success).toBe(true);
    expect(result.metadata?.systemReminders).toBeUndefined();
  });

  it('emits no reminders when there are zero matches', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    const srcDir = path.join(apiDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES_GREP');
    fs.writeFileSync(path.join(srcDir, 'foo.ts'), 'const value = 1;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await grepTool.executeUnsafe(
      { pattern: 'NO_SUCH_TOKEN_FOO', path: workdir },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.matches).toHaveLength(0);
    expect(result.metadata?.systemReminders).toBeUndefined();
  });
});

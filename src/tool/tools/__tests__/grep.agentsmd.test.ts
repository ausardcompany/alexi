import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { grepTool } from '../grep.js';
import type { ToolContext } from '../../index.js';

describe('grep tool — per-directory AGENTS.md reminders', () => {
  let workdir: string;

  beforeEach(() => {
    workdir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'grep-agentsmd-')));
  });

  afterEach(() => {
    try {
      fs.rmSync(workdir, { recursive: true, force: true });
    } catch {
      // best-effort
    }
  });

  it('emits metadata.systemReminders for files whose subtree contains AGENTS.md', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    const srcDir = path.join(apiDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES');
    fs.writeFileSync(path.join(srcDir, 'a.ts'), 'NEEDLE in a\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await grepTool.executeUnsafe({ pattern: 'NEEDLE', path: workdir }, context);

    expect(result.success).toBe(true);
    expect(result.data?.matches.length).toBeGreaterThan(0);
    const reminders = result.metadata?.systemReminders;
    expect(reminders).toBeDefined();
    expect(reminders).toHaveLength(1);
    if (reminders) {
      expect(reminders[0].source).toBe(path.join('apps', 'api', 'AGENTS.md'));
      expect(reminders[0].content).toBe('API_TEAM_RULES');
    }
  });

  it('emits only one reminder when many matches share the same subtree', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    const srcDir = path.join(apiDir, 'src');
    const nested = path.join(srcDir, 'nested');
    fs.mkdirSync(nested, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES');
    fs.writeFileSync(path.join(srcDir, 'a.ts'), 'NEEDLE one\n');
    fs.writeFileSync(path.join(srcDir, 'b.ts'), 'NEEDLE two\n');
    fs.writeFileSync(path.join(nested, 'c.ts'), 'NEEDLE three\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await grepTool.executeUnsafe({ pattern: 'NEEDLE', path: workdir }, context);

    expect(result.success).toBe(true);
    const reminders = result.metadata?.systemReminders ?? [];
    expect(reminders).toHaveLength(1);
    expect(reminders[0].source).toBe(path.join('apps', 'api', 'AGENTS.md'));
  });

  it('does not re-emit a reminder for an already-seen AGENTS.md', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    const srcDir = path.join(apiDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES');
    fs.writeFileSync(path.join(srcDir, 'a.ts'), 'NEEDLE in a\n');
    fs.writeFileSync(path.join(srcDir, 'b.ts'), 'NEEDLE in b\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const firstResult = await grepTool.executeUnsafe(
      { pattern: 'NEEDLE in a', path: workdir },
      context
    );
    const secondResult = await grepTool.executeUnsafe(
      { pattern: 'NEEDLE in b', path: workdir },
      context
    );

    expect(firstResult.metadata?.systemReminders).toHaveLength(1);
    expect(secondResult.metadata?.systemReminders).toBeUndefined();
  });

  it('does not include the project-root AGENTS.md', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    fs.mkdirSync(apiDir, { recursive: true });
    fs.writeFileSync(path.join(workdir, 'AGENTS.md'), 'ROOT_RULES');
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES');
    fs.writeFileSync(path.join(apiDir, 'a.ts'), 'NEEDLE here\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await grepTool.executeUnsafe({ pattern: 'NEEDLE', path: workdir }, context);

    expect(result.success).toBe(true);
    const reminders = result.metadata?.systemReminders ?? [];
    expect(reminders.map((r) => r.source)).toEqual([path.join('apps', 'api', 'AGENTS.md')]);
  });

  it('stays silent when context.agentsMdSeen is omitted', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    fs.mkdirSync(apiDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES');
    fs.writeFileSync(path.join(apiDir, 'a.ts'), 'NEEDLE here\n');

    const context: ToolContext = { workdir };

    const result = await grepTool.executeUnsafe({ pattern: 'NEEDLE', path: workdir }, context);

    expect(result.success).toBe(true);
    expect(result.metadata?.systemReminders).toBeUndefined();
  });
});

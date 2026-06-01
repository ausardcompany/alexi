import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { writeTool } from '../write.js';
import type { ToolContext } from '../../index.js';

describe('write tool — per-directory AGENTS.md reminders', () => {
  let workdir: string;

  beforeEach(() => {
    workdir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'write-agentsmd-')));
  });

  afterEach(() => {
    try {
      fs.rmSync(workdir, { recursive: true, force: true });
    } catch {
      // best-effort
    }
  });

  it('emits metadata.systemReminders when writing a file under a subdir AGENTS.md', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    const srcDir = path.join(apiDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES');
    const target = path.join(srcDir, 'index.ts');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await writeTool.executeUnsafe(
      { filePath: target, content: 'export const hello = 1;\n' },
      context
    );

    expect(result.success).toBe(true);
    expect(result.metadata).toBeDefined();
    const reminders = result.metadata?.systemReminders;
    expect(reminders).toBeDefined();
    expect(reminders).toHaveLength(1);
    if (reminders) {
      expect(reminders[0].source).toBe(path.join('apps', 'api', 'AGENTS.md'));
      expect(reminders[0].content).toBe('API_TEAM_RULES');
    }
  });

  it('does not re-emit a reminder for an already-seen AGENTS.md', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    const srcDir = path.join(apiDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES');
    const first = path.join(srcDir, 'index.ts');
    const second = path.join(srcDir, 'util.ts');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const firstResult = await writeTool.executeUnsafe(
      { filePath: first, content: 'export {};\n' },
      context
    );
    const secondResult = await writeTool.executeUnsafe(
      { filePath: second, content: 'export {};\n' },
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
    const target = path.join(apiDir, 'index.ts');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await writeTool.executeUnsafe(
      { filePath: target, content: 'export const x = 1;\n' },
      context
    );

    expect(result.success).toBe(true);
    const reminders = result.metadata?.systemReminders ?? [];
    expect(reminders.map((r) => r.source)).toEqual([path.join('apps', 'api', 'AGENTS.md')]);
  });

  it('stays silent when context.agentsMdSeen is omitted', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    fs.mkdirSync(apiDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES');
    const target = path.join(apiDir, 'index.ts');

    const context: ToolContext = { workdir };

    const result = await writeTool.executeUnsafe(
      { filePath: target, content: 'export const x = 1;\n' },
      context
    );

    expect(result.success).toBe(true);
    expect(result.metadata?.systemReminders).toBeUndefined();
  });
});

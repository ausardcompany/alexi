import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { editTool } from '../edit.js';
import type { ToolContext } from '../../index.js';

describe('edit tool — per-directory AGENTS.md reminders', () => {
  let workdir: string;

  beforeEach(() => {
    workdir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'edit-agentsmd-')));
  });

  afterEach(() => {
    try {
      fs.rmSync(workdir, { recursive: true, force: true });
    } catch {
      // best-effort
    }
  });

  it('emits metadata.systemReminders when editing a file under a subdir AGENTS.md', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    const srcDir = path.join(apiDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES');
    const target = path.join(srcDir, 'index.ts');
    fs.writeFileSync(target, 'export const hello = 1;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await editTool.executeUnsafe(
      {
        filePath: target,
        oldString: 'export const hello = 1;',
        newString: 'export const hello = 2;',
      },
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
    fs.writeFileSync(first, 'export const a = 1;\n');
    fs.writeFileSync(second, 'export const b = 1;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const firstResult = await editTool.executeUnsafe(
      { filePath: first, oldString: 'const a = 1', newString: 'const a = 2' },
      context
    );
    const secondResult = await editTool.executeUnsafe(
      { filePath: second, oldString: 'const b = 1', newString: 'const b = 2' },
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
    fs.writeFileSync(target, 'export const x = 1;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await editTool.executeUnsafe(
      { filePath: target, oldString: 'const x = 1', newString: 'const x = 2' },
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
    fs.writeFileSync(target, 'export const x = 1;\n');

    const context: ToolContext = { workdir };

    const result = await editTool.executeUnsafe(
      { filePath: target, oldString: 'const x = 1', newString: 'const x = 2' },
      context
    );

    expect(result.success).toBe(true);
    expect(result.metadata?.systemReminders).toBeUndefined();
  });
});

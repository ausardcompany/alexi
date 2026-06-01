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
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES_EDIT');
    const target = path.join(srcDir, 'foo.ts');
    fs.writeFileSync(target, 'export const value = 1;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await editTool.executeUnsafe(
      { filePath: target, oldString: 'value = 1', newString: 'value = 2' },
      context
    );

    expect(result.success).toBe(true);
    const reminders = result.metadata?.systemReminders;
    expect(reminders).toBeDefined();
    expect(reminders).toHaveLength(1);
    if (reminders) {
      expect(reminders[0].source).toBe(path.join('apps', 'api', 'AGENTS.md'));
      expect(reminders[0].content).toBe('API_TEAM_RULES_EDIT');
    }
  });

  it('does not re-emit a reminder for an already-seen AGENTS.md', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    const srcDir = path.join(apiDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES_EDIT');
    const first = path.join(srcDir, 'a.ts');
    const second = path.join(srcDir, 'b.ts');
    fs.writeFileSync(first, 'export const x = 1;\n');
    fs.writeFileSync(second, 'export const y = 2;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const firstResult = await editTool.executeUnsafe(
      { filePath: first, oldString: 'x = 1', newString: 'x = 11' },
      context
    );
    const secondResult = await editTool.executeUnsafe(
      { filePath: second, oldString: 'y = 2', newString: 'y = 22' },
      context
    );

    expect(firstResult.metadata?.systemReminders).toHaveLength(1);
    expect(secondResult.metadata?.systemReminders).toBeUndefined();
  });

  it('stays silent when context.agentsMdSeen is omitted', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    const srcDir = path.join(apiDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES_EDIT');
    const target = path.join(srcDir, 'foo.ts');
    fs.writeFileSync(target, 'export const value = 1;\n');

    const context: ToolContext = { workdir };

    const result = await editTool.executeUnsafe(
      { filePath: target, oldString: 'value = 1', newString: 'value = 2' },
      context
    );

    expect(result.success).toBe(true);
    expect(result.metadata?.systemReminders).toBeUndefined();
  });
});

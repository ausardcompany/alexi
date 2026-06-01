import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { multieditTool } from '../multiedit.js';
import type { ToolContext } from '../../index.js';

describe('multiedit tool — per-directory AGENTS.md reminders', () => {
  let workdir: string;

  beforeEach(() => {
    workdir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'multiedit-agentsmd-')));
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
    fs.writeFileSync(target, 'const a = 1;\nconst b = 2;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await multieditTool.executeUnsafe(
      {
        filePath: target,
        edits: [
          { oldString: 'const a = 1', newString: 'const a = 10' },
          { oldString: 'const b = 2', newString: 'const b = 20' },
        ],
      },
      context
    );

    expect(result.success).toBe(true);
    const reminders = result.metadata?.systemReminders;
    expect(reminders).toBeDefined();
    expect(reminders).toHaveLength(1);
    if (reminders) {
      expect(reminders[0].source).toBe(path.join('apps', 'api', 'AGENTS.md'));
      expect(reminders[0].content).toBe('API_TEAM_RULES');
    }
  });

  it('emits at most one reminder per AGENTS.md per call (file-level dedup)', async () => {
    // multiedit operates on a single file. Even with many edits in the same
    // call, only one reminder should fire for the nearest AGENTS.md.
    const apiDir = path.join(workdir, 'apps', 'api');
    fs.mkdirSync(apiDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES');
    const target = path.join(apiDir, 'index.ts');
    fs.writeFileSync(target, 'const a = 1;\nconst b = 2;\nconst c = 3;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await multieditTool.executeUnsafe(
      {
        filePath: target,
        edits: [
          { oldString: 'const a = 1', newString: 'const a = 10' },
          { oldString: 'const b = 2', newString: 'const b = 20' },
          { oldString: 'const c = 3', newString: 'const c = 30' },
        ],
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.metadata?.systemReminders).toHaveLength(1);
  });

  it('does not re-emit a reminder when called twice on the same subtree', async () => {
    const apiDir = path.join(workdir, 'apps', 'api');
    const srcDir = path.join(apiDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(path.join(apiDir, 'AGENTS.md'), 'API_TEAM_RULES');
    const first = path.join(srcDir, 'a.ts');
    const second = path.join(srcDir, 'b.ts');
    fs.writeFileSync(first, 'const x = 1;\n');
    fs.writeFileSync(second, 'const y = 1;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const firstResult = await multieditTool.executeUnsafe(
      {
        filePath: first,
        edits: [{ oldString: 'const x = 1', newString: 'const x = 2' }],
      },
      context
    );
    const secondResult = await multieditTool.executeUnsafe(
      {
        filePath: second,
        edits: [{ oldString: 'const y = 1', newString: 'const y = 2' }],
      },
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
    fs.writeFileSync(target, 'const x = 1;\n');

    const agentsMdSeen = new Set<string>();
    const context: ToolContext = { workdir, agentsMdSeen };

    const result = await multieditTool.executeUnsafe(
      {
        filePath: target,
        edits: [{ oldString: 'const x = 1', newString: 'const x = 2' }],
      },
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
    fs.writeFileSync(target, 'const x = 1;\n');

    const context: ToolContext = { workdir };

    const result = await multieditTool.executeUnsafe(
      {
        filePath: target,
        edits: [{ oldString: 'const x = 1', newString: 'const x = 2' }],
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.metadata?.systemReminders).toBeUndefined();
  });
});

import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { openPlanTool, PlanOpened } from '../open-plan.js';

describe('openPlanTool', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'alexi-plan-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('resolves relative paths against workdir and emits plan.opened', async () => {
    const planPath = path.join(tempDir, 'plan.md');
    await fs.writeFile(planPath, '# plan');

    const events: unknown[] = [];
    const unsubscribe = PlanOpened.subscribe((payload) => {
      events.push(payload);
    });

    try {
      const result = await openPlanTool.executeUnsafe(
        { path: 'plan.md', title: 'Test' },
        { workdir: tempDir, sessionId: 's1' }
      );

      expect(result.success).toBe(true);
      expect(result.data?.path).toBe(planPath);
      expect(result.data?.title).toBe('Test');
      expect(events.length).toBe(1);
      expect(events[0]).toMatchObject({ sessionId: 's1', path: planPath, title: 'Test' });
    } finally {
      unsubscribe();
    }
  });

  it('defaults the title to the file basename', async () => {
    const planPath = path.join(tempDir, 'nested-plan.md');
    await fs.writeFile(planPath, '# hello');

    const result = await openPlanTool.executeUnsafe(
      { path: planPath },
      { workdir: tempDir }
    );

    expect(result.success).toBe(true);
    expect(result.data?.title).toBe('nested-plan.md');
  });

  it('rejects non-markdown files', async () => {
    const bad = path.join(tempDir, 'plan.txt');
    await fs.writeFile(bad, 'x');

    const result = await openPlanTool.executeUnsafe({ path: bad }, { workdir: tempDir });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/markdown/);
  });

  it('rejects missing files', async () => {
    const result = await openPlanTool.executeUnsafe(
      { path: '/nonexistent/plan.md' },
      { workdir: tempDir }
    );

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/);
  });
});

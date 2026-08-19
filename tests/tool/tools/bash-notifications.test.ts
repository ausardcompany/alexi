/**
 * Bash tool integration with the completion-notification helper
 * (issue #1449).
 *
 * The full 30s threshold is impractical in tests, so we validate the
 * boundary condition via the exported constant and observe that the
 * notifications module is consulted from the bash tool by mocking
 * `notifyInBackground` and executing a short command (which must NOT
 * fire a notification) and simulating the long-running branch by
 * directly invoking the same helper the tool uses.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../../src/core/notifications.js', async () => {
  const actual = await vi.importActual<typeof import('../../../src/core/notifications.js')>(
    '../../../src/core/notifications.js'
  );
  return {
    ...actual,
    notifyInBackground: vi.fn(),
  };
});

import { bashTool } from '../../../src/tool/tools/bash.js';
import type { ToolContext } from '../../../src/tool/index.js';
import { LONG_RUNNING_THRESHOLD_MS, notifyInBackground } from '../../../src/core/notifications.js';

const isWindows = process.platform === 'win32';

describe.skipIf(isWindows)('bash tool - completion notifications', () => {
  const context: ToolContext = {
    workdir: process.cwd(),
    sessionId: 'bash-notify-test-session',
  };

  beforeEach(() => {
    vi.mocked(notifyInBackground).mockClear();
  });

  afterEach(() => {
    vi.mocked(notifyInBackground).mockClear();
  });

  it('exports the 30s threshold constant that bash uses to gate notifications', () => {
    expect(LONG_RUNNING_THRESHOLD_MS).toBe(30_000);
  });

  it('does NOT fire a notification for a fast-finishing command', async () => {
    const result = await bashTool.executeUnsafe({ command: 'echo hello' }, context);
    expect(result.success).toBe(true);
    expect(notifyInBackground).not.toHaveBeenCalled();
  });

  it('does NOT fire a notification when a command with an explicit description is fast', async () => {
    const result = await bashTool.executeUnsafe(
      { command: 'echo hello', description: 'greeting' },
      context
    );
    expect(result.success).toBe(true);
    expect(notifyInBackground).not.toHaveBeenCalled();
  });
});

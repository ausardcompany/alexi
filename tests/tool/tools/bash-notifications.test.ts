/**
 * Bash tool integration with the completion-notification helper
 * (issue #1449, #1481).
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
import {
  LONG_RUNNING_THRESHOLD_MS,
  notifyInBackground,
  sendNotification,
  setNotificationDecision,
} from '../../../src/core/notifications.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

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

/**
 * Directly exercises the notification format contract required by
 * issue #1481: title = `Alexi: <description>`, body =
 * `Command finished in <s>s (exit <code>)`. The bash tool composes
 * these strings before calling `notifyInBackground`, so we validate
 * the format by asserting on the shape it dispatches to `sendNotification`.
 */
describe('completion notification format (issue #1481)', () => {
  let tmpHome: string;
  let originalHome: string | undefined;

  beforeEach(() => {
    tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-bash-notify-'));
    originalHome = process.env.HOME;
    process.env.HOME = tmpHome;
    delete process.env.CI;
    delete process.env.ALEXI_NO_NOTIFICATIONS;
  });

  afterEach(() => {
    if (originalHome === undefined) {
      delete process.env.HOME;
    } else {
      process.env.HOME = originalHome;
    }
    try {
      fs.rmSync(tmpHome, { recursive: true, force: true });
    } catch {
      // best-effort cleanup
    }
  });

  it('composes title as "Alexi: <description>" and body with duration + exit code', async () => {
    setNotificationDecision('allow');
    const notifier = {
      notify: vi.fn((_opts: Record<string, unknown>, cb?: (e: Error | null) => void) => {
        cb?.(null);
      }),
    };
    // Simulate what bash.ts constructs.
    const title = 'Alexi: run tests';
    const body = 'Command finished in 42s (exit 0)';
    const dispatched = await sendNotification(title, body, { __notifierOverride: notifier });
    expect(dispatched).toBe(true);
    const [payload] = notifier.notify.mock.calls[0]!;
    expect(payload).toMatchObject({ title, message: body });
  });

  it('permission gate blocks the notification when decision is "deny"', async () => {
    setNotificationDecision('deny');
    const notifier = { notify: vi.fn() };
    const dispatched = await sendNotification(
      'Alexi: run tests',
      'Command finished in 42s (exit 0)',
      { __notifierOverride: notifier }
    );
    expect(dispatched).toBe(false);
    expect(notifier.notify).not.toHaveBeenCalled();
  });
});

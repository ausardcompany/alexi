/**
 * Tests for the native-notifications helper (issue #1449).
 *
 * Covers:
 *  - Config decision resolution (`allow` / `deny` / `ask` / unset).
 *  - Permission prompt gating on `ask` in interactive contexts.
 *  - Silent skip in non-interactive contexts (CI, ALEXI_NO_NOTIFICATIONS).
 *  - Dispatch to the injected notifier on `allow`.
 *  - No crash when node-notifier throws or reports an error.
 *  - `notifyInBackground` fire-and-forget wrapper.
 *  - `LONG_RUNNING_THRESHOLD_MS` exported at the documented 30s value.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// ~/.alexi/config.json lives under HOME. Redirect HOME to a temp dir
// so tests never touch a real user config.
let tmpHome: string;
let originalHome: string | undefined;
let originalCi: string | undefined;
let originalDisable: string | undefined;

beforeEach(() => {
  tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-notifications-'));
  originalHome = process.env.HOME;
  originalCi = process.env.CI;
  originalDisable = process.env.ALEXI_NO_NOTIFICATIONS;
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
  if (originalCi === undefined) {
    delete process.env.CI;
  } else {
    process.env.CI = originalCi;
  }
  if (originalDisable === undefined) {
    delete process.env.ALEXI_NO_NOTIFICATIONS;
  } else {
    process.env.ALEXI_NO_NOTIFICATIONS = originalDisable;
  }
  try {
    fs.rmSync(tmpHome, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup.
  }
  vi.restoreAllMocks();
});

async function freshImport() {
  vi.resetModules();
  return import('../../src/core/notifications.js');
}

describe('notifications', () => {
  it('exports the documented 30s long-running threshold', async () => {
    const mod = await freshImport();
    expect(mod.LONG_RUNNING_THRESHOLD_MS).toBe(30_000);
  });

  it('defaults to "ask" when the config key is absent', async () => {
    const mod = await freshImport();
    expect(mod.getNotificationDecision()).toBe('ask');
  });

  it('coerces unknown persisted values back to "ask"', async () => {
    const mod = await freshImport();
    mod.setNotificationDecision('allow');
    expect(mod.getNotificationDecision()).toBe('allow');

    // Manually inject a garbage value (bypassing the setter's validation).
    const configFile = path.join(tmpHome, '.alexi', 'config.json');
    const raw = JSON.parse(fs.readFileSync(configFile, 'utf-8')) as Record<string, unknown>;
    raw.notifications = 'garbage-value';
    fs.writeFileSync(configFile, JSON.stringify(raw));

    const mod2 = await freshImport();
    expect(mod2.getNotificationDecision()).toBe('ask');
  });

  it('returns false without dispatching when decision is "deny"', async () => {
    const mod = await freshImport();
    mod.setNotificationDecision('deny');
    const notifier = { notify: vi.fn() };
    const result = await mod.sendNotification('t', 'm', { __notifierOverride: notifier });
    expect(result).toBe(false);
    expect(notifier.notify).not.toHaveBeenCalled();
  });

  it('dispatches to the injected notifier when decision is "allow"', async () => {
    const mod = await freshImport();
    mod.setNotificationDecision('allow');
    const notifier = {
      notify: vi.fn((_opts: Record<string, unknown>, cb?: (e: Error | null) => void) => {
        cb?.(null);
      }),
    };
    const result = await mod.sendNotification('Alexi', 'Task completed', {
      __notifierOverride: notifier,
      icon: '/tmp/icon.png',
      sound: true,
    });
    expect(result).toBe(true);
    expect(notifier.notify).toHaveBeenCalledTimes(1);
    const [payload] = notifier.notify.mock.calls[0]!;
    expect(payload).toMatchObject({
      title: 'Alexi',
      message: 'Task completed',
      icon: '/tmp/icon.png',
      sound: true,
    });
  });

  it('prompts on "ask", persists the answer, and dispatches when accepted', async () => {
    // Simulate an interactive TTY. Vitest runs with node's default
    // stdin/stdout which report `isTTY === undefined`, so we stub the
    // property directly for this test.
    const stdinDesc = Object.getOwnPropertyDescriptor(process.stdin, 'isTTY');
    const stdoutDesc = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');
    Object.defineProperty(process.stdin, 'isTTY', { value: true, configurable: true });
    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true });
    try {
      const mod = await freshImport();
      const notifier = {
        notify: vi.fn((_opts: Record<string, unknown>, cb?: (e: Error | null) => void) => {
          cb?.(null);
        }),
      };
      const asker = vi.fn(async () => true);
      const result = await mod.sendNotification('Alexi', 'Task completed', {
        __notifierOverride: notifier,
        __askOverride: asker,
      });
      expect(asker).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
      expect(notifier.notify).toHaveBeenCalledTimes(1);
      // Decision was persisted for future calls.
      expect(mod.getNotificationDecision()).toBe('allow');
    } finally {
      if (stdinDesc) {
        Object.defineProperty(process.stdin, 'isTTY', stdinDesc);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (process.stdin as any).isTTY;
      }
      if (stdoutDesc) {
        Object.defineProperty(process.stdout, 'isTTY', stdoutDesc);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (process.stdout as any).isTTY;
      }
    }
  });

  it('persists "deny" and skips dispatch when the prompt is declined', async () => {
    const stdinDesc = Object.getOwnPropertyDescriptor(process.stdin, 'isTTY');
    const stdoutDesc = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');
    Object.defineProperty(process.stdin, 'isTTY', { value: true, configurable: true });
    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true });
    try {
      const mod = await freshImport();
      const notifier = { notify: vi.fn() };
      const asker = vi.fn(async () => false);
      const result = await mod.sendNotification('t', 'm', {
        __notifierOverride: notifier,
        __askOverride: asker,
      });
      expect(result).toBe(false);
      expect(notifier.notify).not.toHaveBeenCalled();
      expect(mod.getNotificationDecision()).toBe('deny');
    } finally {
      if (stdinDesc) {
        Object.defineProperty(process.stdin, 'isTTY', stdinDesc);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (process.stdin as any).isTTY;
      }
      if (stdoutDesc) {
        Object.defineProperty(process.stdout, 'isTTY', stdoutDesc);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (process.stdout as any).isTTY;
      }
    }
  });

  it('silently skips (no dispatch, no persist) when decision is "ask" and env is non-interactive', async () => {
    process.env.CI = '1';
    const mod = await freshImport();
    const notifier = { notify: vi.fn() };
    const asker = vi.fn();
    const result = await mod.sendNotification('t', 'm', {
      __notifierOverride: notifier,
      __askOverride: asker as never,
    });
    expect(result).toBe(false);
    expect(notifier.notify).not.toHaveBeenCalled();
    expect(asker).not.toHaveBeenCalled();
    // Decision must remain "ask" so the user is asked next time they
    // run interactively.
    expect(mod.getNotificationDecision()).toBe('ask');
  });

  it('respects ALEXI_NO_NOTIFICATIONS=1 as a hard disable for the ask path', async () => {
    process.env.ALEXI_NO_NOTIFICATIONS = '1';
    // Even with a TTY, the env flag short-circuits.
    const stdinDesc = Object.getOwnPropertyDescriptor(process.stdin, 'isTTY');
    const stdoutDesc = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');
    Object.defineProperty(process.stdin, 'isTTY', { value: true, configurable: true });
    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true });
    try {
      const mod = await freshImport();
      const notifier = { notify: vi.fn() };
      const result = await mod.sendNotification('t', 'm', {
        __notifierOverride: notifier,
        __askOverride: vi.fn(async () => true) as never,
      });
      expect(result).toBe(false);
      expect(notifier.notify).not.toHaveBeenCalled();
    } finally {
      if (stdinDesc) {
        Object.defineProperty(process.stdin, 'isTTY', stdinDesc);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (process.stdin as any).isTTY;
      }
      if (stdoutDesc) {
        Object.defineProperty(process.stdout, 'isTTY', stdoutDesc);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (process.stdout as any).isTTY;
      }
    }
  });

  it('returns false when the notifier callback reports an error (no crash)', async () => {
    const mod = await freshImport();
    mod.setNotificationDecision('allow');
    const notifier = {
      notify: vi.fn((_opts: Record<string, unknown>, cb?: (e: Error | null) => void) => {
        cb?.(new Error('D-Bus unavailable'));
      }),
    };
    const result = await mod.sendNotification('t', 'm', { __notifierOverride: notifier });
    expect(result).toBe(false);
  });

  it('returns false when the notifier throws synchronously (no crash)', async () => {
    const mod = await freshImport();
    mod.setNotificationDecision('allow');
    const notifier: { notify: (opts: Record<string, unknown>) => void } = {
      notify: () => {
        throw new Error('notifier exploded');
      },
    };
    const result = await mod.sendNotification('t', 'm', { __notifierOverride: notifier });
    expect(result).toBe(false);
  });

  it('notifyInBackground never throws even when the notifier does', async () => {
    const mod = await freshImport();
    mod.setNotificationDecision('allow');
    const notifier: { notify: (opts: Record<string, unknown>) => void } = {
      notify: () => {
        throw new Error('boom');
      },
    };
    expect(() => mod.notifyInBackground('t', 'm', { __notifierOverride: notifier })).not.toThrow();
    // Give the microtask queue a tick to settle the fire-and-forget promise.
    await new Promise((r) => setImmediate(r));
  });

  it('isInteractiveEnv is false without a TTY and false under CI', async () => {
    const mod = await freshImport();
    // In the vitest runner both stdin.isTTY and stdout.isTTY are
    // undefined, so isInteractiveEnv() should be false.
    expect(mod.isInteractiveEnv()).toBe(false);
    process.env.CI = '1';
    expect(mod.isInteractiveEnv()).toBe(false);
  });
});

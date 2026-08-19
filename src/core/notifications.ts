/**
 * Native OS notifications for task completion.
 *
 * Wraps `node-notifier` with permission gating and best-effort dispatch:
 *
 * - Reads the `notifications` decision from `~/.alexi/config.json`
 *   (`allow` | `deny` | `ask`). `ask` (or unset) prompts the user once
 *   on the first call from an interactive TTY, then persists the decision.
 * - Non-interactive contexts (no TTY, `CI=1`, `ALEXI_NO_NOTIFICATIONS=1`,
 *   or an `ask` decision without a TTY) silently skip the notification —
 *   agents and CI runs never trigger surprise desktop alerts.
 * - All errors (node-notifier load failure, missing native binary,
 *   platform-specific dispatch error) are swallowed at `logger.debug`
 *   level. A broken notification MUST NOT take down the CLI.
 *
 * See issue #1449 for the full requirements list.
 */

import { getConfigValue, setConfigValue } from '../config/userConfig.js';
import { logger } from '../utils/logger.js';

/**
 * User's persisted decision. Stored under the `notifications` key in
 * `~/.alexi/config.json`. Any other value is treated as `ask`.
 */
export type NotificationDecision = 'allow' | 'deny' | 'ask';

const CONFIG_KEY = 'notifications';

/**
 * Minimum wall-clock duration (ms) before a bash / shell command
 * completion is considered "long-running" and eligible to trigger a
 * completion notification. Exposed so the bash tool and its tests can
 * share the same threshold.
 */
export const LONG_RUNNING_THRESHOLD_MS = 30_000;

/**
 * Options accepted by {@link sendNotification}. All are optional and are
 * forwarded to `node-notifier` (with best-effort dispatch — a platform
 * that does not support `sound` or `wait` silently ignores it).
 */
export interface SendNotificationOptions {
  /** Absolute path to an icon image. Ignored on platforms without icon support. */
  icon?: string;
  /** Play the OS default notification sound. */
  sound?: boolean;
  /** Block until the notification is dismissed. */
  wait?: boolean;
  /**
   * Override the platform-detection layer for testing. Consumers should
   * NOT set this in production code; it exists so unit tests can drive
   * the notifier without touching the real desktop environment.
   */
  __notifierOverride?: NotifierLike;
  /**
   * Override the interactive-prompt handler for testing. Same rules as
   * `__notifierOverride`.
   */
  __askOverride?: (title: string, message: string) => Promise<boolean>;
}

/**
 * Minimum surface node-notifier presents. Reduced to the single method
 * we call so `@types/node-notifier` is a devDependency (not a hard
 * runtime type import) and tests can pass an inline mock.
 */
export interface NotifierLike {
  notify(
    options: Record<string, unknown>,
    callback?: (err: Error | null, response?: string, metadata?: unknown) => void
  ): unknown;
}

/**
 * Detect whether we are attached to an interactive terminal that can
 * host an inquirer prompt. `CI` and the explicit disable flag both
 * short-circuit to `false` so agent workflows never prompt.
 */
export function isInteractiveEnv(): boolean {
  if (process.env.ALEXI_NO_NOTIFICATIONS === '1') {
    return false;
  }
  if (process.env.CI && process.env.CI !== '0' && process.env.CI !== 'false') {
    return false;
  }
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

/**
 * Read the current decision, coercing unknown / malformed values to
 * `ask` so callers never see arbitrary strings.
 */
export function getNotificationDecision(): NotificationDecision {
  const raw = getConfigValue(CONFIG_KEY);
  if (raw === 'allow' || raw === 'deny' || raw === 'ask') {
    return raw;
  }
  return 'ask';
}

/**
 * Persist a decision. Exposed for tests and future `/notifications`
 * command wiring.
 */
export function setNotificationDecision(decision: NotificationDecision): void {
  setConfigValue(CONFIG_KEY, decision);
}

/**
 * Default inquirer-backed permission prompt. Isolated so tests can
 * inject their own answer via `__askOverride` without stubbing
 * `@inquirer/prompts`.
 */
async function defaultAskUser(_title: string, _message: string): Promise<boolean> {
  try {
    const { confirm } = await import('@inquirer/prompts');
    return await confirm({
      message: 'Allow desktop notifications for task completion?',
      default: true,
    });
  } catch (err) {
    logger.debug('notification permission prompt failed', err);
    return false;
  }
}

/**
 * Cached dynamic-import handle for node-notifier. Loading is deferred
 * to the first `allow` call so users who disable notifications never
 * pay the native-binary probe cost.
 */
let cachedNotifier: NotifierLike | null | undefined;

async function loadNotifier(): Promise<NotifierLike | null> {
  if (cachedNotifier !== undefined) {
    return cachedNotifier;
  }
  try {
    const mod = (await import('node-notifier')) as unknown as {
      default?: NotifierLike;
      notify?: NotifierLike['notify'];
    };
    // node-notifier's ESM interop exposes the notifier both as `default`
    // and as a top-level `notify`. Prefer `default` when present.
    if (mod.default && typeof mod.default.notify === 'function') {
      cachedNotifier = mod.default;
    } else if (typeof mod.notify === 'function') {
      cachedNotifier = { notify: mod.notify.bind(mod) };
    } else {
      cachedNotifier = null;
    }
  } catch (err) {
    logger.debug('node-notifier failed to load', err);
    cachedNotifier = null;
  }
  return cachedNotifier;
}

/**
 * Test hook: reset the cached notifier so a subsequent call re-imports
 * (or picks up an override). Not exported from index modules — only
 * unit tests should call this.
 */
export function _resetNotifierCacheForTests(): void {
  cachedNotifier = undefined;
}

/**
 * Send an OS notification. Never throws — a failed dispatch resolves to
 * `false` after being logged at debug level. Returns `true` iff the
 * notification was actually handed to node-notifier without error.
 *
 * The permission decision is resolved on every call so that a user who
 * switches from `deny` to `allow` mid-session (via config edit or a
 * future `/notifications on` command) sees the change immediately.
 */
export async function sendNotification(
  title: string,
  message: string,
  options: SendNotificationOptions = {}
): Promise<boolean> {
  let decision = getNotificationDecision();

  if (decision === 'ask') {
    if (!isInteractiveEnv()) {
      // Non-interactive: cannot prompt; silently skip without
      // persisting so the user is prompted on their next interactive
      // run.
      return false;
    }
    const asker = options.__askOverride ?? defaultAskUser;
    let allowed: boolean;
    try {
      allowed = await asker(title, message);
    } catch (err) {
      logger.debug('notification permission prompt threw', err);
      return false;
    }
    decision = allowed ? 'allow' : 'deny';
    try {
      setNotificationDecision(decision);
    } catch (err) {
      // Persisting the decision is best-effort — a read-only home dir
      // must not crash the CLI. The in-memory decision is used for the
      // rest of this call; the prompt will re-appear next session.
      logger.debug('failed to persist notification decision', err);
    }
    if (decision === 'deny') {
      return false;
    }
  }

  if (decision !== 'allow') {
    return false;
  }

  const notifier = options.__notifierOverride ?? (await loadNotifier());
  if (!notifier) {
    return false;
  }

  const payload: Record<string, unknown> = {
    title,
    message,
  };
  if (options.icon) {
    payload.icon = options.icon;
  }
  if (options.sound !== undefined) {
    payload.sound = options.sound;
  }
  if (options.wait !== undefined) {
    payload.wait = options.wait;
  }

  return new Promise<boolean>((resolve) => {
    try {
      notifier.notify(payload, (err) => {
        if (err) {
          logger.debug('node-notifier reported error', err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    } catch (err) {
      logger.debug('node-notifier threw synchronously', err);
      resolve(false);
    }
  });
}

/**
 * Fire-and-forget helper for call sites that do not want to `await` the
 * notification. Errors are swallowed by {@link sendNotification} already;
 * this wrapper just discards the promise safely.
 */
export function notifyInBackground(
  title: string,
  message: string,
  options?: SendNotificationOptions
): void {
  void sendNotification(title, message, options).catch(() => {
    // sendNotification already swallows errors; this is defense-in-depth.
  });
}

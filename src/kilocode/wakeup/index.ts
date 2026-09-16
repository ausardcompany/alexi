/**
 * Wakeup scheduling engine.
 *
 * Ports upstream kilocode `packages/opencode/src/kilocode/wakeup/index.ts`
 * (commit b7070e507). Allows a running agent to schedule a future resume
 * of its session — useful for long-running SAP workflows that need to
 * poll a job, wait for a batch window, or defer follow-up work.
 *
 * Alexi_change: upstream uses `App.state` (Effect-TS) + drizzle-orm to
 * persist wakeups. Alexi doesn't ship a SQL runtime, so entries are
 * persisted as one JSON file per wakeup in `~/.alexi/wakeups/` and the
 * timer loop is a plain `setInterval`. The public surface (`schedule`,
 * `cancel`, `fireDue`, `list`) matches the upstream contract so the
 * companion tools (`schedule_wakeup` / `cancel_wakeup`) can be ported
 * verbatim.
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';
import { logger } from '../../utils/logger.js';
import { WakeupSchema } from './schema.js';
import { WakeupScheduled, WakeupCancelled, WakeupFired } from '../../bus/index.js';

const WAKEUP_DIR = path.join(os.homedir(), '.alexi', 'wakeups');

async function ensureDir(): Promise<void> {
  await fs.mkdir(WAKEUP_DIR, { recursive: true });
}

function entryPath(id: string): string {
  return path.join(WAKEUP_DIR, `${id}.json`);
}

/**
 * Normalize a `when` argument that may be either an ISO-8601 timestamp or
 * a relative duration string like `"5m"`, `"1h"`, `"30s"`, `"2d"`.
 * Returns an ISO-8601 string, or throws if the input cannot be parsed.
 */
export function normalizeWhen(when: string, now: Date = new Date()): string {
  const trimmed = when.trim();

  // Relative duration: <n><unit> where unit is s/m/h/d.
  const rel = /^(\d+)(ms|s|m|h|d)$/i.exec(trimmed);
  if (rel) {
    const value = Number.parseInt(rel[1], 10);
    const unit = rel[2].toLowerCase();
    const multiplier: Record<string, number> = {
      ms: 1,
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    const deltaMs = value * multiplier[unit];
    return new Date(now.getTime() + deltaMs).toISOString();
  }

  // Otherwise treat as ISO-8601 or any Date-parseable string.
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid wakeup 'when' value: ${when}`);
  }
  return parsed.toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- mirrors upstream kilocode API shape
export namespace Wakeup {
  export interface ScheduleOptions {
    sessionID: string;
    /**
     * Alexi_change (kilocode 16831a04e): session INSTANCE id. A session id
     * can be reused across restarts, but the instance id is minted fresh
     * on each session activation. Persisted with the entry so a later
     * `cancel({ instanceID })` from a different session instance is
     * treated as a no-op instead of wiping a live wakeup.
     */
    instanceID?: string;
    when: string;
    reason: string;
    payload?: Record<string, unknown>;
  }

  export interface CancelOptions {
    sessionID: string;
    /**
     * Alexi_change (kilocode 16831a04e): if provided, only cancel wakeups
     * whose stored `instanceID` matches. When the caller's instance id
     * disagrees with the entry's stored one, the cancel is ignored and
     * `{ cancelled: false }` is returned — the wakeup belongs to a
     * different session instance (e.g. after a restart).
     */
    instanceID?: string;
    wakeupID?: string;
    /**
     * Optional reason for the cancel. Recorded in logs so operators can
     * distinguish tool-initiated cancels from session-delete cleanup.
     * Alexi_change (kilocode a0bd23321).
     */
    reason?: 'manual' | 'session-delete' | 'tool';
  }

  /**
   * Schedule a new wakeup. Persists to disk and returns the created entry.
   */
  export async function schedule(opts: ScheduleOptions): Promise<WakeupSchema.Entry> {
    await ensureDir();
    const now = new Date();
    const entry: WakeupSchema.Entry = {
      id: randomUUID(),
      sessionID: opts.sessionID,
      instanceID: opts.instanceID,
      at: normalizeWhen(opts.when, now),
      reason: opts.reason,
      payload: opts.payload,
      status: 'pending',
      createdAt: now.toISOString(),
    };
    await fs.writeFile(entryPath(entry.id), JSON.stringify(entry, null, 2), 'utf-8');
    logger.info('[wakeup] scheduled', {
      id: entry.id,
      sessionID: entry.sessionID,
      instanceID: entry.instanceID,
      at: entry.at,
    });
    // Alexi_change: publish wakeup lifecycle event. Best-effort — publish
    // errors are swallowed by the bus (see `defineEvent`), so a
    // misconfigured subscriber cannot block the scheduling path.
    try {
      WakeupScheduled.publish({
        wakeupID: entry.id,
        sessionID: entry.sessionID,
        instanceID: entry.instanceID,
        at: entry.at,
        reason: entry.reason,
        timestamp: Date.now(),
      });
    } catch (err) {
      logger.debug('[wakeup] failed to publish WakeupScheduled', {
        err: err instanceof Error ? err.message : String(err),
      });
    }
    return entry;
  }

  /**
   * Cancel a pending wakeup. Returns `{ cancelled: true }` if the entry
   * existed AND belonged to the given session AND was still pending;
   * `{ cancelled: false }` otherwise. Idempotent — cancelling an already
   * cancelled or fired wakeup is a no-op that returns `false`.
   *
   * Alexi_change (kilocode 16831a04e): when `wakeupID` is omitted, cancel
   * ALL pending wakeups matching `sessionID` (and, if provided,
   * `instanceID`). Called from `SessionManager.deleteSession` to sweep
   * orphaned wakeups when a session is torn down.
   */
  export async function cancel(
    opts: CancelOptions
  ): Promise<{ cancelled: boolean; cancelledCount?: number }> {
    // Bulk cancel path: no wakeupID → sweep all pending entries for this
    // session (optionally instance-scoped).
    if (!opts.wakeupID) {
      const entries = await list(opts.sessionID);
      let cancelledCount = 0;
      for (const entry of entries) {
        if (entry.status !== 'pending') {
          continue;
        }
        if (opts.instanceID && entry.instanceID && entry.instanceID !== opts.instanceID) {
          logger.debug('[wakeup] skipping stale-instance cancel', {
            id: entry.id,
            evtInstance: opts.instanceID,
            entryInstance: entry.instanceID,
          });
          continue;
        }
        const updated: WakeupSchema.Entry = { ...entry, status: 'cancelled' };
        try {
          await fs.writeFile(entryPath(entry.id), JSON.stringify(updated, null, 2), 'utf-8');
          cancelledCount++;
          logger.info('[wakeup] cancelled', {
            id: entry.id,
            sessionID: entry.sessionID,
            reason: opts.reason ?? 'manual',
          });
        } catch (err) {
          logger.warn('[wakeup] failed to cancel during sweep', {
            id: entry.id,
            err: err instanceof Error ? err.message : String(err),
          });
        }
      }
      if (cancelledCount > 0) {
        try {
          WakeupCancelled.publish({
            sessionID: opts.sessionID,
            instanceID: opts.instanceID,
            reason: opts.reason,
            cancelledCount,
            timestamp: Date.now(),
          });
        } catch (err) {
          logger.debug('[wakeup] failed to publish WakeupCancelled (bulk)', {
            err: err instanceof Error ? err.message : String(err),
          });
        }
      }
      return { cancelled: cancelledCount > 0, cancelledCount };
    }

    const entry = await read(opts.wakeupID);
    if (!entry) {
      return { cancelled: false };
    }
    if (entry.sessionID !== opts.sessionID) {
      return { cancelled: false };
    }
    // Alexi_change (kilocode 16831a04e): if instance IDs disagree, the
    // wakeup belongs to a different session instance — ignore the cancel.
    if (opts.instanceID && entry.instanceID && entry.instanceID !== opts.instanceID) {
      logger.debug('[wakeup] ignoring cancel for stale instance', {
        id: entry.id,
        evtInstance: opts.instanceID,
        entryInstance: entry.instanceID,
      });
      return { cancelled: false };
    }
    if (entry.status !== 'pending') {
      return { cancelled: false };
    }
    const updated: WakeupSchema.Entry = { ...entry, status: 'cancelled' };
    await fs.writeFile(entryPath(entry.id), JSON.stringify(updated, null, 2), 'utf-8');
    logger.info('[wakeup] cancelled', {
      id: entry.id,
      sessionID: entry.sessionID,
      reason: opts.reason ?? 'manual',
    });
    try {
      WakeupCancelled.publish({
        wakeupID: entry.id,
        sessionID: entry.sessionID,
        instanceID: entry.instanceID,
        reason: opts.reason,
        cancelledCount: 1,
        timestamp: Date.now(),
      });
    } catch (err) {
      logger.debug('[wakeup] failed to publish WakeupCancelled', {
        err: err instanceof Error ? err.message : String(err),
      });
    }
    return { cancelled: true };
  }

  /**
   * Read a single wakeup by id, or `null` if it does not exist / is
   * corrupt on disk.
   */
  export async function read(id: string): Promise<WakeupSchema.Entry | null> {
    try {
      const raw = await fs.readFile(entryPath(id), 'utf-8');
      const parsed = WakeupSchema.Entry.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  }

  /**
   * List all wakeups, optionally filtered by session id.
   */
  export async function list(sessionID?: string): Promise<WakeupSchema.Entry[]> {
    try {
      await ensureDir();
      const files = await fs.readdir(WAKEUP_DIR);
      const entries: WakeupSchema.Entry[] = [];
      for (const file of files) {
        if (!file.endsWith('.json')) {
          continue;
        }
        const id = file.slice(0, -'.json'.length);
        const entry = await read(id);
        if (!entry) {
          continue;
        }
        if (sessionID && entry.sessionID !== sessionID) {
          continue;
        }
        entries.push(entry);
      }
      return entries;
    } catch {
      return [];
    }
  }

  /**
   * Return all pending wakeups whose `at` timestamp is <= `now` and mark
   * them as fired on disk. Callers are responsible for actually resuming
   * the associated sessions (see `./resume.ts`).
   */
  export async function fireDue(now: Date = new Date()): Promise<WakeupSchema.Entry[]> {
    const all = await list();
    const due: WakeupSchema.Entry[] = [];
    for (const entry of all) {
      if (entry.status !== 'pending') {
        continue;
      }
      if (new Date(entry.at).getTime() <= now.getTime()) {
        const fired: WakeupSchema.Entry = { ...entry, status: 'fired' };
        try {
          await fs.writeFile(entryPath(entry.id), JSON.stringify(fired, null, 2), 'utf-8');
          due.push(fired);
          try {
            WakeupFired.publish({
              wakeupID: fired.id,
              sessionID: fired.sessionID,
              instanceID: fired.instanceID,
              at: fired.at,
              reason: fired.reason,
              timestamp: Date.now(),
            });
          } catch (evtErr) {
            logger.debug('[wakeup] failed to publish WakeupFired', {
              err: evtErr instanceof Error ? evtErr.message : String(evtErr),
            });
          }
        } catch (err) {
          logger.warn('[wakeup] failed to mark fired', {
            id: entry.id,
            err: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }
    return due;
  }
}

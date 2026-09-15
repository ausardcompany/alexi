/**
 * Wakeup Schema
 *
 * Ports upstream kilocode `packages/opencode/src/kilocode/wakeup/schema.ts`
 * (commit b7070e507). A wakeup is a scheduled future resume of a session
 * — the agent asks "please wake me up at T with this payload" and, when
 * the timer fires, the session is resumed with `reason` and `payload` as
 * additional context.
 *
 * Alexi_change: no drizzle-orm / SQLite. Entries are persisted as JSON
 * files under `~/.alexi/wakeups/` so this feature can be layered on top
 * of Alexi's existing filesystem-backed session store without pulling in
 * a SQL dependency. The Zod schema below is the source of truth for the
 * on-disk shape.
 */

import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-namespace -- mirrors upstream kilocode API shape
export namespace WakeupSchema {
  export const Status = z.enum(['pending', 'fired', 'cancelled']);
  export type Status = z.infer<typeof Status>;

  export const Entry = z.object({
    /** Unique wakeup identifier, generated at schedule time. */
    id: z.string(),
    /** Owning session id — a wakeup fires against exactly one session. */
    sessionID: z.string(),
    /** ISO-8601 timestamp of when the wakeup should fire. */
    at: z.string(),
    /** Human-readable reason surfaced back to the agent on resume. */
    reason: z.string(),
    /**
     * Opaque payload the scheduling agent wants to receive on resume.
     * Kept as `Record<string, unknown>` so callers can round-trip any
     * JSON structure without a schema migration.
     */
    payload: z.record(z.string(), z.unknown()).optional(),
    /** Current lifecycle state of the wakeup. */
    status: Status,
    /** ISO-8601 timestamp of when the wakeup was scheduled. */
    createdAt: z.string(),
  });
  export type Entry = z.infer<typeof Entry>;
}

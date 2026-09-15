/**
 * Wakeup resume helper.
 *
 * Ports upstream kilocode `packages/opencode/src/kilocode/wakeup/resume.ts`
 * (commit b7070e507). When a `pending` wakeup's `at` timestamp elapses,
 * this module is responsible for converting the wakeup entry into a
 * resume instruction that the SessionManager can enqueue as a synthetic
 * user turn.
 *
 * Alexi_change: the upstream helper wires directly into opencode's
 * Effect-TS session runtime. Alexi's SessionManager takes plain
 * async / await, so `resume()` here returns a `ResumeInstruction` value
 * object and lets the caller decide how to inject it. Downstream
 * orchestration in `src/core/sessionManager.ts` should consume the
 * `ResumeInstruction` verbatim when the wakeup subsystem is wired up
 * against a live SessionManager instance.
 */

import type { WakeupSchema } from './schema.js';

export interface ResumeInstruction {
  /** Session that should be resumed. */
  sessionID: string;
  /** Synthetic user-role message describing why the session is waking up. */
  message: string;
  /** Opaque payload the scheduling agent attached at schedule time. */
  payload?: Record<string, unknown>;
  /** Original wakeup id so downstream telemetry can correlate. */
  wakeupID: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- mirrors upstream kilocode API shape
export namespace WakeupResume {
  /**
   * Convert a fired wakeup entry into a `ResumeInstruction` ready for
   * injection into a session. Kept synchronous and side-effect-free so
   * callers can decide whether the resume is delivered via the persistent
   * SessionManager (production) or via a mocked bus (tests).
   */
  export function resume(entry: WakeupSchema.Entry): ResumeInstruction {
    const message = [
      `<system-reminder source="wakeup">`,
      `Scheduled wakeup ${entry.id} fired at ${entry.at}.`,
      `Reason: ${entry.reason}`,
      `</system-reminder>`,
    ].join('\n');
    return {
      sessionID: entry.sessionID,
      message,
      payload: entry.payload,
      wakeupID: entry.id,
    };
  }
}

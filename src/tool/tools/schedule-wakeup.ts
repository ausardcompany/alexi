/**
 * schedule_wakeup Tool
 *
 * Ports upstream kilocode `packages/opencode/src/kilocode/tool/schedule-wakeup.ts`
 * (commit b7070e507). Allows an agent to schedule a future resume of its
 * own session — the model asks "wake me up in 5m to check the batch job"
 * and the wakeup subsystem (`src/kilocode/wakeup/`) enqueues a synthetic
 * user turn when the timestamp elapses. Useful for long-running SAP AI
 * Core workflows that block on external batches, approvals, or backoffs.
 *
 * Alexi_change: uses `defineTool` (not upstream `Tool.define`), inline
 * description string (Alexi doesn't `import DESCRIPTION from './x.txt'`),
 * and Alexi's filesystem-backed wakeup store instead of drizzle/SQLite.
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import { Wakeup } from '../../kilocode/wakeup/index.js';

const ScheduleWakeupParamsSchema = z.object({
  when: z
    .string()
    .describe(
      "ISO 8601 timestamp (e.g. '2026-09-15T12:00:00Z') or relative duration ('5m', '1h', '30s', '2d')"
    ),
  reason: z.string().describe('Why the wakeup is scheduled — surfaced back to the agent on resume'),
  payload: z
    .record(z.unknown())
    .optional()
    .describe('Optional opaque payload delivered to the resumed session'),
});

interface ScheduleWakeupResult {
  wakeupID: string;
  at: string;
}

export const scheduleWakeupTool = defineTool<
  typeof ScheduleWakeupParamsSchema,
  ScheduleWakeupResult
>({
  name: 'schedule_wakeup',
  description: `Schedule a future resume of the current session.

Use this tool when you need to:
- Wait for a long-running SAP job / batch / approval and check back later.
- Retry a step after a backoff period without holding the connection open.
- Break a large workflow into deferred checkpoints.

Provide 'when' as either an ISO 8601 timestamp or a relative duration like
'5m', '1h', '30s', '2d'. The 'reason' string is surfaced back to the agent
as a system-reminder when the session resumes. The optional 'payload' is
round-tripped verbatim so the resumed turn can pick up context.

To cancel a pending wakeup, call 'cancel_wakeup' with the returned wakeupID.`,

  parameters: ScheduleWakeupParamsSchema,

  async execute(params, context): Promise<ToolResult<ScheduleWakeupResult>> {
    if (!context.sessionId) {
      return {
        success: false,
        error: 'schedule_wakeup requires an active session context',
      };
    }
    try {
      const entry = await Wakeup.schedule({
        sessionID: context.sessionId,
        when: params.when,
        reason: params.reason,
        payload: params.payload,
      });
      return {
        success: true,
        data: { wakeupID: entry.id, at: entry.at },
        hint: `Wakeup ${entry.id} scheduled for ${entry.at}: ${params.reason}`,
        metadata: { wakeupID: entry.id, at: entry.at },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Failed to schedule wakeup: ${message}` };
    }
  },
});

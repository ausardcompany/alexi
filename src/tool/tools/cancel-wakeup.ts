/**
 * cancel_wakeup Tool
 *
 * Ports upstream kilocode `packages/opencode/src/kilocode/tool/cancel-wakeup.ts`
 * (commit b7070e507). Companion to `schedule_wakeup` — allows an agent to
 * cancel a previously scheduled wakeup by id. Idempotent: cancelling an
 * unknown, already-fired, or foreign-session wakeup returns
 * `{ cancelled: false }` rather than an error, so agents can safely
 * clean up without pre-checking.
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import { Wakeup } from '../../kilocode/wakeup/index.js';

const CancelWakeupParamsSchema = z.object({
  wakeupID: z.string().describe('ID of the wakeup to cancel (returned by schedule_wakeup)'),
});

interface CancelWakeupResult {
  cancelled: boolean;
  wakeupID: string;
}

export const cancelWakeupTool = defineTool<typeof CancelWakeupParamsSchema, CancelWakeupResult>({
  name: 'cancel_wakeup',
  description: `Cancel a previously scheduled wakeup by id.

Idempotent: cancelling an unknown, already-fired, or foreign-session
wakeup returns { cancelled: false } instead of raising an error, so
you can call this defensively without pre-checking the wakeup state.`,

  parameters: CancelWakeupParamsSchema,

  async execute(params, context): Promise<ToolResult<CancelWakeupResult>> {
    if (!context.sessionId) {
      return {
        success: false,
        error: 'cancel_wakeup requires an active session context',
      };
    }
    try {
      const result = await Wakeup.cancel({
        sessionID: context.sessionId,
        wakeupID: params.wakeupID,
        // Alexi_change (kilocode 16831a04e / a0bd23321): tag the cancel with
        // the tool source so operator logs can distinguish tool-initiated
        // cancels from session-delete sweeps.
        reason: 'tool',
      });
      return {
        success: true,
        data: { cancelled: result.cancelled, wakeupID: params.wakeupID },
        hint: result.cancelled
          ? `Wakeup ${params.wakeupID} cancelled`
          : `No pending wakeup with id ${params.wakeupID}`,
        metadata: { cancelled: result.cancelled },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Failed to cancel wakeup: ${message}` };
    }
  },
});

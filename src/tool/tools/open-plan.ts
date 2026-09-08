/**
 * Open Plan Tool
 *
 * Ports upstream kilocode `6024a76db feat(vscode): open agent-created plans`
 * and `325656483 fix(vscode): scope plan opens to active session`. Upstream
 * the tool asks the VSCode host to open a plan markdown file in an editor
 * pane; Alexi has no VSCode webview so we adapt it to a CLI-friendly
 * "notify plan-ready" signal:
 *
 *   1. Validate that the referenced file exists AND has a `.md` extension
 *      (dedupe upstream `15041d024`) — refuses arbitrary paths.
 *   2. Publish a `plan.opened` event on the shared bus so downstream
 *      listeners (TUI, SAP integration, external CI hooks) can react.
 *   3. Return the resolved absolute path so the calling agent can echo the
 *      location back to the user.
 *
 * The tool intentionally does NOT try to spawn an editor process — Alexi
 * runs headlessly in CI just as often as in a terminal, and forking an
 * editor there would deadlock.
 */

import { z } from 'zod';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { defineEvent } from '../../bus/index.js';
import { defineTool, type ToolResult } from '../index.js';

/**
 * Event fired whenever an agent surfaces a plan markdown file for review.
 * TUIs and CI integrations can subscribe to render / attach the plan.
 */
export const PlanOpened = defineEvent(
  'plan.opened',
  z.object({
    sessionId: z.string().optional(),
    path: z.string(),
    title: z.string().optional(),
    timestamp: z.number(),
  })
);

const OpenPlanParamsSchema = z.object({
  path: z.string().describe('Absolute or workspace-relative path to the plan markdown file'),
  title: z.string().optional().describe('Optional human-readable title'),
});

export interface OpenPlanResult {
  path: string;
  title: string;
}

export const openPlanTool = defineTool<typeof OpenPlanParamsSchema, OpenPlanResult>({
  name: 'open_plan',
  description: `Signal that an agent-authored plan file is ready for review.

Publishes a plan.opened event on the shared bus so the TUI or an external
integration can surface the plan to the user. The referenced file MUST
exist and MUST end in .md — arbitrary paths are rejected.

Parameters:
- path: Absolute or workdir-relative path to the plan markdown file.
- title: Optional human-readable title; defaults to the basename.`,

  parameters: OpenPlanParamsSchema,

  async execute(params, context): Promise<ToolResult<OpenPlanResult>> {
    const base = context.workdir || process.cwd();
    const resolved = path.isAbsolute(params.path) ? params.path : path.resolve(base, params.path);

    const stat = await fs.stat(resolved).catch(() => null);
    if (!stat || !stat.isFile()) {
      return {
        success: false,
        error: `Plan file not found: ${resolved}`,
      };
    }
    if (!resolved.endsWith('.md')) {
      return {
        success: false,
        error: `Plan must be a markdown file: ${resolved}`,
      };
    }

    const title = params.title ?? path.basename(resolved);

    // Emit event for CLI listeners / SAP integration to consume.
    // Publish failures (schema mismatch) should not crash the tool, so
    // wrap in try/catch — this is a notification, not a side effect the
    // agent depends on for correctness.
    try {
      PlanOpened.publish({
        sessionId: context.sessionId,
        path: resolved,
        title,
        timestamp: Date.now(),
      });
    } catch {
      // Non-fatal.
    }

    return {
      success: true,
      data: {
        path: resolved,
        title,
      },
    };
  },
});

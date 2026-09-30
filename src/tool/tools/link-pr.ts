/**
 * `link_pr` tool
 *
 * Ports upstream kilocode `c98f8740c` / `154a8427c` / `9076f0301` /
 * `56ab1e502` / `9cc0a9158`. The model uses this tool to associate a
 * pull request URL with the current Alexi session so downstream tooling
 * (revert, code review, session sidebar) can surface the PR context.
 *
 * Alexi-specific behaviour:
 *   1. The tool is only functional on CLI backends (`ALEXI_CLIENT=cli`).
 *      When embedded in a non-CLI host (SAP BAS extension, VS Code
 *      webview) the tool returns an `unsupported_client` refusal
 *      instead of corrupting session state. See `session/pr-link.ts`
 *      `enabled()`.
 *   2. Links are stored PER SESSION via `recordSessionLink`, never
 *      against the shared worktree — this stops a link explicitly made
 *      by one session from fanning out to a sibling session sharing
 *      the same checkout (SAP tenant isolation).
 *   3. Host/owner/repo are cross-checked against the worktree's remote
 *      before persistence. A link to a fork or an unrelated repo is
 *      refused with `worktree_mismatch`.
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import {
  enabled as prEnabled,
  parsePrUrl,
  recordSessionLink,
  type SessionPrLink,
} from '../../session/pr-link.js';
import { logger } from '../../utils/logger.js';

const LinkPrParamsSchema = z.object({
  url: z
    .string()
    .describe('Full URL of the pull request to link (e.g. https://github.com/owner/repo/pull/123).'),
});

export interface LinkPrResult {
  ok: boolean;
  reason?:
    | 'unsupported_client'
    | 'invalid_url'
    | 'worktree_mismatch'
    | 'storage_error'
    | 'missing_session';
  link?: SessionPrLink['link'];
}

export const linkPrTool = defineTool<typeof LinkPrParamsSchema, LinkPrResult>({
  name: 'link_pr',
  description: `Associate a pull request URL with the current session.

The link is persisted for THIS session only (not the shared worktree).
The tool refuses URLs whose host/owner/repo do not match the current
worktree's git remote — a safeguard against linking a fork or an
unrelated repo. On non-CLI backends the tool is unavailable and
returns an "unsupported_client" refusal.

Parameters:
- url: Full URL of the pull request (GitHub, GitLab, and Azure DevOps
  URL shapes are recognized).`,

  parameters: LinkPrParamsSchema,

  async execute(params, context): Promise<ToolResult<LinkPrResult>> {
    // Gate first — matches upstream `154a8427c`. On non-CLI backends
    // we return a soft refusal rather than throwing, because the model
    // may still be usable, it just cannot persist PR links.
    if (!prEnabled()) {
      return {
        success: false,
        error: 'Session PR linking is only available in CLI backends.',
        data: { ok: false, reason: 'unsupported_client' },
      };
    }

    const link = parsePrUrl(params.url);
    if (!link) {
      return {
        success: false,
        error: `Not a recognizable pull-request URL: ${params.url}`,
        data: { ok: false, reason: 'invalid_url' },
      };
    }

    const sessionId = context.sessionId;
    if (!sessionId) {
      // A session-scoped tool without a session id would silently drop
      // the record — fail loudly instead so the caller can retry with
      // a proper session context.
      return {
        success: false,
        error: 'link_pr requires an active session; no sessionId in tool context.',
        data: { ok: false, reason: 'missing_session' },
      };
    }

    const worktree = context.workdir || process.cwd();

    try {
      const stored = await recordSessionLink(sessionId, { link, evidence: 'user' }, worktree);
      if (!stored) {
        return {
          success: false,
          error:
            "The PR does not match this session's worktree (different host/owner/repo).",
          data: { ok: false, reason: 'worktree_mismatch' },
        };
      }
      return {
        success: true,
        data: { ok: true, link: stored.link },
      };
    } catch (err) {
      logger.warn('link_pr: failed to record session link', { err });
      return {
        success: false,
        error: 'Could not persist the PR link for this session.',
        data: { ok: false, reason: 'storage_error' },
      };
    }
  },
});

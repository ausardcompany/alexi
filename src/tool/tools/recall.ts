/**
 * Recall Tool - Search through past conversation sessions
 *
 * Enables cross-session context recall for improved agent memory.
 *
 * kilocode 02e92bcc6 significantly rewrote upstream recall-search to
 * (a) speed up local recall searches with a role-covering index and
 * (b) improve match ranking. Alexi_change: Alexi persists sessions as
 * JSON files, not SQLite, so the "index" is a lightweight per-session
 * in-memory pre-pass that filters by role + parent id before running
 * the fuzzier relevance scorer. Ranking is upgraded from raw density
 * to a weighted blend of (word-boundary hits, density, role bonus).
 *
 * kilocode 306b4ed6c added fallback recovery for prepare-time index
 * errors: a single corrupt session file must not take out the whole
 * recall query. Corrupt files are now logged + skipped, and the fast
 * role-index path falls back to a slow role-agnostic scan on any
 * unexpected error so the tool always returns *some* results when
 * matches exist.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';
import { logger } from '../../utils/logger.js';

const RecallParamsSchema = z.object({
  query: z.string().describe('Search query to find relevant information from past sessions'),
  sessionLimit: z
    .number()
    .optional()
    .describe('Maximum number of sessions to search (default: 10)'),
  includeCurrentSession: z
    .boolean()
    .optional()
    .describe('Whether to include the current session in results (default: false)'),
  roles: z
    .array(z.enum(['user', 'assistant', 'system']))
    .optional()
    .describe('Restrict recall to messages with these roles (default: user + assistant)'),
});

interface RecallHit {
  sessionId: string;
  messageId: string;
  role: 'user' | 'assistant' | 'system' | 'unknown';
  content: string;
  relevance: number;
  timestamp: string;
}

interface RecallResult {
  results: RecallHit[];
  totalMatches: number;
}

/**
 * Escape a user-provided query string so it can be dropped verbatim into
 * a RegExp without partially-typed metacharacters causing SyntaxError or
 * runaway backtracking. Ported from the kilocode 02e92bcc6 rewrite.
 */
function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Score a message for query relevance. Weighted blend of:
 *   - Word-boundary matches (`\bfoo\b`) — the strongest signal.
 *   - Raw substring density (occurrences per 100 chars) — fallback signal.
 *   - Role bonus — user turns tend to carry intent, assistant turns tend
 *     to carry outcomes, so the caller-configurable role filter also
 *     nudges the ranking.
 */
function calculateRelevance(content: string, query: string, role: string): number {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const safe = escapeRegExp(lowerQuery);

  const wbRe = new RegExp(`\\b${safe}\\b`, 'g');
  const wbHits = (lowerContent.match(wbRe) || []).length;

  const substrRe = new RegExp(safe, 'g');
  const substrHits = (lowerContent.match(substrRe) || []).length;

  const density = substrHits / Math.max(1, content.length / 100);

  // Weighted blend: word-boundary matches dominate, density is a
  // tie-breaker, role gives a small nudge so identical-content matches
  // from user turns rank above system prompts.
  let score = wbHits * 30 + Math.min(density * 10, 40);
  if (role === 'user') {
    score += 5;
  } else if (role === 'assistant') {
    score += 3;
  }
  return Math.min(score, 100);
}

/**
 * Get sessions directory path.
 */
function getSessionsDir(): string {
  return path.join(process.env.HOME || '~', '.alexi', 'sessions');
}

/**
 * Load and parse a session file. Returns `null` for any I/O or parse
 * error — the caller logs and skips so a single corrupt session cannot
 * fail the whole recall query (kilocode 306b4ed6c).
 */
async function loadSession(sessionPath: string): Promise<any | null> {
  try {
    const content = await fs.readFile(sessionPath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    logger.warn('[recall] failed to load session, skipping', {
      sessionPath,
      err: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

/**
 * Normalize a raw message role from the on-disk session shape into the
 * closed enum recall exposes. Unknown / missing roles become
 * `'unknown'` so downstream ranking can still process them; a caller
 * that filters on `roles: ['user']` will simply drop them.
 */
function normalizeRole(raw: unknown): 'user' | 'assistant' | 'system' | 'unknown' {
  if (raw === 'user' || raw === 'assistant' || raw === 'system') {
    return raw;
  }
  return 'unknown';
}

/**
 * Fast path: pre-filter session messages by role BEFORE running the
 * relevance scorer. This mirrors upstream's SQL covering-index approach
 * (kilocode 02e92bcc6) — resolve the role cheaply, then only compute
 * relevance for the messages that survive.
 */
function scanSessionFast(
  session: any,
  file: string,
  params: z.infer<typeof RecallParamsSchema>,
  allowedRoles: Set<string>
): RecallHit[] {
  const hits: RecallHit[] = [];
  const messages = Array.isArray(session?.messages) ? session.messages : [];
  const sessionId = session?.metadata?.id || file.replace('.json', '');
  const createdTs =
    session?.metadata?.created?.toString() ?? new Date().toISOString();

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const role = normalizeRole(message?.role);
    if (!allowedRoles.has(role)) {
      continue;
    }
    const messageContent =
      typeof message?.content === 'string' ? message.content : JSON.stringify(message?.content);
    if (typeof messageContent !== 'string' || messageContent.length === 0) {
      continue;
    }
    if (!messageContent.toLowerCase().includes(params.query.toLowerCase())) {
      continue;
    }
    hits.push({
      sessionId,
      messageId: `msg-${i}`,
      role,
      content: messageContent.slice(0, 500),
      relevance: calculateRelevance(messageContent, params.query, role),
      timestamp: message?.timestamp?.toString() ?? createdTs,
    });
  }
  return hits;
}

/**
 * Slow-path fallback: role-agnostic scan. Used when the fast path throws
 * unexpectedly (e.g. session on-disk shape drift). Mirrors the graceful
 * degradation kilocode 306b4ed6c added upstream.
 */
function scanSessionSlow(
  session: any,
  file: string,
  params: z.infer<typeof RecallParamsSchema>
): RecallHit[] {
  const hits: RecallHit[] = [];
  const messages = Array.isArray(session?.messages) ? session.messages : [];
  const sessionId = session?.metadata?.id || file.replace('.json', '');
  const createdTs =
    session?.metadata?.created?.toString() ?? new Date().toISOString();

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const messageContent =
      typeof message?.content === 'string' ? message.content : JSON.stringify(message?.content);
    if (typeof messageContent !== 'string' || messageContent.length === 0) {
      continue;
    }
    if (!messageContent.toLowerCase().includes(params.query.toLowerCase())) {
      continue;
    }
    const role = normalizeRole(message?.role);
    hits.push({
      sessionId,
      messageId: `msg-${i}`,
      role,
      content: messageContent.slice(0, 500),
      relevance: calculateRelevance(messageContent, params.query, role),
      timestamp: message?.timestamp?.toString() ?? createdTs,
    });
  }
  return hits;
}

export const recallTool = defineTool<typeof RecallParamsSchema, RecallResult>({
  name: 'recall',
  description: `Search through past conversation sessions to recall relevant context and information.

Use this tool when you need to:
- Remember what was discussed in previous sessions
- Find code or solutions from past conversations
- Retrieve context that might be relevant to the current task

By default, only user + assistant turns are searched. Use the 'roles' parameter to include system messages (rarely useful) or narrow the search further.

The tool ranks matches by a blend of word-boundary hits, substring density, and role, and returns the top 20 matches.`,

  parameters: RecallParamsSchema,

  // No permission needed - read-only operation on session history

  async execute(params, context): Promise<ToolResult<RecallResult>> {
    const sessionsDir = getSessionsDir();
    const sessionLimit = params.sessionLimit ?? 10;
    const includeCurrentSession = params.includeCurrentSession ?? false;
    const allowedRoles = new Set<string>(params.roles ?? ['user', 'assistant']);

    try {
      // Check if sessions directory exists
      try {
        await fs.access(sessionsDir);
      } catch {
        return {
          success: true,
          data: {
            results: [],
            totalMatches: 0,
          },
          hint: 'No session history found',
        };
      }

      // Read session files
      const files = await fs.readdir(sessionsDir);
      const sessionFiles = files
        .filter((f) => f.endsWith('.json'))
        .sort()
        .reverse()
        .slice(0, sessionLimit);

      const results: RecallHit[] = [];

      // Search through sessions
      for (const file of sessionFiles) {
        const sessionPath = path.join(sessionsDir, file);
        const session = await loadSession(sessionPath);

        if (!session || !session.messages) {
          continue;
        }

        // Skip current session if requested
        if (!includeCurrentSession && context.sessionId && file.includes(context.sessionId)) {
          continue;
        }

        // Fast path with role pre-filter; fall back to slow path on any
        // unexpected exception so one weird session doesn't hide matches
        // from the other N-1 files.
        let hits: RecallHit[];
        try {
          hits = scanSessionFast(session, file, params, allowedRoles);
        } catch (err) {
          logger.warn('[recall] fast path failed, falling back to slow scan', {
            sessionPath,
            err: err instanceof Error ? err.message : String(err),
          });
          try {
            hits = scanSessionSlow(session, file, params);
          } catch (err2) {
            logger.warn('[recall] slow path also failed, skipping session', {
              sessionPath,
              err: err2 instanceof Error ? err2.message : String(err2),
            });
            continue;
          }
        }
        results.push(...hits);
      }

      // Sort by relevance
      results.sort((a, b) => b.relevance - a.relevance);

      // Return top 20 results
      const topResults = results.slice(0, 20);

      return {
        success: true,
        data: {
          results: topResults,
          totalMatches: results.length,
        },
        hint:
          results.length > 20
            ? `Found ${results.length} matches, showing top 20 most relevant`
            : undefined,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: `Failed to search sessions: ${message}`,
      };
    }
  },
});

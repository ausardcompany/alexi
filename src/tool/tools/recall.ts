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
  /**
   * True when the primary substring search returned zero results and the
   * fallback title-typo scan was used to produce approximate matches.
   * Callers should treat these hits as "close but not exact" and may want
   * to prompt the user to refine the query.
   */
  partialMatch?: boolean;
  /**
   * Query terms that could not be matched (exact or via distance-1 typo)
   * in any of the returned hits. Populated only for `partialMatch: true`
   * responses so the caller can surface which words are still missing.
   */
  missingTerms?: string[];
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
 * Return `true` iff the Levenshtein edit distance between `a` and `b` is
 * exactly 1 (single insertion, deletion, or substitution). Distance 0
 * (identical strings) returns `false` — callers use exact-match logic for
 * that case. Runs in O(max(|a|,|b|)) with an early exit when the length
 * difference alone rules out a distance-1 relationship.
 *
 * Used for session-title typo tolerance: the fallback scan only fires
 * when the primary substring search returned zero results, and only over
 * short title strings, so the naive scan is cheap enough in practice.
 */
function isDistanceOne(a: string, b: string): boolean {
  if (a === b) {
    return false;
  }
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) {
    return false;
  }

  // Substitution case: same length, count mismatches.
  if (la === lb) {
    let diff = 0;
    for (let i = 0; i < la; i++) {
      if (a[i] !== b[i]) {
        diff++;
        if (diff > 1) {
          return false;
        }
      }
    }
    return diff === 1;
  }

  // Insertion / deletion case: the shorter string must equal the longer
  // one with a single character removed. Walk both strings in lockstep
  // and allow exactly one "skip" on the longer side.
  const shorter = la < lb ? a : b;
  const longer = la < lb ? b : a;
  let i = 0;
  let j = 0;
  let skipped = false;
  while (i < shorter.length && j < longer.length) {
    if (shorter[i] === longer[j]) {
      i++;
      j++;
      continue;
    }
    if (skipped) {
      return false;
    }
    skipped = true;
    j++;
  }
  return true;
}

/**
 * Check whether `token` matches `word` exactly or with a single-character
 * typo (Levenshtein distance 1). Returns `'exact' | 'typo' | null`.
 * Comparisons are case-insensitive; callers pass already-lowercased
 * strings for speed, but the function is defensive.
 */
function tokenMatchKind(token: string, word: string): 'exact' | 'typo' | null {
  const t = token.toLowerCase();
  const w = word.toLowerCase();
  if (t === w) {
    return 'exact';
  }
  if (isDistanceOne(t, w)) {
    return 'typo';
  }
  return null;
}

/**
 * Split a query into whitespace-separated non-empty terms. Used by the
 * typo-tolerant title-fallback scan so multi-word queries can be scored
 * term-by-term rather than as one monolithic substring.
 */
function splitQueryTerms(query: string): string[] {
  return query
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/**
 * Tokenize a session title into lowercase word tokens for typo matching.
 * Only alphanumeric runs are kept so punctuation ("orchestrator." →
 * "orchestrator") does not defeat the distance-1 comparison.
 */
function tokenizeTitle(title: string): string[] {
  const tokens = title.toLowerCase().match(/[a-z0-9]+/g);
  return tokens ?? [];
}

/**
 * Score a message for query relevance. Weighted blend of:
 *   - Word-boundary matches (`\bfoo\b`) — the strongest signal.
 *   - Raw substring density (occurrences per 100 chars) — fallback signal.
 *   - Role bonus — user turns tend to carry intent, assistant turns tend
 *     to carry outcomes, so the caller-configurable role filter also
 *     nudges the ranking.
 */
function calculateRelevance(
  content: string,
  query: string,
  role: string,
  matchKind: 'exact' | 'typo' = 'exact'
): number {
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

  // Typo-tolerant match: exact hits already got their full score; a
  // distance-1 title-typo hit synthesises a minimum baseline (the
  // content will not contain the raw query substring, so the regex
  // matches above are 0) and then applies a 20% penalty so exact
  // matches always rank above typo matches. See
  // `scanSessionTitlesTypoTolerant` for the fallback caller.
  if (matchKind === 'typo') {
    // Give typo matches a non-zero baseline (they will otherwise score
    // 0 on both word-boundary and density signals). Cap and penalise.
    const baseline = 30 + (role === 'user' ? 5 : role === 'assistant' ? 3 : 0);
    score = Math.max(score, baseline) * 0.8;
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
  const createdTs = session?.metadata?.created?.toString() ?? new Date().toISOString();

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
  const createdTs = session?.metadata?.created?.toString() ?? new Date().toISOString();

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

/**
 * Fallback typo-tolerant scan over session TITLES only.
 *
 * Rationale: full-transcript Levenshtein would be O(messages * tokens *
 * queryTerms) per session, which is far too expensive for the 20-hit
 * common case. Titles are short (auto-generated from the first user
 * turn, capped at ~50 chars) and highly indicative of session topic, so
 * a title-only fallback catches the "I remember the topic but typoed
 * it" case cheaply.
 *
 * A session is returned as a hit iff AT LEAST ONE query term either
 * matches a title token exactly OR is within Levenshtein distance 1 of
 * a title token. Query terms that fail to match any token in this
 * particular title are surfaced via `termsMissing`, and the enclosing
 * `RecallResult.missingTerms` reports terms that did not match in ANY
 * of the returned hits (the union across all successful sessions).
 * Relevance scaling by matched-term fraction keeps a title matching
 * only 1 of 3 terms below a title matching 3 of 3.
 */
function scanSessionTitlesTypoTolerant(
  session: any,
  file: string,
  queryTerms: string[]
): { hit: RecallHit | null; termsMatched: Set<string>; termsMissing: Set<string> } {
  const title: string | undefined =
    typeof session?.metadata?.title === 'string' ? session.metadata.title : undefined;
  if (!title) {
    return { hit: null, termsMatched: new Set(), termsMissing: new Set() };
  }

  const titleTokens = tokenizeTitle(title);
  if (titleTokens.length === 0) {
    return { hit: null, termsMatched: new Set(), termsMissing: new Set() };
  }

  const termsMatched = new Set<string>();
  const termsMissing = new Set<string>();
  let bestKindOverall: 'exact' | 'typo' = 'typo';
  let anyExact = false;

  for (const term of queryTerms) {
    let bestForTerm: 'exact' | 'typo' | null = null;
    for (const tok of titleTokens) {
      const kind = tokenMatchKind(term, tok);
      if (kind === 'exact') {
        bestForTerm = 'exact';
        break;
      }
      if (kind === 'typo') {
        // We only reach this branch when no earlier iteration set
        // 'exact' (that would have broken out of the loop). Keep the
        // first typo hit; subsequent typo hits do not upgrade.
        bestForTerm = bestForTerm ?? 'typo';
      }
    }
    if (bestForTerm === null) {
      termsMissing.add(term.toLowerCase());
    } else {
      termsMatched.add(term.toLowerCase());
      if (bestForTerm === 'exact') {
        anyExact = true;
      }
    }
  }

  // At least one term must have matched (via exact or typo) for the
  // session to be a hit. A zero-match title is not a partial match, it
  // is just noise.
  if (termsMatched.size === 0) {
    return { hit: null, termsMatched, termsMissing };
  }

  // If every matched term was an exact hit AND no terms were missing,
  // report as an exact match; otherwise treat as a typo match so the
  // relevance is penalised relative to the primary exact-substring
  // path.
  if (anyExact && termsMissing.size === 0 && termsMatched.size === queryTerms.length) {
    bestKindOverall = 'exact';
  }

  const sessionId = session?.metadata?.id || file.replace('.json', '');
  const createdTs = session?.metadata?.created?.toString() ?? new Date().toISOString();

  // Score against the title itself so density/word-boundary signals are
  // meaningful. Scale down proportionally to the fraction of matched
  // terms so a partial-match title ranks below a full-match title.
  const rawScore = calculateRelevance(title, queryTerms.join(' '), 'user', bestKindOverall);
  const fraction = termsMatched.size / queryTerms.length;
  const relevance = rawScore * fraction;

  return {
    hit: {
      sessionId,
      messageId: 'title',
      role: 'user',
      content: title.slice(0, 500),
      relevance,
      timestamp: createdTs,
    },
    termsMatched,
    termsMissing,
  };
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

      // Zero-result fallback: retry with typo tolerance over session
      // titles ONLY. Full-transcript typo scanning would be O(n*m*k)
      // per query and is not worth the cost; titles are short and
      // topical enough to catch the common "misspelled the topic"
      // case (issue #1745).
      if (results.length === 0) {
        const queryTerms = splitQueryTerms(params.query);
        if (queryTerms.length > 0) {
          const typoHits: RecallHit[] = [];
          const matchedTerms = new Set<string>();
          for (const file of sessionFiles) {
            const sessionPath = path.join(sessionsDir, file);
            const session = await loadSession(sessionPath);
            if (!session) {
              continue;
            }
            if (!includeCurrentSession && context.sessionId && file.includes(context.sessionId)) {
              continue;
            }
            const { hit, termsMatched } = scanSessionTitlesTypoTolerant(session, file, queryTerms);
            if (hit) {
              typoHits.push(hit);
              // Only aggregate matched-terms from sessions that
              // actually made it into the result set — a session that
              // matched zero terms contributes nothing.
              for (const t of termsMatched) {
                matchedTerms.add(t);
              }
            }
          }

          if (typoHits.length > 0) {
            typoHits.sort((a, b) => b.relevance - a.relevance);
            const topTypo = typoHits.slice(0, 20);
            // `missingTerms` = query terms that failed to match in ANY
            // returned typo hit (union of per-hit misses). A term that
            // matched at least one hit is not missing overall.
            const missingTerms = queryTerms
              .filter((t) => !matchedTerms.has(t.toLowerCase()))
              // Deduplicate case-insensitively while preserving original casing.
              .filter(
                (t, i, arr) => arr.findIndex((x) => x.toLowerCase() === t.toLowerCase()) === i
              );
            return {
              success: true,
              data: {
                results: topTypo,
                totalMatches: typoHits.length,
                partialMatch: true,
                missingTerms,
              },
              hint:
                missingTerms.length > 0
                  ? `No exact matches; ${typoHits.length} session title(s) matched with typo tolerance. Missing terms: ${missingTerms.join(', ')}`
                  : `No exact matches; ${typoHits.length} session title(s) matched with typo tolerance`,
            };
          }
        }
      }

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

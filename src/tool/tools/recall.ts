/**
 * Recall Tool - Search and retrieve information from previous sessions
 * Enables cross-session context retrieval within the same project
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const RecallParamsSchema = z.object({
  query: z.string().describe('Search query to find relevant session content'),
  sessionId: z.string().optional().describe('Specific session ID to search within'),
  limit: z.number().default(10).describe('Maximum number of results to return'),
});

interface RecallResult {
  results: Array<{
    sessionId: string;
    sessionTitle?: string;
    matches: Array<{
      role: string;
      preview: string;
      timestamp?: number;
    }>;
  }>;
  totalMatches: number;
}

interface SessionData {
  metadata: {
    id: string;
    title?: string;
    created: number;
    updated: number;
  };
  messages: Array<{
    role: string;
    content: string;
    timestamp?: number;
  }>;
}

/**
 * Search messages for query and return matches with context
 */
function searchMessages(
  messages: Array<{ role: string; content: string; timestamp?: number }>,
  query: string
): Array<{ role: string; preview: string; timestamp?: number }> {
  const queryLower = query.toLowerCase();
  return messages
    .filter((m) => {
      const content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
      return content.toLowerCase().includes(queryLower);
    })
    .map((m) => ({
      role: m.role,
      preview: extractPreview(m.content, query),
      timestamp: m.timestamp,
    }));
}

/**
 * Extract a preview snippet around the query match
 */
function extractPreview(content: any, query: string, contextChars = 100): string {
  const text = typeof content === 'string' ? content : JSON.stringify(content);
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, contextChars * 2);
  const start = Math.max(0, idx - contextChars);
  const end = Math.min(text.length, idx + query.length + contextChars);
  return (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
}

/**
 * Load session data from file
 */
async function loadSession(sessionsDir: string, sessionId: string): Promise<SessionData | null> {
  try {
    const sessionPath = path.join(sessionsDir, `${sessionId}.json`);
    const content = await fs.readFile(sessionPath, 'utf-8');
    return JSON.parse(content) as SessionData;
  } catch {
    return null;
  }
}

/**
 * List all session files in the sessions directory
 */
async function listSessions(sessionsDir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(sessionsDir);
    return files.filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
  } catch {
    return [];
  }
}

export const recallTool = defineTool<typeof RecallParamsSchema, RecallResult>({
  name: 'recall',
  description: `Search and retrieve information from previous sessions in this project.

Use this tool to:
- Find relevant context from past conversations
- Look up previous decisions or implementations
- Access historical information across sessions

The tool searches through message content and returns matching excerpts with context.`,

  parameters: RecallParamsSchema,

  async execute(params, context): Promise<ToolResult<RecallResult>> {
    const sessionsDir = path.join(os.homedir(), '.alexi', 'sessions');

    // Ensure sessions directory exists
    try {
      await fs.mkdir(sessionsDir, { recursive: true });
    } catch {
      return {
        success: false,
        error: 'Failed to access sessions directory',
      };
    }

    // If specific session requested, search only that session
    if (params.sessionId) {
      const session = await loadSession(sessionsDir, params.sessionId);
      if (!session) {
        return {
          success: false,
          error: `Session not found: ${params.sessionId}`,
        };
      }

      const matches = searchMessages(session.messages, params.query);
      return {
        success: true,
        data: {
          results: [
            {
              sessionId: session.metadata.id,
              sessionTitle: session.metadata.title,
              matches,
            },
          ],
          totalMatches: matches.length,
        },
      };
    }

    // Search across all sessions
    const sessionIds = await listSessions(sessionsDir);
    const allResults: Array<{
      sessionId: string;
      sessionTitle?: string;
      matches: Array<{ role: string; preview: string; timestamp?: number }>;
    }> = [];

    let totalMatches = 0;

    for (const sessionId of sessionIds) {
      const session = await loadSession(sessionsDir, sessionId);
      if (!session) continue;

      const matches = searchMessages(session.messages, params.query);
      if (matches.length > 0) {
        allResults.push({
          sessionId: session.metadata.id,
          sessionTitle: session.metadata.title,
          matches,
        });
        totalMatches += matches.length;
      }

      // Stop if we've collected enough results
      if (allResults.length >= params.limit) {
        break;
      }
    }

    // Sort by most recent matches
    allResults.sort((a, b) => {
      const aTime = Math.max(...a.matches.map((m) => m.timestamp || 0));
      const bTime = Math.max(...b.matches.map((m) => m.timestamp || 0));
      return bTime - aTime;
    });

    return {
      success: true,
      data: {
        results: allResults.slice(0, params.limit),
        totalMatches,
      },
    };
  },
});

/**
 * Recall Tool
 * Search and read transcripts from previous sessions
 * Enables AI to access context from past conversations
 */

import { z } from 'zod';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';
import { defineTool, type ToolContext, type ToolResult } from '../index.js';
import { SessionManager } from '../../core/sessionManager.js';

// Parameters schema
const RecallParamsSchema = z.object({
  mode: z
    .enum(['search', 'read'])
    .describe("'search' to find sessions by title, 'read' to get a session transcript"),
  query: z
    .string()
    .optional()
    .describe('Search query to match against session titles (required for search mode)'),
  sessionID: z
    .string()
    .optional()
    .describe('Session ID to read the transcript of (required for read mode)'),
  limit: z
    .number()
    .optional()
    .describe('Maximum number of search results to return (default: 20, max: 50)'),
});

type RecallParams = z.infer<typeof RecallParamsSchema>;

/**
 * Search for sessions by title
 */
async function searchSessions(
  params: RecallParams,
  _context: ToolContext
): Promise<ToolResult<unknown>> {
  if (!params.query) {
    return {
      success: false,
      error: "The 'query' parameter is required when mode is 'search'",
    };
  }

  try {
    const sessionManager = new SessionManager();
    const limit = Math.min(params.limit ?? 20, 50);

    // Get all sessions
    const allSessions = sessionManager.listSessions();

    // Filter by query (case-insensitive title match)
    const matchingSessions = allSessions
      .filter((metadata) => {
        const title = metadata.title || 'Untitled';
        return title.toLowerCase().includes(params.query!.toLowerCase());
      })
      .map((metadata) => ({
        id: metadata.id,
        title: metadata.title || 'Untitled',
        created: metadata.created,
        updated: metadata.updated,
        messageCount: metadata.messageCount,
      }))
      .slice(0, limit);

    return {
      success: true,
      data: {
        query: params.query,
        resultCount: matchingSessions.length,
        sessions: matchingSessions,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: `Failed to search sessions: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Read a session transcript
 */
async function readSession(
  params: RecallParams,
  _context: ToolContext
): Promise<ToolResult<unknown>> {
  if (!params.sessionID) {
    return {
      success: false,
      error: "The 'sessionID' parameter is required when mode is 'read'",
    };
  }

  try {
    const sessionManager = new SessionManager();

    // Load session
    const session = sessionManager.loadSession(params.sessionID);

    if (!session) {
      return {
        success: false,
        error: `Session not found: ${params.sessionID}`,
      };
    }

    // Format messages as transcript
    const transcript = session.messages
      .map((msg) => {
        const role = msg.role.toUpperCase();
        const content =
          typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content, null, 2);
        return `[${role}]: ${content}`;
      })
      .join('\n\n');

    return {
      success: true,
      data: {
        sessionID: params.sessionID,
        title: session.metadata.title,
        messageCount: session.messages.length,
        transcript,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: `Failed to read session: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

// Tool definition
export const recallTool = defineTool({
  name: 'recall',
  description: `Search and read transcripts from previous sessions in this project.

Use 'search' mode to find sessions by title matching your query.
Use 'read' mode with a sessionID to retrieve the full transcript.

This tool helps you recall context from previous conversations and tasks.`,
  parameters: RecallParamsSchema,
  permission: {
    action: 'read',
    getResource: (params) => {
      if (params.mode === 'search') {
        return 'sessions:search';
      }
      return `sessions:${params.sessionID || 'unknown'}`;
    },
  },
  async execute(params: RecallParams, context: ToolContext): Promise<ToolResult<unknown>> {
    if (params.mode === 'search') {
      return searchSessions(params, context);
    }
    return readSession(params, context);
  },
});

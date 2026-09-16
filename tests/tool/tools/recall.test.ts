/**
 * Recall Tool Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { recallTool } from '../../../src/tool/tools/recall.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('Recall Tool', () => {
  let tempDir: string;
  let sessionsDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'recall-test-'));
    sessionsDir = path.join(tempDir, '.alexi', 'sessions');
    await fs.mkdir(sessionsDir, { recursive: true });

    // Override HOME for testing
    process.env.HOME = tempDir;

    context = {
      workdir: tempDir,
      sessionId: 'test-session-123',
    };
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should return empty results when no sessions exist', async () => {
    const result = await recallTool.execute(
      {
        query: 'test',
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.results).toEqual([]);
    expect(result.data?.totalMatches).toBe(0);
  });

  it('should find matches in session messages', async () => {
    // Create a test session
    const sessionData = {
      metadata: {
        id: 'session-1',
        created: Date.now(),
        updated: Date.now(),
      },
      messages: [
        {
          role: 'user',
          content: 'Hello, I need help with TypeScript',
          timestamp: Date.now(),
        },
        {
          role: 'assistant',
          content: 'I can help you with TypeScript. What do you need?',
          timestamp: Date.now(),
        },
        {
          role: 'user',
          content: 'How do I use async/await?',
          timestamp: Date.now(),
        },
      ],
    };

    await fs.writeFile(
      path.join(sessionsDir, 'session-1.json'),
      JSON.stringify(sessionData),
      'utf-8'
    );

    const result = await recallTool.execute(
      {
        query: 'TypeScript',
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.totalMatches).toBeGreaterThan(0);
    expect(result.data?.results.length).toBeGreaterThan(0);
    expect(result.data?.results[0].content).toContain('TypeScript');
  });

  it('should exclude current session when requested', async () => {
    // Create current session
    const currentSessionData = {
      metadata: {
        id: 'test-session-123',
        created: Date.now(),
      },
      messages: [
        {
          role: 'user',
          content: 'Current session message with keyword',
          timestamp: Date.now(),
        },
      ],
    };

    // Create another session
    const otherSessionData = {
      metadata: {
        id: 'other-session',
        created: Date.now(),
      },
      messages: [
        {
          role: 'user',
          content: 'Other session message with keyword',
          timestamp: Date.now(),
        },
      ],
    };

    await fs.writeFile(
      path.join(sessionsDir, 'test-session-123.json'),
      JSON.stringify(currentSessionData),
      'utf-8'
    );

    await fs.writeFile(
      path.join(sessionsDir, 'other-session.json'),
      JSON.stringify(otherSessionData),
      'utf-8'
    );

    const result = await recallTool.execute(
      {
        query: 'keyword',
        includeCurrentSession: false,
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.results.every((r) => r.sessionId !== 'test-session-123')).toBe(true);
  });

  it('should respect session limit', async () => {
    // Create multiple sessions
    for (let i = 0; i < 15; i++) {
      const sessionData = {
        metadata: {
          id: `session-${i}`,
          created: Date.now() - i * 1000,
        },
        messages: [
          {
            role: 'user',
            content: `Message ${i} with searchterm`,
            timestamp: Date.now(),
          },
        ],
      };

      await fs.writeFile(
        path.join(sessionsDir, `session-${i}.json`),
        JSON.stringify(sessionData),
        'utf-8'
      );
    }

    const result = await recallTool.execute(
      {
        query: 'searchterm',
        sessionLimit: 5,
      },
      context
    );

    expect(result.success).toBe(true);
    // Should only search through 5 sessions
    expect(result.data?.totalMatches).toBeLessThanOrEqual(5);
  });

  describe('typo tolerance (issue #1745)', () => {
    it('detects single-char typo in session title and flags partialMatch', async () => {
      // Title token "orchestrator"; query "orcestrator" is distance-1
      // (single 'h' deletion), so it must match via typo tolerance.
      const sessionData = {
        metadata: {
          id: 'session-typo-1',
          created: Date.now(),
          title: 'How to build the orchestrator pipeline',
        },
        messages: [
          {
            role: 'user',
            content: 'unrelated body content that has nothing matching',
            timestamp: Date.now(),
          },
        ],
      };

      await fs.writeFile(
        path.join(sessionsDir, 'session-typo-1.json'),
        JSON.stringify(sessionData),
        'utf-8'
      );

      const result = await recallTool.execute({ query: 'orcestrator' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.partialMatch).toBe(true);
      expect(result.data?.results.length).toBeGreaterThan(0);
      expect(result.data?.results[0].sessionId).toBe('session-typo-1');
      expect(result.data?.missingTerms).toEqual([]);
    });

    it('prefers exact matches over typo matches', async () => {
      // Session with exact match in message content.
      const exactSession = {
        metadata: {
          id: 'exact-session',
          created: Date.now(),
          title: 'Discussion about orchestrator',
        },
        messages: [
          {
            role: 'user',
            content: 'We need to fix the orchestrator today',
            timestamp: Date.now(),
          },
        ],
      };

      // Session with only a typo match in the title (distance-1
      // substitution: "orchestratur" vs "orchestrator").
      const typoSession = {
        metadata: {
          id: 'typo-session',
          created: Date.now(),
          title: 'Notes on the orchestratur bug',
        },
        messages: [
          {
            role: 'user',
            content: 'unrelated body content',
            timestamp: Date.now(),
          },
        ],
      };

      await fs.writeFile(
        path.join(sessionsDir, 'exact-session.json'),
        JSON.stringify(exactSession),
        'utf-8'
      );
      await fs.writeFile(
        path.join(sessionsDir, 'typo-session.json'),
        JSON.stringify(typoSession),
        'utf-8'
      );

      const result = await recallTool.execute({ query: 'orchestrator' }, context);

      expect(result.success).toBe(true);
      // Exact-match path fires, typo fallback is NOT engaged.
      expect(result.data?.partialMatch).toBeUndefined();
      expect(result.data?.results.length).toBeGreaterThan(0);
      // Highest-relevance hit is from the exact-match session.
      expect(result.data?.results[0].sessionId).toBe('exact-session');
    });

    it('does NOT match a multi-char typo (distance > 1)', async () => {
      const sessionData = {
        metadata: {
          id: 'far-typo-session',
          created: Date.now(),
          title: 'Notes on the orchestrator',
        },
        messages: [
          {
            role: 'user',
            content: 'unrelated body content',
            timestamp: Date.now(),
          },
        ],
      };

      await fs.writeFile(
        path.join(sessionsDir, 'far-typo-session.json'),
        JSON.stringify(sessionData),
        'utf-8'
      );

      // Two-character edit distance: "orxxxstrator" vs "orchestrator".
      const result = await recallTool.execute({ query: 'orxxxstrator' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.results.length).toBe(0);
      expect(result.data?.partialMatch).toBeUndefined();
    });

    it('reports missing terms when only some query terms match a title', async () => {
      // Title contains "orchestrator" (typo-hit for "orchestartor") but
      // does NOT contain "sapaicore" — that term is reported missing
      // in the partial-match result.
      const sessionData = {
        metadata: {
          id: 'missing-term-session',
          created: Date.now(),
          title: 'Refactoring the orchestrator internals',
        },
        messages: [
          {
            role: 'user',
            content: 'unrelated body content',
            timestamp: Date.now(),
          },
        ],
      };

      await fs.writeFile(
        path.join(sessionsDir, 'missing-term-session.json'),
        JSON.stringify(sessionData),
        'utf-8'
      );

      const result = await recallTool.execute({ query: 'orcestrator sapaicore' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.partialMatch).toBe(true);
      expect(result.data?.results.length).toBe(1);
      expect(result.data?.results[0].sessionId).toBe('missing-term-session');
      expect(result.data?.missingTerms).toEqual(['sapaicore']);
    });

    it('returns empty results when no title matches any term', async () => {
      const sessionData = {
        metadata: {
          id: 'no-match-session',
          created: Date.now(),
          title: 'Refactoring database indexes',
        },
        messages: [
          {
            role: 'user',
            content: 'unrelated body content',
            timestamp: Date.now(),
          },
        ],
      };

      await fs.writeFile(
        path.join(sessionsDir, 'no-match-session.json'),
        JSON.stringify(sessionData),
        'utf-8'
      );

      const result = await recallTool.execute({ query: 'orcestrator sapaicore' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.results.length).toBe(0);
      expect(result.data?.partialMatch).toBeUndefined();
    });
  });

  it('should calculate relevance scores', async () => {
    const sessionData = {
      metadata: {
        id: 'session-1',
        created: Date.now(),
      },
      messages: [
        {
          role: 'user',
          content:
            'This message contains the keyword multiple times: keyword, keyword, and keyword again. It has enough text to avoid hitting the relevance cap.',
          timestamp: Date.now(),
        },
        {
          role: 'user',
          content:
            'This message contains the keyword only once but has similar length to ensure different density.',
          timestamp: Date.now(),
        },
      ],
    };

    await fs.writeFile(
      path.join(sessionsDir, 'session-1.json'),
      JSON.stringify(sessionData),
      'utf-8'
    );

    const result = await recallTool.execute(
      {
        query: 'keyword',
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.results.length).toBe(2);
    // First result should have higher relevance (more occurrences)
    expect(result.data?.results[0].relevance).toBeGreaterThan(result.data?.results[1].relevance);
  });
});

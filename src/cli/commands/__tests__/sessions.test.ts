/**
 * Tests for `alexi sessions` command, covering:
 *   - default human-readable output
 *   - --json output shape and values
 *   - empty-state behavior in both modes
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Command } from 'commander';

import type { SessionMetadata } from '../../../core/sessionManager.js';

const listSessionsMock: ReturnType<typeof vi.fn> = vi.fn();

vi.mock('../../../core/sessionManager.js', () => {
  // Use a real class so `new SessionManager()` works at runtime.
  class SessionManager {
    listSessions = listSessionsMock;
    exportToMarkdown = vi.fn();
    deleteSession = vi.fn();
  }
  return { SessionManager };
});

// Imported AFTER vi.mock so the mocked SessionManager is wired in.
const { registerSessionCommands } = await import('../sessions.js');

const FIXTURE_SESSIONS: SessionMetadata[] = [
  {
    id: 'sess-001',
    created: 1_700_000_000_000,
    updated: 1_700_000_500_000,
    modelId: 'sap-ai-core/anthropic--claude-4.7-opus',
    totalTokens: 1234,
    messageCount: 7,
    title: 'Refactor router',
  },
  {
    id: 'sess-002',
    created: 1_700_001_000_000,
    updated: 1_700_001_500_000,
    // modelId intentionally omitted to exercise the null fallback
    totalTokens: 0,
    messageCount: 0,
    // title intentionally omitted to exercise the null fallback
  },
];

function buildProgram(): Command {
  const program = new Command();
  // Commander would normally call process.exit on error / unknown commands;
  // override to keep test failures legible.
  program.exitOverride();
  registerSessionCommands(program);
  return program;
}

describe('alexi sessions command', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    listSessionsMock.mockReset();
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  describe('--json mode', () => {
    it('emits a JSON array with the documented shape and values', async () => {
      listSessionsMock.mockReturnValue(FIXTURE_SESSIONS);

      const program = buildProgram();
      await program.parseAsync(['node', 'alexi', 'sessions', '--json']);

      const output = (logSpy.mock.calls as unknown[][]).map((c) => c.join(' ')).join('\n');
      const parsed = JSON.parse(output) as unknown;

      expect(Array.isArray(parsed)).toBe(true);
      const arr = parsed as Array<Record<string, unknown>>;
      expect(arr).toHaveLength(2);

      expect(arr[0]).toEqual({
        id: 'sess-001',
        title: 'Refactor router',
        model: 'sap-ai-core/anthropic--claude-4.7-opus',
        updatedAt: 1_700_000_500_000,
        messageCount: 7,
        totalTokens: 1234,
      });

      // Second session exercises the null fallbacks for title and model.
      expect(arr[1]).toEqual({
        id: 'sess-002',
        title: null,
        model: null,
        updatedAt: 1_700_001_500_000,
        messageCount: 0,
        totalTokens: 0,
      });

      // Each entry must have exactly the documented set of keys.
      const expectedKeys = ['id', 'title', 'model', 'updatedAt', 'messageCount', 'totalTokens'];
      for (const entry of arr) {
        expect(Object.keys(entry).sort()).toEqual([...expectedKeys].sort());
      }
    });

    it('emits [] when there are no sessions', async () => {
      listSessionsMock.mockReturnValue([]);

      const program = buildProgram();
      await program.parseAsync(['node', 'alexi', 'sessions', '--json']);

      const output = (logSpy.mock.calls as unknown[][]).map((c) => c.join(' ')).join('\n');
      expect(JSON.parse(output)).toEqual([]);
      expect(output).not.toContain('No sessions found');
    });
  });

  describe('default (human-readable) mode', () => {
    it('renders the saved-sessions header and per-session lines', async () => {
      listSessionsMock.mockReturnValue(FIXTURE_SESSIONS);

      const program = buildProgram();
      await program.parseAsync(['node', 'alexi', 'sessions']);

      const output = (logSpy.mock.calls as unknown[][]).map((c) => c.join(' ')).join('\n');

      expect(output).toContain('=== Saved Sessions ===');
      expect(output).toContain('ID: sess-001');
      expect(output).toContain('Title: Refactor router');
      expect(output).toContain('ID: sess-002');
      expect(output).toContain('Title: Untitled');
      expect(output).toContain('Messages: 7, Tokens: 1234');
      expect(output).toContain('Model: sap-ai-core/anthropic--claude-4.7-opus');
      expect(output).toContain('Model: N/A');
    });

    it('prints "No sessions found" when there are no sessions', async () => {
      listSessionsMock.mockReturnValue([]);

      const program = buildProgram();
      await program.parseAsync(['node', 'alexi', 'sessions']);

      const output = (logSpy.mock.calls as unknown[][]).map((c) => c.join(' ')).join('\n');
      expect(output).toContain('No sessions found');
      expect(output).not.toContain('=== Saved Sessions ===');
    });
  });
});

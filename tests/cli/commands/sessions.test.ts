/**
 * Tests for the `alexi sessions` CLI commands, focused on the search
 * surface added in issue #1585 (Part 2 of the FTS work).
 *
 * We drive the commander program end-to-end with a temp `HOME`, seed a
 * few sessions on disk, and assert on captured stdout. This is closer to
 * an integration test than a unit test — deliberate, because the search
 * path stitches together the SQLite index, `SessionManager`, and the
 * CLI, and unit-level mocks would let a shape regression slip through.
 *
 * If the runner cannot build `better-sqlite3` the search subcommand
 * returns an empty result set; tests that require content indexing
 * short-circuit via a readiness probe rather than fail spuriously.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { Command } from 'commander';
import type { SessionMetadata, Message } from '../../../src/core/sessionManager.js';
import { SessionSearchIndex } from '../../../src/session/search.js';
import { registerSessionCommands } from '../../../src/cli/commands/sessions.js';

let tmpHome: string;
let sessionsDir: string;
let originalHome: string | undefined;
let originalExit: typeof process.exit;
let stdout: string[];
let stderr: string[];

beforeEach(() => {
  tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-sessions-cli-'));
  sessionsDir = path.join(tmpHome, '.alexi', 'sessions');
  fs.mkdirSync(sessionsDir, { recursive: true });
  originalHome = process.env.HOME;
  process.env.HOME = tmpHome;

  // Trap `process.exit` so a failing subcommand does not tear down the
  // vitest worker. We collect the code and inspect it in assertions.
  originalExit = process.exit;
  process.exit = ((code?: number) => {
    throw new Error(`process.exit(${code ?? 0})`);
  }) as typeof process.exit;

  stdout = [];
  stderr = [];
  vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
    stdout.push(args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));
  });
  vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    stderr.push(args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));
  });
});

afterEach(() => {
  process.exit = originalExit;
  if (originalHome === undefined) {
    delete process.env.HOME;
  } else {
    process.env.HOME = originalHome;
  }
  vi.restoreAllMocks();
  fs.rmSync(tmpHome, { recursive: true, force: true });
});

function makeMetadata(overrides: Partial<SessionMetadata>): SessionMetadata {
  return {
    id: overrides.id ?? `id-${Math.random().toString(36).slice(2, 10)}`,
    created: overrides.created ?? Date.now(),
    updated: overrides.updated ?? Date.now(),
    messageCount: overrides.messageCount ?? 1,
    totalTokens: overrides.totalTokens ?? 100,
    workdir: overrides.workdir ?? tmpHome,
    modelId: overrides.modelId ?? 'sap-ai-core/anthropic--claude-4.7-opus',
    title: overrides.title,
  };
}

function writeSession(metadata: SessionMetadata, messages: Message[] = []): void {
  fs.writeFileSync(
    path.join(sessionsDir, `${metadata.id}.json`),
    JSON.stringify({ metadata, messages }, null, 2),
    'utf-8'
  );
}

/**
 * Probe whether the native `better-sqlite3` binding is available on this
 * runner. Tests that inspect content-search results short-circuit when
 * the answer is `false` so a broken binding does not manifest as a false
 * failure.
 */
function indexReady(): boolean {
  const probe = new SessionSearchIndex(sessionsDir);
  const ready = probe.isReady();
  probe.close();
  return ready;
}

async function runProgram(argv: string[]): Promise<void> {
  const program = new Command();
  program.exitOverride();
  registerSessionCommands(program);
  try {
    await program.parseAsync(['node', 'alexi', ...argv]);
  } catch (err) {
    // commander throws on `exitOverride` after parsing errors, and our
    // stubbed `process.exit` throws on non-zero exits. Both are expected
    // in the "invalid flags" test case; propagate nothing here so
    // assertions can inspect stderr.
    if (!(err instanceof Error) || !err.message.startsWith('process.exit(')) {
      throw err;
    }
  }
}

describe('sessions search subcommand', () => {
  it('runs `sessions-search <query>` and prints ranked results with snippets', async () => {
    if (!indexReady()) {
      return;
    }

    writeSession(makeMetadata({ id: 'react-1', title: 'React hooks primer' }), [
      { role: 'user', content: 'How do react hooks work?', timestamp: 1 },
      { role: 'assistant', content: 'useState is the entry point.', timestamp: 2 },
    ]);
    writeSession(makeMetadata({ id: 'unrelated', title: 'Bash tips' }), [
      { role: 'user', content: 'awk oneliner for csv', timestamp: 1 },
    ]);

    await runProgram(['sessions-search', 'react']);

    const combined = stdout.join('\n');
    expect(combined).toContain('Search Results');
    expect(combined).toContain('react-1');
    expect(combined).not.toContain('unrelated');
    expect(combined).toContain('Snippet:');
  });

  it('supports --json for machine-readable output', async () => {
    if (!indexReady()) {
      return;
    }

    writeSession(makeMetadata({ id: 'j-1', title: 'openai integration' }), [
      { role: 'user', content: 'How to call openai chat completions?', timestamp: 1 },
    ]);

    await runProgram(['sessions-search', 'openai', '--json']);

    const raw = stdout.join('\n').trim();
    const parsed = JSON.parse(raw) as Array<{ id: string; title: string | null }>;
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThan(0);
    expect(parsed[0].id).toBe('j-1');
  });

  it('prints a friendly message when no sessions match', async () => {
    if (!indexReady()) {
      return;
    }

    writeSession(makeMetadata({ id: 'only-one', title: 'orange county' }));
    await runProgram(['sessions-search', 'quantumfoo']);
    expect(stdout.join('\n')).toContain('No sessions match');
  });

  it('sessions --search flag emits the same shape as the subcommand', async () => {
    if (!indexReady()) {
      return;
    }

    writeSession(makeMetadata({ id: 'flag-1', title: 'python asyncio' }), [
      { role: 'assistant', content: 'asyncio.gather runs coroutines in parallel.', timestamp: 1 },
    ]);

    await runProgram(['sessions', '--search', 'asyncio', '--json']);
    const parsed = JSON.parse(stdout.join('\n').trim()) as Array<{ id: string }>;
    expect(parsed.map((p) => p.id)).toContain('flag-1');
  });

  it('rejects mutually exclusive --here and --workdir', async () => {
    await runProgram(['sessions-search', 'foo', '--here', '--workdir', path.join(tmpHome, 'nope')]);
    expect(stderr.join('\n')).toContain('mutually exclusive');
  });
});

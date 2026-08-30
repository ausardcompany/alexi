/**
 * Tests for {@link SessionSearchIndex}, the SQLite FTS5-backed replacement
 * for the eager `fs.readdirSync + JSON.parse` session listing (issue
 * #1557 / kilocode #13420 port).
 *
 * Covers the five behaviours listed in the issue:
 *   1. Indexes 1000+ sessions and searches in <500ms.
 *   2. FTS5 ranking prioritizes title matches (bm25 order).
 *   3. `workdir` filter narrows results.
 *   4. `deleteSession` removes rows from the index.
 *   5. `refreshIndex` reconciles filesystem deletes.
 *
 * Every test writes to a `fs.mkdtemp` workdir and closes the underlying
 * SQLite handle in `afterEach`, so runs are parallel-safe. If the native
 * `better-sqlite3` binding is unavailable on the CI runner, tests
 * short-circuit via `isReady()` — the class documented contract is that
 * it degrades to no-ops, and we want a broken binding to be a skip
 * rather than a false failure.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import type { SessionMetadata } from '../../src/core/sessionManager.js';
import { SessionSearchIndex } from '../../src/session/search.js';

let tempDir: string;
let index: SessionSearchIndex;

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'session-search-'));
  index = new SessionSearchIndex(tempDir);
});

afterEach(() => {
  index.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

/**
 * Build a minimal SessionMetadata suitable for the FTS index. Defaults
 * are chosen to be recognisable in ranking (`workdir` matches the tempDir
 * so `--here`-style filters find them).
 */
function makeMetadata(overrides: Partial<SessionMetadata>): SessionMetadata {
  return {
    id: overrides.id ?? `id-${Math.random().toString(36).slice(2, 10)}`,
    created: overrides.created ?? Date.now(),
    updated: overrides.updated ?? Date.now(),
    messageCount: overrides.messageCount ?? 1,
    totalTokens: overrides.totalTokens ?? 100,
    workdir: overrides.workdir ?? tempDir,
    modelId: overrides.modelId ?? 'sap-ai-core/anthropic--claude-4.7-opus',
    title: overrides.title,
    parentSessionId: overrides.parentSessionId,
    agent: overrides.agent,
  };
}

/**
 * Build a synthetic Message. Only `role`, `content`, and `timestamp` are
 * required by the FTS content path; the rest of the shape is ignored.
 */
function makeMessage(role: 'user' | 'assistant' | 'system', content: string) {
  return { role, content, timestamp: Date.now() };
}

/**
 * Write a session JSON file to disk alongside the FTS index. Used by
 * `refreshIndex` reconciliation tests where the filesystem is the source
 * of truth and the index should catch up.
 */
function writeSessionFile(
  metadata: SessionMetadata,
  messages: Array<{ role: string; content: string; timestamp: number }> = []
): void {
  const file = path.join(tempDir, `${metadata.id}.json`);
  fs.writeFileSync(file, JSON.stringify({ metadata, messages }, null, 2), 'utf-8');
}

describe('SessionSearchIndex', () => {
  it('reports ready when the native binding is available', () => {
    // If this fails, the runner cannot build better-sqlite3 and the rest
    // of the suite is meaningless. Surface that as a hard failure so we
    // do not silently ship a broken index.
    expect(index.isReady()).toBe(true);
  });

  it('indexes 1000 sessions and searches in under 500ms', () => {
    if (!index.isReady()) {
      return;
    }

    const titleWords = ['api', 'refactor', 'auth', 'llm', 'router', 'plan'];
    for (let i = 0; i < 1000; i++) {
      const words = [
        titleWords[i % titleWords.length],
        titleWords[(i + 3) % titleWords.length],
        `session ${i}`,
      ];
      index.upsertSession(
        makeMetadata({ id: `bulk-${i}`, title: words.join(' '), updated: Date.now() + i })
      );
    }

    const start = Date.now();
    const results = index.search('api');
    const elapsed = Date.now() - start;

    // Every session containing "api" in its title should be found. Two of
    // six title words are "api"-adjacent (index 0 -> "api", index 3 ->
    // "api"), which pushes the match count above the default 100 limit;
    // that is fine — we only care about latency and non-empty results
    // here.
    expect(results.length).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(500);
  });

  it('ranks title matches higher via FTS5 bm25', () => {
    if (!index.isReady()) {
      return;
    }

    // Session A has "refactor" in the title once. Session B has it three
    // times (via a longer title). bm25 rewards repeated term matches in
    // shorter fields, so B should rank ahead of A (lower score).
    index.upsertSession(makeMetadata({ id: 'a', title: 'refactor router bug', updated: 1000 }));
    index.upsertSession(
      makeMetadata({
        id: 'b',
        title: 'refactor refactor refactor pipeline',
        updated: 500,
      })
    );
    index.upsertSession(makeMetadata({ id: 'c', title: 'unrelated session', updated: 2000 }));

    const results = index.search('refactor');
    expect(results.map((r) => r.id)).toContain('a');
    expect(results.map((r) => r.id)).toContain('b');
    expect(results.map((r) => r.id)).not.toContain('c');

    const scoreA = results.find((r) => r.id === 'a')?.score ?? 0;
    const scoreB = results.find((r) => r.id === 'b')?.score ?? 0;
    // Lower bm25 == better match. Session B (three occurrences) should
    // rank ahead of A (one occurrence).
    expect(scoreB).toBeLessThan(scoreA);
  });

  it('applies the workdir filter to search results', () => {
    if (!index.isReady()) {
      return;
    }

    const fooDir = path.join(tempDir, 'foo');
    const barDir = path.join(tempDir, 'bar');
    fs.mkdirSync(fooDir, { recursive: true });
    fs.mkdirSync(barDir, { recursive: true });

    index.upsertSession(
      makeMetadata({ id: 'foo-1', title: 'shared keyword one', workdir: fooDir })
    );
    index.upsertSession(
      makeMetadata({ id: 'foo-2', title: 'shared keyword two', workdir: fooDir })
    );
    index.upsertSession(
      makeMetadata({ id: 'bar-1', title: 'shared keyword three', workdir: barDir })
    );

    const inFoo = index.search('shared', { workdir: fooDir });
    expect(inFoo.map((r) => r.id).sort()).toEqual(['foo-1', 'foo-2']);

    const inBar = index.search('shared', { workdir: barDir });
    expect(inBar.map((r) => r.id)).toEqual(['bar-1']);
  });

  it('deleteSession removes the row from search results', () => {
    if (!index.isReady()) {
      return;
    }

    index.upsertSession(makeMetadata({ id: 'to-delete', title: 'ephemeral session' }));
    expect(index.search('ephemeral').map((r) => r.id)).toEqual(['to-delete']);

    index.deleteSession('to-delete');
    expect(index.search('ephemeral')).toEqual([]);
  });

  it('refreshIndex reconciles a manual filesystem delete', () => {
    if (!index.isReady()) {
      return;
    }

    const meta = makeMetadata({ id: 'reconcile', title: 'reconcile me' });
    // Write both to the index AND to disk so refreshIndex sees a mismatch
    // when the file is removed below.
    index.upsertSession(meta);
    writeSessionFile(meta);
    expect(index.search('reconcile').map((r) => r.id)).toEqual(['reconcile']);

    fs.unlinkSync(path.join(tempDir, 'reconcile.json'));
    index.refreshIndex();

    expect(index.search('reconcile')).toEqual([]);
  });

  it('empty query falls back to chronological order', () => {
    if (!index.isReady()) {
      return;
    }

    index.upsertSession(makeMetadata({ id: 'old', title: 'first', updated: 1000 }));
    index.upsertSession(makeMetadata({ id: 'mid', title: 'second', updated: 2000 }));
    index.upsertSession(makeMetadata({ id: 'new', title: 'third', updated: 3000 }));

    const rows = index.search('');
    expect(rows.map((r) => r.id)).toEqual(['new', 'mid', 'old']);
    // Chronological rows do not carry a bm25 score.
    expect(rows.every((r) => r.score === undefined)).toBe(true);
  });

  it('malformed FTS5 syntax returns [] rather than throwing', () => {
    if (!index.isReady()) {
      return;
    }
    // Unbalanced quote in operator syntax would raise inside SQLite.
    // The class swallows the error and returns an empty result so the
    // CLI can surface a friendly "no matches" message.
    expect(index.search('unbalanced "quote')).toEqual([]);
  });

  it('indexes message content and finds sessions by message text', () => {
    if (!index.isReady()) {
      return;
    }

    // The title is deliberately generic. The match must come from the
    // message content, proving the content column is being indexed.
    index.upsertSession(makeMetadata({ id: 'content-1', title: 'Untitled' }), [
      makeMessage('user', 'How do I use react hooks with typescript?'),
      makeMessage('assistant', 'Use useState and useEffect from react.'),
    ]);
    index.upsertSession(makeMetadata({ id: 'content-2', title: 'Unrelated' }), [
      makeMessage('user', 'What is the capital of France?'),
    ]);

    const hits = index.search('react');
    expect(hits.map((r) => r.id)).toContain('content-1');
    expect(hits.map((r) => r.id)).not.toContain('content-2');
  });

  it('AND semantics: multiple tokens require all to match', () => {
    if (!index.isReady()) {
      return;
    }

    index.upsertSession(makeMetadata({ id: 'both', title: 'react hooks tutorial' }), [
      makeMessage('user', 'How do I use react hooks?'),
    ]);
    index.upsertSession(makeMetadata({ id: 'only-react', title: 'react basics' }), [
      makeMessage('user', 'Intro to react components.'),
    ]);
    index.upsertSession(makeMetadata({ id: 'only-hooks', title: 'vue composition' }), [
      makeMessage('user', 'Hooks pattern in vue.'),
    ]);

    // FTS5 default operator is implicit AND: `react hooks` == `react AND hooks`.
    const hits = index.search('react hooks');
    const ids = hits.map((r) => r.id);
    expect(ids).toContain('both');
    expect(ids).not.toContain('only-react');
    expect(ids).not.toContain('only-hooks');
  });

  it('returns a snippet of the matched content (<= 100 chars)', () => {
    if (!index.isReady()) {
      return;
    }

    const longBody =
      'This is a long assistant explanation about react hooks and their lifecycle. ' +
      'It goes on for quite a while, elaborating on useState, useEffect, useMemo, ' +
      'useCallback, and useRef, plus custom hook composition patterns.';
    index.upsertSession(makeMetadata({ id: 'snippet-1', title: 'Untitled' }), [
      makeMessage('assistant', longBody),
    ]);

    const [hit] = index.search('react');
    expect(hit).toBeDefined();
    expect(hit.snippet).toBeDefined();
    expect(typeof hit.snippet).toBe('string');
    expect(hit.snippet!.length).toBeLessThanOrEqual(100);
    expect(hit.snippet!.toLowerCase()).toContain('react');
  });

  it('empty query returns empty snippets and chronological order', () => {
    if (!index.isReady()) {
      return;
    }

    index.upsertSession(makeMetadata({ id: 'e1', title: 'first', updated: 1 }), [
      makeMessage('user', 'hello world'),
    ]);
    const rows = index.search('');
    // Chronological rows do not carry snippets — only MATCH queries do.
    expect(rows.every((r) => r.snippet === undefined)).toBe(true);
  });

  it('refreshIndex reindexes content from session JSON files', () => {
    if (!index.isReady()) {
      return;
    }

    // Simulate a fresh index by writing a session file with rich message
    // content and asking refreshIndex to pick it up from disk. This
    // verifies the reindex path (used on `sessions search` startup) also
    // reads and indexes message content, not just metadata.
    const meta = makeMetadata({ id: 'from-disk', title: 'Untitled' });
    writeSessionFile(meta, [
      { role: 'user', content: 'discuss elasticsearch cluster sizing', timestamp: Date.now() },
      {
        role: 'assistant',
        content: 'For 100GB indices, aim for 3 hot nodes.',
        timestamp: Date.now(),
      },
    ]);
    index.refreshIndex();

    const hits = index.search('elasticsearch');
    expect(hits.map((r) => r.id)).toContain('from-disk');
  });

  it('upsertSession updates an existing row instead of duplicating it', () => {
    if (!index.isReady()) {
      return;
    }

    index.upsertSession(makeMetadata({ id: 'stable', title: 'original title' }));
    index.upsertSession(makeMetadata({ id: 'stable', title: 'updated with kw-marker' }));

    expect(index.search('original')).toEqual([]);
    const hits = index.search('kw-marker');
    expect(hits.map((r) => r.id)).toEqual(['stable']);
  });
});

/**
 * Tests for the `link_pr` tool.
 *
 * Ports upstream kilocode `eb7b4896b test(cli): scope PR-link storage
 * fixtures to Effect layers`, adapted to Alexi's vitest + Zod stack.
 * Upstream uses Bun's `spyOn` to scope PR-link storage fixtures to a
 * single Effect layer; Alexi mocks the whole `session/pr-link` module
 * with `vi.mock` and uses `mockImplementation` per test to swap the
 * fixture. Assertions target the new `recordSessionLink(sessionId,
 * record, worktree)` shape.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// Hoisted mock — mirrors AGENTS.md guidance (mock BEFORE importing SUT).
// We keep `parsePrUrl` real so URL-shape tests exercise the real parser,
// but swap `recordSessionLink` for a fixture per test.
vi.mock('../../../session/pr-link.js', async () => {
  const actual =
    await vi.importActual<typeof import('../../../session/pr-link.js')>(
      '../../../session/pr-link.js'
    );
  return {
    ...actual,
    // Default fixture — individual tests override via `mockImplementation`.
    recordSessionLink: vi.fn(actual.recordSessionLink),
  };
});

import { linkPrTool } from '../link-pr.js';
import * as prLink from '../../../session/pr-link.js';
import type { ToolContext } from '../../index.js';

function makeContext(overrides: Partial<ToolContext> = {}): ToolContext {
  return {
    workdir: '/tmp/fake-worktree',
    sessionId: 'session-abc',
    ...overrides,
  };
}

describe('link_pr tool', () => {
  const originalClient = process.env.ALEXI_CLIENT;

  beforeEach(() => {
    process.env.ALEXI_CLIENT = 'cli';
    // Reset the mock to a passthrough that always records successfully.
    vi.mocked(prLink.recordSessionLink).mockReset();
  });

  afterEach(() => {
    if (originalClient === undefined) {
      delete process.env.ALEXI_CLIENT;
    } else {
      process.env.ALEXI_CLIENT = originalClient;
    }
  });

  test('refuses execution when backend is not CLI', async () => {
    process.env.ALEXI_CLIENT = 'vscode';

    const result = await linkPrTool.executeUnsafe(
      { url: 'https://github.com/owner/repo/pull/1' },
      makeContext()
    );

    expect(result.success).toBe(false);
    expect(result.data).toMatchObject({ ok: false, reason: 'unsupported_client' });
    expect(prLink.recordSessionLink).not.toHaveBeenCalled();
  });

  test('refuses execution when URL is not a recognizable PR', async () => {
    const result = await linkPrTool.executeUnsafe(
      { url: 'https://example.com/not-a-pr' },
      makeContext()
    );

    expect(result.success).toBe(false);
    expect(result.data).toMatchObject({ ok: false, reason: 'invalid_url' });
    expect(prLink.recordSessionLink).not.toHaveBeenCalled();
  });

  test('refuses when the tool context has no sessionId', async () => {
    const result = await linkPrTool.executeUnsafe(
      { url: 'https://github.com/owner/repo/pull/42' },
      makeContext({ sessionId: undefined })
    );

    expect(result.success).toBe(false);
    expect(result.data).toMatchObject({ ok: false, reason: 'missing_session' });
    expect(prLink.recordSessionLink).not.toHaveBeenCalled();
  });

  test('records a session link on the happy path via recordSessionLink', async () => {
    const writes: { sessionId: string; record: unknown; worktree: string }[] = [];
    vi.mocked(prLink.recordSessionLink).mockImplementation(
      async (sessionId, record, worktree) => {
        writes.push({ sessionId, record, worktree });
        return record;
      }
    );

    const result = await linkPrTool.executeUnsafe(
      { url: 'https://github.com/owner/repo/pull/42' },
      makeContext({ sessionId: 'session-abc', workdir: '/tmp/fake-worktree' })
    );

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({ ok: true });
    expect(prLink.recordSessionLink).toHaveBeenCalledTimes(1);
    expect(writes).toHaveLength(1);
    expect(writes[0]).toMatchObject({
      sessionId: 'session-abc',
      worktree: '/tmp/fake-worktree',
      record: {
        evidence: 'user',
        link: { host: 'github.com', owner: 'owner', repo: 'repo', number: 42 },
      },
    });
  });

  test('surfaces worktree_mismatch when recordSessionLink refuses', async () => {
    vi.mocked(prLink.recordSessionLink).mockResolvedValue(undefined);

    const result = await linkPrTool.executeUnsafe(
      { url: 'https://github.com/other/repo/pull/1' },
      makeContext()
    );

    expect(result.success).toBe(false);
    expect(result.data).toMatchObject({ ok: false, reason: 'worktree_mismatch' });
  });

  test('surfaces storage_error when recordSessionLink throws', async () => {
    vi.mocked(prLink.recordSessionLink).mockRejectedValue(new Error('disk full'));

    const result = await linkPrTool.executeUnsafe(
      { url: 'https://github.com/owner/repo/pull/7' },
      makeContext()
    );

    expect(result.success).toBe(false);
    expect(result.data).toMatchObject({ ok: false, reason: 'storage_error' });
  });
});

describe('pr-link helpers', () => {
  const originalClient = process.env.ALEXI_CLIENT;

  afterEach(() => {
    if (originalClient === undefined) {
      delete process.env.ALEXI_CLIENT;
    } else {
      process.env.ALEXI_CLIENT = originalClient;
    }
  });

  test('enabled() returns true only for the CLI client', () => {
    process.env.ALEXI_CLIENT = 'cli';
    expect(prLink.enabled()).toBe(true);

    process.env.ALEXI_CLIENT = 'vscode';
    expect(prLink.enabled()).toBe(false);

    delete process.env.ALEXI_CLIENT;
    // Defaults to `cli` when the caller has not opted out.
    expect(prLink.enabled()).toBe(true);
  });

  test('parsePrUrl handles GitHub and GitLab shapes', () => {
    expect(prLink.parsePrUrl('https://github.com/owner/repo/pull/12')).toMatchObject({
      host: 'github.com',
      owner: 'owner',
      repo: 'repo',
      number: 12,
    });
    expect(
      prLink.parsePrUrl('https://gitlab.com/group/proj/merge_requests/8')
    ).toMatchObject({
      host: 'gitlab.com',
      owner: 'group',
      repo: 'proj',
      number: 8,
    });
    expect(prLink.parsePrUrl('not-a-url')).toBeUndefined();
    expect(prLink.parsePrUrl('https://github.com/owner/repo/issues/1')).toBeUndefined();
  });
});

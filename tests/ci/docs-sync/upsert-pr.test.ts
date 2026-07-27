import { describe, it, expect, vi } from 'vitest';
import {
  FILE_DRAFT_CAP,
  buildPRBody,
  extractWatermark,
  formatWatermarkTimestamp,
  isDocsOnly,
  rolloverBranchName,
  sanitizeBody,
  upsertDocsPR,
  type DocsPRClient,
  type ExistingBotPR,
  type ProcessedPR,
} from '../../../src/ci/docsSync/upsertPr.js';

/**
 * Builds a mock DocsPRClient. Callers override individual methods when they
 * want to assert on inputs; the defaults record the calls for later
 * inspection.
 */
function makeClient(overrides: Partial<DocsPRClient> = {}): {
  client: DocsPRClient;
  commitToBranch: ReturnType<typeof vi.fn>;
  updatePR: ReturnType<typeof vi.fn>;
  createPR: ReturnType<typeof vi.fn>;
  findExistingBotPR: ReturnType<typeof vi.fn>;
} {
  const client: DocsPRClient = {
    findExistingBotPR:
      overrides.findExistingBotPR ??
      vi.fn<DocsPRClient['findExistingBotPR']>().mockResolvedValue(null),
    commitToBranch:
      overrides.commitToBranch ??
      vi.fn<DocsPRClient['commitToBranch']>().mockResolvedValue(undefined),
    updatePR: overrides.updatePR ?? vi.fn<DocsPRClient['updatePR']>().mockResolvedValue(undefined),
    createPR:
      overrides.createPR ?? vi.fn<DocsPRClient['createPR']>().mockResolvedValue({ number: 42 }),
  };
  return {
    client,
    commitToBranch: client.commitToBranch as ReturnType<typeof vi.fn>,
    updatePR: client.updatePR as ReturnType<typeof vi.fn>,
    createPR: client.createPR as ReturnType<typeof vi.fn>,
    findExistingBotPR: client.findExistingBotPR as ReturnType<typeof vi.fn>,
  };
}

const FIXED_NOW = new Date('2026-07-27T13:25:00.000Z');
const WATERMARK = '2026-07-27T13:25:00Z';

describe('sanitizeBody', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeBody('')).toBe('');
  });

  it('escapes HTML comment openers and closers', () => {
    const input = 'hello <!-- processed-through: fake --> world';
    const output = sanitizeBody(input);
    expect(output).not.toContain('<!--');
    expect(output).not.toContain('-->');
    expect(output).toContain('&lt;!--');
    expect(output).toContain('--&gt;');
  });

  it('escapes CDATA openers to prevent injection', () => {
    const input = '<![CDATA[danger]]>';
    expect(sanitizeBody(input)).toContain('&lt;![CDATA[');
  });

  it('leaves ordinary markdown untouched', () => {
    const input = '## Heading\n\nSome **bold** text.';
    expect(sanitizeBody(input)).toBe(input);
  });
});

describe('formatWatermarkTimestamp', () => {
  it('strips fractional seconds from an ISO string', () => {
    const result = formatWatermarkTimestamp('2026-07-27T13:25:00.123Z');
    expect(result).toBe('2026-07-27T13:25:00Z');
  });

  it('accepts a Date instance', () => {
    const result = formatWatermarkTimestamp(new Date('2026-01-02T03:04:05.999Z'));
    expect(result).toBe('2026-01-02T03:04:05Z');
  });

  it('throws for invalid input', () => {
    expect(() => formatWatermarkTimestamp('not a date')).toThrow(/Invalid watermark/);
  });
});

describe('extractWatermark', () => {
  it('returns the timestamp when the marker is present', () => {
    const body = 'blah\n<!-- processed-through: 2026-07-27T13:25:00Z -->\n';
    expect(extractWatermark(body)).toBe('2026-07-27T13:25:00Z');
  });

  it('returns null when no marker is present', () => {
    expect(extractWatermark('nothing here')).toBeNull();
  });

  it('returns null for empty body', () => {
    expect(extractWatermark('')).toBeNull();
  });
});

describe('rolloverBranchName', () => {
  it('formats the branch name deterministically from the clock', () => {
    expect(rolloverBranchName(FIXED_NOW)).toBe('auto-docs-2026-07-27-132500');
  });
});

describe('isDocsOnly', () => {
  it('is true for docs/ paths', () => {
    expect(isDocsOnly(['docs/API.md', 'docs/ROUTING.md'])).toBe(true);
  });

  it('is true for AGENTS.md and README.md at repo root', () => {
    expect(isDocsOnly(['AGENTS.md', 'README.md', 'CHANGELOG.md'])).toBe(true);
  });

  it('is true for an empty modified-file list', () => {
    expect(isDocsOnly([])).toBe(true);
  });

  it('is false when a source file is included', () => {
    expect(isDocsOnly(['docs/API.md', 'src/core/orchestrator.ts'])).toBe(false);
  });

  it('is false for workflow file changes', () => {
    expect(isDocsOnly(['.github/workflows/docs-sync.yml'])).toBe(false);
  });

  it('normalises leading ./ prefix', () => {
    expect(isDocsOnly(['./docs/API.md'])).toBe(true);
  });
});

describe('buildPRBody', () => {
  const prs: ProcessedPR[] = [
    { number: 100, title: 'feat: add thing', url: 'https://example.test/pr/100' },
    { number: 101, title: 'fix(core): pipe|separated title' },
  ];

  it('includes a processed-through watermark comment in the canonical format', () => {
    const body = buildPRBody(prs, WATERMARK);
    expect(body).toContain(`<!-- processed-through: ${WATERMARK} -->`);
    expect(extractWatermark(body)).toBe(WATERMARK);
  });

  it('renders processed PRs as a markdown table with linked numbers', () => {
    const body = buildPRBody(prs, WATERMARK);
    expect(body).toContain('| PR | Title |');
    expect(body).toContain('| [#100](https://example.test/pr/100) | feat: add thing |');
  });

  it('escapes pipes in PR titles so the table stays intact', () => {
    const body = buildPRBody(prs, WATERMARK);
    expect(body).toContain('fix(core): pipe\\|separated title');
  });

  it('drops any existing watermark and appends a fresh one', () => {
    const previous = 'earlier body\n<!-- processed-through: 2026-01-01T00:00:00Z -->\n';
    const body = buildPRBody([], WATERMARK, previous);
    const matches = body.match(/<!-- processed-through:/g) ?? [];
    expect(matches).toHaveLength(1);
    expect(extractWatermark(body)).toBe(WATERMARK);
    expect(body).toContain('earlier body');
  });

  it('sanitizes HTML comments from prior body content', () => {
    const previous = 'attacker <!-- processed-through: 1999-01-01T00:00:00Z --> content';
    const body = buildPRBody([], WATERMARK, previous);
    // The attacker's fake watermark must not have survived as a real marker.
    expect(extractWatermark(body)).toBe(WATERMARK);
    expect(body).toContain('attacker &lt;!--');
  });

  it('renders a default preamble when no previous body is provided', () => {
    const body = buildPRBody([], WATERMARK);
    expect(body).toMatch(/Rolling documentation sync PR/);
  });

  it('renders unlinked PR references when url is missing', () => {
    const body = buildPRBody([{ number: 55, title: 'chore: bump' }], WATERMARK);
    expect(body).toContain('| #55 | chore: bump |');
  });
});

describe('upsertDocsPR', () => {
  const processedPRs: ProcessedPR[] = [{ number: 200, title: 'feat: add' }];

  it('creates a fresh PR when no existing bot PR is found (cold start)', async () => {
    const { client, commitToBranch, createPR, updatePR } = makeClient();

    const result = await upsertDocsPR({
      modifiedFiles: ['docs/API.md'],
      processedPRs,
      watermark: WATERMARK,
      client,
      now: () => FIXED_NOW,
    });

    expect(result.action).toBe('created');
    expect(result.branch).toBe('auto-docs-2026-07-27-132500');
    expect(result.draft).toBe(false);
    expect(result.totalFiles).toBe(1);
    expect(commitToBranch).toHaveBeenCalledWith({
      branch: 'auto-docs-2026-07-27-132500',
      message: 'docs(ci): sync docs with merged PRs [alexi-bot]',
      createBranch: true,
    });
    expect(createPR).toHaveBeenCalledTimes(1);
    expect(updatePR).not.toHaveBeenCalled();
    const created = createPR.mock.calls[0]![0];
    expect(created.title).toBe('[auto-docs] Sync docs with merged PRs');
    expect(created.draft).toBe(false);
    expect(extractWatermark(created.body)).toBe(WATERMARK);
  });

  it('appends to an existing PR when the combined file count is below the cap', async () => {
    const existing: ExistingBotPR = {
      number: 77,
      title: '[auto-docs] Sync docs with merged PRs',
      body: 'previous body\n<!-- processed-through: 2026-07-26T00:00:00Z -->',
      branch: 'auto-docs-2026-07-26-000000',
      changedFiles: 3,
      isDraft: false,
    };
    const { client, commitToBranch, updatePR, createPR } = makeClient({
      findExistingBotPR: vi.fn().mockResolvedValue(existing),
    });

    const result = await upsertDocsPR({
      modifiedFiles: ['docs/A.md', 'docs/B.md'],
      processedPRs,
      watermark: WATERMARK,
      client,
      now: () => FIXED_NOW,
    });

    expect(result.action).toBe('appended');
    expect(result.prNumber).toBe(77);
    expect(result.branch).toBe(existing.branch);
    expect(result.totalFiles).toBe(5);
    expect(result.draft).toBe(false);
    expect(commitToBranch).toHaveBeenCalledWith({
      branch: existing.branch,
      message: 'docs(ci): sync docs with merged PRs [alexi-bot]',
      createBranch: false,
    });
    expect(updatePR).toHaveBeenCalledTimes(1);
    expect(createPR).not.toHaveBeenCalled();
    const updated = updatePR.mock.calls[0]![0];
    expect(extractWatermark(updated.body)).toBe(WATERMARK);
    // Old watermark must have been dropped, not duplicated.
    expect(updated.body.match(/<!-- processed-through:/g)).toHaveLength(1);
    expect(updated.body).toContain('previous body');
  });

  it('rolls over to a fresh branch when the combined file count hits the cap', async () => {
    const existing: ExistingBotPR = {
      number: 88,
      title: '[auto-docs] Sync docs with merged PRs',
      body: 'body',
      branch: 'auto-docs-old',
      changedFiles: FILE_DRAFT_CAP - 1, // 14
      isDraft: false,
    };
    const { client, commitToBranch, createPR, updatePR } = makeClient({
      findExistingBotPR: vi.fn().mockResolvedValue(existing),
      createPR: vi.fn().mockResolvedValue({ number: 99 }),
    });

    const result = await upsertDocsPR({
      modifiedFiles: ['docs/A.md', 'docs/B.md'], // brings total to 16, >= 15
      processedPRs,
      watermark: WATERMARK,
      client,
      now: () => FIXED_NOW,
    });

    expect(result.action).toBe('rolled-over');
    expect(result.prNumber).toBe(99);
    expect(result.branch).toBe('auto-docs-2026-07-27-132500');
    expect(result.totalFiles).toBeGreaterThanOrEqual(FILE_DRAFT_CAP);
    expect(commitToBranch).toHaveBeenCalledWith({
      branch: 'auto-docs-2026-07-27-132500',
      message: 'docs(ci): sync docs with merged PRs [alexi-bot]',
      createBranch: true,
    });
    expect(createPR).toHaveBeenCalledTimes(1);
    expect(updatePR).not.toHaveBeenCalled();
  });

  it('marks the PR as draft when a non-docs file is touched (cold start path)', async () => {
    const { client, createPR } = makeClient();

    const result = await upsertDocsPR({
      modifiedFiles: ['docs/API.md', 'src/core/orchestrator.ts'],
      processedPRs,
      watermark: WATERMARK,
      client,
      now: () => FIXED_NOW,
    });

    expect(result.draft).toBe(true);
    expect(createPR.mock.calls[0]![0].draft).toBe(true);
  });

  it('marks the PR as draft when a non-docs file is touched (append path)', async () => {
    const existing: ExistingBotPR = {
      number: 12,
      title: '[auto-docs] Sync docs with merged PRs',
      body: 'body',
      branch: 'auto-docs-branch',
      changedFiles: 2,
      isDraft: false,
    };
    const { client, updatePR } = makeClient({
      findExistingBotPR: vi.fn().mockResolvedValue(existing),
    });

    const result = await upsertDocsPR({
      modifiedFiles: ['src/tool/index.ts'],
      processedPRs,
      watermark: WATERMARK,
      client,
      now: () => FIXED_NOW,
    });

    expect(result.draft).toBe(true);
    expect(updatePR.mock.calls[0]![0].draft).toBe(true);
  });

  it('preserves an existing draft flag on the append path even for docs-only changes', async () => {
    const existing: ExistingBotPR = {
      number: 15,
      title: '[auto-docs] Sync docs with merged PRs',
      body: 'body',
      branch: 'auto-docs-branch',
      changedFiles: 1,
      isDraft: true,
    };
    const { client, updatePR } = makeClient({
      findExistingBotPR: vi.fn().mockResolvedValue(existing),
    });

    const result = await upsertDocsPR({
      modifiedFiles: ['docs/A.md'],
      processedPRs,
      watermark: WATERMARK,
      client,
      now: () => FIXED_NOW,
    });

    expect(result.draft).toBe(true);
    expect(updatePR.mock.calls[0]![0].draft).toBe(true);
  });

  it('sanitizes agent-provided content in the existing body when appending', async () => {
    const existing: ExistingBotPR = {
      number: 21,
      title: '[auto-docs] Sync docs with merged PRs',
      body: 'good stuff\n<!-- processed-through: 2000-01-01T00:00:00Z --> more <!-- other -->',
      branch: 'auto-docs-branch',
      changedFiles: 1,
      isDraft: false,
    };
    const { client, updatePR } = makeClient({
      findExistingBotPR: vi.fn().mockResolvedValue(existing),
    });

    await upsertDocsPR({
      modifiedFiles: ['docs/A.md'],
      processedPRs,
      watermark: WATERMARK,
      client,
      now: () => FIXED_NOW,
    });

    const body = updatePR.mock.calls[0]![0].body;
    // Only the real watermark, not the attacker-embedded one, may remain.
    expect(body.match(/<!-- processed-through:/g)).toHaveLength(1);
    expect(extractWatermark(body)).toBe(WATERMARK);
    // Any surviving comment openers must be escaped.
    expect(body).not.toMatch(/<!--\s*other/);
  });

  it('uses a custom title when provided', async () => {
    const { client, createPR } = makeClient();

    await upsertDocsPR({
      modifiedFiles: ['docs/A.md'],
      processedPRs,
      watermark: WATERMARK,
      client,
      now: () => FIXED_NOW,
      title: '[auto-docs] Custom Title',
    });

    expect(createPR.mock.calls[0]![0].title).toBe('[auto-docs] Custom Title');
  });
});

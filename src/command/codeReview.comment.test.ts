/**
 * Tests for the `--comment` PR-posting mode of executeCodeReview.
 *
 * Covers:
 *   - parseAllFindings extracts findings under all three severity headers
 *   - inline findings (file+line) post to /pulls/{N}/comments
 *   - findings without file/line aggregate into one /issues/{N}/comments call
 *   - commentDryRun prints planned commands but never executes
 *   - a single inline post failure falls back to summary append
 *   - --comment without an open PR returns success: false with the expected
 *     error and posts nothing
 *   - --comment with gh missing returns success: false with the install hint
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('child_process', () => ({
  execFile: vi.fn(),
  exec: vi.fn(),
  spawn: vi.fn(),
}));

vi.mock('../core/orchestrator.js', () => ({
  sendChat: vi.fn(),
}));

vi.mock('../core/agenticChat.js', () => ({
  agenticChat: vi.fn(),
}));

vi.mock('../providers/index.js', () => ({
  getDefaultModel: vi.fn(() => 'gpt-4o'),
}));

vi.mock('../config/routingConfig.js', () => ({
  loadRoutingConfig: vi.fn(),
}));

vi.mock('../utils/githubPr.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/githubPr.js')>();
  return {
    ...actual,
    detectCurrentPr: vi.fn(),
  };
});

import { execFile } from 'child_process';
import {
  executeCodeReview,
  parseAllFindings,
  buildInlineCommentArgs,
  buildSummaryBody,
  postReviewComments,
} from './codeReview.js';
import { sendChat } from '../core/orchestrator.js';
import { getDefaultModel } from '../providers/index.js';
import { loadRoutingConfig } from '../config/routingConfig.js';
import { detectCurrentPr } from '../utils/githubPr.js';

// ---------------------------------------------------------------------------
// execFile mocking helpers
// ---------------------------------------------------------------------------

type ExecFileCallback = (
  err: (Error & { code?: string | number }) | null,
  stdout: string | Buffer,
  stderr: string | Buffer
) => void;

interface ExecFileCall {
  file: string;
  args: string[];
}

interface ExecFileFixture {
  /** Output for `git diff …` invocations. */
  diff: string;
  /** Output for `git status --porcelain` invocations. */
  status: string;
  /** Per-call response for `gh api ...` invocations, keyed by URL fragment. */
  ghResponses: Array<{
    /** Substring matched against `args[3]` (the API path). */
    pathMatch: string;
    stdout?: string;
    err?: Error & { code?: string | number };
  }>;
  calls: ExecFileCall[];
}

function setExecFileFixture(fixture: ExecFileFixture): void {
  vi.mocked(execFile).mockImplementation(((
    file: string,
    args: string[],
    _options: unknown,
    callback: ExecFileCallback
  ) => {
    fixture.calls.push({ file, args });
    if (file === 'git' && args[0] === 'status') {
      callback(null, fixture.status, '');
    } else if (file === 'git' && args[0] === 'diff') {
      callback(null, fixture.diff, '');
    } else if (file === 'gh' && args[0] === 'api') {
      const apiPath = args[3] ?? '';
      const match = fixture.ghResponses.find((r) => apiPath.includes(r.pathMatch));
      if (!match) {
        callback(null, '{}', '');
      } else if (match.err) {
        callback(match.err, '', '');
      } else {
        callback(null, match.stdout ?? '{}', '');
      }
    } else {
      callback(null, '', '');
    }
    return undefined as unknown;
  }) as unknown as typeof execFile);
}

const SAMPLE_DIFF = `diff --git a/src/foo.ts b/src/foo.ts
index 1111..2222 100644
--- a/src/foo.ts
+++ b/src/foo.ts
@@ -1,3 +1,3 @@
-export const x = 1;
+export const x = 2;
`;

const REVIEW_MIXED = `### MUST FIX (Critical)
- Off-by-one in \`src/foo.ts:1\` — should subtract 1, not add 1
- Missing global state synchronization (no specific file)

### SHOULD IMPROVE (Important)
- Add a unit test for \`src/foo.ts:5\`

### NICE TO HAVE (Suggestions)
- Use a const-tier name`;

function mockReview(text: string = REVIEW_MIXED): void {
  vi.mocked(sendChat).mockResolvedValue({
    text,
    usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
    modelUsed: 'gpt-4o',
    routingReason: undefined,
  });
}

function mockPrPresent(): void {
  vi.mocked(detectCurrentPr).mockResolvedValue({
    owner: 'ausardcompany',
    repo: 'alexi',
    number: 509,
    headSha: 'deadbeef',
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
  vi.mocked(loadRoutingConfig).mockReturnValue({
    models: [
      {
        id: 'gpt-4o',
        type: 'openai',
        costTier: 'medium',
        strengths: [],
        maxTokens: 128000,
        reasoning: false,
      },
    ],
    rules: [],
    preferences: {
      defaultCostTier: 'medium',
      preferCheapWhenPossible: false,
      maxCostPerRequest: null,
      fallbackModel: 'gpt-4o',
    },
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

// ---------------------------------------------------------------------------
// parseAllFindings
// ---------------------------------------------------------------------------

describe('parseAllFindings', () => {
  it('extracts findings from all three severity sections', () => {
    const findings = parseAllFindings(REVIEW_MIXED);
    expect(findings).toHaveLength(4);
    expect(findings[0].severity).toBe('MUST FIX');
    expect(findings[0].file).toBe('src/foo.ts');
    expect(findings[0].line).toBe(1);
    expect(findings[1].severity).toBe('MUST FIX');
    expect(findings[1].file).toBeUndefined();
    expect(findings[1].line).toBeUndefined();
    expect(findings[2].severity).toBe('SHOULD IMPROVE');
    expect(findings[2].file).toBe('src/foo.ts');
    expect(findings[2].line).toBe(5);
    expect(findings[3].severity).toBe('NICE TO HAVE');
  });

  it('returns [] when no recognised section header is present', () => {
    expect(parseAllFindings('Just some unstructured prose.')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// buildInlineCommentArgs / buildSummaryBody
// ---------------------------------------------------------------------------

describe('buildInlineCommentArgs', () => {
  it('builds a well-formed `gh api ...` argv for a pulls/comments call', () => {
    const argv = buildInlineCommentArgs(
      { owner: 'o', repo: 'r', number: 7, headSha: 'abc' },
      { severity: 'MUST FIX', file: 'src/foo.ts', line: 42, body: 'do the thing' }
    );
    expect(argv[0]).toBe('api');
    expect(argv).toContain('repos/o/r/pulls/7/comments');
    expect(argv).toContain('commit_id=abc');
    expect(argv).toContain('path=src/foo.ts');
    expect(argv).toContain('line=42');
    expect(argv).toContain('side=RIGHT');
    expect(argv.find((a) => a.startsWith('body='))).toContain('**[MUST FIX]**');
  });
});

describe('buildSummaryBody', () => {
  it('rolls up severity counts and lists unattributable + failed findings', () => {
    const body = buildSummaryBody(
      [
        { severity: 'MUST FIX', body: 'a' },
        { severity: 'MUST FIX', body: 'b', file: 'x.ts', line: 1 },
        { severity: 'SHOULD IMPROVE', body: 'c' },
      ],
      [{ severity: 'MUST FIX', body: 'a' }],
      [
        {
          finding: { severity: 'MUST FIX', body: 'b', file: 'x.ts', line: 1 },
          reason: 'line not in diff',
        },
      ]
    );
    expect(body).toContain('**MUST FIX:** 2');
    expect(body).toContain('**SHOULD IMPROVE:** 1');
    expect(body).toContain('**NICE TO HAVE:** 0');
    expect(body).toContain('Findings without a file/line');
    expect(body).toContain('Findings that could not be posted inline');
    expect(body).toContain('line not in diff');
  });
});

// ---------------------------------------------------------------------------
// postReviewComments (direct unit, no executeCodeReview wrapper)
// ---------------------------------------------------------------------------

describe('postReviewComments', () => {
  it('dryRun: prints planned commands and never executes', async () => {
    const fixture: ExecFileFixture = {
      diff: '',
      status: '',
      ghResponses: [],
      calls: [],
    };
    setExecFileFixture(fixture);

    const messages: string[] = [];
    const result = await postReviewComments(
      { owner: 'o', repo: 'r', number: 1, headSha: 'sha' },
      [
        { severity: 'MUST FIX', file: 'a.ts', line: 1, body: 'fix a' },
        { severity: 'NICE TO HAVE', body: 'general note' },
      ],
      '/tmp/repo',
      { dryRun: true, onProgress: (m) => messages.push(m) }
    );

    expect(result.posted).toBe(0);
    expect(fixture.calls).toHaveLength(0);
    expect(messages.some((m) => m.includes('repos/o/r/pulls/1/comments'))).toBe(true);
    expect(messages.some((m) => m.includes('repos/o/r/issues/1/comments'))).toBe(true);
  });

  it('posts an inline comment per file+line finding and one summary comment', async () => {
    const fixture: ExecFileFixture = {
      diff: '',
      status: '',
      ghResponses: [
        {
          pathMatch: 'pulls/1/comments',
          stdout: JSON.stringify({ html_url: 'https://gh/inline-1' }),
        },
        {
          pathMatch: 'issues/1/comments',
          stdout: JSON.stringify({ html_url: 'https://gh/summary-1' }),
        },
      ],
      calls: [],
    };
    setExecFileFixture(fixture);

    const result = await postReviewComments(
      { owner: 'o', repo: 'r', number: 1, headSha: 'sha' },
      [
        { severity: 'MUST FIX', file: 'a.ts', line: 1, body: 'fix a' },
        { severity: 'SHOULD IMPROVE', body: 'general note' },
      ],
      '/tmp/repo'
    );

    expect(result.posted).toBe(2);
    expect(result.inlineCommentUrls).toEqual(['https://gh/inline-1']);
    expect(result.summaryCommentUrl).toBe('https://gh/summary-1');

    // 1 inline call + 1 summary call
    const ghCalls = fixture.calls.filter((c) => c.file === 'gh');
    expect(ghCalls).toHaveLength(2);
    expect(ghCalls[0].args).toContain('repos/o/r/pulls/1/comments');
    expect(ghCalls[1].args).toContain('repos/o/r/issues/1/comments');
  });

  it('falls back to summary append when an inline post fails', async () => {
    const inlineErr = Object.assign(new Error('HTTP 422'), { code: 1 });
    const fixture: ExecFileFixture = {
      diff: '',
      status: '',
      ghResponses: [
        { pathMatch: 'pulls/1/comments', err: inlineErr },
        {
          pathMatch: 'issues/1/comments',
          stdout: JSON.stringify({ html_url: 'https://gh/summary' }),
        },
      ],
      calls: [],
    };
    setExecFileFixture(fixture);

    const result = await postReviewComments(
      { owner: 'o', repo: 'r', number: 1, headSha: 'sha' },
      [{ severity: 'MUST FIX', file: 'a.ts', line: 1, body: 'fix a' }],
      '/tmp/repo'
    );

    // Inline failed, summary succeeded.
    expect(result.posted).toBe(1);
    expect(result.summaryCommentUrl).toBe('https://gh/summary');
    expect(result.inlineCommentUrls).toEqual([]);

    // Summary call should mention the failure reason.
    const summaryCall = fixture.calls.find(
      (c) => c.file === 'gh' && c.args.includes('repos/o/r/issues/1/comments')
    );
    expect(summaryCall).toBeDefined();
    const bodyArgIdx = summaryCall!.args.findIndex((a) => a.startsWith('body='));
    expect(summaryCall!.args[bodyArgIdx]).toContain('could not be posted inline');
  });
});

// ---------------------------------------------------------------------------
// executeCodeReview --comment integration
// ---------------------------------------------------------------------------

describe('executeCodeReview --comment', () => {
  it('returns success: false with a clear error when no PR is open', async () => {
    const fixture: ExecFileFixture = {
      diff: SAMPLE_DIFF,
      status: '',
      ghResponses: [],
      calls: [],
    };
    setExecFileFixture(fixture);
    mockReview();
    vi.mocked(detectCurrentPr).mockResolvedValue(null);

    const result = await executeCodeReview({ comment: true });
    expect(result.success).toBe(false);
    expect(result.error).toContain('No PR found');
    // Review still produced.
    expect(result.review).toContain('MUST FIX');
    // No `gh api` calls executed.
    expect(fixture.calls.some((c) => c.file === 'gh')).toBe(false);
  });

  it('returns success: false with install hint when gh is missing', async () => {
    const fixture: ExecFileFixture = {
      diff: SAMPLE_DIFF,
      status: '',
      ghResponses: [],
      calls: [],
    };
    setExecFileFixture(fixture);
    mockReview();
    const { GhCliMissingError } = await import('../utils/githubPr.js');
    vi.mocked(detectCurrentPr).mockRejectedValue(new GhCliMissingError());

    const result = await executeCodeReview({ comment: true });
    expect(result.success).toBe(false);
    expect(result.error).toContain('gh CLI not found');
    expect(result.error).toContain('gh auth login');
  });

  it('posts inline + summary comments when a PR is detected', async () => {
    const fixture: ExecFileFixture = {
      diff: SAMPLE_DIFF,
      status: '',
      ghResponses: [
        { pathMatch: 'pulls/509/comments', stdout: JSON.stringify({ html_url: 'https://gh/i1' }) },
        { pathMatch: 'pulls/509/comments', stdout: JSON.stringify({ html_url: 'https://gh/i2' }) },
        { pathMatch: 'issues/509/comments', stdout: JSON.stringify({ html_url: 'https://gh/s' }) },
      ],
      calls: [],
    };
    setExecFileFixture(fixture);
    mockReview();
    mockPrPresent();

    const result = await executeCodeReview({ comment: true });
    expect(result.success).toBe(true);
    expect(result.comments).toBeDefined();
    expect(result.comments?.posted).toBeGreaterThan(0);

    const ghCalls = fixture.calls.filter((c) => c.file === 'gh');
    // 2 inline (foo.ts:1 MUST FIX, foo.ts:5 SHOULD IMPROVE) + 1 summary
    const inlineCalls = ghCalls.filter((c) =>
      c.args.includes('repos/ausardcompany/alexi/pulls/509/comments')
    );
    const summaryCalls = ghCalls.filter((c) =>
      c.args.includes('repos/ausardcompany/alexi/issues/509/comments')
    );
    expect(inlineCalls.length).toBe(2);
    expect(summaryCalls.length).toBe(1);
  });

  it('commentDryRun: never executes gh api but reports planned calls', async () => {
    const fixture: ExecFileFixture = {
      diff: SAMPLE_DIFF,
      status: '',
      ghResponses: [],
      calls: [],
    };
    setExecFileFixture(fixture);
    mockReview();
    mockPrPresent();

    const messages: string[] = [];
    const result = await executeCodeReview({
      comment: true,
      commentDryRun: true,
      onProgress: (m) => messages.push(m),
    });

    expect(result.success).toBe(true);
    expect(result.comments?.posted).toBe(0);
    // Dry-run mode counts every planned invocation as skipped.
    expect(result.comments?.skipped).toBeGreaterThan(0);

    // No actual gh executions.
    expect(fixture.calls.some((c) => c.file === 'gh')).toBe(false);
    // Planned invocations surfaced via onProgress.
    expect(messages.some((m) => m.includes('pulls/509/comments'))).toBe(true);
    expect(messages.some((m) => m.includes('issues/509/comments'))).toBe(true);
  });
});

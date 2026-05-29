/**
 * Tests for the `--fix` apply-mode of executeCodeReview.
 *
 * The structured review pass and routing logic are covered by
 * tests/command/codeReview.test.ts; this file focuses on:
 *   - the second apply pass via agenticChat
 *   - guard rails (low effort, dirty working tree, fixMaxFindings cap)
 *   - the tool allowlist passed to agenticChat
 *   - parseMustFixFindings + reconcileFindingsWithToolCalls helpers
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

import { execFile } from 'child_process';
import {
  executeCodeReview,
  parseMustFixFindings,
  reconcileFindingsWithToolCalls,
  APPLY_TOOL_ALLOWLIST,
  DEFAULT_FIX_MAX_FINDINGS,
} from './codeReview.js';
import { sendChat } from '../core/orchestrator.js';
import { agenticChat } from '../core/agenticChat.js';
import { getDefaultModel } from '../providers/index.js';
import { loadRoutingConfig } from '../config/routingConfig.js';

// ---------------------------------------------------------------------------
// execFile mocking helpers
// ---------------------------------------------------------------------------

type ExecFileCallback = (
  err: Error | null,
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
  /** Records every call routed through the mock. */
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
    if (args[0] === 'status') {
      callback(null, fixture.status, '');
    } else if (args[0] === 'diff') {
      callback(null, fixture.diff, '');
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
diff --git a/src/bar.ts b/src/bar.ts
index 3333..4444 100644
--- a/src/bar.ts
+++ b/src/bar.ts
@@ -1,3 +1,3 @@
-export function bar() { return 1; }
+export function bar() { return 2; }
`;

const REVIEW_TWO_FINDINGS = `### MUST FIX (Critical)
- Off-by-one in \`src/foo.ts:1\` — should subtract 1, not add 1
- Missing null check in \`src/bar.ts\` before dereferencing

### SHOULD IMPROVE (Important)
- Add a unit test

### NICE TO HAVE (Suggestions)
- Use a const-tier name`;

function mockReview(text: string = REVIEW_TWO_FINDINGS): void {
  vi.mocked(sendChat).mockResolvedValue({
    text,
    usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
    modelUsed: 'gpt-4o',
    routingReason: undefined,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
  vi.mocked(loadRoutingConfig).mockReturnValue({
    models: [
      {
        id: 'gpt-4o-mini',
        type: 'openai',
        costTier: 'cheap',
        strengths: [],
        maxTokens: 16000,
        reasoning: false,
      },
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
// parseMustFixFindings
// ---------------------------------------------------------------------------

describe('parseMustFixFindings', () => {
  it('extracts dash-bullet findings under the MUST FIX header', () => {
    const findings = parseMustFixFindings(REVIEW_TWO_FINDINGS);
    expect(findings).toHaveLength(2);
    expect(findings[0].file).toBe('src/foo.ts');
    expect(findings[0].lineHint).toBe(1);
    expect(findings[1].file).toBe('src/bar.ts');
  });

  it('returns [] when no MUST FIX section is present', () => {
    expect(parseMustFixFindings('### NICE TO HAVE\n- not critical')).toEqual([]);
  });

  it('handles numbered bullets and stops at SHOULD IMPROVE', () => {
    const review = `## MUST FIX
1. Bug in \`a.ts:5\`
2. Bug in \`b.ts\`
## SHOULD IMPROVE
- skip me`;
    const findings = parseMustFixFindings(review);
    expect(findings).toHaveLength(2);
    expect(findings[0].file).toBe('a.ts');
    expect(findings[1].file).toBe('b.ts');
  });

  it('marks findings with no parsable file as having an empty file', () => {
    const review = `### MUST FIX
- Generic structural problem with no path mention`;
    const findings = parseMustFixFindings(review);
    expect(findings).toHaveLength(1);
    expect(findings[0].file).toBe('');
  });
});

// ---------------------------------------------------------------------------
// reconcileFindingsWithToolCalls
// ---------------------------------------------------------------------------

describe('reconcileFindingsWithToolCalls', () => {
  const findings = parseMustFixFindings(REVIEW_TWO_FINDINGS);

  it('marks edits as applied and suggest as skipped', () => {
    const outcomes = reconcileFindingsWithToolCalls(findings, [
      {
        name: 'edit',
        success: true,
        arguments: JSON.stringify({ filePath: 'src/foo.ts', oldString: 'a', newString: 'b' }),
      },
      {
        name: 'suggest',
        success: true,
        arguments: JSON.stringify({
          suggestion: 'Refactor needed in upstream module',
          file: 'src/bar.ts',
        }),
      },
    ]);

    expect(outcomes).toHaveLength(2);
    expect(outcomes[0]).toMatchObject({ file: 'src/foo.ts', status: 'applied' });
    expect(outcomes[1]).toMatchObject({ file: 'src/bar.ts', status: 'skipped' });
    expect(outcomes[1].reason).toContain('Refactor needed');
  });

  it('marks failed edits as failed when no later applied call recovers them', () => {
    const outcomes = reconcileFindingsWithToolCalls(findings, [
      {
        name: 'edit',
        success: false,
        error: 'oldString not found',
        arguments: JSON.stringify({ filePath: 'src/foo.ts', oldString: 'a', newString: 'b' }),
      },
    ]);
    expect(outcomes[0].status).toBe('failed');
    expect(outcomes[0].reason).toContain('oldString not found');
    expect(outcomes[1].status).toBe('skipped');
  });

  it('ignores tool calls with malformed JSON arguments', () => {
    const outcomes = reconcileFindingsWithToolCalls(findings, [
      { name: 'edit', success: true, arguments: '{not json' },
    ]);
    expect(outcomes.every((o) => o.status === 'skipped')).toBe(true);
  });

  it('distributes multiple successful edits across same-file findings', () => {
    // Two findings both targeting src/foo.ts: a single batched-mode model
    // emitting two edit calls should mark BOTH applied, not collapse onto
    // findings[0] only.
    const sameFileReview = `### MUST FIX
- First issue in \`src/foo.ts\`
- Second issue in \`src/foo.ts\``;
    const sameFileFindings = parseMustFixFindings(sameFileReview);
    expect(sameFileFindings).toHaveLength(2);

    const outcomes = reconcileFindingsWithToolCalls(sameFileFindings, [
      {
        name: 'edit',
        success: true,
        arguments: JSON.stringify({ filePath: 'src/foo.ts', oldString: 'a', newString: 'b' }),
      },
      {
        name: 'edit',
        success: true,
        arguments: JSON.stringify({ filePath: 'src/foo.ts', oldString: 'c', newString: 'd' }),
      },
    ]);

    expect(outcomes[0].status).toBe('applied');
    expect(outcomes[1].status).toBe('applied');
  });
});

// ---------------------------------------------------------------------------
// executeCodeReview --fix
// ---------------------------------------------------------------------------

describe('executeCodeReview --fix', () => {
  it('runs apply pass and reports applied + skipped findings', async () => {
    const fixture: ExecFileFixture = { diff: SAMPLE_DIFF, status: '', calls: [] };
    setExecFileFixture(fixture);
    mockReview();

    vi.mocked(agenticChat).mockResolvedValue({
      text: 'done',
      usage: { prompt_tokens: 50, completion_tokens: 25, total_tokens: 75 },
      modelUsed: 'gpt-4o',
      iterations: 1,
      toolCallsExecuted: 3,
      toolCallSummary: [
        {
          name: 'edit',
          success: true,
          arguments: JSON.stringify({
            filePath: 'src/foo.ts',
            oldString: 'export const x = 2;',
            newString: 'export const x = 0;',
          }),
        },
        {
          name: 'edit',
          success: true,
          arguments: JSON.stringify({
            filePath: 'src/bar.ts',
            oldString: 'return 2',
            newString: 'return null === null ? 0 : 1',
          }),
        },
        {
          name: 'suggest',
          success: true,
          arguments: JSON.stringify({
            suggestion: 'consider extracting helper',
          }),
        },
      ],
    });

    const result = await executeCodeReview({
      fix: true,
      workdir: '/tmp/test',
    });

    expect(result.success).toBe(true);
    expect(result.fixesApplied).toBeDefined();
    const applied = result.fixesApplied!.filter((f) => f.status === 'applied');
    const skipped = result.fixesApplied!.filter((f) => f.status === 'skipped');
    // Both edits succeed → both findings move to applied; the trailing
    // unattributed suggest call no longer matches a finding still in default
    // state, so the skipped count is 0.
    expect(applied).toHaveLength(2);
    expect(skipped).toHaveLength(0);
  });

  it('records 2 applied and 1 skipped when one finding cannot be auto-fixed', async () => {
    const fixture: ExecFileFixture = { diff: SAMPLE_DIFF, status: '', calls: [] };
    setExecFileFixture(fixture);

    const reviewWithThree = `### MUST FIX (Critical)
- Off-by-one in \`src/foo.ts:1\`
- Missing null check in \`src/bar.ts\`
- Architecture issue in \`src/baz.ts\` (needs design review)

### SHOULD IMPROVE`;

    mockReview(reviewWithThree);

    vi.mocked(agenticChat).mockResolvedValue({
      text: 'done',
      usage: { prompt_tokens: 50, completion_tokens: 25, total_tokens: 75 },
      modelUsed: 'gpt-4o',
      iterations: 1,
      toolCallsExecuted: 3,
      toolCallSummary: [
        {
          name: 'edit',
          success: true,
          arguments: JSON.stringify({ filePath: 'src/foo.ts', oldString: 'a', newString: 'b' }),
        },
        {
          name: 'edit',
          success: true,
          arguments: JSON.stringify({ filePath: 'src/bar.ts', oldString: 'c', newString: 'd' }),
        },
        {
          name: 'suggest',
          success: true,
          arguments: JSON.stringify({
            suggestion: 'Architectural change required, deferring.',
            file: 'src/baz.ts',
          }),
        },
      ],
    });

    const result = await executeCodeReview({
      fix: true,
      workdir: '/tmp/test',
    });

    const applied = result.fixesApplied!.filter((f) => f.status === 'applied');
    const skipped = result.fixesApplied!.filter((f) => f.status === 'skipped');
    expect(applied).toHaveLength(2);
    expect(skipped).toHaveLength(1);
    expect(skipped[0].file).toBe('src/baz.ts');
    expect(skipped[0].reason).toContain('Architectural change required');
  });

  it('refuses --fix when effort is low without invoking agenticChat or sendChat', async () => {
    setExecFileFixture({ diff: SAMPLE_DIFF, status: '', calls: [] });

    const result = await executeCodeReview({ fix: true, effort: 'low', workdir: '/tmp/test' });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/effort=low/i);
    expect(agenticChat).not.toHaveBeenCalled();
    expect(sendChat).not.toHaveBeenCalled();
  });

  it('refuses --fix when working tree has unrelated dirty changes', async () => {
    const fixture: ExecFileFixture = {
      diff: SAMPLE_DIFF,
      status: ' M src/foo.ts\n M src/bar.ts\n M src/unrelated.ts\n',
      calls: [],
    };
    setExecFileFixture(fixture);
    mockReview();

    const result = await executeCodeReview({ fix: true, workdir: '/tmp/test' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Refusing to auto-apply');
    expect(result.error).toContain('src/unrelated.ts');
    expect(agenticChat).not.toHaveBeenCalled();
    // sendChat is also short-circuited because dirty-tree detection happens
    // before the review pass kicks off.
    expect(sendChat).not.toHaveBeenCalled();
  });

  it('does not refuse when the only dirty files are the ones in the diff', async () => {
    const fixture: ExecFileFixture = {
      diff: SAMPLE_DIFF,
      status: ' M src/foo.ts\n M src/bar.ts\n',
      calls: [],
    };
    setExecFileFixture(fixture);
    mockReview();

    vi.mocked(agenticChat).mockResolvedValue({
      text: 'done',
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      modelUsed: 'gpt-4o',
      iterations: 1,
      toolCallsExecuted: 0,
      toolCallSummary: [],
    });

    const result = await executeCodeReview({ fix: true, workdir: '/tmp/test' });
    expect(result.success).toBe(true);
    expect(agenticChat).toHaveBeenCalledTimes(1);
  });

  it('caps the number of applied findings at fixMaxFindings and notes truncation', async () => {
    const fixture: ExecFileFixture = { diff: SAMPLE_DIFF, status: '', calls: [] };
    setExecFileFixture(fixture);

    const bullets = Array.from({ length: 7 }, (_, i) => `- Issue ${i + 1} in \`src/file${i}.ts\``);
    const reviewWithMany = `### MUST FIX (Critical)\n${bullets.join('\n')}\n\n### SHOULD IMPROVE`;
    mockReview(reviewWithMany);

    vi.mocked(agenticChat).mockResolvedValue({
      text: 'done',
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      modelUsed: 'gpt-4o',
      iterations: 1,
      toolCallsExecuted: 0,
      toolCallSummary: [],
    });

    const result = await executeCodeReview({
      fix: true,
      fixMaxFindings: 3,
      workdir: '/tmp/test',
    });

    expect(result.success).toBe(true);
    expect(result.review).toContain('Found 7 MUST FIX findings');
    expect(result.review).toMatch(/applying only the first 3/i);

    // Only the first 3 findings should appear in the user message sent to
    // agenticChat (the prompt encodes them as JSON).
    const applyUserMessage = vi.mocked(agenticChat).mock.calls[0][0];
    expect(applyUserMessage).toContain('src/file0.ts');
    expect(applyUserMessage).toContain('src/file1.ts');
    expect(applyUserMessage).toContain('src/file2.ts');
    expect(applyUserMessage).not.toContain('src/file3.ts');
  });

  it('passes a tool allowlist that excludes bash and write', async () => {
    setExecFileFixture({ diff: SAMPLE_DIFF, status: '', calls: [] });
    mockReview();

    vi.mocked(agenticChat).mockResolvedValue({
      text: 'done',
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      modelUsed: 'gpt-4o',
      iterations: 1,
      toolCallsExecuted: 0,
      toolCallSummary: [],
    });

    await executeCodeReview({ fix: true, workdir: '/tmp/test' });

    expect(agenticChat).toHaveBeenCalledTimes(1);
    const opts = vi.mocked(agenticChat).mock.calls[0][1] as { enabledTools?: string[] };
    expect(opts.enabledTools).toBeDefined();
    expect(opts.enabledTools).not.toContain('bash');
    expect(opts.enabledTools).not.toContain('write');
    expect(opts.enabledTools).toEqual(expect.arrayContaining(['edit', 'multiedit', 'suggest']));
  });

  it('exposes APPLY_TOOL_ALLOWLIST without bash or write', () => {
    expect(APPLY_TOOL_ALLOWLIST).not.toContain('bash');
    expect(APPLY_TOOL_ALLOWLIST).not.toContain('write');
    expect(APPLY_TOOL_ALLOWLIST).toContain('edit');
    expect(APPLY_TOOL_ALLOWLIST).toContain('multiedit');
    expect(APPLY_TOOL_ALLOWLIST).toContain('suggest');
  });

  it('uses DEFAULT_FIX_MAX_FINDINGS = 10 when no override is provided', () => {
    expect(DEFAULT_FIX_MAX_FINDINGS).toBe(10);
  });

  it('returns fix=false path unchanged (no agenticChat invocation)', async () => {
    setExecFileFixture({ diff: SAMPLE_DIFF, status: '', calls: [] });
    mockReview();

    const result = await executeCodeReview({ workdir: '/tmp/test' });
    expect(result.success).toBe(true);
    expect(result.fixesApplied).toBeUndefined();
    expect(agenticChat).not.toHaveBeenCalled();
  });
});

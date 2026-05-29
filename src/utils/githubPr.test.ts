/**
 * Tests for detectCurrentPr / GhCliMissingError.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('child_process', () => ({
  execFile: vi.fn(),
}));

import { execFile } from 'child_process';
import { detectCurrentPr, GhCliMissingError } from './githubPr.js';

type ExecFileCallback = (
  err: (Error & { code?: string | number }) | null,
  stdout: string | Buffer,
  stderr: string | Buffer
) => void;

interface CallRecord {
  file: string;
  args: string[];
}

interface Fixture {
  err?: Error & { code?: string | number };
  stdout?: string;
  stderr?: string;
  calls: CallRecord[];
}

function setExecFile(fixture: Fixture): void {
  vi.mocked(execFile).mockImplementation(((
    file: string,
    args: string[],
    _options: unknown,
    callback: ExecFileCallback
  ) => {
    fixture.calls.push({ file, args });
    callback(fixture.err ?? null, fixture.stdout ?? '', fixture.stderr ?? '');
    return undefined as unknown;
  }) as unknown as typeof execFile);
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('detectCurrentPr', () => {
  it('returns parsed PrContext when gh pr view succeeds', async () => {
    const json = JSON.stringify({
      number: 509,
      headRefOid: 'deadbeef1234',
      baseRefName: 'main',
      headRepository: { name: 'alexi' },
      headRepositoryOwner: { login: 'ausardcompany' },
    });
    const fixture: Fixture = { stdout: json, calls: [] };
    setExecFile(fixture);

    const ctx = await detectCurrentPr('/tmp/repo');
    expect(ctx).toEqual({
      owner: 'ausardcompany',
      repo: 'alexi',
      number: 509,
      headSha: 'deadbeef1234',
    });
    expect(fixture.calls).toHaveLength(1);
    expect(fixture.calls[0].file).toBe('gh');
    expect(fixture.calls[0].args).toEqual([
      'pr',
      'view',
      '--json',
      'number,headRefOid,baseRefName,headRepository,headRepositoryOwner',
    ]);
  });

  it('returns null when no pull request is associated with the current branch', async () => {
    const err = Object.assign(new Error('Process exited with non-zero status'), {
      code: 1,
    });
    const fixture: Fixture = {
      err,
      stdout: '',
      stderr: 'no pull requests found for branch "feature/foo"',
      calls: [],
    };
    setExecFile(fixture);

    const ctx = await detectCurrentPr('/tmp/repo');
    expect(ctx).toBeNull();
  });

  it('returns null on the alternative "no pull request found" wording', async () => {
    const err = Object.assign(new Error('exit 1'), { code: 1 });
    const fixture: Fixture = {
      err,
      stdout: '',
      stderr: "couldn't find a pull request for the current branch",
      calls: [],
    };
    setExecFile(fixture);

    expect(await detectCurrentPr('/tmp/repo')).toBeNull();
  });

  it('throws GhCliMissingError when gh is not on PATH', async () => {
    const err = Object.assign(new Error('spawn gh ENOENT'), { code: 'ENOENT' });
    const fixture: Fixture = { err, calls: [] };
    setExecFile(fixture);

    await expect(detectCurrentPr('/tmp/repo')).rejects.toBeInstanceOf(GhCliMissingError);
  });

  it('throws when gh exits with an unexpected error', async () => {
    const err = Object.assign(new Error('exit 1'), { code: 1 });
    const fixture: Fixture = {
      err,
      stdout: '',
      stderr: 'authentication required: please run gh auth login',
      calls: [],
    };
    setExecFile(fixture);

    await expect(detectCurrentPr('/tmp/repo')).rejects.toThrow(/gh pr view failed/);
  });

  it('throws when gh returns malformed JSON', async () => {
    const fixture: Fixture = { stdout: 'not json', calls: [] };
    setExecFile(fixture);

    await expect(detectCurrentPr('/tmp/repo')).rejects.toThrow(/parse gh pr view JSON/);
  });

  it('throws when JSON is missing required fields', async () => {
    const fixture: Fixture = {
      stdout: JSON.stringify({ number: 1 }),
      calls: [],
    };
    setExecFile(fixture);

    await expect(detectCurrentPr('/tmp/repo')).rejects.toThrow(/incomplete JSON/);
  });
});

/**
 * GitHub PR detection utilities.
 *
 * Wraps the `gh` CLI (no shell, no `bash` tool) to discover the pull request
 * associated with the current branch and the repo metadata needed to post
 * inline review comments.
 */

import { execFile } from 'child_process';

/**
 * Thrown when `gh` is not available on `PATH`. Callers should render an
 * actionable message ("install gh and authenticate") rather than treating
 * this as a generic failure.
 */
export class GhCliMissingError extends Error {
  constructor(message = 'gh CLI not found on PATH') {
    super(message);
    this.name = 'GhCliMissingError';
  }
}

/** Repo + PR metadata needed by the posting code. */
export interface PrContext {
  owner: string;
  repo: string;
  number: number;
  headSha: string;
}

/** Promise wrapper around execFile. Mirrors the helper in codeReview.ts. */
function execFileAsync(
  file: string,
  args: string[],
  options: { cwd?: string; maxBuffer?: number }
): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve, reject) => {
    execFile(file, args, options, (err, stdout: string | Buffer, stderr: string | Buffer) => {
      const out = typeof stdout === 'string' ? stdout : stdout.toString('utf-8');
      const errOut = typeof stderr === 'string' ? stderr : stderr.toString('utf-8');
      if (err) {
        const e = err as NodeJS.ErrnoException & { code?: string | number };
        if (e.code === 'ENOENT') {
          reject(new GhCliMissingError('gh CLI not found on PATH'));
          return;
        }
        // Resolve non-zero exits so the caller can inspect stderr/stdout.
        const exitCode = typeof e.code === 'number' ? e.code : 1;
        resolve({ stdout: out, stderr: errOut, code: exitCode });
        return;
      }
      resolve({ stdout: out, stderr: errOut, code: 0 });
    });
  });
}

/**
 * Match `gh`'s "no pull requests found" error message. `gh` keeps changing
 * the exact wording across versions, so we look for either of the common
 * phrasings.
 */
function looksLikeNoPrError(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes('no pull requests found') ||
    lower.includes('no pull request found') ||
    lower.includes("couldn't find a pull request") ||
    lower.includes('no pr associated')
  );
}

interface GhPrViewJson {
  number?: number;
  headRefOid?: string;
  baseRefName?: string;
  headRepository?: { name?: string } | null;
  headRepositoryOwner?: { login?: string } | null;
}

/**
 * Detect the pull request associated with the current branch (in `workdir`).
 *
 * Returns:
 *   - the parsed `PrContext` when `gh pr view` succeeds
 *   - `null` when the current branch has no associated PR (gh exits non-zero
 *     with a "no pull requests" message)
 *
 * Throws:
 *   - `GhCliMissingError` if `gh` is not on `PATH`
 *   - `Error` for other unexpected failures (parse error, missing fields)
 */
export async function detectCurrentPr(workdir: string): Promise<PrContext | null> {
  const { stdout, stderr, code } = await execFileAsync(
    'gh',
    ['pr', 'view', '--json', 'number,headRefOid,baseRefName,headRepository,headRepositoryOwner'],
    { cwd: workdir, maxBuffer: 4 * 1024 * 1024 }
  );

  if (code !== 0) {
    if (looksLikeNoPrError(stderr) || looksLikeNoPrError(stdout)) {
      return null;
    }
    const detail = (stderr || stdout || '').trim();
    throw new Error(`gh pr view failed (exit ${code}): ${detail || '(no output)'}`);
  }

  let parsed: GhPrViewJson;
  try {
    parsed = JSON.parse(stdout) as GhPrViewJson;
  } catch (err) {
    throw new Error(`Failed to parse gh pr view JSON: ${(err as Error).message}`, { cause: err });
  }

  const owner = parsed.headRepositoryOwner?.login;
  const repo = parsed.headRepository?.name;
  const number = parsed.number;
  const headSha = parsed.headRefOid;

  if (!owner || !repo || typeof number !== 'number' || !headSha) {
    throw new Error(
      `gh pr view returned incomplete JSON ` +
        `(owner=${owner ?? 'undefined'}, repo=${repo ?? 'undefined'}, ` +
        `number=${number ?? 'undefined'}, headSha=${headSha ?? 'undefined'})`
    );
  }

  return { owner, repo, number, headSha };
}

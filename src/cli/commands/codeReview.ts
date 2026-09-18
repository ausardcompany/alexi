/**
 * code-review command — non-interactive entry point for the code-review skill.
 *
 *   alexi code-review                  # uncommitted, medium effort
 *   alexi code-review --effort high
 *   alexi code-review --base main
 */

import type { Command } from 'commander';
import {
  executeCodeReview,
  type CodeReviewEffort,
  type CodeReviewTarget,
} from '../../command/codeReview.js';
import { detectVCSProvider, type VCSRemote } from '../../git/remoteDetection.js';
import { formatMRPRUrl, requestNoun } from '../../git/urlFormatter.js';

interface CodeReviewCliOptions {
  effort?: string;
  base?: string;
  model?: string;
  workdir?: string;
  fix?: boolean;
  fixMax?: number;
  comment?: boolean;
  commentDryRun?: boolean;
}

/**
 * Best-effort formatter for the current MR/PR URL from CI environment
 * variables. Returns `undefined` when no MR/PR number can be found.
 *
 * Recognised env vars:
 *   - GitLab CI: `CI_MERGE_REQUEST_IID`
 *   - Bitbucket Pipelines: `BITBUCKET_PR_ID`
 *   - Generic fallback: `ALEXI_MR_NUMBER` / `ALEXI_PR_NUMBER`
 */
function tryFormatEnvMRPRUrl(remote: VCSRemote): string | undefined {
  const raw =
    process.env['ALEXI_MR_NUMBER'] ??
    process.env['ALEXI_PR_NUMBER'] ??
    (remote.provider === 'gitlab' ? process.env['CI_MERGE_REQUEST_IID'] : undefined) ??
    (remote.provider === 'bitbucket' ? process.env['BITBUCKET_PR_ID'] : undefined);
  if (!raw) {
    return undefined;
  }
  const num = Number.parseInt(raw, 10);
  if (!Number.isInteger(num) || num <= 0) {
    return undefined;
  }
  try {
    return formatMRPRUrl({
      provider: remote.provider,
      org: remote.org,
      repo: remote.repo,
      number: num,
    });
  } catch {
    return undefined;
  }
}

function parseEffort(value: string | undefined): CodeReviewEffort {
  const normalised = (value ?? 'medium').toLowerCase();
  if (normalised === 'low' || normalised === 'medium' || normalised === 'high') {
    return normalised;
  }
  throw new Error(`Invalid --effort value: ${value} (expected low|medium|high)`);
}

export function registerCodeReviewCommand(program: Command): void {
  program
    .command('code-review')
    .description('Review uncommitted changes (or a base-branch diff) for correctness bugs')
    .option('--effort <level>', 'Review effort: low | medium | high', 'medium')
    .option('--base <branch>', 'Compare against this base branch instead of HEAD')
    .option('--model <id>', 'Override the model used for the review')
    .option('--workdir <path>', 'Working directory for the git invocation')
    .option('--fix', 'Apply MUST FIX findings as edits via the agentic loop')
    .option(
      '--fix-max <n>',
      'Maximum findings to auto-apply when --fix is set (default: 10)',
      (v) => parseInt(v, 10),
      10
    )
    .option('--comment', 'Post findings to the current GitHub PR via gh api')
    .option('--comment-dry-run', 'Print the planned `gh api` invocations without executing them')
    .action(async (opts: CodeReviewCliOptions) => {
      try {
        const effort = parseEffort(opts.effort);
        const target: CodeReviewTarget = opts.base ? { base: opts.base } : 'uncommitted';

        // Detect VCS provider (best-effort). Only affects output wording
        // and `--comment` handling for non-GitHub remotes; the review
        // itself is provider-agnostic.
        const remote = await detectVCSProvider(opts.workdir ?? process.cwd());
        const noun = remote ? requestNoun(remote.provider) : 'PR';

        // The `--comment` flag posts findings via `gh api`, which is
        // GitHub-only. On GitLab/Bitbucket we surface the equivalent
        // MR/PR URL (when derivable from CI env) and skip the gh path.
        let commentPassthrough = opts.comment;
        if (opts.comment && remote && remote.provider !== 'github') {
          commentPassthrough = false;
          process.stderr.write(
            `[code-review] --comment is GitHub-only; skipping ${noun} comment posting ` +
              `for ${remote.provider} remote\n`
          );
          const mrPrUrl = tryFormatEnvMRPRUrl(remote);
          if (mrPrUrl) {
            process.stderr.write(`[code-review] detected ${noun}: ${mrPrUrl}\n`);
          }
        }

        const result = await executeCodeReview({
          effort,
          target,
          workdir: opts.workdir,
          modelOverride: opts.model,
          fix: opts.fix,
          fixMaxFindings: opts.fixMax,
          comment: commentPassthrough,
          commentDryRun: opts.commentDryRun,
          onProgress: (msg) => process.stderr.write(`[code-review] ${msg}\n`),
        });

        if (!result.success && result.error) {
          process.stderr.write(`code-review failed: ${result.error}\n`);
          process.exit(1);
        }

        process.stdout.write(result.review);
        if (!result.review.endsWith('\n')) {
          process.stdout.write('\n');
        }

        if (result.fixesApplied) {
          const counts = { applied: 0, skipped: 0, failed: 0 };
          for (const fa of result.fixesApplied) {
            counts[fa.status]++;
          }
          process.stdout.write('\n## Fixes\n');
          for (const fa of result.fixesApplied) {
            process.stdout.write(
              `- [${fa.status}] ${fa.file || '(no file)'}` +
                (fa.reason ? ` — ${fa.reason}` : '') +
                '\n'
            );
          }
          process.stderr.write(
            `\n[code-review] fixes: ${counts.applied} applied, ${counts.skipped} skipped, ${counts.failed} failed\n`
          );
        }

        if (result.comments) {
          process.stderr.write(
            `\n[code-review] ${noun} comments: ${result.comments.posted} posted, ` +
              `${result.comments.skipped} skipped\n`
          );
          if (result.comments.summaryCommentUrl) {
            process.stderr.write(`[code-review] summary: ${result.comments.summaryCommentUrl}\n`);
          }
          for (const url of result.comments.inlineCommentUrls) {
            process.stderr.write(`[code-review] inline:  ${url}\n`);
          }
        }

        process.stderr.write(
          `\n[code-review] effort=${result.effort} diff=${result.diffBytes}B ` +
            `tokens=${result.totalTokens.toLocaleString()} ` +
            `elapsed=${(result.elapsedMs / 1000).toFixed(1)}s\n`
        );
      } catch (err) {
        process.stderr.write(
          `code-review failed: ${err instanceof Error ? err.message : String(err)}\n`
        );
        process.exit(1);
      }
    });
}

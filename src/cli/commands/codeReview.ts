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

interface CodeReviewCliOptions {
  effort?: string;
  base?: string;
  model?: string;
  workdir?: string;
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
    .action(async (opts: CodeReviewCliOptions) => {
      try {
        const effort = parseEffort(opts.effort);
        const target: CodeReviewTarget = opts.base ? { base: opts.base } : 'uncommitted';

        const result = await executeCodeReview({
          effort,
          target,
          workdir: opts.workdir,
          modelOverride: opts.model,
          onProgress: (msg) => process.stderr.write(`[code-review] ${msg}\n`),
        });

        process.stdout.write(result.review);
        if (!result.review.endsWith('\n')) {
          process.stdout.write('\n');
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

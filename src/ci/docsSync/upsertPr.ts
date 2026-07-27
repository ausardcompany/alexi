/**
 * docs-sync: rolling PR upsert.
 *
 * Maintains a single rolling "[auto-docs]" pull request that accumulates
 * documentation changes across daily runs. When the accumulated file count
 * would exceed the draft cap, a fresh branch and PR are opened so no single
 * PR grows unbounded. The PR body carries a machine-readable
 * `processed-through` watermark that other modules use to derive the next
 * processing window.
 *
 * All GitHub side effects (branch commit, PR list/create/update) are injected
 * so this module remains pure and testable without a real API client.
 */

/** Draft cap: at or above this file count, roll over to a fresh branch. */
export const FILE_DRAFT_CAP = 15;

/** Prefix used to identify bot-authored PRs during list queries. */
export const PR_TITLE_PREFIX = '[auto-docs]';

/** Default title when opening a fresh PR. */
export const DEFAULT_PR_TITLE = '[auto-docs] Sync docs with merged PRs';

/** Regex used both to detect and to strip existing watermarks in PR bodies. */
const WATERMARK_RE = /<!--\s*processed-through:\s*([0-9T:\-Z]+)\s*-->/;

/**
 * Files considered "docs" for the purpose of the draft-mode decision. Any
 * change to a path outside this allowlist forces the PR to draft so a human
 * reviews build-executable modifications.
 */
const DOCS_PATH_PREFIXES = ['docs/'] as const;
const DOCS_ROOT_FILES = new Set(['AGENTS.md', 'README.md', 'CHANGELOG.md']);

export interface ProcessedPR {
  /** PR number in the upstream repo. */
  number: number;
  /** PR title (already-sanitized by the caller). */
  title: string;
  /** PR URL (may be empty; rendered as plain number when missing). */
  url?: string;
}

export interface ExistingBotPR {
  /** PR number in the docs repo. */
  number: number;
  /** PR title (should start with {@link PR_TITLE_PREFIX}). */
  title: string;
  /** Existing body of the PR (may contain a prior watermark). */
  body: string;
  /** Head branch of the PR. */
  branch: string;
  /** Number of files currently touched by the PR. */
  changedFiles: number;
  /** Whether the PR is already marked as draft. */
  isDraft: boolean;
}

/**
 * Adapter surface for GitHub side effects. Concrete implementations (Octokit,
 * gh CLI wrapper, in-memory fake) plug in here.
 */
export interface DocsPRClient {
  /** Returns the newest open bot PR whose title starts with the prefix. */
  findExistingBotPR: () => Promise<ExistingBotPR | null>;
  /**
   * Commit staged changes to the given branch. Called for both the existing
   * branch (append path) and freshly created branches (rollover path).
   */
  commitToBranch: (input: {
    branch: string;
    message: string;
    createBranch: boolean;
  }) => Promise<void>;
  /**
   * Update an existing PR's body (and optionally its draft flag).
   * Called only on the append path.
   */
  updatePR: (input: { number: number; body: string; draft: boolean }) => Promise<void>;
  /**
   * Create a brand new PR. Called on rollover and cold-start paths.
   * The returned number is used by callers to log the outcome.
   */
  createPR: (input: {
    branch: string;
    title: string;
    body: string;
    draft: boolean;
  }) => Promise<{ number: number }>;
}

export interface UpsertDocsPROptions {
  /** Repo-relative paths of files staged in the working tree. */
  modifiedFiles: readonly string[];
  /** PRs merged since the previous watermark, in chronological order. */
  processedPRs: readonly ProcessedPR[];
  /** Timestamp to embed in the new watermark, ISO8601 with `Z` suffix. */
  watermark: string;
  /** GitHub adapter. */
  client: DocsPRClient;
  /**
   * Optional clock used to generate the rollover branch suffix. Defaults to
   * `Date.now()`; tests inject a fixed instant for determinism.
   */
  now?: () => Date;
  /** Optional override for the base title on rollover / cold-start. */
  title?: string;
}

export type UpsertAction = 'appended' | 'rolled-over' | 'created';

export interface UpsertDocsPRResult {
  /** Which branch of the decision tree fired. */
  action: UpsertAction;
  /** PR number that was updated or created. */
  prNumber: number;
  /** Branch that was committed to. */
  branch: string;
  /** True when the PR ended up in draft state. */
  draft: boolean;
  /** Total file count considered for the draft cap. */
  totalFiles: number;
}

/**
 * Escapes any HTML comment sequences in agent-provided text so they cannot
 * forge or overwrite the machine-readable watermark. The transformation is
 * intentionally irreversible: dashes inside comments are replaced with a
 * lookalike that renders identically in Markdown but does not close a comment.
 */
export function sanitizeBody(body: string): string {
  if (!body) {
    return '';
  }
  return body
    .replace(/<!--/g, '&lt;!--')
    .replace(/-->/g, '--&gt;')
    .replace(/<!\[CDATA\[/g, '&lt;![CDATA[');
}

/**
 * Formats a Date (or ISO string) into the canonical watermark timestamp:
 * `YYYY-MM-DDTHH:MM:SSZ` (no fractional seconds, always UTC).
 */
export function formatWatermarkTimestamp(input: Date | string): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid watermark timestamp: ${String(input)}`);
  }
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/** Extracts the watermark timestamp from a PR body, or null when missing. */
export function extractWatermark(body: string): string | null {
  if (!body) {
    return null;
  }
  const match = body.match(WATERMARK_RE);
  return match ? match[1] : null;
}

/** Removes any existing watermark comment from a body (idempotent). */
function stripWatermark(body: string): string {
  return body
    .replace(WATERMARK_RE, '')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd();
}

/**
 * Builds a full PR body from the list of processed PRs and the watermark. The
 * processed-PR list is rendered as a Markdown table so reviewers can scan the
 * digest without expanding the PR. Any prior watermark in `previousBody` is
 * dropped before the new marker is appended.
 */
export function buildPRBody(
  processedPRs: readonly ProcessedPR[],
  watermark: string,
  previousBody = ''
): string {
  const sections: string[] = [];

  const sanitizedPrevious = stripWatermark(sanitizeBody(previousBody));
  if (sanitizedPrevious) {
    sections.push(sanitizedPrevious);
  } else {
    sections.push(
      'Rolling documentation sync PR. New entries are appended by the docs-sync bot on each run.'
    );
  }

  if (processedPRs.length > 0) {
    const rows = processedPRs.map((pr) => {
      const link = pr.url ? `[#${pr.number}](${pr.url})` : `#${pr.number}`;
      const title = sanitizeBody(pr.title).replace(/\|/g, '\\|');
      return `| ${link} | ${title} |`;
    });
    sections.push(['## Processed PRs', '', '| PR | Title |', '| --- | --- |', ...rows].join('\n'));
  }

  sections.push(`<!-- processed-through: ${watermark} -->`);
  return sections.join('\n\n') + '\n';
}

/**
 * Returns true when every modified path is a documentation file. Anything
 * outside {@link DOCS_PATH_PREFIXES} or {@link DOCS_ROOT_FILES} is considered
 * build-executable and forces the PR to draft.
 */
export function isDocsOnly(modifiedFiles: readonly string[]): boolean {
  if (modifiedFiles.length === 0) {
    return true;
  }
  for (const file of modifiedFiles) {
    const normalized = file.replace(/^\.\//, '');
    if (DOCS_ROOT_FILES.has(normalized)) {
      continue;
    }
    const isDocsPath = DOCS_PATH_PREFIXES.some((prefix) => normalized.startsWith(prefix));
    if (!isDocsPath) {
      return false;
    }
  }
  return true;
}

/**
 * Produces a rollover branch name that includes an ISO-derived timestamp so
 * concurrent runs never collide. Format: `auto-docs-YYYY-MM-DD-HHMMSS`.
 */
export function rolloverBranchName(now: Date): string {
  const iso = now.toISOString();
  const [datePart, timePart] = iso.split('T');
  const hhmmss = timePart.slice(0, 8).replace(/:/g, '');
  return `auto-docs-${datePart}-${hhmmss}`;
}

/**
 * Rolling PR upsert. Chooses between three actions based on the current state
 * of the docs repo:
 *
 * - `appended`: an existing open bot PR is under the draft cap; new commits
 *   and processed-PR entries are added, watermark bumped.
 * - `rolled-over`: an existing open bot PR is at or above the cap; a fresh
 *   branch is opened and a new PR is created.
 * - `created`: no existing bot PR was found; a fresh branch + PR are created.
 *
 * In all cases the PR is marked as draft when any non-docs file was touched.
 */
export async function upsertDocsPR(options: UpsertDocsPROptions): Promise<UpsertDocsPRResult> {
  const { modifiedFiles, processedPRs, watermark, client } = options;
  const title = options.title ?? DEFAULT_PR_TITLE;
  const nowFn = options.now ?? ((): Date => new Date());

  const nonDocsChange = !isDocsOnly(modifiedFiles);
  const existing = await client.findExistingBotPR();
  const commitMessage = `docs(ci): sync docs with merged PRs [alexi-bot]`;

  if (existing) {
    const totalFiles = existing.changedFiles + modifiedFiles.length;
    if (totalFiles < FILE_DRAFT_CAP) {
      const newBody = buildPRBody(processedPRs, watermark, existing.body);
      const draft = existing.isDraft || nonDocsChange;
      await client.commitToBranch({
        branch: existing.branch,
        message: commitMessage,
        createBranch: false,
      });
      await client.updatePR({ number: existing.number, body: newBody, draft });
      return {
        action: 'appended',
        prNumber: existing.number,
        branch: existing.branch,
        draft,
        totalFiles,
      };
    }
    // At/over cap: roll over to a fresh branch and PR.
    const branch = rolloverBranchName(nowFn());
    const body = buildPRBody(processedPRs, watermark);
    const draft = nonDocsChange;
    await client.commitToBranch({ branch, message: commitMessage, createBranch: true });
    const created = await client.createPR({ branch, title, body, draft });
    return {
      action: 'rolled-over',
      prNumber: created.number,
      branch,
      draft,
      totalFiles,
    };
  }

  // Cold start: no bot PR currently open.
  const branch = rolloverBranchName(nowFn());
  const body = buildPRBody(processedPRs, watermark);
  const draft = nonDocsChange;
  await client.commitToBranch({ branch, message: commitMessage, createBranch: true });
  const created = await client.createPR({ branch, title, body, draft });
  return {
    action: 'created',
    prNumber: created.number,
    branch,
    draft,
    totalFiles: modifiedFiles.length,
  };
}

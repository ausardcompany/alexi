/**
 * Depth-Limited Skill Scanner
 *
 * Alexi_change (opencode #55597 — "bound skill discovery"): replaces
 * unbounded glob expansion (`{*.md,**\/SKILL.md}`) with a breadth-first
 * walk that
 *
 *   1. stops at `MAX_DEPTH` directories (default `6`),
 *   2. short-circuits on the first `SKILL.md` found in a subtree (that
 *      file *is* the skill — recursing further would double-count or
 *      pick up unrelated markdown),
 *   3. skips well-known noise directories (`node_modules`, `.git`,
 *      `dist`, `build`, `.next`, `target`, …),
 *   4. tolerates `readdir`/`stat` failures (sandboxed filesystems,
 *      broken symlinks) so a bad branch does not abort the whole
 *      scan.
 *
 * Keeping this behaviour isolated in a dedicated module means
 * `src/skill/index.ts` can migrate to it one call site at a time, and
 * tests can exercise the bounds without spinning up a full skill
 * registry.
 */

import * as path from 'path';
import { readdir, stat } from 'fs/promises';

/**
 * Maximum directory depth the scanner will descend into. `0` means
 * only the scan root itself is visited. The upstream default (`6`) is
 * generous enough for every real monorepo skill layout we have seen
 * and short enough to prevent runaway walks on `node_modules`
 * symlink loops or recursive `.git` worktrees.
 */
export const MAX_DEPTH = 6;

/**
 * Directory basenames always skipped by the scanner regardless of
 * depth. Matches upstream opencode's list; keep it synced if upstream
 * grows the set.
 */
export const IGNORED_DIRS: ReadonlySet<string> = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'target',
  '.cache',
  '.turbo',
]);

/**
 * Glob-style ignore patterns re-exported for callers that still use a
 * glob library elsewhere (e.g. the test harness). Mirrors the array
 * exported by opencode's `util/skill-scan`.
 */
export const ignore: readonly string[] = [
  '**/node_modules/**',
  '**/.git/**',
  '**/.*',
  '**/.*/**',
];

/**
 * Classified child entry produced by the scanner's per-directory probe.
 * Symbolic links are resolved up front so the caller does not need a
 * second round of `stat` calls.
 */
interface ScanChild {
  readonly name: string;
  readonly path: string;
  readonly type: 'file' | 'directory' | 'other';
}

/**
 * Resolve a dirent (including symlinks) into {@link ScanChild}. A
 * broken symlink or stat failure yields `'other'` so the entry is
 * ignored without aborting the parent scan.
 */
async function classify(parent: string, name: string, isFile: boolean, isDir: boolean, isSymlink: boolean): Promise<ScanChild> {
  const target = path.join(parent, name);
  if (isFile) {
    return { name, path: target, type: 'file' };
  }
  if (isDir) {
    return { name, path: target, type: 'directory' };
  }
  if (isSymlink) {
    const s = await stat(target).catch(() => null);
    if (s?.isDirectory()) {
      return { name, path: target, type: 'directory' };
    }
    if (s?.isFile()) {
      return { name, path: target, type: 'file' };
    }
  }
  return { name, path: target, type: 'other' };
}

/**
 * BFS scan of `root` returning the discovered skill file paths. At the
 * scan root (depth 0) every `*.md` file is a candidate (legacy flat
 * layout); below that only files literally named `SKILL.md` qualify,
 * and the subtree is pruned once one is found.
 *
 * The returned list is sorted lexicographically so callers can rely on
 * a stable order between runs regardless of underlying filesystem
 * ordering.
 */
export async function scanSkills(root: string): Promise<string[]> {
  const files: string[] = [];
  const queue: Array<{ directory: string; depth: number }> = [
    { directory: root, depth: 0 },
  ];

  while (queue.length > 0) {
    const item = queue.shift()!;

    // `readdir` can fail on sandboxed filesystems (EACCES) or broken
    // mount points (EIO). Treat any failure as "empty directory" so
    // the scan continues on the next queued entry.
    const entries = await readdir(item.directory, { withFileTypes: true }).catch(() => []);

    const children = await Promise.all(
      entries
        .filter((e) => !e.name.startsWith('.') && !IGNORED_DIRS.has(e.name))
        .map((e) => classify(item.directory, e.name, e.isFile(), e.isDirectory(), e.isSymbolicLink()))
    );

    // Short-circuit: a `SKILL.md` file *is* the skill marker; descending
    // further would double-count sub-skills that should be scanned
    // separately via their own `SKILL.md`.
    const skillMarker = children.find((c) => c.type === 'file' && c.name === 'SKILL.md');
    if (skillMarker) {
      files.push(skillMarker.path);
      continue;
    }

    // At depth 0 only, also collect flat `*.md` files for the legacy
    // layout (one skill per markdown file in the root directory).
    if (item.depth === 0) {
      for (const c of children) {
        if (c.type === 'file' && c.name.endsWith('.md')) {
          files.push(c.path);
        }
      }
    }

    // Enqueue sub-directories up to MAX_DEPTH. Equality allows the
    // final level's children to be inspected without descending into
    // their contents (MAX_DEPTH acts as an inclusive depth cap on
    // directories visited, not on files returned).
    if (item.depth < MAX_DEPTH) {
      for (const c of children) {
        if (c.type === 'directory') {
          queue.push({ directory: c.path, depth: item.depth + 1 });
        }
      }
    }
  }

  return files.sort();
}

/**
 * PTY / child-process termination helpers.
 *
 * Ports two upstream fixes:
 *  - kilocode `aadded4a3` — tolerate vanished process entries. On Linux,
 *    reading `/proc/<pid>/stat` may race with the process itself exiting
 *    between `readdir("/proc")` and `readFile(...)`. Any missing entry is
 *    treated as "gone" rather than crashing the whole walk.
 *  - Prefer `/proc`-based process tree walking on Linux over spawning
 *    `ps`. This is faster, has no dependency on the busybox/procps ps
 *    binary being installed (a real problem in slim SAP AI Core runtime
 *    containers), and cannot be broken by exotic locale settings that
 *    change the `ps` output format.
 *
 * The `ps` code path is preserved as a fallback for non-Linux platforms
 * and for the (unlikely) case that `/proc` is not mounted / not
 * readable, so behaviour on macOS and inside restricted containers is
 * unchanged.
 */

import { spawn } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';

import { logger } from '../../utils/logger.js';

export interface ProcessRow {
  pid: number;
  parent: number;
}

/**
 * Build the flat process tree (pid -> parent pid) the caller uses to
 * walk descendants of a spawned PTY leader before signalling them.
 *
 * On Linux this prefers `/proc/<pid>/stat` (see module comment). On
 * every other platform (or when the `/proc` walk yields nothing) it
 * falls back to `ps -axo pid=,ppid=`.
 */
export async function tree(
  file: string = 'ps',
  args: string[] = ['-axo', 'pid=,ppid=']
): Promise<ProcessRow[]> {
  if (process.platform === 'linux') {
    try {
      const rows = await procTree();
      if (rows.length > 0) {
        return rows;
      }
    } catch (err) {
      logger.debug('failed to read Linux process tree', err);
    }
  }

  return await new Promise<ProcessRow[]>((resolve, reject) => {
    const child = spawn(file, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });
    child.on('error', (err) => {
      reject(err);
    });
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`ps exited with code ${code}: ${stderr.trim()}`));
        return;
      }
      const rows: ProcessRow[] = [];
      for (const line of stdout.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.length === 0) {
          continue;
        }
        const parts = trimmed.split(/\s+/);
        if (parts.length < 2) {
          continue;
        }
        const pid = Number(parts[0]);
        const parent = Number(parts[1]);
        if (Number.isFinite(pid) && Number.isFinite(parent)) {
          rows.push({ pid, parent });
        }
      }
      resolve(rows);
    });
  });
}

/**
 * Walk `/proc` and return one `{ pid, parent }` row per running process.
 * Entries that vanish between `readdir` and `readFile` are silently
 * dropped (this is the `aadded4a3` fix) — that is the expected outcome
 * of racing with a process exit and NOT an error condition.
 */
async function procTree(): Promise<ProcessRow[]> {
  const entries = await readdir('/proc', { withFileTypes: true });
  const rows = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
      .map(async (entry): Promise<ProcessRow | undefined> => {
        // Tolerate vanished entries between readdir and readFile.
        const stat = await readFile(`/proc/${entry.name}/stat`, 'utf8').catch(() => undefined);
        if (!stat) {
          return undefined;
        }
        // `/proc/<pid>/stat` format: `<pid> (<comm>) <state> <ppid> ...`
        // The comm field may contain arbitrary text including spaces
        // and parentheses; only the final `)` closes it. Skip past the
        // last `)` so the state + ppid parse is unambiguous.
        const match = stat.match(/^\d+ \(.*\) [A-Z] (\d+)/);
        if (!match) {
          return undefined;
        }
        return { pid: Number(entry.name), parent: Number(match[1]) };
      })
  );
  return rows.filter((row): row is ProcessRow => row !== undefined);
}

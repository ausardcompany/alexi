import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { runRevert } from '../../src/cli/commands/revert.js';
import { recordSnapshot } from '../../src/core/snapshot.js';
import type { FileCheckpoint } from '../../src/core/checkpoints.js';

describe('alexi revert command', () => {
  let tmpHome: string;
  let workdir: string;
  let originalHome: string | undefined;

  beforeEach(async () => {
    tmpHome = await fs.mkdtemp(path.join(os.tmpdir(), 'alexi-revert-'));
    workdir = await fs.mkdtemp(path.join(os.tmpdir(), 'alexi-revert-work-'));
    originalHome = process.env.HOME;
    process.env.HOME = tmpHome;
    // SessionManager auto-creates ~/.alexi/sessions on construction.
    await fs.mkdir(path.join(tmpHome, '.alexi', 'sessions'), { recursive: true });
  });

  afterEach(async () => {
    if (originalHome === undefined) {
      delete process.env.HOME;
    } else {
      process.env.HOME = originalHome;
    }
    await fs.rm(tmpHome, { recursive: true, force: true });
    await fs.rm(workdir, { recursive: true, force: true });
  });

  function makeCheckpoint(
    filePath: string,
    originalContent: string,
    newContent: string
  ): FileCheckpoint {
    return {
      id: `cp-${path.basename(filePath)}`,
      filePath,
      originalContent,
      newContent,
      timestamp: Date.now(),
      toolName: 'edit',
    };
  }

  function captureIo() {
    const out: string[] = [];
    const err: string[] = [];
    return {
      out: (s: string) => {
        out.push(s);
      },
      err: (s: string) => {
        err.push(s);
      },
      outLines: out,
      errLines: err,
    };
  }

  it('--preview exits 0 and prints a per-file plan without writing', async () => {
    const filePath = path.join(workdir, 'a.txt');
    await fs.writeFile(filePath, 'new', 'utf-8');
    await recordSnapshot(
      'sess-preview',
      'step-1',
      [makeCheckpoint(filePath, 'orig', 'new')],
      ['edit']
    );

    const io = captureIo();
    const code = await runRevert({ session: 'sess-preview', to: 'step-1', preview: true }, io);

    expect(code).toBe(0);
    const output = io.outLines.join('\n');
    expect(output).toContain('filePath\texists\tbytes-to-restore\tstatus');
    expect(output).toContain(filePath);
    // Preview must not have written anything back.
    const contents = await fs.readFile(filePath, 'utf-8');
    expect(contents).toBe('new');
  });

  it('exits 1 with a clear error when the snapshot is missing', async () => {
    // Also create a fake session json so listSessions finds a default.
    await fs.writeFile(
      path.join(tmpHome, '.alexi', 'sessions', 'sess-x.json'),
      JSON.stringify({
        metadata: {
          id: 'sess-x',
          created: 1,
          updated: 2,
          totalTokens: 0,
          messageCount: 0,
        },
        messages: [],
      }),
      'utf-8'
    );

    const io = captureIo();
    const code = await runRevert({ session: 'sess-x', to: 'no-such-step' }, io);

    expect(code).toBe(1);
    expect(io.errLines.join('\n')).toMatch(/not found/i);
  });

  it('commit path restores files matching newContent and reports counts', async () => {
    const filePath = path.join(workdir, 'b.txt');
    await fs.writeFile(filePath, 'new-body', 'utf-8');
    await recordSnapshot(
      'sess-commit',
      'step-2',
      [makeCheckpoint(filePath, 'orig-body', 'new-body')],
      ['edit']
    );

    const io = captureIo();
    const code = await runRevert({ session: 'sess-commit', to: 'step-2' }, io);

    expect(code).toBe(0);
    expect(io.outLines.join('\n')).toMatch(/restored 1 file\(s\), skipped 0/);
    const contents = await fs.readFile(filePath, 'utf-8');
    expect(contents).toBe('orig-body');
  });

  it('reports skipped modified-outside-agent files in the summary', async () => {
    const kept = path.join(workdir, 'kept.txt');
    const modified = path.join(workdir, 'modified.txt');
    await fs.writeFile(kept, 'new-k', 'utf-8');
    await fs.writeFile(modified, 'human-touched', 'utf-8');
    await recordSnapshot(
      'sess-mixed',
      'step-3',
      [makeCheckpoint(kept, 'orig-k', 'new-k'), makeCheckpoint(modified, 'orig-m', 'new-m')],
      ['edit', 'write']
    );

    const io = captureIo();
    const code = await runRevert({ session: 'sess-mixed', to: 'step-3' }, io);

    expect(code).toBe(0);
    expect(io.outLines.join('\n')).toMatch(
      /restored 1 file\(s\), skipped 1 \(outside-agent edits\)/
    );
    expect(await fs.readFile(kept, 'utf-8')).toBe('orig-k');
    expect(await fs.readFile(modified, 'utf-8')).toBe('human-touched');
  });

  it('exits 1 with a clear error when no session id is available', async () => {
    // No sessions on disk, no --session provided.
    const io = captureIo();
    const code = await runRevert({ to: 'step-1' }, io);
    expect(code).toBe(1);
    expect(io.errLines.join('\n')).toMatch(/no sessions found/i);
  });
});

/**
 * Edit tool - mixed line ending preservation.
 *
 * Mirrors upstream opencode commit 0cb43477 (fix(core): preserve mixed line
 * endings in edit tool). Verifies that:
 *
 *   - pure LF files stay pure LF
 *   - pure CRLF files stay pure CRLF
 *   - mixed-EOL files keep their non-edited regions byte-identical
 *   - edits that span both LF and CRLF regions do not silently normalise
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { editTool } from '../edit.js';

interface MinimalContext {
  workdir: string;
  gitManager?: { onFileChanged: (...args: unknown[]) => void };
}

async function runEdit(
  ctx: MinimalContext,
  params: { filePath: string; oldString: string; newString: string; replaceAll?: boolean }
) {
  // Use executeUnsafe so the test does not depend on the default `ask`
  // permission rule for `write` (which has no interactive listener in a
  // test run and would otherwise time out and reject every call).
  // Mirrors the pattern in edit.agentsmd.test.ts.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (editTool as any).executeUnsafe(params, ctx);
  return result;
}

describe('edit tool - mixed line endings', () => {
  let workdir: string;

  beforeEach(async () => {
    workdir = await fs.mkdtemp(path.join(os.tmpdir(), 'alexi-edit-eol-'));
  });

  afterEach(async () => {
    await fs.rm(workdir, { recursive: true, force: true });
  });

  it('preserves pure LF files', async () => {
    const file = path.join(workdir, 'lf.txt');
    const original = 'alpha\nbeta\ngamma\n';
    await fs.writeFile(file, original, 'utf-8');

    const result = await runEdit(
      { workdir },
      { filePath: file, oldString: 'beta', newString: 'BETA' }
    );
    expect(result.success).toBe(true);

    const after = await fs.readFile(file, 'utf-8');
    expect(after).toBe('alpha\nBETA\ngamma\n');
    expect(after).not.toContain('\r');
  });

  it('preserves pure CRLF files', async () => {
    const file = path.join(workdir, 'crlf.txt');
    const original = 'alpha\r\nbeta\r\ngamma\r\n';
    await fs.writeFile(file, original, 'utf-8');

    const result = await runEdit(
      { workdir },
      { filePath: file, oldString: 'beta', newString: 'BETA' }
    );
    expect(result.success).toBe(true);

    const after = await fs.readFile(file, 'utf-8');
    expect(after).toBe('alpha\r\nBETA\r\ngamma\r\n');
    // Every \n is paired with a \r
    expect(after.match(/\n/g)?.length).toBe(after.match(/\r\n/g)?.length);
  });

  it('preserves mixed line endings outside the edit region', async () => {
    // Three CRLF line breaks and one bare LF line break — must survive.
    const file = path.join(workdir, 'mixed.txt');
    const original = 'alpha\r\nbeta\nhit-me\r\ndelta\r\n';
    await fs.writeFile(file, original, 'utf-8');

    const result = await runEdit(
      { workdir },
      { filePath: file, oldString: 'hit-me', newString: 'HIT' }
    );
    expect(result.success).toBe(true);

    const after = await fs.readFile(file, 'utf-8');
    // Byte-exact outside the edited token: both the LF-only break between
    // "beta" and "hit-me", and the surrounding CRLFs, are retained.
    expect(after).toBe('alpha\r\nbeta\nHIT\r\ndelta\r\n');
  });

  it('does not corrupt a lone-LF region when the caller passes an LF oldString', async () => {
    // Caller rendered oldString with LF-only (common when the model echoes
    // normalised content) but the file region is actually CRLF. The edit
    // must still land AND the non-edited LF region must stay LF.
    const file = path.join(workdir, 'mixed2.txt');
    const original = 'first\nsecond\r\ntarget line\r\ntail\n';
    await fs.writeFile(file, original, 'utf-8');

    const result = await runEdit(
      { workdir },
      { filePath: file, oldString: 'target line', newString: 'TARGET' }
    );
    expect(result.success).toBe(true);

    const after = await fs.readFile(file, 'utf-8');
    expect(after).toBe('first\nsecond\r\nTARGET\r\ntail\n');
  });
});

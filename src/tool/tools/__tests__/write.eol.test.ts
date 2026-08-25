import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import type { ToolContext } from '../../index.js';

describe('write tool - platform-native line endings', () => {
  let workdir: string;

  beforeEach(() => {
    workdir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'write-eol-')));
  });

  afterEach(() => {
    try {
      fs.rmSync(workdir, { recursive: true, force: true });
    } catch {
      // best-effort
    }
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it('creates new files using the platform EOL (LF on Linux CI)', async () => {
    // On the CI runner (Linux) os.EOL === '\n', so a new file with '\n'
    // content should be written verbatim.
    const { writeTool } = await import('../write.js');
    const target = path.join(workdir, 'new-lf.txt');
    const context: ToolContext = { workdir };

    const result = await writeTool.executeUnsafe(
      { filePath: target, content: 'line1\nline2\n' },
      context
    );
    expect(result.success).toBe(true);

    const written = fs.readFileSync(target, 'utf-8');
    if (os.EOL === '\r\n') {
      expect(written).toBe('line1\r\nline2\r\n');
    } else {
      expect(written).toBe('line1\nline2\n');
    }
  });

  it('collapses stray CRLF in LF-content when writing a new file on a LF platform', async () => {
    if (os.EOL !== '\n') {
      // Only meaningful on LF hosts.
      return;
    }
    const { writeTool } = await import('../write.js');
    const target = path.join(workdir, 'mixed.txt');
    const context: ToolContext = { workdir };

    const result = await writeTool.executeUnsafe(
      { filePath: target, content: 'a\r\nb\r\nc\n' },
      context
    );
    expect(result.success).toBe(true);
    expect(fs.readFileSync(target, 'utf-8')).toBe('a\nb\nc\n');
  });

  it('preserves CRLF when overwriting an existing CRLF file', async () => {
    const { writeTool } = await import('../write.js');
    const target = path.join(workdir, 'crlf.txt');
    fs.writeFileSync(target, 'old\r\ncontent\r\n');

    const context: ToolContext = { workdir };
    const result = await writeTool.executeUnsafe(
      { filePath: target, content: 'new\nvalue\n' },
      context
    );
    expect(result.success).toBe(true);

    const written = fs.readFileSync(target, 'utf-8');
    expect(written).toBe('new\r\nvalue\r\n');
  });

  it('preserves LF when overwriting an existing LF file', async () => {
    const { writeTool } = await import('../write.js');
    const target = path.join(workdir, 'lf.txt');
    fs.writeFileSync(target, 'old\ncontent\n');

    const context: ToolContext = { workdir };
    const result = await writeTool.executeUnsafe(
      { filePath: target, content: 'new\r\nvalue\r\n' },
      context
    );
    expect(result.success).toBe(true);

    const written = fs.readFileSync(target, 'utf-8');
    expect(written).toBe('new\nvalue\n');
  });

  it('preserves LF when overwriting an existing file with no line endings', async () => {
    const { writeTool } = await import('../write.js');
    const target = path.join(workdir, 'noeol.txt');
    fs.writeFileSync(target, 'no-eol-here');

    const context: ToolContext = { workdir };
    const result = await writeTool.executeUnsafe(
      { filePath: target, content: 'new\nvalue\n' },
      context
    );
    expect(result.success).toBe(true);
    expect(fs.readFileSync(target, 'utf-8')).toBe('new\nvalue\n');
  });
});

describe('write tool - simulated Windows platform (CRLF)', () => {
  let workdir: string;

  beforeEach(() => {
    workdir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'write-eol-win-')));
    vi.resetModules();
  });

  afterEach(() => {
    try {
      fs.rmSync(workdir, { recursive: true, force: true });
    } catch {
      // best-effort
    }
    vi.doUnmock('../../eol-normalizer.js');
    vi.resetModules();
  });

  it('creates new files with CRLF when the platform reports CRLF', async () => {
    // Mock the EOL normalizer's platform detection to simulate Windows.
    vi.doMock('../../eol-normalizer.js', async () => {
      const actual =
        await vi.importActual<typeof import('../../eol-normalizer.js')>('../../eol-normalizer.js');
      return {
        ...actual,
        getPlatformEol: () => '\r\n' as const,
        normalizeNewFileLineEndings: (content: string) =>
          content.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n'),
      };
    });

    // Re-import write tool so it picks up the mocked normalizer.
    const { writeTool } = await import('../write.js');
    const target = path.join(workdir, 'new-crlf.txt');
    const context: ToolContext = { workdir };

    const result = await writeTool.executeUnsafe(
      { filePath: target, content: 'alpha\nbeta\ngamma\n' },
      context
    );
    expect(result.success).toBe(true);

    const written = fs.readFileSync(target, 'utf-8');
    expect(written).toBe('alpha\r\nbeta\r\ngamma\r\n');
    // Bytes written should reflect CRLF (3 extra bytes for 3 line endings).
    expect(result.data?.bytesWritten).toBe(Buffer.byteLength(written, 'utf-8'));
  });
});

import {
  formatBashCommand,
  formatDuration,
  formatParamsPreview,
  guessLanguageFromPath,
  truncateOutput,
} from '../../../src/cli/tui/utils/formatToolOutput.js';
import { describe, it, expect } from 'vitest';

describe('formatBashCommand', () => {
  it('prefixes command with $ ', () => {
    expect(formatBashCommand('npm test')).toBe('$ npm test');
  });

  it('trims trailing whitespace', () => {
    expect(formatBashCommand('ls -la   ')).toBe('$ ls -la');
  });

  it('handles empty command', () => {
    expect(formatBashCommand('')).toBe('$ ');
  });
});

describe('truncateOutput', () => {
  it('returns the input untouched when within maxLines', () => {
    const text = 'a\nb\nc';
    const result = truncateOutput(text, 20, 15);
    expect(result.truncated).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.text).toBe(text);
  });

  it('truncates output beyond maxLines to keepLines', () => {
    const lines = Array.from({ length: 25 }, (_, i) => `line ${i + 1}`).join('\n');
    const result = truncateOutput(lines, 20, 15);
    expect(result.truncated).toBe(true);
    expect(result.remaining).toBe(10);
    expect(result.text.split('\n')).toHaveLength(15);
    expect(result.text).toContain('line 1');
    expect(result.text).toContain('line 15');
    expect(result.text).not.toContain('line 16');
  });

  it('uses defaults when no bounds are passed', () => {
    const lines = Array.from({ length: 30 }, (_, i) => `l${i}`).join('\n');
    const result = truncateOutput(lines);
    expect(result.truncated).toBe(true);
  });
});

describe('formatParamsPreview', () => {
  it('returns empty string for empty params', () => {
    expect(formatParamsPreview({})).toBe('');
  });

  it('prefers filePath over other keys', () => {
    const preview = formatParamsPreview({ filePath: '/tmp/x.ts', foo: 'bar' });
    expect(preview).toBe('filePath: /tmp/x.ts');
  });

  it('prefers command for bash-like tools', () => {
    const preview = formatParamsPreview({ command: 'ls -la' });
    expect(preview).toBe('command: ls -la');
  });

  it('falls back to the first param when no known key is present', () => {
    const preview = formatParamsPreview({ custom: 'value' });
    expect(preview).toBe('custom: value');
  });

  it('truncates long values with an ellipsis', () => {
    const longVal = 'a'.repeat(80);
    const preview = formatParamsPreview({ filePath: longVal }, 20);
    expect(preview).toContain('\u2026');
    expect(preview.length).toBeLessThan(40);
  });
});

describe('formatDuration', () => {
  it('formats sub-second durations in ms', () => {
    expect(formatDuration(250)).toBe('250ms');
  });

  it('formats second-scale durations with one decimal', () => {
    expect(formatDuration(1500)).toBe('1.5s');
  });

  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0ms');
  });
});

describe('guessLanguageFromPath', () => {
  it('maps common extensions to languages', () => {
    expect(guessLanguageFromPath('/src/foo.ts')).toBe('typescript');
    expect(guessLanguageFromPath('foo.tsx')).toBe('typescript');
    expect(guessLanguageFromPath('foo.js')).toBe('javascript');
    expect(guessLanguageFromPath('foo.json')).toBe('json');
    expect(guessLanguageFromPath('foo.md')).toBe('markdown');
    expect(guessLanguageFromPath('script.sh')).toBe('bash');
    expect(guessLanguageFromPath('a.py')).toBe('python');
  });

  it('returns undefined for unknown extensions', () => {
    expect(guessLanguageFromPath('foo.xyz')).toBeUndefined();
  });

  it('returns undefined for paths without an extension', () => {
    expect(guessLanguageFromPath('Makefile')).toBeUndefined();
  });

  it('is case-insensitive', () => {
    expect(guessLanguageFromPath('FOO.TS')).toBe('typescript');
  });
});

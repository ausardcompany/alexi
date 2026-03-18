import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import os from 'os';

import {
  fuzzyMatch,
  SLASH_COMMANDS,
  completeSlashCommand,
  completeModelName,
  completeFilePath,
  completeLine,
  readlineCompleter,
} from '../../../src/cli/utils/completer.js';
import { ORCHESTRATION_MODELS } from '../../../src/providers/sapOrchestration.js';

// ---------------------------------------------------------------------------
// 1. fuzzyMatch
// ---------------------------------------------------------------------------

describe('fuzzyMatch', () => {
  it('should match everything with score 0 when query is empty', () => {
    const result = fuzzyMatch('', 'model');
    expect(result.match).toBe(true);
    expect(result.score).toBe(0);
  });

  it('should match empty target with empty query', () => {
    const result = fuzzyMatch('', '');
    expect(result.match).toBe(true);
    expect(result.score).toBe(0);
  });

  it('should score an exact match with maximum prefix score (150)', () => {
    const result = fuzzyMatch('model', 'model');
    expect(result.match).toBe(true);
    // query.length / target.length * 100 + 50 = 5/5 * 100 + 50 = 150
    expect(result.score).toBe(150);
  });

  it('should score a prefix match with prefix bonus', () => {
    const result = fuzzyMatch('mod', 'model');
    expect(result.match).toBe(true);
    // 3/5 * 100 + 50 = 110
    expect(result.score).toBe(110);
  });

  it('should score a single-char prefix match with prefix bonus', () => {
    const result = fuzzyMatch('h', 'help');
    expect(result.match).toBe(true);
    // 1/4 * 100 + 50 = 75
    expect(result.score).toBe(75);
  });

  it('should match a subsequence in order (mdl → model)', () => {
    const result = fuzzyMatch('mdl', 'model');
    expect(result.match).toBe(true);
    // 'm' matches at 0, consecutive=1
    // 'o' skipped, consecutive resets to 0
    // 'd' matches at 2, consecutive=1
    // 'e' skipped, consecutive resets to 0
    // 'l' matches at 4, consecutive=1
    // maxConsecutive = 1 → score = 10
    expect(result.score).toBe(10);
  });

  it('should reward consecutive subsequence characters', () => {
    const result = fuzzyMatch('mo', 'model');
    // 'mo' is a prefix of 'model', so prefix scoring applies
    // 2/5 * 100 + 50 = 90
    expect(result.match).toBe(true);
    expect(result.score).toBe(90);
  });

  it('should not match when characters are not a subsequence', () => {
    const result = fuzzyMatch('xyz', 'model');
    expect(result.match).toBe(false);
    expect(result.score).toBe(0);
  });

  it('should be case insensitive', () => {
    const result = fuzzyMatch('MOD', 'model');
    expect(result.match).toBe(true);
    // Same as 'mod' vs 'model' → prefix → 3/5 * 100 + 50 = 110
    expect(result.score).toBe(110);
  });

  it('should be case insensitive on target too', () => {
    const result = fuzzyMatch('mod', 'MODEL');
    expect(result.match).toBe(true);
    expect(result.score).toBe(110);
  });

  it('should not match when query is longer and not a prefix', () => {
    const result = fuzzyMatch('models-x', 'model');
    expect(result.match).toBe(false);
    expect(result.score).toBe(0);
  });

  it('should not match a single non-present character', () => {
    const result = fuzzyMatch('z', 'help');
    expect(result.match).toBe(false);
    expect(result.score).toBe(0);
  });

  it('should handle subsequence with consecutive run in the middle', () => {
    // 'ear' in 'clear-history': e at 2, a at 3, r at 4 → consecutive=3 → score=30
    const result = fuzzyMatch('ear', 'clear-history');
    expect(result.match).toBe(true);
    expect(result.score).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 2. SLASH_COMMANDS registry
// ---------------------------------------------------------------------------

describe('SLASH_COMMANDS', () => {
  it('should contain the help command', () => {
    const help = SLASH_COMMANDS.find((c) => c.name === 'help');
    expect(help).toBeDefined();
    expect(help!.description).toBeTruthy();
  });

  it('should contain the model command with completesModel flag', () => {
    const model = SLASH_COMMANDS.find((c) => c.name === 'model');
    expect(model).toBeDefined();
    expect(model!.completesModel).toBe(true);
  });

  it('should contain the export command with completesPath flag', () => {
    const exp = SLASH_COMMANDS.find((c) => c.name === 'export');
    expect(exp).toBeDefined();
    expect(exp!.completesPath).toBe(true);
  });

  it('should have alias "h" for help', () => {
    const help = SLASH_COMMANDS.find((c) => c.name === 'help');
    expect(help!.aliases).toContain('h');
  });

  it('should have aliases "quit" and "q" for exit', () => {
    const exit = SLASH_COMMANDS.find((c) => c.name === 'exit');
    expect(exit!.aliases).toContain('quit');
    expect(exit!.aliases).toContain('q');
  });

  it('should give every command a name, description, and category', () => {
    for (const cmd of SLASH_COMMANDS) {
      expect(cmd.name).toBeTruthy();
      expect(cmd.description).toBeTruthy();
      expect(cmd.category).toBeTruthy();
    }
  });

  it('should contain git-related commands', () => {
    const git = SLASH_COMMANDS.find((c) => c.name === 'git');
    const gitLog = SLASH_COMMANDS.find((c) => c.name === 'git-log');
    const gitConfig = SLASH_COMMANDS.find((c) => c.name === 'git-config');
    expect(git).toBeDefined();
    expect(gitLog).toBeDefined();
    expect(gitConfig).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// 3. completeSlashCommand
// ---------------------------------------------------------------------------

describe('completeSlashCommand', () => {
  it('should return all commands when partial is empty', () => {
    const result = completeSlashCommand('');
    // Every command name + every alias gets an entry (empty query matches all)
    expect(result.items.length).toBeGreaterThan(SLASH_COMMANDS.length);
  });

  it('should return /model and /models for "mod"', () => {
    const result = completeSlashCommand('mod');
    const texts = result.items.map((i) => i.text);
    expect(texts).toContain('/model');
    expect(texts).toContain('/models');
  });

  it('should rank /model higher than /models for "mod" (longer prefix ratio)', () => {
    const result = completeSlashCommand('mod');
    const modelItem = result.items.find((i) => i.text === '/model');
    const modelsItem = result.items.find((i) => i.text === '/models');
    expect(modelItem).toBeDefined();
    expect(modelsItem).toBeDefined();
    expect(modelItem!.score).toBeGreaterThan(modelsItem!.score);
  });

  it('should return /help and /history for "h"', () => {
    const result = completeSlashCommand('h');
    const texts = result.items.map((i) => i.text);
    expect(texts).toContain('/help');
    expect(texts).toContain('/history');
  });

  it('should match /exit via aliases "quit" and "q"', () => {
    const qResult = completeSlashCommand('q');
    const texts = qResult.items.map((i) => i.text);
    expect(texts).toContain('/q');
    expect(texts).toContain('/quit');
  });

  it('should return no completions for "xyz"', () => {
    const result = completeSlashCommand('xyz');
    expect(result.items).toHaveLength(0);
  });

  it('should return /git, /git-log, and /git-config for "git"', () => {
    const result = completeSlashCommand('git');
    const texts = result.items.map((i) => i.text);
    expect(texts).toContain('/git');
    expect(texts).toContain('/git-log');
    expect(texts).toContain('/git-config');
  });

  it('should mark all results with kind "command"', () => {
    const result = completeSlashCommand('mod');
    for (const item of result.items) {
      expect(item.kind).toBe('command');
    }
  });

  it('should sort results by score descending', () => {
    const result = completeSlashCommand('mo');
    for (let i = 1; i < result.items.length; i++) {
      expect(result.items[i - 1].score).toBeGreaterThanOrEqual(result.items[i].score);
    }
  });

  it('should set replacementLength to partial length + 1 (for the /)', () => {
    const result = completeSlashCommand('mod');
    expect(result.replacementStart).toBe(0);
    expect(result.replacementLength).toBe(4); // 'mod'.length + 1
  });
});

// ---------------------------------------------------------------------------
// 4. completeModelName
// ---------------------------------------------------------------------------

describe('completeModelName', () => {
  it('should return all ORCHESTRATION_MODELS when partial is empty', () => {
    const result = completeModelName('');
    expect(result.items).toHaveLength(ORCHESTRATION_MODELS.length);
  });

  it('should return gpt models for "gpt"', () => {
    const result = completeModelName('gpt');
    const texts = result.items.map((i) => i.text);
    expect(texts).toContain('gpt-4o');
    expect(texts).toContain('gpt-4.1');
    expect(texts).toContain('gpt-5');
    expect(texts).toContain('gpt-5-mini');
    // No non-gpt models
    for (const item of result.items) {
      expect(item.text.toLowerCase()).toContain('gpt');
    }
  });

  it('should match anthropic claude models for "claude"', () => {
    const result = completeModelName('claude');
    const texts = result.items.map((i) => i.text);
    // 'claude' is a subsequence of 'anthropic--claude-...'
    expect(texts.some((t) => t.includes('claude'))).toBe(true);
  });

  it('should return no completions for "xyz"', () => {
    const result = completeModelName('xyz');
    expect(result.items).toHaveLength(0);
  });

  it('should mark all results with kind "model"', () => {
    const result = completeModelName('gpt');
    for (const item of result.items) {
      expect(item.kind).toBe('model');
    }
  });

  it('should set replacementStart to the length of "/model "', () => {
    const result = completeModelName('gpt');
    expect(result.replacementStart).toBe('/model '.length);
  });
});

// ---------------------------------------------------------------------------
// 5. completeFilePath
// ---------------------------------------------------------------------------

describe('completeFilePath', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'completer-test-'));
    // Create a known directory structure:
    //   tempDir/
    //     alpha.txt
    //     beta.ts
    //     .hidden
    //     subdir/
    //       gamma.js
    fs.writeFileSync(path.join(tempDir, 'alpha.txt'), 'a');
    fs.writeFileSync(path.join(tempDir, 'beta.ts'), 'b');
    fs.writeFileSync(path.join(tempDir, '.hidden'), 'h');
    fs.mkdirSync(path.join(tempDir, 'subdir'));
    fs.writeFileSync(path.join(tempDir, 'subdir', 'gamma.js'), 'g');
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should return all non-hidden entries when partial is "./"', () => {
    // completeFilePath with './' resolves to cwd itself, listing its contents
    const result = completeFilePath('./', tempDir);
    const displays = result.items.map((i) => i.display);
    expect(displays).toContain('alpha.txt');
    expect(displays).toContain('beta.ts');
    expect(displays).toContain('subdir/');
    // Hidden file excluded by default
    expect(displays).not.toContain('.hidden');
  });

  it('should suffix directories with "/"', () => {
    const result = completeFilePath('./', tempDir);
    const subdirItem = result.items.find((i) => i.display === 'subdir/');
    expect(subdirItem).toBeDefined();
    expect(subdirItem!.text).toContain('subdir/');
  });

  it('should return empty for non-existent directory', () => {
    const result = completeFilePath('nonexistent/', tempDir);
    expect(result.items).toHaveLength(0);
  });

  it('should exclude hidden files unless partial starts with "."', () => {
    // './' lists dir contents but excludes dotfiles since prefix is ''
    const withoutDot = completeFilePath('./', tempDir);
    const displaysWithout = withoutDot.items.map((i) => i.display);
    expect(displaysWithout).not.toContain('.hidden');

    // '.h' uses '.' dir with prefix 'h' — but we actually want '.' prefix
    // To see hidden files, use './' + '.' as prefix → './.h' doesn't work.
    // The way completeFilePath works: partial='.hi' resolves to cwd/.hi,
    // dir=cwd, prefix='.hi', so startsWith('.') → shows hidden files.
    const withDot = completeFilePath('.hi', tempDir);
    const displaysWith = withDot.items.map((i) => i.display);
    expect(displaysWith).toContain('.hidden');
  });

  it('should filter entries by prefix', () => {
    const result = completeFilePath('al', tempDir);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].display).toBe('alpha.txt');
  });

  it('should mark all results with kind "path"', () => {
    const result = completeFilePath('./', tempDir);
    for (const item of result.items) {
      expect(item.kind).toBe('path');
    }
  });

  it('should complete files inside a subdirectory when partial ends with "/"', () => {
    const result = completeFilePath('subdir/', tempDir);
    const displays = result.items.map((i) => i.display);
    expect(displays).toContain('gamma.js');
  });
});

// ---------------------------------------------------------------------------
// 6. completeLine
// ---------------------------------------------------------------------------

describe('completeLine', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'completer-line-'));
    fs.writeFileSync(path.join(tempDir, 'readme.md'), '');
    fs.mkdirSync(path.join(tempDir, 'src'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should dispatch "/mod" to slash command completion', () => {
    const result = completeLine('/mod', tempDir);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].kind).toBe('command');
    const texts = result.items.map((i) => i.text);
    expect(texts).toContain('/model');
  });

  it('should dispatch "/model gpt" to model completion', () => {
    const result = completeLine('/model gpt', tempDir);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].kind).toBe('model');
    const texts = result.items.map((i) => i.text);
    expect(texts).toContain('gpt-4o');
  });

  it('should dispatch "/export src" to file path completion', () => {
    const result = completeLine('/export src', tempDir);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].kind).toBe('path');
    const displays = result.items.map((i) => i.display);
    expect(displays).toContain('src/');
  });

  it('should dispatch "@src" to file path completion', () => {
    const result = completeLine('@src', tempDir);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].kind).toBe('path');
  });

  it('should dispatch "@" in the middle of text to file path completion', () => {
    const result = completeLine('look at @read', tempDir);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].kind).toBe('path');
    const displays = result.items.map((i) => i.display);
    expect(displays).toContain('readme.md');
  });

  it('should return empty for regular text without / or @', () => {
    const result = completeLine('hello world', tempDir);
    expect(result.items).toHaveLength(0);
  });

  it('should return all commands for "/" alone', () => {
    const result = completeLine('/', tempDir);
    // '/' with no space → completeSlashCommand('') → all commands + aliases
    expect(result.items.length).toBeGreaterThan(SLASH_COMMANDS.length);
    expect(result.items[0].kind).toBe('command');
  });

  it('should return all models for "/model " (with trailing space)', () => {
    const result = completeLine('/model ', tempDir);
    expect(result.items).toHaveLength(ORCHESTRATION_MODELS.length);
    expect(result.items[0].kind).toBe('model');
  });
});

// ---------------------------------------------------------------------------
// 7. readlineCompleter
// ---------------------------------------------------------------------------

describe('readlineCompleter', () => {
  it('should call the callback with completions formatted as [completions[], line]', () => {
    const callback = vi.fn();
    readlineCompleter('/mod', callback);

    expect(callback).toHaveBeenCalledOnce();
    const [err, [completions, line]] = callback.mock.calls[0];
    expect(err).toBeNull();
    expect(line).toBe('/mod');
    expect(Array.isArray(completions)).toBe(true);
    expect(completions.length).toBeGreaterThan(0);
    // Each completion should be a string starting with '/'
    for (const c of completions) {
      expect(typeof c).toBe('string');
      expect(c.startsWith('/')).toBe(true);
    }
  });

  it('should return empty completions when no matches', () => {
    const callback = vi.fn();
    readlineCompleter('xyz-no-match-ever', callback);

    expect(callback).toHaveBeenCalledOnce();
    const [err, [completions, line]] = callback.mock.calls[0];
    expect(err).toBeNull();
    expect(completions).toHaveLength(0);
    expect(line).toBe('xyz-no-match-ever');
  });

  it('should include the full text with prefix in completions', () => {
    const callback = vi.fn();
    readlineCompleter('/model gpt', callback);

    expect(callback).toHaveBeenCalledOnce();
    const [, [completions]] = callback.mock.calls[0];
    expect(completions.length).toBeGreaterThan(0);
    // completions should start with the prefix '/model ' and then the model name
    for (const c of completions) {
      expect(c.startsWith('/model ')).toBe(true);
    }
  });
});

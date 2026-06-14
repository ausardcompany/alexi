/**
 * Tests for the `submitPrompt` schema field, frontmatter parsing, and
 * `renderSubmitPrompt` variable expansion.
 *
 * Issue #779: chained command follow-up.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  CommandSchema,
  CommandRegistry,
  defineCommand,
  loadCommandFromFile,
  renderSubmitPrompt,
} from '../../src/command/index.js';

describe('CommandSchema - submitPrompt field', () => {
  it('accepts a valid submitPrompt string', () => {
    const cmd = CommandSchema.parse({
      name: 'demo',
      template: 'body',
      submitPrompt: 'now run with $1',
    });
    expect(cmd.submitPrompt).toBe('now run with $1');
  });

  it('leaves submitPrompt undefined when omitted', () => {
    const cmd = CommandSchema.parse({ name: 'demo', template: 'body' });
    expect(cmd.submitPrompt).toBeUndefined();
  });

  it('forwards submitPrompt through defineCommand()', () => {
    const cmd = defineCommand({
      name: 'demo',
      template: 'body',
      submitPrompt: 'follow-up',
    });
    expect(cmd.submitPrompt).toBe('follow-up');
  });
});

describe('loadCommandFromFile - submitPrompt frontmatter', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cmd-submit-prompt-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('parses submitPrompt from markdown frontmatter', () => {
    const content = `---
name: chained
description: Has a follow-up prompt
submitPrompt: 'please summarize the diff above'
---

Render the diff:

@$1
`;
    const filePath = path.join(tempDir, 'chained.md');
    fs.writeFileSync(filePath, content);

    const cmd = loadCommandFromFile(filePath);

    expect(cmd).not.toBeNull();
    expect(cmd!.submitPrompt).toBe('please summarize the diff above');
  });

  it('leaves submitPrompt undefined when not declared in frontmatter', () => {
    const content = `---
name: bare
---

Body.
`;
    const filePath = path.join(tempDir, 'bare.md');
    fs.writeFileSync(filePath, content);

    const cmd = loadCommandFromFile(filePath);

    expect(cmd).not.toBeNull();
    expect(cmd!.submitPrompt).toBeUndefined();
  });

  it('ignores non-string submitPrompt values', () => {
    const content = `---
name: invalid
submitPrompt:
  - not
  - a
  - string
---

Body.
`;
    const filePath = path.join(tempDir, 'invalid.md');
    fs.writeFileSync(filePath, content);

    const cmd = loadCommandFromFile(filePath);

    expect(cmd).not.toBeNull();
    expect(cmd!.submitPrompt).toBeUndefined();
  });
});

describe('renderSubmitPrompt - variable expansion', () => {
  it('returns undefined when command has no submitPrompt', () => {
    const cmd = defineCommand({ name: 'x', template: 'body' });
    expect(renderSubmitPrompt(cmd, [])).toBeUndefined();
  });

  it('expands positional $1 / $2', () => {
    const cmd = defineCommand({
      name: 'x',
      template: 'body',
      submitPrompt: 'fix $1 with goal $2',
    });
    expect(renderSubmitPrompt(cmd, ['file.ts', 'cleanup'])).toBe('fix file.ts with goal cleanup');
  });

  it('expands named ${name} arguments', () => {
    const cmd = defineCommand({
      name: 'x',
      template: 'body',
      arguments: [
        { name: 'file', required: true },
        { name: 'goal' },
      ],
      submitPrompt: 'work on ${file} (goal: ${goal})',
    });
    expect(renderSubmitPrompt(cmd, ['main.ts', 'speed'])).toBe('work on main.ts (goal: speed)');
  });

  it('falls back to ${name:default} when arg is missing', () => {
    const cmd = defineCommand({
      name: 'x',
      template: 'body',
      arguments: [{ name: 'file', required: true }, { name: 'goal' }],
      submitPrompt: 'on ${file} doing ${goal:improve quality}',
    });
    expect(renderSubmitPrompt(cmd, ['main.ts'])).toBe('on main.ts doing improve quality');
  });

  it('applies declared argument defaults', () => {
    const cmd = defineCommand({
      name: 'x',
      template: 'body',
      arguments: [
        { name: 'file', required: true },
        { name: 'goal', default: 'cleanup' },
      ],
      submitPrompt: 'fix $1 ($2)',
    });
    expect(renderSubmitPrompt(cmd, ['main.ts'])).toBe('fix main.ts (cleanup)');
  });

  it('expands $ARGUMENTS, $PWD, and $DATE', () => {
    const cmd = defineCommand({
      name: 'x',
      template: 'body',
      submitPrompt: 'args=$ARGUMENTS pwd=$PWD date=$DATE',
    });
    const out = renderSubmitPrompt(cmd, ['a', 'b'], '/tmp/work');
    expect(out).toContain('args=a b');
    expect(out).toContain('pwd=/tmp/work');
    // Date format: YYYY-MM-DD
    expect(out).toMatch(/date=\d{4}-\d{2}-\d{2}/);
  });

  it('does NOT perform shell injection', () => {
    const cmd = defineCommand({
      name: 'x',
      template: 'body',
      submitPrompt: 'output is !`echo unsafe`',
    });
    const out = renderSubmitPrompt(cmd, []);
    // The literal token is preserved — no `unsafe` substitution.
    expect(out).toBe('output is !`echo unsafe`');
  });

  it('does NOT expand @file references', () => {
    const cmd = defineCommand({
      name: 'x',
      template: 'body',
      submitPrompt: 'see @some/path.ts',
    });
    expect(renderSubmitPrompt(cmd, [])).toBe('see @some/path.ts');
  });
});

describe('CommandRegistry.executeWithSubmitPrompt', () => {
  it('returns rendered template and resolved submitPrompt', async () => {
    const registry = new CommandRegistry('/tmp/repo');
    registry.register(
      defineCommand({
        name: 'review',
        arguments: [{ name: 'file', required: true }],
        template: 'review file: $1',
        submitPrompt: 'now apply fixes to $1',
      })
    );

    const result = await registry.executeWithSubmitPrompt('review', ['main.ts']);
    expect(result.rendered).toBe('review file: main.ts');
    expect(result.submitPrompt).toBe('now apply fixes to main.ts');
  });

  it('returns submitPrompt undefined when not declared', async () => {
    const registry = new CommandRegistry('/tmp/repo');
    registry.register(
      defineCommand({
        name: 'plain',
        template: 'plain body',
      })
    );

    const result = await registry.executeWithSubmitPrompt('plain', []);
    expect(result.rendered).toBe('plain body');
    expect(result.submitPrompt).toBeUndefined();
  });
});

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import matter from 'gray-matter';
import { loadSkillFromFile } from '../../src/skill/index.js';
import { loadAgentFromFile } from '../../src/agent/customAgentLoader.js';
import { loadCommandFromFile } from '../../src/command/index.js';

/**
 * Regression coverage for issue #1945: gray-matter's process-wide,
 * content-keyed internal cache can be poisoned by a malformed YAML parse.
 *
 * How gray-matter's cache works (see node_modules/gray-matter/index.js):
 *   - When `matter(content)` is called WITHOUT an options argument, gray-matter
 *     stores `file` under `matter.cache[content]` BEFORE calling `parseMatter`.
 *   - If `parseMatter` throws, the cached entry still exists with
 *     `data: {}` and the original (unparsed) content.
 *   - A subsequent `matter(content)` with the same content returns the cached
 *     empty-data entry WITHOUT re-attempting the parse — the throw is lost.
 *
 * This matters in multi-worktree setups and long-running TUI processes where
 * the same byte-identical SKILL.md / AGENT.md / command.md may be parsed
 * repeatedly (worktree + primary checkout, hot-reload, etc.). Passing any
 * options object (even `{ cache: null }`) skips the cache entirely.
 */

const MALFORMED_FRONTMATTER = `---
name: broken-skill
description: foo: bar
---

Hello body.
`;

const VALID_FRONTMATTER = `---
name: valid-skill
description: A perfectly fine skill
---

Hello body.
`;

describe('skill loader: gray-matter cache poisoning', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-skill-cache-'));
    // Clear gray-matter's global cache between tests so order-dependence
    // in other suites cannot interfere.
    (matter as unknown as { cache: Record<string, unknown> }).cache = {};
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    (matter as unknown as { cache: Record<string, unknown> }).cache = {};
  });

  it('does not silently return a bogus skill after a malformed parse of identical content', () => {
    // File 1: malformed YAML (unquoted inner colon in `description`).
    const file1 = path.join(tempDir, 'first.md');
    fs.writeFileSync(file1, MALFORMED_FRONTMATTER, 'utf-8');
    const skill1 = loadSkillFromFile(file1);
    // Loader catches the parse error and returns null.
    expect(skill1).toBeNull();

    // File 2: byte-identical content, different file path.
    // Without the `{ cache: null }` fix, gray-matter would return a cached
    // entry with `data: {}` and the loader would happily produce a Skill with
    // defaults derived from the filename and an empty description — the
    // malformed YAML would be silently swallowed.
    const file2 = path.join(tempDir, 'second.md');
    fs.writeFileSync(file2, MALFORMED_FRONTMATTER, 'utf-8');
    const skill2 = loadSkillFromFile(file2);
    expect(skill2).toBeNull();
  });

  it('parses a valid file freshly even when the cache was previously poisoned', () => {
    // Simulate cache poisoning: an earlier call left behind an empty-data
    // entry keyed by the valid file's content.
    (matter as unknown as { cache: Record<string, unknown> }).cache[VALID_FRONTMATTER] = {
      data: {},
      content: VALID_FRONTMATTER,
      isEmpty: false,
      excerpt: '',
    };

    const file = path.join(tempDir, 'valid.md');
    fs.writeFileSync(file, VALID_FRONTMATTER, 'utf-8');
    const skill = loadSkillFromFile(file);

    // With the fix, the loader bypasses the cache and reads the real
    // frontmatter. Without the fix, `data.name` would be undefined and the
    // loader would fall back to the filename-based default ('valid').
    expect(skill).not.toBeNull();
    expect(skill?.name).toBe('valid-skill');
    expect(skill?.description).toBe('A perfectly fine skill');
  });
});

describe('agent loader: gray-matter cache poisoning', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-agent-cache-'));
    (matter as unknown as { cache: Record<string, unknown> }).cache = {};
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    (matter as unknown as { cache: Record<string, unknown> }).cache = {};
  });

  it('parses a valid agent file freshly even when the cache was previously poisoned', async () => {
    const content = `---
id: valid-agent
name: Valid Agent
description: An agent used in a cache-poisoning regression test
model: gpt-4
---

You are a valid agent.
`;
    (matter as unknown as { cache: Record<string, unknown> }).cache[content] = {
      data: {},
      content,
      isEmpty: false,
      excerpt: '',
    };

    const file = path.join(tempDir, 'agent.md');
    fs.writeFileSync(file, content, 'utf-8');
    const agent = await loadAgentFromFile(file, 'project-local');

    expect(agent).not.toBeNull();
    expect(agent?.id).toBe('valid-agent');
    expect(agent?.name).toBe('Valid Agent');
  });
});

describe('command loader: gray-matter cache poisoning', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-cmd-cache-'));
    (matter as unknown as { cache: Record<string, unknown> }).cache = {};
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    (matter as unknown as { cache: Record<string, unknown> }).cache = {};
  });

  it('parses a valid command file freshly even when the cache was previously poisoned', () => {
    const content = `---
name: valid-command
description: A valid command used in a cache-poisoning regression test
---

Run the thing.
`;
    (matter as unknown as { cache: Record<string, unknown> }).cache[content] = {
      data: {},
      content,
      isEmpty: false,
      excerpt: '',
    };

    const file = path.join(tempDir, 'cmd.md');
    fs.writeFileSync(file, content, 'utf-8');
    const command = loadCommandFromFile(file);

    expect(command).not.toBeNull();
    expect(command?.name).toBe('valid-command');
    expect(command?.description).toBe('A valid command used in a cache-poisoning regression test');
  });
});

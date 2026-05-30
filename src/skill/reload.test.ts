/**
 * `reloadSkills` registry-refresh tests.
 *
 * Verifies that re-scanning skill directories:
 * - Picks up newly added skills on a second call.
 * - Removes file-sourced skills that have disappeared.
 * - Preserves built-in skills (source !== 'file') across reloads.
 * - Publishes the `skill.reloaded` event with correct counts.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

const globalSkillsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reload-skills-global-'));

vi.mock('../utils/global.js', () => ({
  getGlobalPaths: () => ({
    config: path.dirname(globalSkillsDir),
    skills: globalSkillsDir,
    cache: path.join(path.dirname(globalSkillsDir), 'cache'),
  }),
}));

import {
  reloadSkills,
  getSkillRegistry,
  defineSkill,
  registerSkill,
  SkillReloaded,
  type Skill,
} from './index.js';

const SKILL_BODY = (id: string): string => `---
id: ${id}
name: ${id}
description: ${id} from disk
---

Prompt for ${id}.
`;

describe('reloadSkills', () => {
  let projectRoot: string;
  let tempRoots: string[];

  beforeEach(() => {
    tempRoots = [];
    projectRoot = mkTempDir('reload-skills-project-');
    // Reset the registry to a clean baseline so tests don't interact.
    getSkillRegistry().clear();
  });

  afterEach(() => {
    for (const dir of tempRoots) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    // Empty the controlled global skills dir between tests.
    if (fs.existsSync(globalSkillsDir)) {
      for (const entry of fs.readdirSync(globalSkillsDir)) {
        fs.rmSync(path.join(globalSkillsDir, entry), { recursive: true, force: true });
      }
    }
    getSkillRegistry().clear();
  });

  function mkTempDir(prefix: string): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
    const resolved = fs.realpathSync(dir);
    tempRoots.push(resolved);
    return resolved;
  }

  function writeSkill(dir: string, id: string): string {
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${id}.md`);
    fs.writeFileSync(file, SKILL_BODY(id));
    return file;
  }

  it('discovers new on-disk skills on a subsequent reload', () => {
    const projectSkillsDir = path.join(projectRoot, '.alexi', 'skills');
    writeSkill(projectSkillsDir, 'first-skill');
    writeSkill(globalSkillsDir, 'second-skill');

    const first = reloadSkills(projectRoot);
    expect(first.added).toBe(2);
    expect(first.removed).toBe(0);
    expect(first.total).toBe(2);

    // Verify registry contents.
    const ids1 = getSkillRegistry()
      .list()
      .map((s) => s.id)
      .sort();
    expect(ids1).toEqual(['first-skill', 'second-skill']);

    // Add a third on-disk skill and reload again.
    writeSkill(projectSkillsDir, 'third-skill');

    const second = reloadSkills(projectRoot);
    expect(second.added).toBe(1);
    expect(second.removed).toBe(0);
    expect(second.total).toBe(3);

    const ids2 = getSkillRegistry()
      .list()
      .map((s) => s.id)
      .sort();
    expect(ids2).toContain('third-skill');
    expect(ids2).toHaveLength(3);
  });

  it('removes file-sourced skills that have disappeared', () => {
    const projectSkillsDir = path.join(projectRoot, '.alexi', 'skills');
    const file = writeSkill(projectSkillsDir, 'doomed-skill');

    const first = reloadSkills(projectRoot);
    expect(first.added).toBe(1);
    expect(getSkillRegistry().has('doomed-skill')).toBe(true);

    // Delete the file and reload.
    fs.unlinkSync(file);

    const second = reloadSkills(projectRoot);
    expect(second.removed).toBe(1);
    expect(second.added).toBe(0);
    expect(getSkillRegistry().has('doomed-skill')).toBe(false);
  });

  it('preserves built-in skills across reloads', () => {
    // Register a built-in (non-file) skill before any reload.
    const builtin: Skill = defineSkill({
      id: 'alexi-config',
      name: 'Alexi Config (test)',
      description: 'Built-in protected skill',
      prompt: 'built-in',
    });
    registerSkill(builtin);

    const projectSkillsDir = path.join(projectRoot, '.alexi', 'skills');
    writeSkill(projectSkillsDir, 'project-skill');

    const first = reloadSkills(projectRoot);
    expect(first.total).toBe(2);
    expect(getSkillRegistry().has('alexi-config')).toBe(true);

    // Second reload — built-in must still be present even when file-sourced
    // skills disappear.
    fs.rmSync(projectSkillsDir, { recursive: true, force: true });
    const second = reloadSkills(projectRoot);
    expect(getSkillRegistry().has('alexi-config')).toBe(true);
    expect(getSkillRegistry().has('project-skill')).toBe(false);
    expect(second.total).toBe(1);
  });

  it('publishes a skill.reloaded event with the count summary', () => {
    const events: Array<{ added: number; removed: number; total: number }> = [];
    const unsubscribe = SkillReloaded.subscribe((payload) => {
      events.push({ added: payload.added, removed: payload.removed, total: payload.total });
    });

    try {
      const projectSkillsDir = path.join(projectRoot, '.alexi', 'skills');
      writeSkill(projectSkillsDir, 'evt-skill');

      const counts = reloadSkills(projectRoot);

      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({
        added: counts.added,
        removed: counts.removed,
        total: counts.total,
      });
    } finally {
      unsubscribe();
    }
  });
});

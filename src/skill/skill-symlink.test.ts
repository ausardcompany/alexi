import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { loadSkillsFromDirectory, skillDirectories } from './index.js';
import * as globalUtils from '../utils/global.js';

const SKILL_BODY = (id: string): string => `---
id: ${id}
name: ${id}
description: Symlink test skill ${id}
---

Prompt for ${id}.
`;

describe('Skill symlink-aware discovery', () => {
  let tempRoots: string[];
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    tempRoots = [];
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    for (const dir of tempRoots) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    warnSpy.mockRestore();
  });

  function mkTempDir(prefix = 'skill-symlink-'): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
    // Resolve to canonical path so symlink-target comparisons work on macOS
    // (where /tmp is itself a symlink to /private/tmp).
    const resolved = fs.realpathSync(dir);
    tempRoots.push(resolved);
    return resolved;
  }

  it('loads a symlinked skill file and points sourcePath at the link entry', () => {
    const dir = mkTempDir();
    const realFile = path.join(dir, 'realSkill.md');
    fs.writeFileSync(realFile, SKILL_BODY('real-skill'));

    const linkFile = path.join(dir, 'linkedSkill.md');
    fs.symlinkSync(realFile, linkFile);

    const skills = loadSkillsFromDirectory(dir);

    // Both entries map to the same skill id, so we get one unique id but two
    // entries (real + link). The important behavior is the symlinked file is
    // discovered at all; the loader does not silently skip it.
    expect(skills.length).toBeGreaterThanOrEqual(1);
    const ids = skills.map((s) => s.id);
    expect(ids).toContain('real-skill');

    // sourcePath of the symlinked entry should point at the symlink path.
    const linkSkill = skills.find((s) => s.sourcePath === linkFile);
    expect(linkSkill).toBeDefined();
  });

  it('recurses into a symlinked subdirectory and discovers its skills', () => {
    const dirA = mkTempDir('skill-symlink-a-');
    const dirB = mkTempDir('skill-symlink-b-');

    const skillFile = path.join(dirB, 'shared-skill.md');
    fs.writeFileSync(skillFile, SKILL_BODY('shared-skill'));

    fs.symlinkSync(dirB, path.join(dirA, 'shared'));

    const skills = loadSkillsFromDirectory(dirA);
    const ids = skills.map((s) => s.id);

    expect(ids).toContain('shared-skill');
  });

  it('does not infinitely loop on a circular symlink', () => {
    const dirA = mkTempDir('skill-symlink-cycle-');

    const concrete = path.join(dirA, 'concrete.md');
    fs.writeFileSync(concrete, SKILL_BODY('concrete-skill'));

    // A/loop -> A (cycle)
    fs.symlinkSync(dirA, path.join(dirA, 'loop'));

    const skills = loadSkillsFromDirectory(dirA);
    const ids = skills.map((s) => s.id);

    expect(ids).toContain('concrete-skill');
  });

  it('warns and continues on broken symlinks', () => {
    const dir = mkTempDir('skill-symlink-broken-');

    const valid = path.join(dir, 'valid.md');
    fs.writeFileSync(valid, SKILL_BODY('valid-skill'));

    // Broken symlink: target does not exist.
    const broken = path.join(dir, 'dead.md');
    fs.symlinkSync(path.join(dir, 'does-not-exist.md'), broken);

    const skills = loadSkillsFromDirectory(dir);
    const ids = skills.map((s) => s.id);

    expect(ids).toContain('valid-skill');
    expect(warnSpy).toHaveBeenCalled();
  });
});

describe('skillDirectories deduplication', () => {
  let tempRoots: string[];
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    tempRoots = [];
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    for (const dir of tempRoots) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    warnSpy.mockRestore();
    vi.restoreAllMocks();
  });

  function mkTempDir(prefix = 'skill-dirs-'): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
    const resolved = fs.realpathSync(dir);
    tempRoots.push(resolved);
    return resolved;
  }

  it('deduplicates project skills dir when symlinked to global skills dir', () => {
    // Set up a fake global skills dir.
    const fakeHome = mkTempDir('skill-dirs-home-');
    const globalSkills = path.join(fakeHome, '.alexi', 'skills');
    fs.mkdirSync(globalSkills, { recursive: true });

    // Set up a project root whose .alexi/skills is a symlink to globalSkills.
    const projectRoot = mkTempDir('skill-dirs-project-');
    fs.mkdirSync(path.join(projectRoot, '.alexi'), { recursive: true });
    fs.symlinkSync(globalSkills, path.join(projectRoot, '.alexi', 'skills'));

    vi.spyOn(globalUtils, 'getGlobalPaths').mockReturnValue({
      config: path.join(fakeHome, '.alexi'),
      skills: globalSkills,
      cache: path.join(fakeHome, '.alexi', 'cache'),
    });

    const dirs = skillDirectories(projectRoot);

    // Both candidates resolve to the same realpath, so only one is kept.
    expect(dirs.length).toBe(1);
  });

  it('returns both project and global dirs when distinct', () => {
    const fakeHome = mkTempDir('skill-dirs-home-distinct-');
    const globalSkills = path.join(fakeHome, '.alexi', 'skills');
    fs.mkdirSync(globalSkills, { recursive: true });

    const projectRoot = mkTempDir('skill-dirs-project-distinct-');
    const projectSkills = path.join(projectRoot, '.alexi', 'skills');
    fs.mkdirSync(projectSkills, { recursive: true });

    vi.spyOn(globalUtils, 'getGlobalPaths').mockReturnValue({
      config: path.join(fakeHome, '.alexi'),
      skills: globalSkills,
      cache: path.join(fakeHome, '.alexi', 'cache'),
    });

    const dirs = skillDirectories(projectRoot);
    expect(dirs.length).toBe(2);
    // Project must come first (higher precedence).
    expect(dirs[0]).toBe(projectSkills);
  });
});

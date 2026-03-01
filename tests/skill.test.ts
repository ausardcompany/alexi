import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  defineSkill,
  loadSkillFromFile,
  loadSkillsFromDirectory,
  SkillRegistry,
  getSkillRegistry,
  registerSkill,
  getSkill,
  listSkills,
} from '../src/skill/index.js';

describe('Skill System', () => {
  let tempDir: string;

  beforeEach(() => {
    // Create temp directory for test files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-test-'));
    // Clear global registry
    getSkillRegistry().clear();
  });

  afterEach(() => {
    // Cleanup temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('defineSkill', () => {
    it('should create a skill with required fields', () => {
      const skill = defineSkill({
        id: 'test-skill',
        name: 'Test Skill',
        description: 'A test skill',
        prompt: 'You are a test assistant',
      });

      expect(skill.id).toBe('test-skill');
      expect(skill.name).toBe('Test Skill');
      expect(skill.description).toBe('A test skill');
      expect(skill.prompt).toBe('You are a test assistant');
      expect(skill.source).toBe('builtin');
    });

    it('should create a skill with optional fields', () => {
      const skill = defineSkill({
        id: 'advanced-skill',
        name: 'Advanced Skill',
        description: 'An advanced test skill',
        prompt: 'You are an advanced assistant',
        category: 'testing',
        tags: ['test', 'advanced'],
        aliases: ['adv', 'advanced'],
        tools: ['read', 'write'],
        disabledTools: ['bash'],
        preferredModel: 'claude-3-opus',
        temperature: 0.7,
        maxTokens: 4096,
      });

      expect(skill.category).toBe('testing');
      expect(skill.tags).toEqual(['test', 'advanced']);
      expect(skill.aliases).toEqual(['adv', 'advanced']);
      expect(skill.tools).toEqual(['read', 'write']);
      expect(skill.disabledTools).toEqual(['bash']);
      expect(skill.preferredModel).toBe('claude-3-opus');
      expect(skill.temperature).toBe(0.7);
      expect(skill.maxTokens).toBe(4096);
    });
  });

  describe('loadSkillFromFile', () => {
    it('should load skill from markdown file with frontmatter', () => {
      const skillContent = `---
id: file-skill
name: File Skill
description: A skill loaded from file
category: file-test
tags:
  - file
  - test
aliases:
  - fs
---

You are an assistant loaded from a markdown file.

## Instructions
- Be helpful
- Be concise
`;

      const filePath = path.join(tempDir, 'test-skill.md');
      fs.writeFileSync(filePath, skillContent);

      const skill = loadSkillFromFile(filePath);

      expect(skill).not.toBeNull();
      expect(skill!.id).toBe('file-skill');
      expect(skill!.name).toBe('File Skill');
      expect(skill!.description).toBe('A skill loaded from file');
      expect(skill!.category).toBe('file-test');
      expect(skill!.tags).toEqual(['file', 'test']);
      expect(skill!.aliases).toEqual(['fs']);
      expect(skill!.source).toBe('file');
      expect(skill!.sourcePath).toBe(filePath);
      expect(skill!.prompt).toContain('You are an assistant loaded from a markdown file');
      expect(skill!.prompt).toContain('## Instructions');
    });

    it('should use filename as id if not specified in frontmatter', () => {
      const skillContent = `---
name: Simple Skill
description: A simple skill
---

You are a simple assistant.
`;

      const filePath = path.join(tempDir, 'simple-skill.md');
      fs.writeFileSync(filePath, skillContent);

      const skill = loadSkillFromFile(filePath);

      expect(skill).not.toBeNull();
      expect(skill!.id).toBe('simple-skill');
    });

    it('should return null for non-existent file', () => {
      const skill = loadSkillFromFile('/non/existent/path.md');
      expect(skill).toBeNull();
    });

    it('should handle file with no frontmatter', () => {
      const skillContent = `You are a plain assistant without frontmatter.`;

      const filePath = path.join(tempDir, 'plain-skill.md');
      fs.writeFileSync(filePath, skillContent);

      const skill = loadSkillFromFile(filePath);

      expect(skill).not.toBeNull();
      expect(skill!.id).toBe('plain-skill');
      expect(skill!.prompt).toBe('You are a plain assistant without frontmatter.');
    });
  });

  describe('loadSkillsFromDirectory', () => {
    it('should load all skill files from directory', () => {
      // Create multiple skill files
      const skill1 = `---
id: skill-1
name: Skill One
description: First skill
---
Prompt one`;

      const skill2 = `---
id: skill-2
name: Skill Two
description: Second skill
---
Prompt two`;

      fs.writeFileSync(path.join(tempDir, 'skill-1.md'), skill1);
      fs.writeFileSync(path.join(tempDir, 'skill-2.md'), skill2);

      const skills = loadSkillsFromDirectory(tempDir);

      expect(skills).toHaveLength(2);
      expect(skills.map((s) => s.id).sort()).toEqual(['skill-1', 'skill-2']);
    });

    it('should return empty array for non-existent directory', () => {
      const skills = loadSkillsFromDirectory('/non/existent/dir');
      expect(skills).toEqual([]);
    });

    it('should ignore non-skill files', () => {
      const skillFile = `---
id: valid-skill
---
Valid prompt`;

      fs.writeFileSync(path.join(tempDir, 'valid.md'), skillFile);
      fs.writeFileSync(path.join(tempDir, 'readme.txt'), 'Not a skill');
      fs.writeFileSync(path.join(tempDir, 'data.json'), '{"not": "skill"}');

      const skills = loadSkillsFromDirectory(tempDir);

      expect(skills).toHaveLength(1);
      expect(skills[0].id).toBe('valid-skill');
    });
  });

  describe('SkillRegistry', () => {
    let registry: SkillRegistry;

    beforeEach(() => {
      registry = new SkillRegistry();
    });

    it('should register and retrieve skills', () => {
      const skill = defineSkill({
        id: 'reg-skill',
        name: 'Registry Skill',
        description: 'Test',
        prompt: 'Test prompt',
      });

      registry.register(skill);

      expect(registry.has('reg-skill')).toBe(true);
      expect(registry.get('reg-skill')).toEqual(skill);
    });

    it('should retrieve skill by alias', () => {
      const skill = defineSkill({
        id: 'aliased-skill',
        name: 'Aliased Skill',
        description: 'Test',
        prompt: 'Test prompt',
        aliases: ['as', 'aliased'],
      });

      registry.register(skill);

      expect(registry.get('as')).toEqual(skill);
      expect(registry.get('aliased')).toEqual(skill);
      expect(registry.get('AS')).toEqual(skill); // Case insensitive
      expect(registry.has('as')).toBe(true);
    });

    it('should list all skills', () => {
      registry.register(defineSkill({ id: 's1', name: 'S1', description: '', prompt: '' }));
      registry.register(defineSkill({ id: 's2', name: 'S2', description: '', prompt: '' }));
      registry.register(defineSkill({ id: 's3', name: 'S3', description: '', prompt: '' }));

      const skills = registry.list();

      expect(skills).toHaveLength(3);
    });

    it('should filter skills by category', () => {
      registry.register(
        defineSkill({ id: 's1', name: 'S1', description: '', prompt: '', category: 'cat-a' })
      );
      registry.register(
        defineSkill({ id: 's2', name: 'S2', description: '', prompt: '', category: 'cat-b' })
      );
      registry.register(
        defineSkill({ id: 's3', name: 'S3', description: '', prompt: '', category: 'cat-a' })
      );

      const catA = registry.listByCategory('cat-a');
      const catB = registry.listByCategory('cat-b');

      expect(catA).toHaveLength(2);
      expect(catB).toHaveLength(1);
    });

    it('should filter skills by tag', () => {
      registry.register(
        defineSkill({ id: 's1', name: 'S1', description: '', prompt: '', tags: ['tag1', 'tag2'] })
      );
      registry.register(
        defineSkill({ id: 's2', name: 'S2', description: '', prompt: '', tags: ['tag2', 'tag3'] })
      );
      registry.register(
        defineSkill({ id: 's3', name: 'S3', description: '', prompt: '', tags: ['tag1'] })
      );

      const tag1 = registry.listByTag('tag1');
      const tag2 = registry.listByTag('tag2');
      const tag3 = registry.listByTag('tag3');

      expect(tag1).toHaveLength(2);
      expect(tag2).toHaveLength(2);
      expect(tag3).toHaveLength(1);
    });

    it('should search skills', () => {
      registry.register(
        defineSkill({
          id: 'code-review',
          name: 'Code Review',
          description: 'Reviews code quality',
          prompt: '',
          tags: ['review', 'quality'],
        })
      );
      registry.register(
        defineSkill({
          id: 'security-audit',
          name: 'Security Audit',
          description: 'Audits security vulnerabilities',
          prompt: '',
          tags: ['security', 'audit'],
        })
      );

      expect(registry.search('code')).toHaveLength(1);
      expect(registry.search('review')).toHaveLength(1);
      expect(registry.search('audit')).toHaveLength(1);
      expect(registry.search('security')).toHaveLength(1);
      expect(registry.search('xyz')).toHaveLength(0);
    });

    it('should get all categories', () => {
      registry.register(
        defineSkill({ id: 's1', name: 'S1', description: '', prompt: '', category: 'cat-a' })
      );
      registry.register(
        defineSkill({ id: 's2', name: 'S2', description: '', prompt: '', category: 'cat-b' })
      );
      registry.register(
        defineSkill({ id: 's3', name: 'S3', description: '', prompt: '', category: 'cat-a' })
      );
      registry.register(defineSkill({ id: 's4', name: 'S4', description: '', prompt: '' })); // no category

      const categories = registry.getCategories();

      expect(categories.sort()).toEqual(['cat-a', 'cat-b']);
    });

    it('should remove skills', () => {
      registry.register(
        defineSkill({
          id: 'removable',
          name: 'Removable',
          description: '',
          prompt: '',
          aliases: ['rm'],
        })
      );

      expect(registry.has('removable')).toBe(true);
      expect(registry.has('rm')).toBe(true);

      const removed = registry.remove('removable');

      expect(removed).toBe(true);
      expect(registry.has('removable')).toBe(false);
      expect(registry.has('rm')).toBe(false);
    });

    it('should clear all skills', () => {
      registry.register(
        defineSkill({ id: 's1', name: 'S1', description: '', prompt: '', aliases: ['a1'] })
      );
      registry.register(
        defineSkill({ id: 's2', name: 'S2', description: '', prompt: '', aliases: ['a2'] })
      );

      registry.clear();

      expect(registry.list()).toHaveLength(0);
      expect(registry.has('s1')).toBe(false);
      expect(registry.has('a1')).toBe(false);
    });
  });

  describe('Global Registry Functions', () => {
    it('should use global registry', () => {
      const skill = defineSkill({
        id: 'global-skill',
        name: 'Global Skill',
        description: 'Test',
        prompt: 'Test',
      });

      registerSkill(skill);

      expect(getSkill('global-skill')).toEqual(skill);
      expect(listSkills()).toContainEqual(skill);
    });
  });
});

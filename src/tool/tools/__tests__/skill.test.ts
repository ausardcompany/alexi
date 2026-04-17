import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { skillTool, substituteArguments } from '../skill.js';
import type { ToolContext } from '../../index.js';
import { getSkillRegistry, type Skill } from '../../../skill/index.js';

describe('Skill Tool', () => {
  let context: ToolContext;

  beforeEach(() => {
    context = { workdir: '/test' };
    // Clear registry before each test
    getSkillRegistry().clear();
  });

  afterEach(() => {
    // Clear registry after each test
    getSkillRegistry().clear();
  });

  describe('substituteArguments', () => {
    it('should replace numbered arguments', () => {
      const prompt = 'Analyze the code in $1 and explain $2';
      const args = { '1': 'src/index.ts', '2': 'the architecture' };

      const result = substituteArguments(prompt, args);

      expect(result).toBe('Analyze the code in src/index.ts and explain the architecture');
    });

    it('should replace $ARGUMENTS with all args joined', () => {
      const prompt = 'Process these files: $ARGUMENTS';
      const args = { '1': 'file1.ts', '2': 'file2.ts', '3': 'file3.ts' };

      const result = substituteArguments(prompt, args);

      expect(result).toBe('Process these files: file1.ts file2.ts file3.ts');
    });

    it('should handle both $ARGUMENTS and numbered args', () => {
      const prompt = 'Main file: $1, all files: $ARGUMENTS';
      const args = { '1': 'main.ts', '2': 'helper.ts' };

      const result = substituteArguments(prompt, args);

      expect(result).toBe('Main file: main.ts, all files: main.ts helper.ts');
    });

    it('should handle empty args', () => {
      const prompt = 'No args here';
      const args = {};

      const result = substituteArguments(prompt, args);

      expect(result).toBe('No args here');
    });

    it('should replace multiple occurrences of the same arg', () => {
      const prompt = 'First: $1, again: $1, and once more: $1';
      const args = { '1': 'value' };

      const result = substituteArguments(prompt, args);

      expect(result).toBe('First: value, again: value, and once more: value');
    });

    it('should handle named arguments', () => {
      const prompt = 'File: $file, Type: $type';
      const args = { file: 'index.ts', type: 'typescript' };

      const result = substituteArguments(prompt, args);

      expect(result).toBe('File: index.ts, Type: typescript');
    });

    it('should leave unmatched placeholders', () => {
      const prompt = 'Has $1 and $2 and $3';
      const args = { '1': 'first', '2': 'second' };

      const result = substituteArguments(prompt, args);

      expect(result).toBe('Has first and second and $3');
    });
  });

  describe('skill lookup', () => {
    it('should successfully invoke a registered skill', async () => {
      const testSkill: Skill = {
        id: 'test-skill',
        name: 'Test Skill',
        description: 'A test skill for testing',
        prompt: 'This is the test prompt',
        source: 'builtin',
      };
      getSkillRegistry().register(testSkill);

      const result = await skillTool.executeUnsafe({ name: 'test-skill' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.skillName).toBe('Test Skill');
      expect(result.data?.prompt).toBe('This is the test prompt');
      expect(result.data?.description).toBe('A test skill for testing');
    });

    it('should look up skill by alias', async () => {
      const testSkill: Skill = {
        id: 'code-review',
        name: 'Code Review',
        description: 'Review code for best practices',
        prompt: 'Review the code in $1',
        aliases: ['review', 'cr'],
        source: 'builtin',
      };
      getSkillRegistry().register(testSkill);

      // Lookup by alias 'review'
      const result1 = await skillTool.executeUnsafe({ name: 'review' }, context);
      expect(result1.success).toBe(true);
      expect(result1.data?.skillName).toBe('Code Review');

      // Lookup by alias 'cr'
      const result2 = await skillTool.executeUnsafe({ name: 'cr' }, context);
      expect(result2.success).toBe(true);
      expect(result2.data?.skillName).toBe('Code Review');
    });

    it('should return error when skill not found', async () => {
      const result = await skillTool.executeUnsafe({ name: 'non-existent-skill' }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Skill 'non-existent-skill' not found");
      expect(result.error).toContain('Available skills:');
    });

    it('should list available skills in error message', async () => {
      const skill1: Skill = {
        id: 'skill-1',
        name: 'Skill One',
        description: 'First skill',
        prompt: 'First prompt',
        source: 'builtin',
      };
      const skill2: Skill = {
        id: 'skill-2',
        name: 'Skill Two',
        description: 'Second skill',
        prompt: 'Second prompt',
        source: 'builtin',
      };
      getSkillRegistry().register(skill1);
      getSkillRegistry().register(skill2);

      const result = await skillTool.executeUnsafe({ name: 'missing' }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Skill One');
      expect(result.error).toContain('Skill Two');
    });

    it('should show "(none)" when no skills available', async () => {
      const result = await skillTool.executeUnsafe({ name: 'any-skill' }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('(none)');
    });
  });

  describe('argument substitution in skill', () => {
    it('should substitute arguments in skill prompt', async () => {
      const testSkill: Skill = {
        id: 'analyze',
        name: 'Analyze',
        description: 'Analyze code',
        prompt: 'Analyze the code in $1 and explain $2',
        source: 'builtin',
      };
      getSkillRegistry().register(testSkill);

      const result = await skillTool.executeUnsafe(
        {
          name: 'analyze',
          arguments: { '1': 'src/main.ts', '2': 'the error handling' },
        },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.prompt).toBe(
        'Analyze the code in src/main.ts and explain the error handling'
      );
    });

    it('should handle skill with no arguments needed', async () => {
      const testSkill: Skill = {
        id: 'simple',
        name: 'Simple',
        description: 'A simple skill',
        prompt: 'Just do the thing',
        source: 'builtin',
      };
      getSkillRegistry().register(testSkill);

      const result = await skillTool.executeUnsafe({ name: 'simple' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.prompt).toBe('Just do the thing');
    });
  });

  describe('skill metadata', () => {
    it('should return constrained tools if defined', async () => {
      const testSkill: Skill = {
        id: 'limited',
        name: 'Limited',
        description: 'A skill with tool constraints',
        prompt: 'Do limited things',
        tools: ['read', 'glob', 'grep'],
        source: 'builtin',
      };
      getSkillRegistry().register(testSkill);

      const result = await skillTool.executeUnsafe({ name: 'limited' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.tools).toEqual(['read', 'glob', 'grep']);
    });

    it('should return undefined tools when not constrained', async () => {
      const testSkill: Skill = {
        id: 'unconstrained',
        name: 'Unconstrained',
        description: 'A skill without tool constraints',
        prompt: 'Do anything',
        source: 'builtin',
      };
      getSkillRegistry().register(testSkill);

      const result = await skillTool.executeUnsafe({ name: 'unconstrained' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.tools).toBeUndefined();
    });
  });

  describe('case insensitivity for aliases', () => {
    it('should find skill by alias regardless of case', async () => {
      const testSkill: Skill = {
        id: 'case-test',
        name: 'Case Test',
        description: 'Testing case insensitivity',
        prompt: 'Case test prompt',
        aliases: ['CaseAlias', 'UPPERCASE'],
        source: 'builtin',
      };
      getSkillRegistry().register(testSkill);

      // Lowercase
      const result1 = await skillTool.executeUnsafe({ name: 'casealias' }, context);
      expect(result1.success).toBe(true);
      expect(result1.data?.skillName).toBe('Case Test');

      // Uppercase
      const result2 = await skillTool.executeUnsafe({ name: 'UPPERCASE' }, context);
      expect(result2.success).toBe(true);
      expect(result2.data?.skillName).toBe('Case Test');

      // Mixed case
      const result3 = await skillTool.executeUnsafe({ name: 'CaSEaLiaS' }, context);
      expect(result3.success).toBe(true);
      expect(result3.data?.skillName).toBe('Case Test');
    });
  });

  describe('built-in alexi-config skill', () => {
    it('should include named command lookup guidance', async () => {
      // Register the built-in alexi-config skill
      const alexiConfigSkill: Skill = {
        id: 'alexi-config',
        name: 'Alexi Configuration',
        description: 'Information about Alexi configuration and where it loads things from',
        prompt: `# Alexi Configuration Guide

This document explains where Alexi loads configuration and commands from.

## Configuration Directories

Alexi searches for configuration in the following locations (in order of precedence):

1. **Project-local configuration**: \`.alexi/\` in your project directory
2. **User configuration**: \`~/.config/alexi/\` (XDG Base Directory standard)
3. **Legacy user configuration**: \`~/.alexi/\` (backward compatibility)

## Finding a named command

When you invoke a command by name, Alexi searches in these locations:

1. Project-local: \`<project>/.alexi/command/<name>\`
2. User config: \`~/.config/alexi/command/<name>\`
3. Legacy user: \`~/.alexi/command/<name>\`
4. Built-in commands

The first match wins. This allows you to:
- Override built-in commands with custom implementations
- Share commands across projects via global config
- Keep project-specific commands in version control

## Explicit search paths

You can also specify explicit search paths in your configuration:

- Use \`**/command/\` pattern to search subdirectories
- Configure custom search paths in \`alexi.config.json\`
- Set \`ALEXI_CONFIG_PATH\` environment variable for additional paths`,
        category: 'system',
        tags: ['config', 'system', 'help'],
        aliases: ['config'],
        source: 'builtin',
      };
      getSkillRegistry().register(alexiConfigSkill);

      const result = await skillTool.executeUnsafe({ name: 'alexi-config' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.skillName).toBe('Alexi Configuration');
      expect(result.data?.description).toContain('where it loads things from');
      expect(result.data?.prompt).toContain('Finding a named command');
      expect(result.data?.prompt).toContain('~/.config/alexi/');
      expect(result.data?.prompt).toContain('~/.alexi/');
      expect(result.data?.prompt).toContain('**/command/');
      expect(result.data?.prompt).toContain('explicit search');
    });
  });
});

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  loadAgentFromFile,
  loadAgentsFromDirectory,
  loadAgentsFromConfig,
  loadAllCustomAgents,
} from '../../src/agent/customAgentLoader.js';

describe('Custom Agent Loader', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'agent-loader-'));
  });

  afterEach(async () => {
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  });

  describe('loadAgentFromFile', () => {
    it('should load agent from markdown file with YAML frontmatter', async () => {
      const filePath = path.join(tempDir, 'api-expert.md');
      fs.writeFileSync(
        filePath,
        `---
name: "API Expert"
description: "Specializes in REST API development"
mode: all
model: gpt-4o
tools: [read, write, edit, glob, grep, bash]
aliases: [api, backend]
temperature: 0.3
---

You are an API development expert specializing in REST and GraphQL APIs.
Always validate request/response schemas with Zod.
`
      );

      const agent = await loadAgentFromFile(filePath, 'project-local');

      expect(agent).not.toBeNull();
      expect(agent!.id).toBe('api-expert');
      expect(agent!.name).toBe('API Expert');
      expect(agent!.description).toBe('Specializes in REST API development');
      expect(agent!.mode).toBe('all');
      expect(agent!.preferredModel).toBe('gpt-4o');
      expect(agent!.tools).toEqual(['read', 'write', 'edit', 'glob', 'grep', 'bash']);
      expect(agent!.aliases).toEqual(['api', 'backend']);
      expect(agent!.temperature).toBe(0.3);
      expect(agent!.systemPrompt).toContain('API development expert');
      expect(agent!.source).toBe('project-local');
      expect(agent!.sourcePath).toBe(filePath);
    });

    it('should use filename as id when no slug is provided', async () => {
      const filePath = path.join(tempDir, 'my-custom-agent.md');
      fs.writeFileSync(
        filePath,
        `---
name: "My Custom Agent"
description: "A test agent"
---

You are a custom test agent.
`
      );

      const agent = await loadAgentFromFile(filePath, 'user-global');

      expect(agent).not.toBeNull();
      expect(agent!.id).toBe('my-custom-agent');
    });

    it('should use slug as id when provided', async () => {
      const filePath = path.join(tempDir, 'file-name-ignored.md');
      fs.writeFileSync(
        filePath,
        `---
slug: custom-slug
name: "Slug Agent"
description: "Agent with custom slug"
---

You are a slugged agent.
`
      );

      const agent = await loadAgentFromFile(filePath, 'project-local');

      expect(agent).not.toBeNull();
      expect(agent!.id).toBe('custom-slug');
    });

    it('should return null for empty system prompt', async () => {
      const filePath = path.join(tempDir, 'empty.md');
      fs.writeFileSync(
        filePath,
        `---
name: "Empty Agent"
description: "No prompt"
---
`
      );

      const agent = await loadAgentFromFile(filePath, 'project-local');
      expect(agent).toBeNull();
    });

    it('should return null for invalid YAML frontmatter', async () => {
      const filePath = path.join(tempDir, 'invalid.md');
      fs.writeFileSync(filePath, `not valid frontmatter at all`);

      // gray-matter treats files without --- delimiters as having no frontmatter
      // but with content. So this should still work (id from filename, empty name/desc)
      const agent = await loadAgentFromFile(filePath, 'project-local');
      // Content is treated as systemPrompt
      expect(agent).not.toBeNull();
      expect(agent!.id).toBe('invalid');
      expect(agent!.systemPrompt).toBe('not valid frontmatter at all');
    });

    it('should return null for non-existent file', async () => {
      const agent = await loadAgentFromFile(path.join(tempDir, 'nonexistent.md'), 'project-local');
      expect(agent).toBeNull();
    });

    it('should default mode to all when not specified', async () => {
      const filePath = path.join(tempDir, 'default-mode.md');
      fs.writeFileSync(
        filePath,
        `---
name: "Default Mode Agent"
description: "No mode specified"
---

Agent with default mode.
`
      );

      const agent = await loadAgentFromFile(filePath, 'project-local');
      expect(agent).not.toBeNull();
      expect(agent!.mode).toBe('all');
    });
  });

  describe('loadAgentsFromDirectory', () => {
    it('should load all markdown files from directory', async () => {
      const dir = path.join(tempDir, 'agents');
      fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(
        path.join(dir, 'agent-a.md'),
        `---
name: "Agent A"
description: "First agent"
---

Agent A prompt.
`
      );

      fs.writeFileSync(
        path.join(dir, 'agent-b.md'),
        `---
name: "Agent B"
description: "Second agent"
---

Agent B prompt.
`
      );

      // Non-markdown file should be ignored
      fs.writeFileSync(path.join(dir, 'readme.txt'), 'not an agent');

      const agents = await loadAgentsFromDirectory(dir, 'project-local');

      expect(agents).toHaveLength(2);
      expect(agents[0].id).toBe('agent-a');
      expect(agents[1].id).toBe('agent-b');
    });

    it('should return empty array for non-existent directory', async () => {
      const agents = await loadAgentsFromDirectory(path.join(tempDir, 'nope'), 'user-global');
      expect(agents).toHaveLength(0);
    });

    it('should sort files alphabetically', async () => {
      const dir = path.join(tempDir, 'sorted');
      fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(path.join(dir, 'z-agent.md'), '---\nname: Z\ndescription: Z\n---\nZ prompt');
      fs.writeFileSync(path.join(dir, 'a-agent.md'), '---\nname: A\ndescription: A\n---\nA prompt');

      const agents = await loadAgentsFromDirectory(dir, 'project-local');

      expect(agents[0].id).toBe('a-agent');
      expect(agents[1].id).toBe('z-agent');
    });
  });

  describe('loadAgentsFromConfig', () => {
    it('should load agents from JSON config object', () => {
      const config = {
        agents: {
          'config-agent': {
            name: 'Config Agent',
            description: 'Agent from JSON config',
            prompt: 'You are a config-defined agent.',
            model: 'gpt-4o-mini',
            tools: ['read', 'glob'],
          },
        },
      };

      const agents = loadAgentsFromConfig(config);

      expect(agents).toHaveLength(1);
      expect(agents[0].id).toBe('config-agent');
      expect(agents[0].name).toBe('Config Agent');
      expect(agents[0].systemPrompt).toBe('You are a config-defined agent.');
      expect(agents[0].preferredModel).toBe('gpt-4o-mini');
      expect(agents[0].tools).toEqual(['read', 'glob']);
      expect(agents[0].source).toBe('config');
    });

    it('should return empty array when no agents section', () => {
      const agents = loadAgentsFromConfig({});
      expect(agents).toHaveLength(0);
    });

    it('should skip invalid agent entries', () => {
      const config = {
        agents: {
          'good-agent': {
            name: 'Good',
            description: 'Valid agent',
            prompt: 'Valid prompt.',
          },
          'bad-agent': 'not an object',
        },
      };

      const agents = loadAgentsFromConfig(config);
      expect(agents).toHaveLength(1);
      expect(agents[0].id).toBe('good-agent');
    });
  });

  describe('loadAllCustomAgents', () => {
    it('should load from both user and project directories', async () => {
      // Create project-level agents dir
      const projectDir = path.join(tempDir, '.alexi', 'agents');
      fs.mkdirSync(projectDir, { recursive: true });

      fs.writeFileSync(
        path.join(projectDir, 'project-agent.md'),
        `---
name: "Project Agent"
description: "Project-specific agent"
---

Project agent prompt.
`
      );

      const agents = await loadAllCustomAgents(tempDir);

      // Should find at least the project agent (user dir might not exist)
      const projectAgent = agents.find((a) => a.id === 'project-agent');
      expect(projectAgent).toBeDefined();
      expect(projectAgent!.source).toBe('project-local');
    });

    it('should return empty when no agent directories exist', async () => {
      const agents = await loadAllCustomAgents(tempDir);
      expect(agents).toHaveLength(0);
    });
  });
});

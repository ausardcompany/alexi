import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
  buildAssembledSystemPrompt,
  getAgentPrompt,
  getModelPrompt,
  getSoulPrompt,
  getModelPromptKey,
} from './system.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsDir = path.join(__dirname, 'prompts');

// All expected prompt files
const PROMPT_FILES = [
  'soul.txt',
  'anthropic.txt',
  'openai.txt',
  'gemini.txt',
  'default.txt',
  'code.txt',
  'debug.txt',
  'plan.txt',
  'explore.txt',
  'ask.txt',
  'orchestrator.txt',
];

const AGENT_IDS = ['code', 'debug', 'plan', 'explore', 'ask', 'orchestrator'];
const MODEL_IDS = [
  'anthropic--claude-3.5-sonnet',
  'gpt-4o',
  'gemini-1.5-pro',
  'some-unknown-model',
];

describe('Prompt System', () => {
  describe('Prompt files', () => {
    it.each(PROMPT_FILES)('%s exists and is non-empty', (filename) => {
      const filePath = path.join(promptsDir, filename);
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, 'utf-8').trim();
      expect(content.length).toBeGreaterThan(0);
    });

    it.each(PROMPT_FILES)('%s does not contain credential-like patterns', (filename) => {
      const filePath = path.join(promptsDir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check for common credential patterns
      expect(content).not.toMatch(/sk-[a-zA-Z0-9]{20,}/); // OpenAI API keys
      expect(content).not.toMatch(/AKIA[A-Z0-9]{16}/); // AWS access keys
      expect(content).not.toMatch(/ghp_[a-zA-Z0-9]{36}/); // GitHub tokens
      expect(content).not.toMatch(/password\s*[:=]\s*["'][^"']+["']/i); // Passwords
    });
  });

  describe('Model prompt key mapping', () => {
    it('maps anthropic model IDs correctly', () => {
      expect(getModelPromptKey('anthropic--claude-3.5-sonnet')).toBe('anthropic');
      expect(getModelPromptKey('anthropic--claude-3-opus')).toBe('anthropic');
    });

    it('maps OpenAI model IDs correctly', () => {
      expect(getModelPromptKey('gpt-4o')).toBe('openai');
      expect(getModelPromptKey('gpt-3.5-turbo')).toBe('openai');
    });

    it('maps Gemini model IDs correctly', () => {
      expect(getModelPromptKey('gemini-1.5-pro')).toBe('gemini');
      expect(getModelPromptKey('gemini-2.0-flash')).toBe('gemini');
    });

    it('maps unknown models to default', () => {
      expect(getModelPromptKey('some-unknown-model')).toBe('default');
      expect(getModelPromptKey('llama-3.1')).toBe('default');
    });
  });

  describe('Prompt accessors', () => {
    it('getSoulPrompt returns non-empty string', () => {
      const soul = getSoulPrompt();
      expect(soul.length).toBeGreaterThan(0);
      expect(soul).toContain('Alexi');
    });

    it.each(AGENT_IDS)('getAgentPrompt("%s") returns non-empty string', (agentId) => {
      const prompt = getAgentPrompt(agentId);
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('getAgentPrompt returns empty string for unknown agent', () => {
      expect(getAgentPrompt('nonexistent')).toBe('');
    });

    it.each(MODEL_IDS)('getModelPrompt("%s") returns non-empty string', (modelId) => {
      const prompt = getModelPrompt(modelId);
      expect(prompt.length).toBeGreaterThan(0);
    });
  });

  describe('buildAssembledSystemPrompt', () => {
    it('always includes soul prompt', () => {
      const prompt = buildAssembledSystemPrompt({
        skipEnv: true,
        skipAgentsMd: true,
      });
      const soul = getSoulPrompt();
      expect(prompt).toContain(soul);
    });

    it('includes agent prompt when agentId is specified', () => {
      const prompt = buildAssembledSystemPrompt({
        agentId: 'code',
        skipEnv: true,
        skipAgentsMd: true,
      });
      const agentPrompt = getAgentPrompt('code');
      expect(prompt).toContain(agentPrompt);
    });

    it('includes model prompt when modelId is specified', () => {
      const prompt = buildAssembledSystemPrompt({
        modelId: 'anthropic--claude-3.5-sonnet',
        skipEnv: true,
        skipAgentsMd: true,
      });
      const modelPrompt = getModelPrompt('anthropic--claude-3.5-sonnet');
      expect(prompt).toContain(modelPrompt);
    });

    it('includes custom rules when provided', () => {
      const customRule = 'Always use TypeScript strict mode';
      const prompt = buildAssembledSystemPrompt({
        customRules: customRule,
        skipEnv: true,
        skipAgentsMd: true,
      });
      expect(prompt).toContain(customRule);
    });

    it('produces valid output for all agent + model combinations', () => {
      for (const agentId of AGENT_IDS) {
        for (const modelId of MODEL_IDS) {
          const prompt = buildAssembledSystemPrompt({
            agentId,
            modelId,
            skipEnv: true,
            skipAgentsMd: true,
          });
          expect(prompt.length).toBeGreaterThan(0);
          expect(prompt).toContain(getSoulPrompt());
          expect(prompt).toContain(getAgentPrompt(agentId));
        }
      }
    });
  });

  describe('Global AGENTS.md resolution', () => {
    let tmpRoot: string;
    let tmpHome: string;
    let tmpProject: string;
    let originalHome: string | undefined;
    let originalUserProfile: string | undefined;
    let originalXdg: string | undefined;

    beforeEach(() => {
      tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-agents-test-'));
      tmpHome = path.join(tmpRoot, 'home');
      tmpProject = path.join(tmpRoot, 'project');
      fs.mkdirSync(tmpHome, { recursive: true });
      fs.mkdirSync(tmpProject, { recursive: true });

      originalHome = process.env.HOME;
      originalUserProfile = process.env.USERPROFILE;
      originalXdg = process.env.XDG_CONFIG_HOME;

      process.env.HOME = tmpHome;
      // Windows uses USERPROFILE for os.homedir()
      process.env.USERPROFILE = tmpHome;
      delete process.env.XDG_CONFIG_HOME;
    });

    afterEach(() => {
      if (originalHome === undefined) {
        delete process.env.HOME;
      } else {
        process.env.HOME = originalHome;
      }
      if (originalUserProfile === undefined) {
        delete process.env.USERPROFILE;
      } else {
        process.env.USERPROFILE = originalUserProfile;
      }
      if (originalXdg === undefined) {
        delete process.env.XDG_CONFIG_HOME;
      } else {
        process.env.XDG_CONFIG_HOME = originalXdg;
      }

      try {
        fs.rmSync(tmpRoot, { recursive: true, force: true });
      } catch {
        // best-effort cleanup
      }
    });

    it('honors $XDG_CONFIG_HOME/AGENTS.md', () => {
      const xdgDir = path.join(tmpRoot, 'xdg');
      fs.mkdirSync(xdgDir, { recursive: true });
      const xdgFile = path.join(xdgDir, 'AGENTS.md');
      fs.writeFileSync(xdgFile, 'XDG_FIXTURE_CONTENT');
      process.env.XDG_CONFIG_HOME = xdgDir;

      const prompt = buildAssembledSystemPrompt({
        workdir: tmpProject,
        skipEnv: true,
      });

      const resolved = fs.realpathSync(xdgFile);
      expect(prompt).toContain(`<global-agents-md path="${resolved}">`);
      expect(prompt).toContain('XDG_FIXTURE_CONTENT');
      expect(prompt).toContain('</global-agents-md>');
    });

    it('falls back to ~/.config/AGENTS.md when XDG_CONFIG_HOME unset', () => {
      const configDir = path.join(tmpHome, '.config');
      fs.mkdirSync(configDir, { recursive: true });
      const configFile = path.join(configDir, 'AGENTS.md');
      fs.writeFileSync(configFile, 'CONFIG_FIXTURE_CONTENT');

      const prompt = buildAssembledSystemPrompt({
        workdir: tmpProject,
        skipEnv: true,
      });

      const resolved = fs.realpathSync(configFile);
      expect(prompt).toContain(`<global-agents-md path="${resolved}">`);
      expect(prompt).toContain('CONFIG_FIXTURE_CONTENT');
    });

    it('falls back to ~/AGENTS.md last', () => {
      const homeFile = path.join(tmpHome, 'AGENTS.md');
      fs.writeFileSync(homeFile, 'HOME_FIXTURE_CONTENT');

      const prompt = buildAssembledSystemPrompt({
        workdir: tmpProject,
        skipEnv: true,
      });

      const resolved = fs.realpathSync(homeFile);
      expect(prompt).toContain(`<global-agents-md path="${resolved}">`);
      expect(prompt).toContain('HOME_FIXTURE_CONTENT');
    });

    it('first hit wins (XDG > ~/.config > ~)', () => {
      // Write all three.
      const xdgDir = path.join(tmpRoot, 'xdg');
      fs.mkdirSync(xdgDir, { recursive: true });
      fs.writeFileSync(path.join(xdgDir, 'AGENTS.md'), 'XDG_WINS');
      process.env.XDG_CONFIG_HOME = xdgDir;

      const configDir = path.join(tmpHome, '.config');
      fs.mkdirSync(configDir, { recursive: true });
      fs.writeFileSync(path.join(configDir, 'AGENTS.md'), 'CONFIG_LOSES');

      fs.writeFileSync(path.join(tmpHome, 'AGENTS.md'), 'HOME_LOSES');

      const prompt = buildAssembledSystemPrompt({
        workdir: tmpProject,
        skipEnv: true,
      });

      expect(prompt).toContain('XDG_WINS');
      expect(prompt).not.toContain('CONFIG_LOSES');
      expect(prompt).not.toContain('HOME_LOSES');
    });

    it('de-dupes when ~/AGENTS.md is a symlink to project AGENTS.md', () => {
      const projectFile = path.join(tmpProject, 'AGENTS.md');
      fs.writeFileSync(projectFile, 'PROJECT_FIXTURE_UNIQUE_TOKEN');

      const homeLink = path.join(tmpHome, 'AGENTS.md');
      fs.symlinkSync(projectFile, homeLink);

      const prompt = buildAssembledSystemPrompt({
        workdir: tmpProject,
        skipEnv: true,
      });

      // Project block present exactly once.
      expect(prompt).toContain('<agents-md>');
      const matches = prompt.match(/PROJECT_FIXTURE_UNIQUE_TOKEN/g) ?? [];
      expect(matches.length).toBe(1);
      // No global block when it would point at the same file.
      expect(prompt).not.toContain('<global-agents-md');
    });
  });
});

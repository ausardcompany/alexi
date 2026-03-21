import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
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
});

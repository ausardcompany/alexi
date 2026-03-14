import { describe, it, expect } from 'vitest';
import {
  AGENT_COLORS,
  DEFAULT_AGENT_COLOR,
  getAgentColor,
  formatAgentPrompt,
  formatAgentBadge,
  formatAgentSwitchNotice,
} from '../agentColors.js';
import { colors } from '../colors.js';

describe('agentColors', () => {
  describe('AGENT_COLORS', () => {
    it('should map all 5 built-in agents to distinct colors', () => {
      expect(Object.keys(AGENT_COLORS)).toHaveLength(5);
      expect(AGENT_COLORS).toHaveProperty('code');
      expect(AGENT_COLORS).toHaveProperty('debug');
      expect(AGENT_COLORS).toHaveProperty('plan');
      expect(AGENT_COLORS).toHaveProperty('explore');
      expect(AGENT_COLORS).toHaveProperty('orchestrator');
    });

    it('should use distinct colors for each agent', () => {
      const colorValues = Object.values(AGENT_COLORS);
      const uniqueColors = new Set(colorValues);
      expect(uniqueColors.size).toBe(colorValues.length);
    });

    it('should use expected color assignments', () => {
      expect(AGENT_COLORS.code).toBe('green');
      expect(AGENT_COLORS.debug).toBe('red');
      expect(AGENT_COLORS.plan).toBe('cyan');
      expect(AGENT_COLORS.explore).toBe('yellow');
      expect(AGENT_COLORS.orchestrator).toBe('magenta');
    });
  });

  describe('DEFAULT_AGENT_COLOR', () => {
    it('should be blue', () => {
      expect(DEFAULT_AGENT_COLOR).toBe('blue');
    });
  });

  describe('getAgentColor', () => {
    it('should return the mapped color for known agents', () => {
      expect(getAgentColor('code')).toBe('green');
      expect(getAgentColor('debug')).toBe('red');
      expect(getAgentColor('plan')).toBe('cyan');
      expect(getAgentColor('explore')).toBe('yellow');
      expect(getAgentColor('orchestrator')).toBe('magenta');
    });

    it('should return DEFAULT_AGENT_COLOR for unknown agents', () => {
      expect(getAgentColor('unknown')).toBe('blue');
      expect(getAgentColor('')).toBe('blue');
      expect(getAgentColor('custom-agent')).toBe('blue');
    });
  });

  describe('formatAgentPrompt', () => {
    it('should include agent name in the prompt', () => {
      const prompt = formatAgentPrompt('code');
      expect(prompt).toContain('code');
      expect(prompt).toContain('❯');
    });

    it('should end with a space', () => {
      expect(formatAgentPrompt('code')).toMatch(/ $/);
      expect(formatAgentPrompt('debug')).toMatch(/ $/);
    });

    it('should default to code agent when undefined', () => {
      const prompt = formatAgentPrompt(undefined);
      expect(prompt).toContain('code');
    });

    it('should use agent-specific ANSI color codes', () => {
      const greenPrompt = formatAgentPrompt('code');
      expect(greenPrompt).toContain(colors.green);
      expect(greenPrompt).toContain(colors.reset);

      const redPrompt = formatAgentPrompt('debug');
      expect(redPrompt).toContain(colors.red);
    });

    it('should produce different prompts for different agents', () => {
      const codePrompt = formatAgentPrompt('code');
      const debugPrompt = formatAgentPrompt('debug');
      expect(codePrompt).not.toBe(debugPrompt);
    });
  });

  describe('formatAgentBadge', () => {
    it('should wrap agent name in brackets', () => {
      const badge = formatAgentBadge('code');
      expect(badge).toContain('[code]');
    });

    it('should include the agent color', () => {
      const badge = formatAgentBadge('debug');
      expect(badge).toContain(colors.red);
      expect(badge).toContain(colors.reset);
    });

    it('should use default color for unknown agents', () => {
      const badge = formatAgentBadge('custom');
      expect(badge).toContain(colors.blue);
    });
  });

  describe('formatAgentSwitchNotice', () => {
    it('should include a colored dot and new agent name', () => {
      const notice = formatAgentSwitchNotice(undefined, 'debug');
      expect(notice).toContain('●');
      expect(notice).toContain('debug');
      expect(notice).toContain('Switched to');
    });

    it('should include the new agent color', () => {
      const notice = formatAgentSwitchNotice(undefined, 'debug');
      expect(notice).toContain(colors.red);
    });

    it('should include "from X" when switching between different agents', () => {
      const notice = formatAgentSwitchNotice('code', 'debug');
      expect(notice).toContain('from code');
      expect(notice).toContain(colors.dim);
    });

    it('should not include "from" when fromAgent matches toAgent', () => {
      const notice = formatAgentSwitchNotice('code', 'code');
      expect(notice).not.toContain('from');
    });

    it('should not include "from" when fromAgent is undefined', () => {
      const notice = formatAgentSwitchNotice(undefined, 'plan');
      expect(notice).not.toContain('from');
    });
  });
});

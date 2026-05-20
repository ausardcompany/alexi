import { describe, it, expect, beforeEach } from 'vitest';
import {
  EnhancedToolRegistry,
  registerTool,
  getToolRegistry,
  setToolRegistry,
} from './registry.js';

describe('Tool Registry', () => {
  beforeEach(() => {
    // Reset global registry before each test
    setToolRegistry(new EnhancedToolRegistry());
  });

  describe('registerFromDefinition', () => {
    it('should handle tool definition with missing args', () => {
      const toolDef = {
        name: 'test-tool',
        description: 'A test tool',
        // args intentionally omitted
      };

      expect(() => registerTool(toolDef as any)).not.toThrow();

      const registry = getToolRegistry();
      const registeredTool = registry.get('test-tool');
      expect(registeredTool).toBeDefined();
      expect((registeredTool as any).args).toEqual({});
    });

    it('should handle tool definition with null args', () => {
      const toolDef = {
        name: 'null-args-tool',
        description: 'A tool with null args',
        args: null,
      };

      expect(() => registerTool(toolDef as any)).not.toThrow();

      const registry = getToolRegistry();
      const registeredTool = registry.get('null-args-tool');
      expect((registeredTool as any).args).toEqual({});
    });

    it('should handle tool definition with undefined args', () => {
      const toolDef = {
        name: 'undefined-args-tool',
        description: 'A tool with undefined args',
        args: undefined,
      };

      expect(() => registerTool(toolDef)).not.toThrow();

      const registry = getToolRegistry();
      const registeredTool = registry.get('undefined-args-tool');
      expect(registeredTool).toBeDefined();
    });

    it('should handle tool definition with invalid args type', () => {
      const toolDef = {
        name: 'invalid-args-tool',
        description: 'A tool with invalid args',
        args: 'not an object',
      };

      expect(() => registerTool(toolDef as any)).not.toThrow();

      const registry = getToolRegistry();
      const registeredTool = registry.get('invalid-args-tool');
      expect((registeredTool as any).args).toEqual({});
    });

    it('should handle tool definition with valid args', () => {
      const toolDef = {
        name: 'valid-args-tool',
        description: 'A tool with valid args',
        args: {
          param1: { type: 'string', description: 'First parameter' },
          param2: { type: 'number', description: 'Second parameter' },
        },
      };

      expect(() => registerTool(toolDef)).not.toThrow();

      const registry = getToolRegistry();
      const registeredTool = registry.get('valid-args-tool');
      expect((registeredTool as any).args).toEqual(toolDef.args);
    });

    it('should use parameters field as fallback for args', () => {
      const toolDef = {
        name: 'parameters-tool',
        description: 'A tool with parameters instead of args',
        parameters: {
          param1: { type: 'string' },
        },
      };

      expect(() => registerTool(toolDef)).not.toThrow();

      const registry = getToolRegistry();
      const registeredTool = registry.get('parameters-tool');
      expect((registeredTool as any).args).toEqual(toolDef.parameters);
    });
  });

  describe('EnhancedToolRegistry', () => {
    it('should register and retrieve tools', () => {
      const registry = new EnhancedToolRegistry();
      const tool = {
        name: 'test-tool',
        description: 'Test',
        parameters: {},
        toFunctionSchema: () => ({ name: 'test-tool', description: 'Test', parameters: {} }),
        execute: async () => ({ success: true }),
        executeUnsafe: async () => ({ success: true }),
      };

      registry.register(tool as any);
      const retrieved = registry.get('test-tool');
      expect(retrieved).toBe(tool);
    });

    it('should list all registered tools', () => {
      const registry = new EnhancedToolRegistry();
      const tool1 = { name: 'tool1', description: 'Tool 1' };
      const tool2 = { name: 'tool2', description: 'Tool 2' };

      registry.registerFromDefinition(tool1);
      registry.registerFromDefinition(tool2);

      const tools = registry.list();
      expect(tools).toHaveLength(2);
      expect(tools.map((t) => t.name)).toContain('tool1');
      expect(tools.map((t) => t.name)).toContain('tool2');
    });

    it('should clear all tools', () => {
      const registry = new EnhancedToolRegistry();
      registry.registerFromDefinition({ name: 'tool1', description: 'Tool 1' });

      expect(registry.list()).toHaveLength(1);

      registry.clear();
      expect(registry.list()).toHaveLength(0);
    });
  });
});

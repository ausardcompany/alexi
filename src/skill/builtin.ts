/**
 * Built-in Skills
 * Provides pre-packaged skills that are always available
 */

import type { Skill } from './index.js';

// Placeholder for alexi config content - would be loaded from a markdown file
const alexiConfigContent = `# Alexi Configuration Reference

## Overview
Alexi can be configured through various configuration files and environment variables.

## Configuration Files
- \`alexi.json\` or \`alexi.jsonc\` - Project-level configuration
- \`~/.alexi/config.json\` - Global user configuration

## Available Settings

### Model Configuration
- \`defaultModel\`: Default AI model to use
- \`temperature\`: Model temperature (0-2)
- \`maxTokens\`: Maximum tokens per request

### Provider Settings
- \`provider\`: AI provider (sap, openai, anthropic, etc.)
- \`endpoint\`: Custom API endpoint
- \`apiKey\`: API authentication key

### Agent Configuration
- \`defaultAgent\`: Default agent mode (code, debug, plan, explore)
- \`customAgents\`: Custom agent definitions

### Permission Settings
- \`permissions\`: Permission rules for file and command access
- \`allowExternalDirectories\`: Allow access outside project root

### Tool Configuration
- \`enabledTools\`: List of enabled tools
- \`disabledTools\`: List of disabled tools
- \`toolSettings\`: Per-tool configuration

## Environment Variables
- \`ALEXI_API_KEY\`: API key for AI provider
- \`ALEXI_MODEL\`: Override default model
- \`ALEXI_PROVIDER\`: Override default provider
`;

export namespace BuiltinSkills {
  export const BUILTIN_LOCATION = '__builtin__' as const;

  export const ALEXI_CONFIG: Skill = {
    id: 'alexi-config',
    name: 'alexi-config',
    description:
      'Reference for Alexi configuration options and settings. Use when users ask about configuring Alexi, customizing behavior, or understanding available settings.',
    prompt: alexiConfigContent,
    source: 'builtin',
    sourcePath: BUILTIN_LOCATION,
  };

  export const ALL = [ALEXI_CONFIG] as const;

  export function get(name: string): Skill | undefined {
    return ALL.find((s) => s.name === name);
  }

  export function isBuiltin(location: string): boolean {
    return location === BUILTIN_LOCATION;
  }

  export function list(): Skill[] {
    return [...ALL];
  }
}

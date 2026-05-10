/**
 * Built-in Customize Skill
 * Provides guidance on customizing Alexi/opencode behavior and configuration
 * From PR #26617
 */

import { type SkillDefinition } from './index.js';
import { Flag } from '../flag/index.js';

export const customizeAlexiSkill: SkillDefinition = {
  id: 'alexi-meta',
  name: 'Customize Alexi',
  description: 'Guidance on customizing Alexi behavior and configuration',
  category: 'meta',
  tags: ['configuration', 'customization', 'setup'],
  aliases: ['customize', 'config-help'],
  prompt: `# Customizing Alexi

## Configuration Files

Alexi can be customized through configuration files:

- \`.alexi/config.json\` - Project-level configuration
- \`~/.config/alexi/config.json\` - User-level configuration (global)

## Available Settings

### Agent Configuration
Configure custom agents with specific permissions and behaviors.

Example:
\`\`\`json
{
  "agents": {
    "my-agent": {
      "name": "My Custom Agent",
      "description": "Specialized for my workflow",
      "systemPrompt": "You are a helpful assistant...",
      "tools": ["read", "write", "grep"],
      "temperature": 0.7
    }
  }
}
\`\`\`

### Model Selection
Set preferred models for different tasks:

\`\`\`json
{
  "models": {
    "default": "gpt-4-turbo",
    "fast": "gpt-3.5-turbo",
    "reasoning": "o1-preview"
  }
}
\`\`\`

### Permission Rules
Define allow/deny rules for file access and tool usage:

\`\`\`json
{
  "permissions": [
    {
      "id": "deny-secrets",
      "paths": ["**/.env", "**/secrets.*"],
      "decision": "deny"
    },
    {
      "id": "allow-src",
      "paths": ["src/**"],
      "actions": ["read", "write"],
      "decision": "allow"
    }
  ]
}
\`\`\`

### MCP Servers
Configure Model Context Protocol servers for extended capabilities:

\`\`\`json
{
  "mcp": {
    "servers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]
      }
    }
  }
}
\`\`\`

### Routing Configuration
Configure model routing based on prompt patterns:

\`\`\`json
{
  "routing": {
    "rules": [
      {
        "pattern": "translate.*to.*",
        "model": "gpt-4-turbo",
        "priority": 100
      }
    ]
  }
}
\`\`\`

## Best Practices

1. **Start with project-level config** for team consistency
2. **Use user-level config** for personal preferences
3. **Test permission changes carefully** to avoid blocking legitimate operations
4. **Document custom agents** for team members
5. **Version control** project config files (but exclude secrets!)

## Custom Agents

Create custom agents in \`.alexi/agents/\` directory:

\`\`\`yaml
# .alexi/agents/reviewer.yaml
id: reviewer
name: Code Reviewer
description: Specialized for code reviews
systemPrompt: |
  You are an expert code reviewer. Focus on:
  - Code quality and best practices
  - Security vulnerabilities
  - Performance issues
  - Maintainability
tools:
  - read
  - grep
  - definitions
temperature: 0.3
\`\`\`

## Skills

Create custom skills in \`.alexi/skills/\` directory:

\`\`\`markdown
---
id: my-skill
name: My Custom Skill
description: Custom behavior for specific tasks
category: custom
---

# Skill Prompt

Your custom instructions here...
\`\`\`

## Environment Variables

Key environment variables:

- \`ALEXI_CONFIG_DIR\` - Override config directory location
- \`ALEXI_LOG_LEVEL\` - Set logging level (debug, info, warn, error)
- \`ALEXI_NO_COLOR\` - Disable colored output
- \`OPENCODE_EXPERIMENTAL_*\` - Enable experimental features

## Getting Help

- Check documentation: \`alexi help\`
- List agents: \`alexi agent list\`
- List skills: \`alexi skill list\`
- View config: \`alexi config show\`
`,
};

/**
 * Check if the customize skill should be enabled
 */
export function isCustomizeSkillEnabled(): boolean {
  return Flag.OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL;
}

/**
 * Get the customize skill if enabled
 */
export function getCustomizeSkill(): SkillDefinition | null {
  return isCustomizeSkillEnabled() ? customizeAlexiSkill : null;
}

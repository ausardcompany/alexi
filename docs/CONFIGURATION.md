# Configuration

This document describes all configuration options for Alexi, including environment variables, routing configuration, session management, and TUI settings.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Routing Configuration](#routing-configuration)
- [Session Configuration](#session-configuration)
- [TUI Configuration](#tui-configuration)
- [Permission Configuration](#permission-configuration)
- [MCP Configuration](#mcp-configuration)

## Environment Variables

### Required Variables

#### AICORE_SERVICE_KEY

SAP AI Core service key in JSON format containing authentication credentials.

```bash
AICORE_SERVICE_KEY='{
  "clientid": "your-client-id",
  "clientsecret": "your-client-secret",
  "url": "https://your-auth-url",
  "serviceurls": {
    "AI_API_URL": "https://api.ai.your-region.hana.ondemand.com"
  }
}'
```

### Optional Variables

#### AICORE_RESOURCE_GROUP

SAP AI Core resource group identifier. Defaults to "default" if not specified.

```bash
AICORE_RESOURCE_GROUP=production
```

#### AICORE_MODEL

Default model to use when no model is specified in commands.

```bash
AICORE_MODEL=anthropic--claude-4.5-sonnet
```

#### LOG_LEVEL

Set the logging verbosity level.

```bash
LOG_LEVEL=debug  # Options: debug, info, warn, error
```

#### ALEXI_MOCK_PROVIDER

Enable mock provider for testing without SAP AI Core.

```bash
ALEXI_MOCK_PROVIDER=true
```

## Routing Configuration

Routing rules are defined in `routing-config.json` or `~/.alexi/routing-config.json`.

### Configuration File Structure

```json
{
  "rules": [
    {
      "name": "reasoning-for-math",
      "priority": 80,
      "condition": {
        "contains": ["calculate", "math", "equation"]
      },
      "model": "gpt-4.1"
    },
    {
      "name": "code-tasks",
      "priority": 100,
      "condition": {
        "contains": ["code", "implement", "fix", "refactor"]
      },
      "model": "anthropic--claude-4.5-sonnet"
    }
  ],
  "default": {
    "model": "gpt-4o-mini"
  }
}
```

### Routing Rule Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Human-readable rule name |
| `priority` | number | Rule priority (higher = evaluated later) |
| `condition` | object | Matching criteria (contains, regex, etc.) |
| `model` | string | Model to use when rule matches |

### Condition Types

```json
{
  "contains": ["keyword1", "keyword2"],
  "regex": "^(implement|create|build)",
  "complexity": "complex",
  "taskType": "deep-reasoning"
}
```

### Example Configurations

#### Cost Optimization

Prefer cheaper models for simple tasks:

```json
{
  "rules": [
    {
      "name": "complex-reasoning",
      "priority": 100,
      "condition": { "complexity": "complex" },
      "model": "anthropic--claude-4.5-sonnet"
    }
  ],
  "default": {
    "model": "gpt-4o-mini"
  }
}
```

#### Quality Optimization

Use premium models for all tasks:

```json
{
  "rules": [],
  "default": {
    "model": "anthropic--claude-4.5-opus"
  }
}
```

#### Specific Model Preferences

Route different task types to specialized models:

```json
{
  "rules": [
    {
      "name": "code-generation",
      "priority": 90,
      "condition": { "contains": ["code", "implement", "function"] },
      "model": "anthropic--claude-4.5-sonnet"
    },
    {
      "name": "data-analysis",
      "priority": 90,
      "condition": { "contains": ["analyze", "data", "statistics"] },
      "model": "gpt-4o"
    },
    {
      "name": "creative-writing",
      "priority": 90,
      "condition": { "contains": ["write", "story", "creative"] },
      "model": "anthropic--claude-4.5-opus"
    }
  ],
  "default": {
    "model": "gpt-4o-mini"
  }
}
```

## Session Configuration

Sessions are stored in `~/.alexi/sessions/` as JSON files.

### Session Storage Location

```bash
~/.alexi/
├── sessions/           # Session history
│   ├── session-123.json
│   └── session-456.json
├── routing-config.json # Custom routing rules
└── mcp-servers.json   # MCP server configuration
```

### Session File Format

```json
{
  "id": "session-1234567890",
  "messages": [
    {
      "role": "user",
      "content": "Hello, write a function to sort an array"
    },
    {
      "role": "assistant",
      "content": "Here's a sorting function...",
      "model": "anthropic--claude-4.5-sonnet"
    }
  ],
  "metadata": {
    "createdAt": "2026-03-16T10:30:00Z",
    "updatedAt": "2026-03-16T10:35:00Z",
    "tokenCount": 1234,
    "totalCost": 0.05,
    "currency": "USD"
  }
}
```

### Session Management Commands

```bash
# List all sessions
alexi sessions

# Export session to markdown
alexi session-export -s session-123 -o output.md

# Delete a session
alexi session-delete -s session-123

# Continue a session
alexi chat -m "Tell me more" --session session-123
alexi interactive --session session-123
```

## TUI Configuration

The Terminal User Interface (TUI) can be customized through keyboard shortcuts and theme settings.

### Keyboard Shortcuts

All keyboard shortcuts are defined in `src/cli/tui/hooks/useKeyboard.ts`.

| Shortcut | Action | Configurable |
|----------|--------|--------------|
| `Tab` | Cycle agents forward | No |
| `Shift+Tab` | Cycle agents backward | No |
| `Ctrl+X` | Activate leader mode | No |
| `Ctrl+K` | Open command palette | No |
| `Ctrl+L` | Clear messages | No |
| `Ctrl+V` | Paste image from clipboard | No |
| `Ctrl+C` | Abort streaming / Exit | No |

### Leader Mode Keybinds

After pressing `Ctrl+X`:

| Key | Action |
|-----|--------|
| `n` | New session |
| `m` | Open model picker |
| `a` | Open agent selector |
| `s` | Open session list |

### Theme Configuration

Themes are defined in `src/cli/tui/theme/`.

#### Dark Theme (Default)

```typescript
{
  name: 'dark',
  colors: {
    primary: 'cyan',
    secondary: 'blue',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    border: 'gray',
    text: 'white',
    dimText: 'gray',
    agents: {
      code: 'cyan',
      debug: 'yellow',
      plan: 'blue',
      explore: 'magenta',
      orchestrator: 'green',
    },
  },
  borderStyle: 'single',
}
```

#### Light Theme

```typescript
{
  name: 'light',
  colors: {
    primary: 'blue',
    secondary: 'cyan',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    border: 'gray',
    text: 'black',
    dimText: 'gray',
    agents: {
      code: 'blue',
      debug: 'yellow',
      plan: 'cyan',
      explore: 'magenta',
      orchestrator: 'green',
    },
  },
  borderStyle: 'single',
}
```

### Switching Themes

```bash
# In TUI, use slash command
/theme dark
/theme light
```

### Clipboard Configuration

Clipboard image pasting requires platform-specific tools:

| Platform | Preferred Tool | Fallback | Installation |
|----------|---------------|----------|--------------|
| macOS | pngpaste | osascript | `brew install pngpaste` |
| Linux (X11) | xclip | - | `apt install xclip` |
| Linux (Wayland) | wl-paste | - | `apt install wl-clipboard` |
| Windows | PowerShell | - | Pre-installed |

The system automatically detects and uses available tools. No configuration required.

## Permission Configuration

Permission rules control file access and command execution for agentic mode.

### Permission Rule Structure

```typescript
interface PermissionRule {
  id?: string;
  name?: string;
  description?: string;
  tools?: string[];           // Tool name patterns
  actions?: PermissionAction[]; // 'read', 'write', 'execute', 'network'
  paths?: string[];           // File path patterns
  commands?: string[];        // Command patterns
  hosts?: string[];           // Network host patterns
  decision: 'allow' | 'deny' | 'ask';
  priority: number;           // Higher = evaluated later
  externalPaths?: boolean;    // Apply to external paths
  homeExpansion?: boolean;    // Expand ~/ to home directory
}
```

### Default Permission Rules

```typescript
// Deny access to secrets (priority 100)
{
  id: 'deny-secrets',
  name: 'Deny Secrets',
  description: 'Prevent access to sensitive files',
  paths: ['**/.env', '**/.env.*', '**/secrets/**', '**/*.key', '**/*.pem'],
  decision: 'deny',
  priority: 100,
}

// Ask before writing (priority 10)
{
  id: 'ask-write',
  name: 'Ask Before Write',
  description: 'Prompt user before writing files',
  actions: ['write'],
  decision: 'ask',
  priority: 10,
}
```

### Agentic Mode Permission Rules

In agentic mode, high-priority allow rules are added automatically:

```typescript
// Allow writes in workdir (priority 200)
{
  id: 'agentic-allow-write',
  name: 'Agentic Write Allow',
  description: 'Allow writing files in workdir for agentic mode',
  actions: ['write'],
  paths: [`${workdir}/**`, workdir],
  decision: 'allow',
  priority: 200,
}

// Allow execute operations (priority 200)
{
  id: 'agentic-allow-execute',
  name: 'Agentic Execute Allow',
  description: 'Allow executing commands for agentic mode',
  actions: ['execute'],
  decision: 'allow',
  priority: 200,
}
```

These rules override default ask prompts, enabling autonomous file operations.

## MCP Configuration

Model Context Protocol (MCP) servers are configured in `~/.alexi/mcp-servers.json`.

### MCP Server Configuration Format

```json
{
  "servers": [
    {
      "name": "filesystem",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"],
      "enabled": true
    },
    {
      "name": "github",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token"
      },
      "enabled": true
    }
  ]
}
```

### MCP Server Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Unique server identifier |
| `command` | string | Executable command |
| `args` | string[] | Command arguments |
| `env` | object | Environment variables |
| `enabled` | boolean | Whether server is active |

### Managing MCP Servers

```bash
# In TUI, use slash command
/mcp

# This opens the MCP Manager dialog where you can:
# - View all configured servers
# - Enable/disable servers
# - Add new servers
# - Remove servers
```

## Configuration File Locations

All configuration files are stored in `~/.alexi/`:

```bash
~/.alexi/
├── routing-config.json    # Routing rules
├── mcp-servers.json       # MCP server configuration
├── sessions/              # Session history
│   └── *.json
└── logs/                  # Application logs (if enabled)
    └── *.log
```

### Configuration Priority

1. Command-line flags (highest priority)
2. Environment variables
3. Configuration files in `~/.alexi/`
4. Default values (lowest priority)

### Example: Model Selection Priority

```bash
# Priority 1: Command-line flag
alexi chat -m "Hello" --model gpt-4o

# Priority 2: Environment variable
export AICORE_MODEL=anthropic--claude-4.5-sonnet
alexi chat -m "Hello"

# Priority 3: Auto-routing with routing-config.json
alexi chat -m "Hello" --auto-route

# Priority 4: Default model (from provider configuration)
alexi chat -m "Hello"
```

## Configuration Best Practices

1. **Use Environment Variables for Secrets**: Never commit `.env` files to version control
2. **Customize Routing Rules**: Tailor routing to your specific use cases and cost requirements
3. **Enable Agentic Mode Carefully**: Ensure permission rules are appropriate for autonomous operations
4. **Test Configuration Changes**: Use `alexi explain` to verify routing decisions
5. **Back Up Sessions**: Export important sessions to markdown for archival
6. **Monitor Costs**: Review session metadata to track token usage and costs
7. **Use MCP Servers**: Extend functionality with Model Context Protocol integrations

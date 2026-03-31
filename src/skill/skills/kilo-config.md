# Alexi Configuration Reference

This document provides a reference for Alexi configuration options.

## Configuration Files

Alexi supports the following configuration files:
- `alexi.json` or `alexi.jsonc` - Main configuration file
- `kilo.json` or `kilo.jsonc` - Legacy compatibility
- `opencode.json` or `opencode.jsonc` - Legacy compatibility

## Configuration Options

### Model Configuration

```json
{
  "model": "gpt-4",
  "temperature": 0.7,
  "maxTokens": 4096
}
```

### Agent Configuration

Agents can be configured with:
- `id` - Unique identifier
- `name` - Display name
- `description` - Agent description
- `mode` - Agent mode (primary, subagent, all)
- `systemPrompt` - Custom system prompt
- `tools` - Available tools
- `disabledTools` - Disabled tools
- `preferredModel` - Preferred model
- `temperature` - Temperature setting
- `aliases` - Command aliases

### Tool Configuration

Tools can be enabled/disabled per agent or globally.

### Permission Configuration

Configure permission rules for file access and command execution.

## Environment Variables

- `SAP_ORCHESTRATION_URL` - SAP AI Core orchestration endpoint
- `SAP_ORCHESTRATION_CLIENT_ID` - Client ID for authentication
- `SAP_ORCHESTRATION_CLIENT_SECRET` - Client secret for authentication
- `SAP_ORCHESTRATION_DEPLOYMENT_ID` - Deployment ID

For more information, see the main documentation.

# SAP Bot Orchestrator

Intelligent LLM orchestrator for SAP AI Core with automatic model routing, multi-turn conversations, and rule-based configuration.

## Features

✅ **Multi-Provider Support**
- OpenAI-compatible models via proxy (GPT-4o, GPT-4.1, GPT-4o-mini)
- Claude models via native Bedrock Converse API (Claude 4 Sonnet, Claude 3.5 Sonnet, Claude 3 Haiku)
- Extensible architecture for additional providers

✅ **Intelligent Auto-Routing**
- Automatic model selection based on prompt complexity and task type
- Cost optimization with `--prefer-cheap` flag
- Rule-based routing from JSON configuration
- Routing explanation with confidence scores

✅ **Session Management**
- Multi-turn conversations with automatic context preservation
- Session persistence to disk
- Export sessions to markdown format
- Session listing and deletion

✅ **JSON-Based Configuration**
- Define model capabilities and cost tiers
- Create routing rules with priorities
- Keyword-based and complexity-based matching
- Hot-reloadable configuration

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file (see `.env.example`):
```bash
# Proxy configuration (for OpenAI-compatible models)
SAP_PROXY_BASE_URL=http://127.0.0.1:3001/v1
SAP_PROXY_API_KEY=your_secret_key
SAP_PROXY_MODEL=gpt-4o

# Native SAP AI Core (for Claude models)
AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}'
AICORE_RESOURCE_GROUP=your-resource-group-id
```

### 3. Build
```bash
npm run build
```

### 4. Run Commands
```bash
# Simple chat
node dist/cli/program.js chat -m "What is 2+2?"

# Auto-routing with cost optimization
node dist/cli/program.js chat -m "Write a function to reverse a string" --auto-route --prefer-cheap

# Continue a conversation
node dist/cli/program.js chat -m "Now make it recursive" --session <session-id> --auto-route

# Explain routing decision
node dist/cli/program.js explain -m "Prove that sqrt(2) is irrational"
```

## Commands

### `chat` - Send messages to LLMs
```bash
node dist/cli/program.js chat -m "your message" [options]

Options:
  -m, --message <text>    Message to send (required)
  --model <id>            Override model selection (e.g., gpt-4o, claude-4-sonnet)
  --auto-route            Enable automatic model routing
  --prefer-cheap          Prefer cheaper models when auto-routing
  --session <id>          Continue existing session
  --system <prompt>       System prompt for conversation
```

Examples:
```bash
# Use specific model
node dist/cli/program.js chat -m "Hello" --model gpt-4o-mini

# Auto-route with cost optimization
node dist/cli/program.js chat -m "What is AI?" --auto-route --prefer-cheap

# Continue conversation in session
node dist/cli/program.js chat -m "Tell me more" --session abc-123 --auto-route
```

### `explain` - Analyze routing decisions
```bash
node dist/cli/program.js explain -m "your message"
```

Shows:
- Prompt classification (type, complexity, reasoning requirements)
- Matched routing rules
- Model candidates with scores
- Selected model and confidence

Example output:
```
=== Prompt Analysis ===
Type: deep-reasoning
Complexity: complex
Requires Reasoning: true
Estimated Tokens: 19

=== Matched Rules ===
• reasoning-for-math (priority: 80): Use reasoning models for math problems

=== Model Candidates (by score) ===
✓ gpt-4.1              Score: 120 - expensive tier, strong at deep-reasoning, has reasoning
  claude-4-sonnet      Score: 120 - expensive tier, strong at deep-reasoning, has reasoning
  ...

=== Selected Model ===
Model: gpt-4.1
Reason: Task type: deep-reasoning, Complexity: complex, requires reasoning
Confidence: 100%
Rule Applied: reasoning-for-math
```

### `sessions` - List all saved sessions
```bash
node dist/cli/program.js sessions
```

### `session-export` - Export session to markdown
```bash
node dist/cli/program.js session-export -s <session-id> [-o output.md]
```

### `session-delete` - Delete a session
```bash
node dist/cli/program.js session-delete -s <session-id>
```

### `models` - List available models (proxy only)
```bash
node dist/cli/program.js models
```

## Routing Configuration

Create a `routing-config.json` in the project root (see `routing-config.example.json`):

```json
{
  "models": [
    {
      "id": "gpt-4o-mini",
      "type": "openai",
      "costTier": "cheap",
      "strengths": ["simple-qa", "classification", "extraction"],
      "maxTokens": 16000,
      "reasoning": false,
      "enabled": true
    }
  ],
  "rules": [
    {
      "name": "force-claude-for-long-context",
      "description": "Use Claude for prompts longer than 10000 characters",
      "condition": {
        "minLength": 10000
      },
      "modelId": "claude-3.5-sonnet",
      "priority": 100
    },
    {
      "name": "reasoning-for-math",
      "description": "Use reasoning models for math problems",
      "condition": {
        "keywords": ["prove", "derive", "equation", "theorem"]
      },
      "requiresReasoning": true,
      "priority": 80
    }
  ],
  "preferences": {
    "defaultCostTier": "medium",
    "preferCheapWhenPossible": false,
    "fallbackModel": "gpt-4o"
  }
}
```

### Rule Conditions
- `minLength` / `maxLength`: Character count constraints
- `taskTypes`: Match specific task classifications (e.g., `["simple-qa", "coding"]`)
- `maxComplexity`: Maximum allowed complexity (`"simple"`, `"medium"`, `"complex"`)
- `keywords`: List of keywords to match in prompt (case-insensitive)

## Architecture

### Provider Resolution
The orchestrator automatically selects the appropriate provider based on model ID:
- **GPT models** → OpenAI-compatible proxy (`/v1/chat/completions`)
- **Claude models** → Native Bedrock Converse API (`/converse`)
- **Anthropic models** → Anthropic Messages API (`/v1/messages`)

### Routing Logic
1. Check for forced model via `--model` flag
2. If `--auto-route` enabled:
   - Classify prompt (task type, complexity, reasoning needs)
   - Match against routing rules (highest priority wins)
   - Score models based on capabilities and cost
   - Select best model with confidence score
3. Otherwise use default model from environment

### Session Management
- Sessions stored in `~/.sap-bot-orchestrator/sessions/`
- Auto-generated session IDs (UUID)
- Conversation history preserved with token tracking
- Automatic title generation from first message

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in dev mode with tsx
npm run dev -- chat -m "test"

# Watch mode for development
npm run dev:watch
```

## Testing

Test different scenarios:

```bash
# Simple query (should use gpt-4o-mini)
node dist/cli/program.js explain -m "What is the capital of France?"

# Coding task (should use gpt-4o or claude-3.5-sonnet)
node dist/cli/program.js explain -m "Write a function to sort an array"

# Complex reasoning (should use gpt-4.1 or claude-4-sonnet)
node dist/cli/program.js explain -m "Prove the Pythagorean theorem step by step"

# Long context (should use Claude if rule enabled)
node dist/cli/program.js explain -m "$(cat very_long_document.txt)"
```

## Roadmap

- [ ] Streaming support for long responses
- [ ] Cost tracking and budget limits
- [ ] Token usage analytics
- [ ] Interactive CLI mode (REPL)
- [ ] Channel integrations (Telegram, Slack, WebChat)
- [ ] Function/tool calling support
- [ ] Caching layer for repeated queries
- [ ] A/B testing for routing strategies
- [ ] Performance metrics and logging

## License

MIT

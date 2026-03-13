# Alexi

Intelligent LLM orchestrator for SAP AI Core with automatic model routing, multi-turn conversations, and rule-based configuration.

## Features

✅ **Multi-Provider Support**
- OpenAI-compatible models via proxy (GPT-4o, GPT-4.1, GPT-4o-mini)
- Claude models via native Bedrock Converse API (Claude 4.5 Opus, Claude 4.5 Sonnet, Claude 4.5 Haiku)
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

## Installation

### Via Homebrew (Recommended)

For macOS/Linux users with access to the ausardcompany private tap:

```bash
# Add the private tap (requires GitHub authentication)
brew tap ausardcompany/tap git@github.com:ausardcompany/homebrew-tap.git

# Install
brew install alexi

# Use the CLI
alexi chat -m "Hello!"
```

### From Source

```bash
git clone git@github.com:ausardcompany/alexi.git
cd alexi
npm install
npm run build
```

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
alexi chat -m "What is 2+2?"

# Auto-routing with cost optimization
alexi chat -m "Write a function to reverse a string" --auto-route --prefer-cheap

# Continue a conversation
alexi chat -m "Now make it recursive" --session <session-id> --auto-route

# Explain routing decision
alexi explain -m "Prove that sqrt(2) is irrational"
```

## Available Models

The following models are available (configured in `routing-config.json`):

| Model ID | Type | Cost Tier | Reasoning | Max Tokens | Strengths |
|----------|------|-----------|-----------|------------|-----------|
| `gpt-4o-mini` | OpenAI | cheap | ❌ | 16,000 | simple-qa, classification, extraction, summarization |
| `gpt-4o` | OpenAI | medium | ❌ | 128,000 | coding, analysis, creative-writing, complex-qa, vision |
| `gpt-4.1` | OpenAI | expensive | ✅ | 128,000 | deep-reasoning, complex-math, research, advanced-coding |
| `anthropic--claude-4.5-haiku` | Claude | cheap | ❌ | 200,000 | simple-qa, classification, extraction, summarization |
| `anthropic--claude-4.5-sonnet` | Claude | medium | ❌ | 200,000 | coding, analysis, long-context, technical-writing |
| `anthropic--claude-4.5-opus` | Claude | expensive | ✅ | 200,000 | deep-reasoning, complex-analysis, long-context, research |

## Commands

### `chat` - Send messages to LLMs
```bash
alexi chat -m "your message" [options]

Options:
  -m, --message <text>    Message to send (required)
  --model <id>            Override model selection (e.g., gpt-4o, anthropic--claude-4.5-sonnet)
  --auto-route            Enable automatic model routing
  --prefer-cheap          Prefer cheaper models when auto-routing
  --session <id>          Continue existing session
  --system <prompt>       System prompt for conversation
```

Examples:
```bash
# Use specific model
alexi chat -m "Hello" --model gpt-4o-mini

# Auto-route with cost optimization
alexi chat -m "What is AI?" --auto-route --prefer-cheap

# Continue conversation in session
alexi chat -m "Tell me more" --session abc-123 --auto-route
```

### `explain` - Analyze routing decisions
```bash
alexi explain -m "your message"
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
  anthropic--claude-4.5-opus      Score: 120 - expensive tier, strong at deep-reasoning, has reasoning
  ...

=== Selected Model ===
Model: gpt-4.1
Reason: Task type: deep-reasoning, Complexity: complex, requires reasoning
Confidence: 100%
Rule Applied: reasoning-for-math
```

### `agent` - Run an autonomous AI agent
```bash
alexi agent -m "your task" [options]

Options:
  -m, --message <text>    Task description for the agent (required)
  --model <id>            Model to use for the agent
  --max-iterations <n>    Maximum number of agent iterations (default: 10)
```

The agent command runs an autonomous AI that can plan and execute multi-step tasks.

### `stages` - Manage pipeline stages
```bash
alexi stages [options]

Options:
  --list                  List all available stages
  --run <stage>           Run a specific stage
  --config <file>         Path to stages configuration file
```

### `notes` - Manage conversation notes
```bash
alexi notes [options]

Options:
  --add <note>            Add a note to the current session
  --list                  List all notes
  --clear                 Clear all notes
  --session <id>          Specify session for notes
```

### `dod` - Definition of Done checker
```bash
alexi dod [options]

Options:
  --check                 Check if current task meets definition of done
  --set <criteria>        Set definition of done criteria
  --list                  List current DoD criteria
```

### `context` - Manage conversation context
```bash
alexi context [options]

Options:
  --add <file>            Add file content to context
  --clear                 Clear current context
  --show                  Display current context
  --limit <tokens>        Set context token limit
```

### `sessions` - List all saved sessions
```bash
alexi sessions
```

### `session-export` - Export session to markdown
```bash
alexi session-export -s <session-id> [-o output.md]
```

### `session-delete` - Delete a session
```bash
alexi session-delete -s <session-id>
```

### `models` - List available models (proxy only)
```bash
alexi models
```

## Interactive Mode Commands

Start interactive mode:
```bash
alexi interactive
# or
alexi -i
```

Once in interactive mode, the following commands are available:

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/model <id>` | Switch to a different model |
| `/models` | List available models |
| `/session` | Show current session info |
| `/sessions` | List all sessions |
| `/new` | Start a new session |
| `/load <id>` | Load an existing session |
| `/export [file]` | Export current session to markdown |
| `/clear` | Clear conversation history |
| `/system <prompt>` | Set system prompt |
| `/auto` | Toggle auto-routing |
| `/cheap` | Toggle prefer-cheap mode |
| `/context add <file>` | Add file to context |
| `/context clear` | Clear context |
| `/context show` | Show current context |
| `/notes add <note>` | Add a note |
| `/notes list` | List all notes |
| `/notes clear` | Clear all notes |
| `/quit` or `/exit` | Exit interactive mode |

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
      "modelId": "anthropic--claude-4.5-sonnet",
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
- Sessions stored in `~/.alexi/sessions/`
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

## Autonomous Self-Updating System

This bot **automatically updates itself** by syncing with three upstream AI coding assistant repositories:

| Repository | Description | Source |
|------------|-------------|--------|
| **kilocode** | Kilo AI coding assistant | [Kilo-Org/kilocode](https://github.com/Kilo-Org/kilocode) |
| **opencode** | OpenCode AI terminal assistant | [anomalyco/opencode](https://github.com/anomalyco/opencode) |
| **claude-code** | Anthropic's Claude Code CLI | [anthropics/claude-code](https://github.com/anthropics/claude-code) |

### How It Works

The bot runs **fully autonomously** via GitHub Actions:

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions (Daily 06:00 UTC)              │
├─────────────────────────────────────────────────────────────────┤
│  1. Fetch upstream repos (kilocode, opencode, claude-code)      │
│  2. Compare with last synced commits                            │
│  3. Generate diff reports                                       │
│  4. Kilo AI analyzes changes & updates code                     │
│  5. Create PR with changes                                      │
│  6. Auto-merge PR (squash)                                      │
│  7. Update sync state                                           │
└─────────────────────────────────────────────────────────────────┘
```

### Triggers

- **Automatic**: Daily at 06:00 UTC
- **Manual**: Via GitHub Actions UI with options:
  - `dry_run` - Only analyze, don't apply changes
  - `force_sync` - Sync even if no changes detected

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `AICORE_SERVICE_KEY` | Full SAP AI Core service key JSON |
| `AICORE_RESOURCE_GROUP` | SAP AI Core resource group ID |
| `GH_PAT` | Personal access token for PR creation and merge |

### Workflow Configuration

- **Workflow file**: [`.github/workflows/sync-upstream.yml`](.github/workflows/sync-upstream.yml)
- **Sync state**: [`.github/last-sync-commits.json`](.github/last-sync-commits.json)
- **Secrets setup**: See [`SYNC_SECRETS_SETUP.md`](SYNC_SECRETS_SETUP.md)

### Local Testing (Optional)

```bash
# Dry run - analyze without applying
./scripts/sync-upstream.sh --dry-run --verbose

# Full sync with auto-apply
./scripts/sync-upstream.sh --yes
```

### AI Analysis

Kilo AI analyzes upstream changes and:
1. Identifies relevant bug fixes and security updates
2. Extracts useful new features
3. Adapts code to maintain SAP AI Core compatibility
4. Creates detailed change summaries

## Testing

Test different scenarios:

```bash
# Simple query (should use gpt-4o-mini)
alexi explain -m "What is the capital of France?"

# Coding task (should use gpt-4o or anthropic--claude-4.5-sonnet)
alexi explain -m "Write a function to sort an array"

# Complex reasoning (should use gpt-4.1 or anthropic--claude-4.5-opus)
alexi explain -m "Prove the Pythagorean theorem step by step"

# Long context (should use Claude if rule enabled)
alexi explain -m "$(cat very_long_document.txt)"
```

## Roadmap

- [x] Streaming support for long responses
- [x] Interactive CLI mode (REPL)
- [x] Function/tool calling support with streaming
- [x] Content filtering (Azure, Llama Guard)
- [x] Data masking (DPI)
- [x] Document grounding
- [x] Translation support
- [x] Embeddings support
- [ ] Cost tracking and budget limits
- [ ] Token usage analytics
- [ ] Channel integrations (Telegram, Slack, WebChat)
- [ ] Caching layer for repeated queries
- [ ] A/B testing for routing strategies
- [ ] Performance metrics and logging

## License

MIT

# Quickstart: Alexi TUI Development

## Prerequisites

- Node.js >= 22.12.0
- npm (package manager)
- A terminal that supports ANSI colors (iTerm2, Terminal.app, kitty, etc.)

## 1. Install New Dependencies

```bash
# Runtime dependencies
npm install marked marked-terminal cli-highlight \
  ink-text-input ink-select-input ink-spinner \
  diff terminal-link

# Dev dependencies
npm install -D ink-testing-library
```

> **Note**: `ink` (v6.8.0) and `react` (v19.2.4) are already installed.

## 2. Bootstrap the TUI Directory

```bash
mkdir -p src/cli/tui/{components,dialogs,context,hooks,theme}
```

## 3. Minimal TUI Entry Point

Create `src/cli/tui/index.ts`:

```typescript
import { render } from 'ink';
import React from 'react';
import { App } from './App.js';

export async function startTui(options: {
  model: string;
  autoRoute: boolean;
  sessionId?: string;
}): Promise<void> {
  const { waitUntilExit } = render(
    React.createElement(App, options)
  );
  await waitUntilExit();
}
```

## 4. Minimal App Component

Create `src/cli/tui/App.tsx`:

```tsx
import React from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import TextInput from 'ink-text-input';

interface AppProps {
  model: string;
  autoRoute: boolean;
  sessionId?: string;
}

export function App({ model, autoRoute }: AppProps): React.ReactElement {
  const { exit } = useApp();
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<string[]>([]);

  useInput((_input, key) => {
    if (key.ctrl && _input === 'c') {
      exit();
    }
  });

  const handleSubmit = (text: string): void => {
    if (text.trim() === '/exit') {
      exit();
      return;
    }
    setMessages((prev) => [...prev, `You: ${text}`]);
    setInput('');
    // TODO: Wire to streamChat()
  };

  return (
    <Box flexDirection="column" height={process.stdout.rows}>
      {/* Header */}
      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={1}
        height={3}
      >
        <Text color="cyan" bold>
          {model}
        </Text>
        <Text> | </Text>
        <Text color="green">code</Text>
        <Text> | </Text>
        <Text dimColor>
          auto-route: {autoRoute ? 'on' : 'off'}
        </Text>
      </Box>

      {/* Message Area */}
      <Box flexDirection="column" flexGrow={1} overflow="hidden">
        {messages.map((msg, i) => (
          <Text key={i}>{msg}</Text>
        ))}
      </Box>

      {/* Input */}
      <Box>
        <Text color="green" bold>
          code ❯{' '}
        </Text>
        <TextInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
        />
      </Box>

      {/* Status Bar */}
      <Box>
        <Text dimColor>
          Tab: switch agent · Ctrl+X: leader · /help: commands
        </Text>
      </Box>
    </Box>
  );
}
```

## 5. Wire to CLI Command

In `src/cli/commands/interactive.ts`, replace the `startInteractive()` call:

```typescript
import { startTui } from '../tui/index.js';

// In the command action:
await startTui({
  model: options.model,
  autoRoute: options.autoRoute,
  sessionId: options.session,
});
```

## 6. Run the TUI

```bash
npm run dev -- interactive
# or
npm run dev
```

## 7. Run Tests

```bash
# Create a test file at tests/cli/tui/App.test.tsx
npm test -- tests/cli/tui/App.test.tsx
```

Example test:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import React from 'react';
import { App } from '../../../src/cli/tui/App.js';

describe('App', () => {
  it('renders header with model name', () => {
    const { lastFrame } = render(
      <App model="claude-sonnet" autoRoute={false} />
    );
    expect(lastFrame()).toContain('claude-sonnet');
  });

  it('renders input prompt', () => {
    const { lastFrame } = render(
      <App model="claude-sonnet" autoRoute={false} />
    );
    expect(lastFrame()).toContain('code ❯');
  });
});
```

## 8. Development Workflow

1. Make changes to components in `src/cli/tui/`
2. Run `npm run dev` to test interactively
3. Run `npm test` to verify tests pass
4. Run `npm run typecheck` to verify type safety
5. Run `npm run lint` to check code style

## 9. Next Steps After Bootstrap

1. Implement `ThemeContext` and wire colors through the theme system
2. Implement `useStreamChat` hook to connect to the existing `streamChat()` API
3. Implement `MessageBubble` with `MarkdownRenderer`
4. Implement `ToolCallBlock` with event bus subscription
5. Implement modal dialogs starting with `PermissionDialog`
6. Extract slash commands from the `handleCommand()` switch into a command registry
7. Implement `CommandPalette` with fuzzy search

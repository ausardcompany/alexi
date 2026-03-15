import React, { useState, useEffect, useRef } from 'react';
import { Box, useApp, useStdout } from 'ink';

import { ThemeProvider, useTheme } from './context/ThemeContext.js';
import { SessionProvider, useSession } from './context/SessionContext.js';
import { ChatProvider, useChat } from './context/ChatContext.js';
import { KeybindProvider, useKeybind } from './context/KeybindContext.js';
import { DialogProvider, useDialog } from './context/DialogContext.js';
import { useStreamChat } from './hooks/useStreamChat.js';
import { usePermission } from './hooks/usePermission.js';
import { useKeyboard } from './hooks/useKeyboard.js';

import { PermissionDialog } from './dialogs/PermissionDialog.js';
import type { PermissionDialogProps } from './dialogs/PermissionDialog.js';
import { ModelPicker } from './dialogs/ModelPicker.js';
import type { ModelPickerProps } from './dialogs/ModelPicker.js';
import { AgentSelector } from './dialogs/AgentSelector.js';
import type { AgentSelectorProps } from './dialogs/AgentSelector.js';
import { SessionList } from './dialogs/SessionList.js';
import type { SessionListProps } from './dialogs/SessionList.js';
import { McpManager } from './dialogs/McpManager.js';
import type { McpManagerProps } from './dialogs/McpManager.js';
import { CommandPalette } from './components/CommandPalette.js';
import type { CommandPaletteProps } from './components/CommandPalette.js';
import { useToolEvents } from './hooks/useToolEvents.js';
import type { AgentName } from './theme/types.js';

import { Header } from './components/Header.js';
import { StatusBar } from './components/StatusBar.js';
import { InputBox } from './components/InputBox.js';
import { MessageArea } from './components/MessageArea.js';
import type { MessageDisplay } from './components/MessageArea.js';

export interface AppProps {
  model: string;
  autoRoute: boolean;
  sessionId?: string;
  preferCheap?: boolean;
  systemPrompt?: string;
  gitManager?: unknown;
  repoMapManager?: unknown;
}

// ---------------------------------------------------------------------------
// DialogHost — renders the active dialog as an overlay
// ---------------------------------------------------------------------------

function DialogHost(): React.JSX.Element | null {
  const { isOpen, currentType, currentEntry } = useDialog();

  if (!isOpen || currentEntry === null) {
    return null;
  }

  switch (currentType) {
    case 'permission': {
      const props = currentEntry.props as unknown as PermissionDialogProps;
      return <PermissionDialog {...props} />;
    }
    case 'model-picker': {
      const props = currentEntry.props as unknown as ModelPickerProps;
      return <ModelPicker {...props} />;
    }
    case 'agent-selector': {
      const props = currentEntry.props as unknown as AgentSelectorProps;
      return <AgentSelector {...props} />;
    }
    case 'session-list': {
      const props = currentEntry.props as unknown as SessionListProps;
      return <SessionList {...props} />;
    }
    case 'mcp-manager': {
      const props = currentEntry.props as unknown as McpManagerProps;
      return <McpManager {...props} />;
    }
    case 'command-palette': {
      const props = currentEntry.props as unknown as CommandPaletteProps;
      return <CommandPalette {...props} />;
    }
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// AppLayout — inner layout rendered inside all providers
// ---------------------------------------------------------------------------

function AppLayout(): React.JSX.Element {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const { model, agent, sessionId, tokenCount, cost } = useSession();
  const { theme } = useTheme();
  const { state: keybindState } = useKeybind();
  const chat = useChat();
  const { sendMessage } = useStreamChat();
  useToolEvents();
  usePermission();

  const [messages, setMessages] = useState<MessageDisplay[]>([]);
  const wasStreamingRef = useRef(false);

  // Watch for streaming completion: isStreaming transitions false → create assistant message
  useEffect(() => {
    if (chat.isStreaming) {
      wasStreamingRef.current = true;
    } else if (wasStreamingRef.current && chat.streamingText) {
      wasStreamingRef.current = false;
      const assistantMessage: MessageDisplay = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: chat.streamingText,
        toolCalls: [],
        agent: chat.responseModel ?? undefined,
        model: chat.responseModel ?? undefined,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      chat.clearStreamText();
    } else {
      wasStreamingRef.current = false;
    }
  }, [chat.isStreaming, chat.streamingText, chat.responseModel, chat.clearStreamText]);

  useKeyboard({
    onExit: exit,
    onClear: () => setMessages([]),
    onNewSession: () => {
      /* no-op for now — session management TBD */
    },
    isInputActive: !keybindState.leaderActive,
  });

  const handleSubmit = (text: string): void => {
    if (text === '/exit') {
      exit();
      return;
    }
    const newMessage: MessageDisplay = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      toolCalls: [],
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    // Fire and forget — streaming updates flow through ChatContext
    void sendMessage(text);
  };

  const agentColor = theme.colors.agents[agent as AgentName] ?? theme.colors.primary;

  return (
    <Box flexDirection="column" height={stdout?.rows ?? 24}>
      {/* Header — height: 3 */}
      <Box height={3} borderStyle="round" borderColor={theme.colors.border} paddingX={1}>
        <Header
          model={model}
          agent={agent}
          agentColor={agentColor}
          sessionId={sessionId}
          tokenCount={tokenCount}
          autoRoute={false}
        />
      </Box>

      {/* Message Area — flexGrow: 1 */}
      <MessageArea
        messages={messages}
        streamingText={chat.streamingText}
        isStreaming={chat.isStreaming}
        activeToolCalls={chat.activeToolCalls}
        onToggleToolCall={chat.toggleToolCallExpansion}
      />

      {/* Input Box — minHeight: 1 */}
      <InputBox
        agent={agent}
        agentColor={agentColor}
        disabled={chat.isStreaming}
        onSubmit={handleSubmit}
        isFocused={!keybindState.leaderActive}
      />

      {/* Status Bar — height: 1 */}
      <StatusBar
        agent={agent}
        model={model}
        cost={{ totalCost: cost.totalCost, currency: cost.currency }}
        isStreaming={chat.isStreaming}
        leaderActive={keybindState.leaderActive}
      />

      {/* Dialog overlay — renders above/after content when open */}
      <DialogHost />
    </Box>
  );
}

// ---------------------------------------------------------------------------
// App — root with full provider tree
// ---------------------------------------------------------------------------

export function App({ model, autoRoute, sessionId }: AppProps): React.JSX.Element {
  const resolvedSessionId = sessionId ?? `session-${Date.now()}`;

  return (
    <ThemeProvider>
      <SessionProvider
        initialModel={model}
        initialAutoRoute={autoRoute}
        sessionId={resolvedSessionId}
      >
        <ChatProvider>
          <KeybindProvider>
            <DialogProvider>
              <AppLayout />
            </DialogProvider>
          </KeybindProvider>
        </ChatProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

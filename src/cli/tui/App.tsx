import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, useApp, useStdout } from 'ink';

import { ThemeProvider, useTheme } from './context/ThemeContext.js';
import { SessionProvider, useSession } from './context/SessionContext.js';
import { ChatProvider, useChat } from './context/ChatContext.js';
import { KeybindProvider, useKeybind } from './context/KeybindContext.js';
import { DialogProvider, useDialog } from './context/DialogContext.js';
import { AttachmentProvider, useAttachments } from './context/AttachmentContext.js';
import type { ImageAttachmentPreview } from './context/AttachmentContext.js';
import { useStreamChat } from './hooks/useStreamChat.js';
import { usePermission } from './hooks/usePermission.js';
import { useKeyboard } from './hooks/useKeyboard.js';
import { useCommands } from './hooks/useCommands.js';

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

// ---------------------------------------------------------------------------
// useTerminalSize — reactive terminal dimensions
// ---------------------------------------------------------------------------

function useTerminalSize(): { rows: number; columns: number } {
  const { stdout } = useStdout();
  const [size, setSize] = useState({
    rows: stdout?.rows ?? 24,
    columns: stdout?.columns ?? 80,
  });

  useEffect(() => {
    if (!stdout) {
      return;
    }

    const onResize = (): void => {
      setSize({ rows: stdout.rows, columns: stdout.columns });
    };

    stdout.on('resize', onResize);
    return () => {
      stdout.off('resize', onResize);
    };
  }, [stdout]);

  return size;
}

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
  const { rows } = useTerminalSize();
  const { model, agent, sessionId, tokenCount, cost } = useSession();
  const { theme } = useTheme();
  const { state: keybindState } = useKeybind();
  const { isOpen: dialogIsOpen } = useDialog();
  const chat = useChat();
  const { sendMessage } = useStreamChat();
  const { pending: pendingAttachments } = useAttachments();
  const { handleCommand, commands } = useCommands();
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
    commands,
  });

  const handleSubmit = useCallback(
    (text: string): void => {
      // Intercept slash commands — if handled, do NOT send to LLM
      if (text.startsWith('/')) {
        void handleCommand(text);
        return;
      }

      // Snapshot image previews before sendMessage consumes them
      const imagePreviews: ImageAttachmentPreview[] | undefined =
        pendingAttachments.length > 0
          ? pendingAttachments.map((att) => ({
              id: att.id,
              format: att.format,
              sizeBytes: att.sizeBytes,
              source: att.source,
              filePath: att.filePath,
            }))
          : undefined;

      const newMessage: MessageDisplay = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: text,
        toolCalls: [],
        timestamp: Date.now(),
        images: imagePreviews,
      };
      setMessages((prev) => [...prev, newMessage]);
      // Fire and forget — streaming updates flow through ChatContext
      void sendMessage(text);
    },
    [handleCommand, pendingAttachments, sendMessage]
  );

  const agentColor = theme.colors.agents[agent as AgentName] ?? theme.colors.primary;

  return (
    <Box flexDirection="column" height={rows}>
      {/* Header — height: 3 */}
      <Box
        height={3}
        borderStyle={theme.borderStyle}
        borderColor={theme.colors.border}
        paddingX={1}
      >
        <Header
          model={model}
          agent={agent}
          agentColor={agentColor}
          sessionId={sessionId}
          tokenCount={tokenCount}
          autoRoute={false}
        />
      </Box>

      {/* Dialog overlay replaces main content when a dialog is open */}
      {dialogIsOpen ? (
        <Box flexDirection="column" flexGrow={1}>
          <DialogHost />
        </Box>
      ) : (
        <>
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
            commands={commands}
          />

          {/* Status Bar — height: 1 */}
          <StatusBar
            agent={agent}
            model={model}
            cost={{ totalCost: cost.totalCost, currency: cost.currency }}
            isStreaming={chat.isStreaming}
            leaderActive={keybindState.leaderActive}
          />
        </>
      )}
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
          <AttachmentProvider>
            <KeybindProvider>
              <DialogProvider>
                <AppLayout />
              </DialogProvider>
            </KeybindProvider>
          </AttachmentProvider>
        </ChatProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

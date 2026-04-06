import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, useApp, useStdout, useInput } from 'ink';

import { ThemeProvider, useTheme } from './context/ThemeContext.js';
import { SessionProvider, useSession } from './context/SessionContext.js';
import { ChatProvider, useChat } from './context/ChatContext.js';
import { KeybindProvider, useKeybind } from './context/KeybindContext.js';
import { DialogProvider, useDialog } from './context/DialogContext.js';
import { AttachmentProvider, useAttachments } from './context/AttachmentContext.js';
import type { ImageAttachmentPreview } from './context/AttachmentContext.js';
import { SidebarProvider, useSidebar } from './context/SidebarContext.js';
import { PageProvider, usePage } from './context/PageContext.js';
import { ChatPage } from './pages/ChatPage.js';
import { LogsPage } from './pages/LogsPage.js';
import { useLogCollector } from './hooks/useLogCollector.js';
import { useStreamChat } from './hooks/useStreamChat.js';
import { useFileChanges } from './hooks/useFileChanges.js';
import { usePermission } from './hooks/usePermission.js';
import { useKeyboard } from './hooks/useKeyboard.js';
import { useCommands } from './hooks/useCommands.js';
import type { TuiConfig } from '../config/tui-schema.js';

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
import { HelpDialog } from './dialogs/HelpDialog.js';
import { FilePicker } from './dialogs/FilePicker.js';
import { QuitDialog } from './dialogs/QuitDialog.js';
import { ThemeDialog } from './dialogs/ThemeDialog.js';
import { ArgDialog } from './dialogs/ArgDialog.js';
import type { HelpEntry, ArgField } from './types/props.js';
import { useToolEvents } from './hooks/useToolEvents.js';
import type { AgentName } from './theme/types.js';

import type { MessageDisplay } from './components/MessageArea.js';
// MessageBubble and ToolCallBlock are rendered inside MessageArea

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
  tuiConfig?: TuiConfig;
}

// ---------------------------------------------------------------------------
// DialogHost — renders the active dialog as an overlay
// ---------------------------------------------------------------------------

function DialogHost(): React.JSX.Element | null {
  const { isOpen, currentType, currentEntry, close, cancel } = useDialog();
  const { theme } = useTheme();

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
    case 'help': {
      const onClose = (): void => {
        close();
      };
      const helpProps = currentEntry.props as {
        entries?: Array<{
          key: string;
          description: string;
          category: string;
          condition: string | null;
        }>;
      };
      return <HelpDialog entries={(helpProps.entries ?? []) as HelpEntry[]} onClose={onClose} />;
    }
    case 'theme': {
      const handleThemeSelect = (themeName: string): void => {
        close(themeName);
      };
      const handleThemeCancel = (): void => {
        cancel();
      };
      return (
        <ThemeDialog
          currentTheme={theme.active}
          onSelect={handleThemeSelect}
          onCancel={handleThemeCancel}
        />
      );
    }
    case 'file-picker': {
      const onSelectFiles = (paths: string[]): void => {
        close(paths);
      };
      const onCancelPicker = (): void => {
        cancel();
      };
      return (
        <FilePicker rootDir={process.cwd()} onSelect={onSelectFiles} onCancel={onCancelPicker} />
      );
    }
    case 'quit': {
      const quitProps = currentEntry.props as { hasActiveSession?: boolean; tokenCount?: number };
      const handleQuitChoice = (action: 'quit' | 'cancel' | 'save-and-quit'): void => {
        if (action === 'cancel') {
          cancel();
        } else {
          close(action);
        }
      };
      return (
        <QuitDialog
          hasActiveSession={quitProps.hasActiveSession ?? false}
          tokenCount={quitProps.tokenCount ?? 0}
          onChoice={handleQuitChoice}
        />
      );
    }
    case 'arg-input': {
      const argProps = currentEntry.props as {
        title?: string;
        fields?: ArgField[];
      };
      const handleArgSubmit = (vals: Record<string, string>): void => {
        close(vals);
      };
      const handleArgCancel = (): void => {
        cancel();
      };
      return (
        <ArgDialog
          title={argProps.title ?? 'Input'}
          fields={(argProps.fields ?? []) as ArgField[]}
          onSubmit={handleArgSubmit}
          onCancel={handleArgCancel}
        />
      );
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
  const sidebar = useSidebar();
  const { page } = usePage();
  const logCollector = useLogCollector();
  useFileChanges();
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
        toolCalls: [...chat.completedToolCalls],
        agent: chat.responseModel ?? undefined,
        model: chat.responseModel ?? undefined,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      chat.clearStreamText();
      chat.clearCompletedToolCalls();
    } else {
      wasStreamingRef.current = false;
    }
  }, [
    chat.isStreaming,
    chat.streamingText,
    chat.responseModel,
    chat.clearStreamText,
    chat.completedToolCalls,
    chat.clearCompletedToolCalls,
  ]);

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
    <Box flexDirection="column" height={rows} backgroundColor={theme.colors.background}>
      {/* Page routing */}
      {page === 'chat' ? (
        <ChatPage
          messages={messages}
          streamingText={chat.streamingText}
          isStreaming={chat.isStreaming}
          activeToolCalls={chat.activeToolCalls}
          onToggleToolCall={chat.toggleToolCallExpansion}
          agent={agent}
          agentColor={agentColor}
          model={model}
          tokenCount={tokenCount}
          sessionId={sessionId}
          cost={{ totalCost: cost.totalCost, currency: cost.currency }}
          leaderActive={keybindState.leaderActive}
          dialogIsOpen={dialogIsOpen}
          onSubmit={handleSubmit}
          commands={commands}
          sidebar={sidebar}
        />
      ) : (
        <LogsPage
          entries={logCollector.entries}
          agent={agent}
          model={model}
          cost={{ totalCost: cost.totalCost, currency: cost.currency }}
          isStreaming={chat.isStreaming}
          leaderActive={keybindState.leaderActive}
        />
      )}

      {/* Dialog overlay */}
      {dialogIsOpen && <DialogHost />}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// App — root with full provider tree
// ---------------------------------------------------------------------------

export function App({ model, autoRoute, sessionId, tuiConfig }: AppProps): React.JSX.Element {
  const resolvedSessionId = sessionId ?? `session-${Date.now()}`;
  const mouseEnabled = tuiConfig?.mouse ?? true;

  // Disable mouse input if configured
  useInput(
    (_input, _key) => {
      // Mouse input handling disabled when mouseEnabled is false
    },
    { isActive: !mouseEnabled }
  );

  return (
    <ThemeProvider>
      <PageProvider>
        <SessionProvider
          initialModel={model}
          initialAutoRoute={autoRoute}
          sessionId={resolvedSessionId}
        >
          <ChatProvider>
            <AttachmentProvider>
              <SidebarProvider>
                <KeybindProvider>
                  <DialogProvider>
                    <AppLayout />
                  </DialogProvider>
                </KeybindProvider>
              </SidebarProvider>
            </AttachmentProvider>
          </ChatProvider>
        </SessionProvider>
      </PageProvider>
    </ThemeProvider>
  );
}

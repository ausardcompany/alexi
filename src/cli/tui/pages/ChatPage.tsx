import React from 'react';
import { Box } from 'ink';

import { MessageArea } from '../components/MessageArea.js';
import type { MessageDisplay } from '../components/MessageArea.js';
import { InputBox } from '../components/InputBox.js';
import { StatusBar } from '../components/StatusBar.js';
import { SplitPane } from '../components/SplitPane.js';
import { Sidebar } from '../components/Sidebar.js';
import type { SlashCommand } from '../hooks/useCommands.js';
import type { ToolCallState } from '../context/ChatContext.js';
import type { SidebarContextValue } from '../context/SidebarContext.js';
import { useTheme } from '../context/ThemeContext.js';

export interface ChatPageProps {
  messages: MessageDisplay[];
  streamingText: string;
  isStreaming: boolean;
  activeToolCalls: ToolCallState[];
  onToggleToolCall: (id: string) => void;
  agent: string;
  agentColor: string;
  model: string;
  tokenCount: number;
  sessionId: string;
  cost: { totalCost: number; currency: string };
  leaderActive: boolean;
  dialogIsOpen: boolean;
  onSubmit: (text: string) => void;
  commands: SlashCommand[];
  sidebar: SidebarContextValue;
}

/**
 * ChatPage — the main chat view matching upstream OpenCode layout:
 * - Messages viewport (main content, left)
 * - Sidebar (file changes, right, collapsible)
 * - Input editor with top border
 * - Status bar at bottom
 */
export function ChatPage({
  messages,
  streamingText,
  isStreaming,
  activeToolCalls,
  onToggleToolCall,
  agent,
  agentColor,
  model,
  tokenCount,
  sessionId,
  cost,
  leaderActive,
  dialogIsOpen,
  onSubmit,
  commands,
  sidebar,
}: ChatPageProps): React.JSX.Element {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <>
      {/* Main area: messages (left) + sidebar (right) */}
      <SplitPane
        main={
          <MessageArea
            messages={messages}
            streamingText={streamingText}
            isStreaming={isStreaming}
            activeToolCalls={activeToolCalls}
            onToggleToolCall={onToggleToolCall}
          />
        }
        side={
          <Sidebar
            files={sidebar.files}
            selectedIndex={sidebar.selectedIndex}
            onSelect={sidebar.setSelectedIndex}
            onActivate={() => {
              /* TODO */
            }}
            isFocused={sidebar.visible && !leaderActive && !dialogIsOpen}
          />
        }
        sideVisible={sidebar.visible}
      />

      {/* Input editor */}
      <Box flexShrink={0} backgroundColor={colors.background}>
        <InputBox
          agent={agent}
          agentColor={agentColor}
          disabled={isStreaming || dialogIsOpen}
          onSubmit={onSubmit}
          isFocused={!leaderActive && !dialogIsOpen}
          commands={commands}
        />
      </Box>

      {/* Status bar — includes model info (no separate header) */}
      <Box flexShrink={0}>
        <StatusBar
          agent={agent}
          model={model}
          cost={cost}
          isStreaming={isStreaming}
          leaderActive={leaderActive}
          tokenCount={tokenCount}
          sessionId={sessionId}
        />
      </Box>
    </>
  );
}

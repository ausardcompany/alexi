import React from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useDialog } from '../context/DialogContext.js';
import { useTheme } from '../context/ThemeContext.js';

export interface SessionSummary {
  id: string;
  name?: string;
  createdAt: number;
  messageCount: number;
  lastMessage?: string;
}

export interface SessionListProps {
  sessions: SessionSummary[];
  activeSessionId: string;
}

export function SessionList({ sessions, activeSessionId }: SessionListProps): React.JSX.Element {
  const dialog = useDialog();
  const { theme } = useTheme();
  const { colors } = theme;

  const sessionItems = sessions.map((session) => {
    const isActive = session.id === activeSessionId;
    const msgCount = `${session.messageCount} ${session.messageCount === 1 ? 'msg' : 'msgs'}`;
    const preview = session.lastMessage ? `  ${session.lastMessage.slice(0, 30)}` : '';
    const label = `${(session.name ?? session.id.slice(0, 8)).padEnd(12)} ${msgCount}${preview}${isActive ? ' (active)' : ''}`;
    return { label, value: session.id };
  });

  const items = [{ label: '[New Session]', value: 'new' }, ...sessionItems];

  useInput((_input, key) => {
    if (key.escape) {
      dialog.cancel();
    }
  });

  const handleSelect = (item: { label: string; value: string }) => {
    dialog.close(item.value);
  };

  return (
    <Box
      borderStyle="round"
      borderColor={colors.info}
      paddingX={2}
      paddingY={1}
      flexDirection="column"
    >
      <Text color={colors.info} bold>
        Sessions
      </Text>
      <Box marginTop={1}>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
      <Box marginTop={1}>
        <Text color={colors.dimText}>[Esc] Cancel</Text>
      </Box>
    </Box>
  );
}

import React from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useDialog } from '../context/DialogContext.js';
import { useTheme } from '../context/ThemeContext.js';

export interface AgentOption {
  name: string;
  color: string;
  description: string;
}

export interface AgentSelectorProps {
  currentAgent: string;
  agents: AgentOption[];
}

export function AgentSelector({ currentAgent, agents }: AgentSelectorProps): React.JSX.Element {
  const dialog = useDialog();
  const { theme } = useTheme();
  const { colors } = theme;

  const items = agents.map((agent) => ({
    label: `${agent.name.padEnd(14)}  ${agent.description}`,
    value: agent.name,
  }));

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
      borderColor={colors.secondary}
      paddingX={2}
      paddingY={1}
      flexDirection="column"
    >
      <Text color={colors.secondary} bold>
        Agent Selector
      </Text>
      <Box marginTop={1}>
        <Text color={colors.dimText}>Current: {currentAgent}</Text>
      </Box>
      <Box marginTop={1}>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
      <Box marginTop={1}>
        <Text color={colors.dimText}>[Esc] Cancel</Text>
      </Box>
    </Box>
  );
}

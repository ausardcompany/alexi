import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';

import { useDialog } from '../context/DialogContext.js';
import { useTheme } from '../context/ThemeContext.js';

export interface CommandEntry {
  name: string;
  description: string;
  category: string;
  shortcut?: string;
}

export interface CommandPaletteProps {
  commands: CommandEntry[];
}

export function CommandPalette({ commands }: CommandPaletteProps): React.JSX.Element {
  const dialog = useDialog();
  const {
    theme: { colors },
  } = useTheme();

  const [query, setQuery] = useState('');

  useInput((_input, key) => {
    if (key.escape) {
      dialog.cancel();
    }
  });

  const lowerQuery = query.toLowerCase();

  const filtered = commands.filter(
    (entry) =>
      entry.name.toLowerCase().includes(lowerQuery) ||
      entry.description.toLowerCase().includes(lowerQuery)
  );

  const items = filtered.map((entry) => ({
    label: `/${entry.name}  ${entry.description}`,
    value: entry.name,
  }));

  const handleSelect = (item: { label: string; value: string }) => {
    dialog.close(item.value);
  };

  return (
    <Box
      borderStyle="round"
      borderColor={colors.primary}
      paddingX={2}
      paddingY={1}
      flexDirection="column"
    >
      <Text color={colors.primary} bold>
        Command Palette
      </Text>
      <Box marginTop={1}>
        <Text color={colors.dimText}>&gt; </Text>
        <TextInput value={query} onChange={setQuery} placeholder="Type to filter commands..." />
      </Box>
      <Box marginTop={1}>
        {items.length > 0 ? (
          <SelectInput items={items} onSelect={handleSelect} />
        ) : (
          <Text color={colors.dimText}>No commands match &quot;{query}&quot;</Text>
        )}
      </Box>
      <Text color={colors.dimText}>[Esc] Cancel</Text>
    </Box>
  );
}

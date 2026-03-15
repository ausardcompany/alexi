import React from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';

import { useDialog } from '../context/DialogContext.js';
import { useTheme } from '../context/ThemeContext.js';

export interface ModelOption {
  id: string;
  label: string;
  description?: string;
}

export interface ModelGroup {
  provider: string;
  models: ModelOption[];
}

export interface ModelPickerProps {
  currentModel: string;
  modelGroups: ModelGroup[];
}

export function ModelPicker({ currentModel, modelGroups }: ModelPickerProps): React.JSX.Element {
  const dialog = useDialog();
  const {
    theme: { colors },
  } = useTheme();

  useInput((_input, key) => {
    if (key.escape) {
      dialog.cancel();
    }
  });

  const items = modelGroups.flatMap((group) =>
    group.models.map((model) => ({
      label: `[${group.provider}] ${model.label}${model.description ? `  ${model.description}` : ''}`,
      value: model.id,
    }))
  );

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
        Model Picker
      </Text>
      <Text color={colors.dimText}>Current: {currentModel}</Text>
      <Box marginTop={1}>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
      <Text color={colors.dimText}>[Esc] Cancel</Text>
    </Box>
  );
}

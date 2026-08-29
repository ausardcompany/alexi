import React from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';

import { useDialog } from '../context/DialogContext.js';
import { useTheme } from '../context/ThemeContext.js';
import { Spinner } from '../components/Spinner.js';
import {
  getCatalogStatus,
  getCatalogEntries,
  subscribeCatalog,
  type CatalogStatus,
  type CatalogEntry,
} from '../../../providers/modelCatalog.js';
import { ORCHESTRATION_MODELS } from '../../../providers/sapOrchestration.js';

export interface ModelOption {
  id: string;
  label: string;
  description?: string;
  live?: boolean;
}

export interface ModelGroup {
  provider: string;
  models: ModelOption[];
}

export interface ModelPickerProps {
  currentModel: string;
  modelGroups: ModelGroup[];
}

const PROVIDER_PREFIXES: [string, string][] = [
  ['gpt-', 'OpenAI'],
  ['anthropic--', 'Anthropic'],
  ['gemini-', 'Google'],
  ['amazon--', 'Amazon'],
  ['mistralai--', 'Mistral'],
  ['meta--', 'Meta'],
  ['deepseek-', 'DeepSeek'],
  ['sap-', 'SAP'],
];

function getProviderGroup(modelId: string): string {
  for (const [prefix, name] of PROVIDER_PREFIXES) {
    if (modelId.startsWith(prefix)) return name;
  }
  return 'Other';
}

function buildGroupsFromEntries(entries: readonly CatalogEntry[]): ModelGroup[] {
  const groups = new Map<string, ModelOption[]>();
  for (const entry of entries) {
    const group = getProviderGroup(entry.id);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push({
      id: entry.id,
      label: entry.id,
      live: entry.live,
    });
  }
  return Array.from(groups.entries()).map(([provider, models]) => ({ provider, models }));
}

function buildGroupsFromStatic(): ModelGroup[] {
  const groups = new Map<string, ModelOption[]>();
  for (const id of ORCHESTRATION_MODELS) {
    const group = getProviderGroup(id);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push({ id, label: id, live: false });
  }
  return Array.from(groups.entries()).map(([provider, models]) => ({ provider, models }));
}

/**
 * Status badge shown at the top of the picker.
 * idle/loading → spinner + "Fetching live models…"
 * ready        → "● N live"  (green dot + count)
 * error        → "⚠ offline (static list)"
 */
function CatalogBadge({
  status,
  liveCount,
  totalCount,
}: {
  status: CatalogStatus;
  liveCount: number;
  totalCount: number;
}): React.JSX.Element {
  const {
    theme: { colors },
  } = useTheme();

  if (status === 'idle' || status === 'loading') {
    return (
      <Box gap={1}>
        <Spinner />
        <Text color={colors.dimText}>Fetching live models from SAP AI Core…</Text>
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Text color={colors.warning}>
        ⚠ AI Core unreachable — showing static catalog ({totalCount} models)
      </Text>
    );
  }

  // ready
  return (
    <Text>
      <Text color={colors.success}>● </Text>
      <Text color={colors.dimText}>
        {liveCount} live · {totalCount} total
      </Text>
    </Text>
  );
}

export function ModelPicker({ currentModel }: ModelPickerProps): React.JSX.Element {
  const dialog = useDialog();
  const {
    theme: { colors },
  } = useTheme();

  // Live catalog state — updates whenever catalog refreshes
  const [catalogStatus, setCatalogStatus] = React.useState<CatalogStatus>(getCatalogStatus);
  const [groups, setGroups] = React.useState<ModelGroup[]>(() => {
    const status = getCatalogStatus();
    return status === 'ready' ? buildGroupsFromEntries(getCatalogEntries()) : buildGroupsFromStatic();
  });

  React.useEffect(() => {
    const unsub = subscribeCatalog(() => {
      const status = getCatalogStatus();
      setCatalogStatus(status);
      setGroups(
        status === 'ready'
          ? buildGroupsFromEntries(getCatalogEntries())
          : buildGroupsFromStatic()
      );
    });
    return unsub;
  }, []);

  useInput((_input, key) => {
    if (key.escape) dialog.cancel();
  });

  const liveCount = React.useMemo(
    () => getCatalogEntries().filter((e) => e.live).length,
    [catalogStatus] // recompute when catalog changes
  );
  const totalCount = groups.reduce((n, g) => n + g.models.length, 0);

  // Flatten to SelectInput items — live models get ● prefix
  const items = groups.flatMap((group) =>
    group.models.map((model) => {
      const isCurrent = model.id === currentModel;
      const liveIcon = model.live ? '● ' : '○ ';
      const currentSuffix = isCurrent ? '  ←' : '';
      return {
        label: `${liveIcon}[${group.provider}] ${model.label}${currentSuffix}`,
        value: model.id,
      };
    })
  );

  const handleSelect = (item: { label: string; value: string }) => {
    dialog.close(item.value);
  };

  return (
    <Box
      borderStyle="round"
      borderColor={colors.borderFocused}
      paddingX={2}
      paddingY={1}
      flexDirection="column"
      gap={1}
    >
      {/* Header */}
      <Box justifyContent="space-between">
        <Text color={colors.primary} bold>
          Select Model
        </Text>
        <Text color={colors.dimText}>● live  ○ static</Text>
      </Box>

      {/* Current model */}
      <Text color={colors.dimText}>
        Current: <Text color={colors.text}>{currentModel}</Text>
      </Text>

      {/* Catalog status badge */}
      <CatalogBadge status={catalogStatus} liveCount={liveCount} totalCount={totalCount} />

      {/* Divider */}
      <Text color={colors.borderDim}>{'─'.repeat(48)}</Text>

      {/* Model list */}
      <Box>
        <SelectInput items={items} onSelect={handleSelect} limit={16} />
      </Box>

      {/* Footer hints */}
      <Text color={colors.dimText}>[↑↓] Navigate  [Enter] Select  [Esc] Cancel</Text>
    </Box>
  );
}

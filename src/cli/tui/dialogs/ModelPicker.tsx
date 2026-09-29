import React from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';

import { useDialog } from '../context/DialogContext.js';
import { useTheme } from '../context/ThemeContext.js';
import { Spinner } from '../components/Spinner.js';
import {
  getCatalogState,
  getCatalogStatus,
  getCatalogEntries,
  subscribeCatalog,
  type CatalogStatus,
  type CatalogEntry,
} from '../../../providers/modelCatalog.js';
import { hintForErrorMessage } from '../../../providers/modelFetchErrors.js';
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
  /**
   * Optional static model groups. When provided (and non-empty), the picker
   * renders these groups verbatim and skips the live SAP AI Core catalog.
   *
   * When omitted, the picker subscribes to {@link subscribeCatalog} and
   * renders the live catalog state, including any classified fetch error
   * with an actionable hint (issue #1886).
   */
  modelGroups?: ModelGroup[];
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
 * error        → "⚠ Model list unavailable: <classified reason>"
 *                followed by an actionable hint on a second line
 *                (issue #1851 — surface why the fetch failed, not just
 *                that it failed).
 */
function CatalogBadge({
  status,
  liveCount,
  totalCount,
  errorMessage,
  errorHint,
}: {
  status: CatalogStatus;
  liveCount: number;
  totalCount: number;
  errorMessage?: string;
  errorHint?: string;
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
    // Show the classified reason on line 1 and the actionable hint on
    // line 2. Falls back to the pre-1851 generic message when no reason
    // was captured (older code paths / test seams may leave it empty).
    const reason = errorMessage && errorMessage.length > 0 ? errorMessage : 'AI Core unreachable';
    return (
      <Box flexDirection="column">
        <Text color={colors.warning}>
          {`⚠ Model list unavailable: ${reason} (showing static catalog · ${totalCount} models)`}
        </Text>
        {errorHint && <Text color={colors.dimText}>{`  → ${errorHint}`}</Text>}
      </Box>
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

export function ModelPicker({ currentModel, modelGroups }: ModelPickerProps): React.JSX.Element {
  const dialog = useDialog();
  const {
    theme: { colors },
  } = useTheme();

  // Live catalog state — updates whenever catalog refreshes.
  // Only consulted when the caller did not pass an explicit modelGroups list.
  const propGroupsProvided = modelGroups !== undefined && modelGroups.length > 0;

  const [catalogStatus, setCatalogStatus] = React.useState<CatalogStatus>(getCatalogStatus);
  const [catalogGroups, setCatalogGroups] = React.useState<ModelGroup[]>(() => {
    const status = getCatalogStatus();
    return status === 'ready'
      ? buildGroupsFromEntries(getCatalogEntries())
      : buildGroupsFromStatic();
  });
  const [catalogErrorMessage, setCatalogErrorMessage] = React.useState<string | undefined>(
    () => getCatalogState().errorMessage
  );

  React.useEffect(() => {
    if (propGroupsProvided) return; // caller supplied groups; don't listen
    const unsub = subscribeCatalog(() => {
      const status = getCatalogStatus();
      setCatalogStatus(status);
      setCatalogGroups(
        status === 'ready' ? buildGroupsFromEntries(getCatalogEntries()) : buildGroupsFromStatic()
      );
      setCatalogErrorMessage(getCatalogState().errorMessage);
    });
    return unsub;
  }, [propGroupsProvided]);

  const catalogErrorHint = React.useMemo(
    () => hintForErrorMessage(catalogErrorMessage),
    [catalogErrorMessage]
  );

  useInput((_input, key) => {
    if (key.escape) dialog.cancel();
  });

  const groups: ModelGroup[] = propGroupsProvided ? (modelGroups ?? []) : catalogGroups;

  const liveCount = React.useMemo(
    () => getCatalogEntries().filter((e) => e.live).length,
    [catalogStatus] // recompute when catalog changes
  );
  const totalCount = groups.reduce((n, g) => n + g.models.length, 0);

  // Flatten to SelectInput items. When groups come from props, honour any
  // `description` field on the option. When groups come from the live catalog,
  // prefix with ●/○ to indicate live vs static.
  const items = groups.flatMap((group) =>
    group.models.map((model) => {
      if (propGroupsProvided) {
        const desc = model.description ? `  ${model.description}` : '';
        return {
          label: `[${group.provider}] ${model.label}${desc}`,
          value: model.id,
        };
      }
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
          Model Picker
        </Text>
        <Text color={colors.dimText}>● live ○ static</Text>
      </Box>

      {/* Current model */}
      <Text color={colors.dimText}>
        Current: <Text color={colors.text}>{currentModel}</Text>
      </Text>

      {/* Catalog status badge (only when using the live catalog) */}
      {!propGroupsProvided && (
        <CatalogBadge
          status={catalogStatus}
          liveCount={liveCount}
          totalCount={totalCount}
          errorMessage={catalogErrorMessage}
          errorHint={catalogErrorHint}
        />
      )}

      {/* Divider */}
      <Text color={colors.borderDim}>{'─'.repeat(48)}</Text>

      {/* Model list */}
      <Box>
        <SelectInput items={items} onSelect={handleSelect} limit={16} />
      </Box>

      {/* Footer hints */}
      <Text color={colors.dimText}>[↑↓] Navigate [Enter] Select [Esc] Cancel</Text>
    </Box>
  );
}

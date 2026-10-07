import React from 'react';
import { Box, Text } from 'ink';

import { useTheme } from '../context/ThemeContext.js';
import {
  computeTodoProgress,
  formatTodoChipLabel,
  todoProgressState,
  type TodoProgress,
} from '../../../utils/todo.js';
import { getTodos, onTodosChange, type Todo } from '../../../tool/tools/todowrite.js';

export interface TodoProgressChipProps {
  /**
   * Explicit todo list for tests and non-interactive callers. When omitted
   * the component subscribes to the global `todowrite` tool state so the
   * chip updates automatically as the agent edits todos. The explicit prop
   * takes precedence — passing an empty array is treated as "no todos".
   */
  todos?: readonly Todo[];
  /**
   * Background color used behind the chip. Defaults to the theme's darker
   * status-bar background so the chip blends into the StatusBar segment
   * strip without needing additional wrapper padding.
   */
  backgroundColor?: string;
}

/**
 * Compact "N/M todos" progress chip rendered in the StatusBar. The chip
 * reflects the global `todowrite` tool state live via `onTodosChange` so
 * the user sees the ratio update as todos move through `pending ->
 * in_progress -> completed` without having to open the full list.
 *
 * The chip is hidden entirely when the todo list is empty — showing "0/0"
 * for an idle session was noisy in practice. Tests can force a visible
 * empty state by passing `todos={[]}`; this component treats both empty
 * and omitted the same way, by rendering `null`.
 *
 * Colour mapping (see {@link todoProgressState}):
 * - `done`   -> theme success (green)
 * - `active` -> theme warning (yellow)
 * - `idle`   -> theme dimText (gray)
 */
export function TodoProgressChip({
  todos,
  backgroundColor,
}: TodoProgressChipProps): React.JSX.Element | null {
  const { theme } = useTheme();
  const { colors } = theme;

  // When a `todos` prop is provided, use it directly and skip the
  // subscription. Otherwise mirror the global state so the chip updates
  // whenever `todowrite` fires its change listeners.
  const [liveTodos, setLiveTodos] = React.useState<readonly Todo[]>(() =>
    todos !== undefined ? todos : getTodos()
  );

  React.useEffect(() => {
    if (todos !== undefined) {
      setLiveTodos(todos);
      return;
    }
    setLiveTodos(getTodos());
    const unsub = onTodosChange((next) => {
      setLiveTodos(next);
    });
    return unsub;
  }, [todos]);

  const progress: TodoProgress = computeTodoProgress(liveTodos);
  const state = todoProgressState(progress);
  if (state === 'empty') {
    return null;
  }

  const label = formatTodoChipLabel(progress);
  const bg = backgroundColor ?? colors.backgroundDarker;
  let color: string;
  switch (state) {
    case 'done':
      color = colors.success;
      break;
    case 'active':
      color = colors.warning;
      break;
    case 'idle':
    default:
      color = colors.dimText;
      break;
  }

  return (
    <Box backgroundColor={bg}>
      <Text color={colors.dimText} backgroundColor={bg}>
        {' · '}
      </Text>
      <Text color={color} backgroundColor={bg}>
        {label}
      </Text>
    </Box>
  );
}

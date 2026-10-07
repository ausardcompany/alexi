import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render } from 'ink-testing-library';

import { TodoProgressChip } from '../../../src/cli/tui/components/TodoProgressChip.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import { clearTodos, type Todo } from '../../../src/tool/tools/todowrite.js';

function Wrapper({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <ThemeProvider>{children}</ThemeProvider>;
}

function todo(status: Todo['status'], content = 't'): Todo {
  return { content, status, priority: 'medium' };
}

afterEach(() => {
  // Reset the module-level todo state owned by todowrite.ts so tests
  // that fall back to the subscription-mode default do not leak state.
  clearTodos();
});

describe('TodoProgressChip', () => {
  it('renders nothing when the explicit todo list is empty', () => {
    const { lastFrame } = render(
      <Wrapper>
        <TodoProgressChip todos={[]} />
      </Wrapper>
    );
    expect(lastFrame()).toBe('');
  });

  it('renders "N/M todos" when todos are provided explicitly', () => {
    const todos: Todo[] = [
      todo('completed'),
      todo('completed'),
      todo('completed'),
      todo('in_progress'),
      todo('pending'),
    ];
    const { lastFrame } = render(
      <Wrapper>
        <TodoProgressChip todos={todos} />
      </Wrapper>
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('3/5 todos');
  });

  it('renders a done-state chip when every todo is completed', () => {
    const todos: Todo[] = [todo('completed'), todo('completed')];
    const { lastFrame } = render(
      <Wrapper>
        <TodoProgressChip todos={todos} />
      </Wrapper>
    );
    expect(lastFrame() ?? '').toContain('2/2 todos');
  });

  it('renders an idle-state chip when no todos are completed yet', () => {
    const todos: Todo[] = [todo('pending'), todo('pending'), todo('pending')];
    const { lastFrame } = render(
      <Wrapper>
        <TodoProgressChip todos={todos} />
      </Wrapper>
    );
    expect(lastFrame() ?? '').toContain('0/3 todos');
  });

  it('subscribes to the global todo state when no `todos` prop is given', () => {
    // Default (subscription-mode) start: no todos -> chip hidden
    const { lastFrame } = render(
      <Wrapper>
        <TodoProgressChip />
      </Wrapper>
    );
    expect(lastFrame()).toBe('');
  });
});

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';

import { DialogProvider } from '../../../src/cli/tui/context/DialogContext.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import {
  PermissionDialog,
  type PermissionDialogProps,
} from '../../../src/cli/tui/dialogs/PermissionDialog.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderDialog(props: PermissionDialogProps) {
  return render(
    <ThemeProvider>
      <DialogProvider>
        <PermissionDialog {...props} />
      </DialogProvider>
    </ThemeProvider>
  );
}

const defaultProps: PermissionDialogProps = {
  action: 'read',
  toolName: 'ReadFileTool',
  resource: '/home/user/secret.txt',
  description: 'This tool wants to read a file from disk.',
  icon: '📖',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('PermissionDialog', () => {
  it('renders without crashing', () => {
    const { lastFrame } = renderDialog(defaultProps);
    expect(lastFrame()).toBeTruthy();
  });

  it('shows the action label for "read" action', () => {
    const { lastFrame } = renderDialog({ ...defaultProps, action: 'read' });
    expect(lastFrame()).toContain('Read Access');
  });

  it('shows the tool name', () => {
    const { lastFrame } = renderDialog({ ...defaultProps, toolName: 'MySpecialTool' });
    expect(lastFrame()).toContain('MySpecialTool');
  });

  it('shows the resource', () => {
    const { lastFrame } = renderDialog({ ...defaultProps, resource: '/etc/passwd' });
    expect(lastFrame()).toContain('/etc/passwd');
  });

  it('shows the description', () => {
    const { lastFrame } = renderDialog({
      ...defaultProps,
      description: 'Wants to read a sensitive file.',
    });
    expect(lastFrame()).toContain('Wants to read a sensitive file.');
  });

  it('shows key hints for A, D and N', () => {
    const { lastFrame } = renderDialog(defaultProps);
    const frame = lastFrame()!;
    expect(frame).toContain('A');
    expect(frame).toContain('D');
    expect(frame).toContain('N');
  });

  it('shows the icon prop', () => {
    const { lastFrame } = renderDialog({ ...defaultProps, icon: '🔑' });
    expect(lastFrame()).toContain('🔑');
  });

  describe('renders correct action label for all action types', () => {
    const cases: Array<[PermissionDialogProps['action'], string]> = [
      ['read', 'Read Access'],
      ['write', 'Write Access'],
      ['execute', 'Execute Command'],
      ['network', 'Network Access'],
      ['admin', 'Administrative Access'],
    ];

    for (const [action, expectedLabel] of cases) {
      it(`shows "${expectedLabel}" for action="${action}"`, () => {
        const { lastFrame } = renderDialog({ ...defaultProps, action });
        expect(lastFrame()).toContain(expectedLabel);
      });
    }
  });
});

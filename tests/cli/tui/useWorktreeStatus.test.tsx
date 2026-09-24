import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

import { useWorktreeStatus } from '../../../src/cli/tui/hooks/useWorktreeStatus.js';
import {
  __resetWorktreeStatusRegistry,
  setWorktreeStatus,
  removeWorktreeStatus,
} from '../../../src/agent/worktreeStatus.js';

afterEach(() => {
  __resetWorktreeStatusRegistry();
});

function Probe(): React.JSX.Element {
  const worktrees = useWorktreeStatus();
  return (
    <>
      {worktrees.map((wt) => (
        <Text key={wt.id}>
          {wt.id}:{wt.status}
        </Text>
      ))}
      {worktrees.length === 0 ? <Text>empty</Text> : null}
    </>
  );
}

async function flush(): Promise<void> {
  // Yield to the event loop so React commits the effect + state update
  // before ink-testing-library snapshots the frame.
  await new Promise((r) => setImmediate(r));
}

describe('useWorktreeStatus', () => {
  it('starts empty when nothing has been reported', async () => {
    const { lastFrame } = render(<Probe />);
    await flush();
    expect(lastFrame() ?? '').toContain('empty');
  });

  it('picks up existing entries on mount via the synchronous initial snapshot', async () => {
    setWorktreeStatus('wt-1', { label: 'x', status: 'running' });
    const { lastFrame } = render(<Probe />);
    await flush();
    expect(lastFrame() ?? '').toContain('wt-1:running');
  });

  it('propagates status changes to consumers in real time', async () => {
    const { lastFrame } = render(<Probe />);
    await flush();
    setWorktreeStatus('wt-1', { label: 'x', status: 'idle' });
    await flush();
    expect(lastFrame() ?? '').toContain('wt-1:idle');

    setWorktreeStatus('wt-1', { label: 'x', status: 'error' });
    await flush();
    expect(lastFrame() ?? '').toContain('wt-1:error');
  });

  it('drops the entry from the snapshot when it is removed', async () => {
    setWorktreeStatus('wt-1', { label: 'x', status: 'idle' });
    const { lastFrame } = render(<Probe />);
    await flush();
    expect(lastFrame() ?? '').toContain('wt-1:idle');
    removeWorktreeStatus('wt-1');
    await flush();
    expect(lastFrame() ?? '').toContain('empty');
  });
});

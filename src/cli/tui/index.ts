import React from 'react';
import { render } from 'ink';

import { App } from './App.js';

export interface StartTuiOptions {
  model: string;
  autoRoute: boolean;
  sessionId?: string;
  preferCheap?: boolean;
  systemPrompt?: string;
  gitManager?: unknown;
  repoMapManager?: unknown;
}

export async function startTui(options: StartTuiOptions): Promise<void> {
  const { waitUntilExit } = render(React.createElement(App, options));
  await waitUntilExit();
}

/**
 * Contract: App Layout (Root TUI Component)
 *
 * The root Ink component that establishes the full-screen flexbox layout
 * and wraps all content in the context provider tree.
 */

// --- Provider Tree Order ---
// <ThemeProvider>
//   <SessionProvider>
//     <ChatProvider>
//       <KeybindProvider>
//         <DialogProvider>
//           <AppLayout />
//         </DialogProvider>
//       </KeybindProvider>
//     </ChatProvider>
//   </SessionProvider>
// </ThemeProvider>

// --- Layout Contract ---

export interface AppLayoutProps {
  /** Initial model to use */
  model: string;
  /** Whether auto-routing is enabled */
  autoRoute: boolean;
  /** Session ID to resume (or undefined for new session) */
  sessionId?: string;
  /** Git manager instance (from CLI command setup) */
  gitManager?: unknown;
  /** Repo map manager instance */
  repoMapManager?: unknown;
}

/**
 * Layout regions — all rendered within a single full-screen <Box>
 * using `useWindowSize()` to get terminal dimensions.
 *
 * ┌─────────────────────────────────────┐
 * │ <Header />           height: 3      │
 * ├─────────────────────────────────────┤
 * │ <MessageArea />      flexGrow: 1    │
 * │                      overflow: hidden│
 * ├─────────────────────────────────────┤
 * │ <InputBox />         minHeight: 1   │
 * ├─────────────────────────────────────┤
 * │ <StatusBar />        height: 1      │
 * └─────────────────────────────────────┘
 *
 * When a dialog is active, it renders as position="absolute" overlay.
 */

// --- Header Contract ---

export interface HeaderProps {
  model: string;
  agent: string;
  agentColor: string;
  sessionId: string;
  tokenCount: number;
  autoRoute: boolean;
}

/**
 * Header renders a bordered box with:
 * - Left: model name
 * - Center: agent badge (colored)
 * - Right: session ID + token count
 * - Below: auto-route indicator (if enabled)
 */

// --- StatusBar Contract ---

export interface StatusBarProps {
  agent: string;
  model: string;
  cost: { totalCost: number; currency: string };
  isStreaming: boolean;
  leaderActive: boolean;
}

/**
 * StatusBar renders a single-line bar at the bottom:
 * - Left: keybinding hints (Tab: agent · Ctrl+X: leader · /help)
 * - Center: agent name
 * - Right: cost display + streaming indicator
 *
 * When leaderActive=true, shows leader mode options instead.
 */

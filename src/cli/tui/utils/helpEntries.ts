import type { HelpEntry } from '../types/props.js';

/**
 * Returns all available keybindings as HelpEntry[] with categories.
 * This is the single source of truth for keybinding documentation.
 */
export function getHelpEntries(): HelpEntry[] {
  return [
    // Navigation
    { key: 'Tab', description: 'Cycle agent forward', category: 'navigation', condition: null },
    {
      key: 'Shift+Tab',
      description: 'Cycle agent backward',
      category: 'navigation',
      condition: null,
    },
    { key: 'PgUp', description: 'Scroll messages up', category: 'navigation', condition: null },
    { key: 'PgDn', description: 'Scroll messages down', category: 'navigation', condition: null },
    { key: 'Ctrl+B', description: 'Toggle sidebar', category: 'navigation', condition: null },
    {
      key: 'Ctrl+J',
      description: 'Toggle chat/logs page',
      category: 'navigation',
      condition: null,
    },
    {
      key: 'p',
      description: 'Pin/unpin selected worktree',
      category: 'navigation',
      condition: 'sidebar focused',
    },

    // Chat
    { key: 'Enter', description: 'Send message', category: 'chat', condition: null },
    { key: 'Shift+Enter', description: 'New line', category: 'chat', condition: null },
    { key: 'Ctrl+C', description: 'Abort stream / quit', category: 'chat', condition: null },
    { key: 'Ctrl+L', description: 'Clear messages', category: 'chat', condition: null },
    {
      key: 'Ctrl+S',
      description: 'Steer subagent',
      category: 'chat',
      condition: 'subagent active',
    },
    { key: 'Escape', description: 'Abort stream / cancel', category: 'chat', condition: null },

    // Leader mode
    { key: 'Ctrl+X', description: 'Activate leader mode', category: 'leader', condition: null },
    { key: 'leader+n', description: 'New session', category: 'leader', condition: 'leader mode' },
    {
      key: 'leader+m',
      description: 'Open model picker',
      category: 'leader',
      condition: 'leader mode',
    },
    {
      key: 'leader+a',
      description: 'Open agent selector',
      category: 'leader',
      condition: 'leader mode',
    },
    {
      key: 'leader+s',
      description: 'Open session list',
      category: 'leader',
      condition: 'leader mode',
    },
    {
      key: 'leader+f',
      description: 'Open file picker',
      category: 'leader',
      condition: 'leader mode',
    },
    {
      key: 'leader+t',
      description: 'Open theme dialog',
      category: 'leader',
      condition: 'leader mode',
    },
    {
      key: 'leader+l',
      description: 'Switch to logs page',
      category: 'leader',
      condition: 'leader mode',
    },
    { key: 'leader+h', description: 'Open help', category: 'leader', condition: 'leader mode' },
    {
      key: 'leader+b',
      description: 'Toggle sidebar',
      category: 'leader',
      condition: 'leader mode',
    },
    { key: 'leader+q', description: 'Quit', category: 'leader', condition: 'leader mode' },
    { key: 'Esc', description: 'Cancel leader mode', category: 'leader', condition: 'leader mode' },

    // Dialogs
    { key: '?', description: 'Open help overlay', category: 'dialogs', condition: null },
    {
      key: 'Ctrl+/',
      description: 'Open help overlay (alt)',
      category: 'dialogs',
      condition: null,
    },
    { key: 'Ctrl+K', description: 'Open command palette', category: 'dialogs', condition: null },

    // Input
    {
      key: 'Up/Down',
      description: 'Navigate history / autocomplete',
      category: 'input',
      condition: null,
    },
    { key: '/', description: 'Start slash command', category: 'input', condition: null },

    // Vim
    { key: 'i', description: 'Enter insert mode', category: 'vim', condition: 'vim normal' },
    { key: 'Esc', description: 'Return to normal mode', category: 'vim', condition: 'vim insert' },
    { key: 'h/j/k/l', description: 'Move cursor', category: 'vim', condition: 'vim normal' },
    { key: 'dd', description: 'Delete line', category: 'vim', condition: 'vim normal' },
    { key: 'u', description: 'Undo', category: 'vim', condition: 'vim normal' },
    { key: 'Ctrl+R', description: 'Redo', category: 'vim', condition: 'vim normal' },
  ];
}

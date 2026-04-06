/**
 * TUI Configuration Schema
 * Defines the schema for TUI-specific configuration options
 */

import { z } from 'zod';

export const tuiConfigSchema = z.object({
  theme: z.enum(['dark', 'light', 'auto']).default('auto'),
  keybindings: z.record(z.string()).optional(),
  mouse: z.boolean().default(true).describe('Enable or disable mouse input in TUI'),
});

export type TuiConfig = z.infer<typeof tuiConfigSchema>;

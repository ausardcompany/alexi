/**
 * Tool Schema Definitions
 * Centralized type definitions for tool system with branded IDs
 */

import { z } from 'zod';

// Branded ID types for type safety
const _ToolIDSchema = z.string().describe('Unique identifier for a tool');
export type ToolID = z.infer<typeof _ToolIDSchema>;

const _ToolCallIDSchema = z.string().describe('Unique identifier for a tool call instance');
export type ToolCallID = z.infer<typeof _ToolCallIDSchema>;

const _ToolResultIDSchema = z.string().describe('Unique identifier for a tool result');
export type ToolResultID = z.infer<typeof _ToolResultIDSchema>;

// Tool execution state
const _ToolExecutionStateSchema = z.enum([
  'pending',
  'running',
  'completed',
  'failed',
  'cancelled',
]);
export type ToolExecutionState = z.infer<typeof _ToolExecutionStateSchema>;

// Tool permission level
const _ToolPermissionLevelSchema = z.enum(['allow', 'ask', 'deny']);
export type ToolPermissionLevel = z.infer<typeof _ToolPermissionLevelSchema>;

// Tool metadata for registration
const _ToolMetadataSchema = z.object({
  id: _ToolIDSchema,
  name: z.string(),
  description: z.string(),
  category: z.string().optional(),
  requiresPermission: z.boolean(),
  defaultPermission: _ToolPermissionLevelSchema,
});
export type ToolMetadata = z.infer<typeof _ToolMetadataSchema>;

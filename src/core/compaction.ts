/**
 * Context Compaction System for Alexi
 * Summarize long conversations to free up context window space while preserving important information.
 *
 * Integration points (NOT implemented here, noted for future):
 * - SessionManager should call this before adding messages if near limit
 * - Interactive REPL should expose /compact command
 * - Auto-compact can be disabled via config
 */

import type { Message } from './sessionManager.js';

// ============ Types ============

export interface CompactionOptions {
  preserveLastN?: number; // Keep last N messages intact, default 4
  summaryMaxTokens?: number; // Max tokens for summary, default 2000
  triggerThreshold?: number; // Auto-trigger at this % of context, default 90
  keepPruned?: boolean; // Keep pruned messages in history, default false
}

export interface CompactionResult {
  originalMessages: number;
  compactedMessages: number;
  estimatedTokensSaved: number;
  summary: string;
}

// LLM function type for generating summaries
export type LLMSummarizeFn = (prompt: string) => Promise<string>;

// ============ Constants ============

const DEFAULT_PRESERVE_LAST_N = 4;
const DEFAULT_SUMMARY_MAX_TOKENS = 2000;
const DEFAULT_TRIGGER_THRESHOLD = 90; // percent
const MAX_TOOL_OUTPUT_LENGTH = 50000; // 50KB threshold
const PRUNED_TOOL_MARKER = '[Output truncated due to size]';

const SUMMARY_PROMPT = `Summarize this conversation for context continuity. Extract and preserve:
1. KEY DECISIONS: What was decided and why
2. FILES CHANGED: List all files created/modified/deleted
3. CONTEXT: Tech stack, constraints, requirements mentioned
4. CURRENT STATE: What task is in progress, what's next

Be concise but preserve actionable details. Format as structured notes.
Respond in the same language the user used in the conversation.

Conversation:
{messages}`;

// ============ Token Estimation ============

/**
 * Simple token estimation: ~4 chars per token
 */
export function estimateTokens(text: string): number {
  if (!text || text.length === 0) {
    return 0;
  }
  return Math.ceil(text.length / 4);
}

/**
 * Estimate total tokens for a list of messages
 */
export function estimateMessagesTokens(messages: Message[]): number {
  if (!messages || messages.length === 0) {
    return 0;
  }

  let total = 0;
  for (const message of messages) {
    // Add overhead for role/structure (~4 tokens per message)
    total += 4;
    total += estimateTokens(message.content);
  }

  return total;
}

// ============ Core Functions ============

/**
 * Check if compaction is needed based on current token usage
 */
export function shouldCompact(
  messages: Message[],
  maxContextTokens: number,
  threshold?: number
): boolean {
  if (!messages || messages.length === 0) {
    return false;
  }

  const thresholdPercent = threshold ?? DEFAULT_TRIGGER_THRESHOLD;
  const currentTokens = estimateMessagesTokens(messages);
  const thresholdTokens = (maxContextTokens * thresholdPercent) / 100;

  return currentTokens >= thresholdTokens;
}

// Global LLM function for summarization
let globalLLMSummarizeFn: LLMSummarizeFn | null = null;

/**
 * Set the LLM function used for generating summaries
 */
export function setLLMSummarizeFn(fn: LLMSummarizeFn): void {
  globalLLMSummarizeFn = fn;
}

/**
 * Get the currently configured LLM function
 */
export function getLLMSummarizeFn(): LLMSummarizeFn | null {
  return globalLLMSummarizeFn;
}

/**
 * Format messages for the summary prompt
 */
function formatMessagesForPrompt(messages: Message[]): string {
  return messages.map((m) => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n');
}

/**
 * Create the summary prompt with messages
 */
function createSummaryPrompt(messages: Message[]): string {
  const formattedMessages = formatMessagesForPrompt(messages);
  return SUMMARY_PROMPT.replace('{messages}', formattedMessages);
}

/**
 * Prune tool output if it exceeds size threshold
 */
function pruneToolOutput(content: string | object, maxLength: number): string {
  const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2);

  if (text.length <= maxLength) return text;

  // Keep beginning and end for context
  const headLength = Math.floor(maxLength * 0.7);
  const tailLength = Math.floor(maxLength * 0.2);

  return `${text.slice(0, headLength)}\n\n${PRUNED_TOOL_MARKER}\n\n${text.slice(-tailLength)}`;
}

/**
 * Check if message contains tool output and prune if necessary
 */
function pruneMessageToolOutput(message: Message): Message {
  // Check if this is a tool message with large content
  if (message.role === 'tool' && message.content) {
    const contentLength =
      typeof message.content === 'string'
        ? message.content.length
        : JSON.stringify(message.content).length;

    if (contentLength > MAX_TOOL_OUTPUT_LENGTH) {
      return {
        ...message,
        content: pruneToolOutput(message.content, MAX_TOOL_OUTPUT_LENGTH),
      };
    }
  }
  return message;
}

/**
 * Prune large tool outputs from messages to prevent context overflow
 */
export function pruneToolOutputs(messages: Message[]): Message[] {
  return messages.map((message) => pruneMessageToolOutput(message));
}

/**
 * Compact a conversation by summarizing older messages
 *
 * Algorithm:
 * 1. Estimate current token usage
 * 2. If below threshold, return messages unchanged
 * 3. Separate messages: keep last N, compact the rest
 * 4. Create a summary prompt that extracts key information
 * 5. Call LLM to generate summary
 * 6. Return: [system message, summary message, ...last N messages]
 */
export async function compactConversation(
  messages: Message[],
  options?: CompactionOptions
): Promise<{ messages: Message[]; result: CompactionResult }> {
  const preserveLastN = options?.preserveLastN ?? DEFAULT_PRESERVE_LAST_N;
  const summaryMaxTokens = options?.summaryMaxTokens ?? DEFAULT_SUMMARY_MAX_TOKENS;

  // Handle empty or small message arrays
  if (!messages || messages.length === 0) {
    return {
      messages: [],
      result: {
        originalMessages: 0,
        compactedMessages: 0,
        estimatedTokensSaved: 0,
        summary: '',
      },
    };
  }

  // If we have fewer messages than preserveLastN, return unchanged
  if (messages.length <= preserveLastN) {
    return {
      messages: [...messages],
      result: {
        originalMessages: messages.length,
        compactedMessages: messages.length,
        estimatedTokensSaved: 0,
        summary: '',
      },
    };
  }

  const originalTokens = estimateMessagesTokens(messages);

  // Separate system messages from others
  const systemMessages = messages.filter((m) => m.role === 'system');
  const nonSystemMessages = messages.filter((m) => m.role !== 'system');

  // If non-system messages are fewer than preserveLastN, return unchanged
  if (nonSystemMessages.length <= preserveLastN) {
    return {
      messages: [...messages],
      result: {
        originalMessages: messages.length,
        compactedMessages: messages.length,
        estimatedTokensSaved: 0,
        summary: '',
      },
    };
  }

  // Split: messages to summarize vs messages to keep
  const messagesToSummarize = nonSystemMessages.slice(0, -preserveLastN);
  const messagesToKeep = nonSystemMessages.slice(-preserveLastN);

  // Generate summary
  let summary: string;

  if (globalLLMSummarizeFn) {
    // Use LLM for summarization
    const prompt = createSummaryPrompt(messagesToSummarize);
    summary = await globalLLMSummarizeFn(prompt);

    // Truncate if summary exceeds max tokens
    const summaryTokens = estimateTokens(summary);
    if (summaryTokens > summaryMaxTokens) {
      // Truncate to approximately summaryMaxTokens
      const maxChars = summaryMaxTokens * 4;
      summary = summary.slice(0, maxChars) + '...';
    }
  } else {
    // Fallback: create a basic summary without LLM
    summary = createFallbackSummary(messagesToSummarize);
  }

  // Create summary message
  const summaryMessage: Message = {
    role: 'system',
    content: `[CONVERSATION SUMMARY]\n${summary}`,
    timestamp: Date.now(),
  };

  // Build compacted messages: system messages + summary + last N messages
  const compactedMessages: Message[] = [...systemMessages, summaryMessage, ...messagesToKeep];

  const compactedTokens = estimateMessagesTokens(compactedMessages);
  const tokensSaved = Math.max(0, originalTokens - compactedTokens);

  return {
    messages: compactedMessages,
    result: {
      originalMessages: messages.length,
      compactedMessages: compactedMessages.length,
      estimatedTokensSaved: tokensSaved,
      summary,
    },
  };
}

/**
 * Create a fallback summary when no LLM function is available
 * Extracts basic information from messages
 */
function createFallbackSummary(messages: Message[]): string {
  const sections: string[] = [];

  // Extract file mentions
  const filePattern =
    /[\w\-./]+\.(ts|js|tsx|jsx|py|go|rs|java|cpp|c|h|css|scss|html|json|yaml|yml|md|txt)\b/gi;
  const filesSet = new Set<string>();

  for (const message of messages) {
    const matches = message.content.match(filePattern);
    if (matches) {
      matches.forEach((f) => filesSet.add(f));
    }
  }

  if (filesSet.size > 0) {
    const filesList = Array.from(filesSet).slice(0, 10).join(', ');
    sections.push(`FILES MENTIONED: ${filesList}`);
  }

  // Extract decisions/key points
  const decisionPattern = /(decided|agreed|confirmed|will|should|must)\s+[^.!?]{10,80}/gi;
  const decisions: string[] = [];

  for (const message of messages) {
    const matches = message.content.match(decisionPattern);
    if (matches) {
      matches.slice(0, 3).forEach((d) => decisions.push(d.trim()));
    }
  }

  if (decisions.length > 0) {
    sections.push(`KEY POINTS: ${decisions.slice(0, 5).join('; ')}`);
  }

  // Add message count context
  sections.push(`CONTEXT: ${messages.length} messages summarized from earlier conversation.`);

  return sections.join('\n');
}

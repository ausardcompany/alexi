/**
 * Context Compaction System
 * Automatically compacts conversation history when approaching token limits
 */

import { z } from 'zod';
import { defineEvent } from '../bus/index.js';

// ============ Types ============

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface CompactionCheckOptions {
  maxTokens?: number; // Max allowed tokens (default: 100000)
  warningThreshold?: number; // Trigger at this % of max (default: 0.8)
}

export interface CompactionOptions {
  strategy: CompactionStrategy;
  preserveRecent?: number; // Number of recent messages to always keep
  preserveSystemPrompt?: boolean; // Always keep system prompt
  customSummaryPrompt?: string; // Custom prompt for summarization
}

export type CompactionStrategy =
  | 'truncate' // Remove oldest messages
  | 'summarize' // AI summarization of old messages
  | 'sliding' // Sliding window, keep N most recent
  | 'smart'; // Combination based on content importance

export interface CompactionResult {
  success: boolean;
  originalMessageCount: number;
  compactedMessageCount: number;
  originalTokens: number;
  compactedTokens: number;
  summary?: string; // If summarization was used
  removedMessages?: number; // Number of messages removed
  error?: string;
}

// Summarization function type - can be injected for AI-based summarization
export type SummarizeFn = (prompt: string) => Promise<string>;

// ============ Constants ============

const DEFAULT_MAX_TOKENS = 100000;
const DEFAULT_WARNING_THRESHOLD = 0.8;
const DEFAULT_PRESERVE_RECENT = 4;

const SUMMARY_PROMPT = `Summarize the following conversation context concisely.
Preserve key decisions, file changes, and important context.
Be specific about file paths and code changes mentioned.

Conversation to summarize:
{messages}

Provide a concise summary (max 500 words):`;

// Patterns that indicate important messages
const IMPORTANCE_PATTERNS = [
  /file\s+(created|modified|deleted|changed)/i,
  /\.(ts|js|tsx|jsx|py|go|rs|java|cpp|c|h|css|scss|html|json|yaml|yml|md|txt)\b/i,
  /commit|merge|branch|push|pull/i,
  /error|bug|fix|issue|problem/i,
  /decision|decided|agreed|confirmed/i,
  /todo|task|action\s*item/i,
  /important|critical|urgent/i,
  /```[\s\S]+```/, // Code blocks
];

// ============ Events ============

export const CompactionNeeded = defineEvent(
  'context.compaction.needed',
  z.object({
    currentTokens: z.number(),
    maxTokens: z.number(),
    messageCount: z.number(),
    timestamp: z.number(),
  })
);

export const CompactionPerformed = defineEvent(
  'context.compaction.performed',
  z.object({
    strategy: z.string(),
    originalTokens: z.number(),
    compactedTokens: z.number(),
    removedMessages: z.number(),
    timestamp: z.number(),
  })
);

// ============ Token Estimation ============

/**
 * Estimate token count for a string
 * Rough estimation without external dependencies
 */
export function estimateTokens(text: string): number {
  if (!text || text.length === 0) {
    return 0;
  }

  // Split on whitespace and punctuation for more accurate word count
  const words = text.split(/\s+/).filter((w) => w.length > 0).length;
  const chars = text.length;

  // Rough estimation: ~4 chars per token for English
  // Account for code which tends to have more tokens
  return Math.ceil((words * 1.3 + chars / 4) / 2);
}

/**
 * Estimate total tokens for a conversation
 */
export function estimateConversationTokens(messages: Message[]): number {
  if (!messages || messages.length === 0) {
    return 0;
  }

  let total = 0;
  for (const message of messages) {
    // Add role overhead (~4 tokens for role markup)
    total += 4;
    total += estimateTokens(message.content);
  }

  return total;
}

// ============ CompactionManager Class ============

export class CompactionManager {
  private summarizeFn?: SummarizeFn;
  private defaultOptions: Partial<CompactionOptions>;

  constructor(options?: {
    summarizeFn?: SummarizeFn;
    defaultOptions?: Partial<CompactionOptions>;
  }) {
    this.summarizeFn = options?.summarizeFn;
    this.defaultOptions = options?.defaultOptions ?? {
      strategy: 'sliding',
      preserveRecent: DEFAULT_PRESERVE_RECENT,
      preserveSystemPrompt: true,
    };
  }

  /**
   * Set the summarization function (for AI-based summarization)
   */
  setSummarizeFn(fn: SummarizeFn): void {
    this.summarizeFn = fn;
  }

  /**
   * Estimate token count for content
   */
  estimateTokens(content: string): number {
    return estimateTokens(content);
  }

  /**
   * Check if compaction is needed based on current token count
   */
  needsCompaction(messages: Message[], options?: CompactionCheckOptions): boolean {
    if (!messages || messages.length === 0) {
      return false;
    }

    const maxTokens = options?.maxTokens ?? DEFAULT_MAX_TOKENS;
    const threshold = options?.warningThreshold ?? DEFAULT_WARNING_THRESHOLD;

    const currentTokens = estimateConversationTokens(messages);
    const thresholdTokens = maxTokens * threshold;

    if (currentTokens >= thresholdTokens) {
      // Publish event when compaction is needed
      CompactionNeeded.publish({
        currentTokens,
        maxTokens,
        messageCount: messages.length,
        timestamp: Date.now(),
      });
      return true;
    }

    return false;
  }

  /**
   * Compact messages using the specified strategy
   */
  async compact(messages: Message[], options?: CompactionOptions): Promise<CompactionResult> {
    const opts = { ...this.defaultOptions, ...options } as CompactionOptions;
    const originalTokens = estimateConversationTokens(messages);
    const originalCount = messages.length;

    // Handle edge cases
    if (!messages || messages.length === 0) {
      return {
        success: true,
        originalMessageCount: 0,
        compactedMessageCount: 0,
        originalTokens: 0,
        compactedTokens: 0,
        removedMessages: 0,
      };
    }

    if (messages.length <= (opts.preserveRecent ?? DEFAULT_PRESERVE_RECENT)) {
      return {
        success: true,
        originalMessageCount: originalCount,
        compactedMessageCount: messages.length,
        originalTokens,
        compactedTokens: originalTokens,
        removedMessages: 0,
      };
    }

    try {
      let result: CompactionResult;

      switch (opts.strategy) {
        case 'truncate':
          result = await this.truncateStrategy(messages, opts);
          break;
        case 'summarize':
          result = await this.summarizeStrategy(messages, opts);
          break;
        case 'sliding':
          result = await this.slidingWindowStrategy(messages, opts);
          break;
        case 'smart':
          result = await this.smartStrategy(messages, opts);
          break;
        default:
          result = await this.slidingWindowStrategy(messages, opts);
      }

      // Publish compaction event
      CompactionPerformed.publish({
        strategy: opts.strategy,
        originalTokens: result.originalTokens,
        compactedTokens: result.compactedTokens,
        removedMessages: result.removedMessages ?? 0,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      return {
        success: false,
        originalMessageCount: originalCount,
        compactedMessageCount: originalCount,
        originalTokens,
        compactedTokens: originalTokens,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Generate a summary of messages (requires summarizeFn to be set)
   */
  async summarize(messages: Message[]): Promise<string> {
    if (!this.summarizeFn) {
      throw new Error(
        'Summarization function not configured. Set summarizeFn in constructor or via setSummarizeFn().'
      );
    }

    if (!messages || messages.length === 0) {
      return '';
    }

    const formattedMessages = messages
      .map((m) => `[${m.role.toUpperCase()}]: ${m.content}`)
      .join('\n\n');

    const prompt = SUMMARY_PROMPT.replace('{messages}', formattedMessages);
    return await this.summarizeFn(prompt);
  }

  // ============ Strategy Implementations ============

  /**
   * Truncate strategy: Remove oldest messages (except system prompt)
   */
  private async truncateStrategy(
    messages: Message[],
    options: CompactionOptions
  ): Promise<CompactionResult> {
    const preserveRecent = options.preserveRecent ?? DEFAULT_PRESERVE_RECENT;
    const preserveSystem = options.preserveSystemPrompt !== false;

    const systemMessages = preserveSystem ? messages.filter((m) => m.role === 'system') : [];
    const nonSystemMessages = messages.filter((m) => m.role !== 'system');

    // Keep only recent non-system messages
    const recentMessages = nonSystemMessages.slice(-preserveRecent);
    const compactedMessages = [...systemMessages, ...recentMessages];

    const compactedTokens = estimateConversationTokens(compactedMessages);
    const originalTokens = estimateConversationTokens(messages);

    return {
      success: true,
      originalMessageCount: messages.length,
      compactedMessageCount: compactedMessages.length,
      originalTokens,
      compactedTokens,
      removedMessages: messages.length - compactedMessages.length,
    };
  }

  /**
   * Summarize strategy: AI summarization of old messages
   */
  private async summarizeStrategy(
    messages: Message[],
    options: CompactionOptions
  ): Promise<CompactionResult> {
    const preserveRecent = options.preserveRecent ?? DEFAULT_PRESERVE_RECENT;
    const preserveSystem = options.preserveSystemPrompt !== false;
    const originalTokens = estimateConversationTokens(messages);

    // Separate system messages
    const systemMessages = preserveSystem ? messages.filter((m) => m.role === 'system') : [];
    const nonSystemMessages = messages.filter((m) => m.role !== 'system');

    // Nothing to summarize if not enough messages
    if (nonSystemMessages.length <= preserveRecent) {
      return {
        success: true,
        originalMessageCount: messages.length,
        compactedMessageCount: messages.length,
        originalTokens,
        compactedTokens: originalTokens,
        removedMessages: 0,
      };
    }

    // Messages to summarize vs keep
    const toSummarize = nonSystemMessages.slice(0, -preserveRecent);
    const toKeep = nonSystemMessages.slice(-preserveRecent);

    let summaryText: string;

    if (this.summarizeFn) {
      // Use AI summarization
      const customPrompt = options.customSummaryPrompt;
      if (customPrompt) {
        const formattedMessages = toSummarize
          .map((m) => `[${m.role.toUpperCase()}]: ${m.content}`)
          .join('\n\n');
        summaryText = await this.summarizeFn(customPrompt.replace('{messages}', formattedMessages));
      } else {
        summaryText = await this.summarize(toSummarize);
      }
    } else {
      // Fallback to basic extraction
      summaryText = this.extractKeySummary(toSummarize);
    }

    // Create summary message
    const summaryMessage: Message = {
      role: 'system',
      content: `[CONVERSATION SUMMARY]\n${summaryText}`,
      timestamp: Date.now(),
      metadata: { isSummary: true, summarizedCount: toSummarize.length },
    };

    const compactedMessages = [...systemMessages, summaryMessage, ...toKeep];
    const compactedTokens = estimateConversationTokens(compactedMessages);

    return {
      success: true,
      originalMessageCount: messages.length,
      compactedMessageCount: compactedMessages.length,
      originalTokens,
      compactedTokens,
      summary: summaryText,
      removedMessages: toSummarize.length,
    };
  }

  /**
   * Sliding window strategy: Keep N most recent messages
   */
  private async slidingWindowStrategy(
    messages: Message[],
    options: CompactionOptions
  ): Promise<CompactionResult> {
    const preserveRecent = options.preserveRecent ?? DEFAULT_PRESERVE_RECENT;
    const preserveSystem = options.preserveSystemPrompt !== false;
    const originalTokens = estimateConversationTokens(messages);

    const systemMessages = preserveSystem ? messages.filter((m) => m.role === 'system') : [];
    const nonSystemMessages = messages.filter((m) => m.role !== 'system');

    // Keep recent messages
    const recentMessages = nonSystemMessages.slice(-preserveRecent);
    const removedMessages = nonSystemMessages.slice(0, -preserveRecent);

    // Optionally prepend a brief summary of removed content
    let summaryMessage: Message | undefined;
    if (removedMessages.length > 0) {
      const briefSummary = this.extractKeySummary(removedMessages);
      if (briefSummary) {
        summaryMessage = {
          role: 'system',
          content: `[PRIOR CONTEXT] ${briefSummary}`,
          timestamp: Date.now(),
          metadata: { isPriorContext: true, summarizedCount: removedMessages.length },
        };
      }
    }

    const compactedMessages = summaryMessage
      ? [...systemMessages, summaryMessage, ...recentMessages]
      : [...systemMessages, ...recentMessages];

    const compactedTokens = estimateConversationTokens(compactedMessages);

    return {
      success: true,
      originalMessageCount: messages.length,
      compactedMessageCount: compactedMessages.length,
      originalTokens,
      compactedTokens,
      summary: summaryMessage?.content,
      removedMessages: removedMessages.length,
    };
  }

  /**
   * Smart strategy: Preserve important messages, summarize/truncate the rest
   */
  private async smartStrategy(
    messages: Message[],
    options: CompactionOptions
  ): Promise<CompactionResult> {
    const preserveRecent = options.preserveRecent ?? DEFAULT_PRESERVE_RECENT;
    const preserveSystem = options.preserveSystemPrompt !== false;
    const originalTokens = estimateConversationTokens(messages);

    const systemMessages = preserveSystem ? messages.filter((m) => m.role === 'system') : [];
    const nonSystemMessages = messages.filter((m) => m.role !== 'system');

    // Nothing to compact
    if (nonSystemMessages.length <= preserveRecent) {
      return {
        success: true,
        originalMessageCount: messages.length,
        compactedMessageCount: messages.length,
        originalTokens,
        compactedTokens: originalTokens,
        removedMessages: 0,
      };
    }

    // Split into recent and old messages
    const recentMessages = nonSystemMessages.slice(-preserveRecent);
    const oldMessages = nonSystemMessages.slice(0, -preserveRecent);

    // Identify important messages in old messages
    const importantOldMessages = oldMessages.filter((m) => this.isImportantMessage(m));
    const unimportantOldMessages = oldMessages.filter((m) => !this.isImportantMessage(m));

    // Create summary of unimportant messages
    let summaryMessage: Message | undefined;
    if (unimportantOldMessages.length > 0) {
      let summaryText: string;

      if (this.summarizeFn) {
        summaryText = await this.summarize(unimportantOldMessages);
      } else {
        summaryText = this.extractKeySummary(unimportantOldMessages);
      }

      if (summaryText) {
        summaryMessage = {
          role: 'system',
          content: `[CONVERSATION SUMMARY]\n${summaryText}`,
          timestamp: Date.now(),
          metadata: {
            isSummary: true,
            summarizedCount: unimportantOldMessages.length,
          },
        };
      }
    }

    // Build compacted messages
    const compactedMessages: Message[] = [
      ...systemMessages,
      ...(summaryMessage ? [summaryMessage] : []),
      ...importantOldMessages,
      ...recentMessages,
    ];

    const compactedTokens = estimateConversationTokens(compactedMessages);

    return {
      success: true,
      originalMessageCount: messages.length,
      compactedMessageCount: compactedMessages.length,
      originalTokens,
      compactedTokens,
      summary: summaryMessage?.content,
      removedMessages: unimportantOldMessages.length,
    };
  }

  // ============ Helper Methods ============

  /**
   * Check if a message is considered important
   */
  private isImportantMessage(message: Message): boolean {
    for (const pattern of IMPORTANCE_PATTERNS) {
      if (pattern.test(message.content)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Extract key information from messages without AI
   */
  private extractKeySummary(messages: Message[]): string {
    if (!messages || messages.length === 0) {
      return '';
    }

    const keyPoints: string[] = [];

    for (const message of messages) {
      // Extract file paths mentioned
      const fileMatches = message.content.match(
        /[\w\-./]+\.(ts|js|tsx|jsx|py|go|rs|java|cpp|c|h|css|scss|html|json|yaml|yml|md|txt)\b/gi
      );
      if (fileMatches) {
        const uniqueFiles = [...new Set(fileMatches)];
        keyPoints.push(`Files mentioned: ${uniqueFiles.slice(0, 5).join(', ')}`);
      }

      // Extract decisions/confirmations
      const decisionMatch = message.content.match(
        /(decided|agreed|confirmed|will|should)\s+.{10,50}/i
      );
      if (decisionMatch) {
        keyPoints.push(decisionMatch[0].trim());
      }

      // Extract errors/issues
      const errorMatch = message.content.match(/(error|issue|bug|problem|fix)[:.\s].{10,80}/i);
      if (errorMatch) {
        keyPoints.push(errorMatch[0].trim());
      }
    }

    // Remove duplicates and limit length
    const uniquePoints = [...new Set(keyPoints)].slice(0, 10);

    if (uniquePoints.length === 0) {
      // Fallback: just mention the message count
      return `${messages.length} earlier messages in the conversation.`;
    }

    return uniquePoints.join('. ');
  }
}

// ============ Global Instance ============

let globalCompactionManager: CompactionManager | null = null;

/**
 * Get the global CompactionManager instance
 */
export function getCompactionManager(): CompactionManager {
  if (!globalCompactionManager) {
    globalCompactionManager = new CompactionManager();
  }
  return globalCompactionManager;
}

/**
 * Set the global CompactionManager instance
 */
export function setCompactionManager(manager: CompactionManager): void {
  globalCompactionManager = manager;
}

/**
 * Check if compaction is needed for a conversation
 */
export function shouldCompact(messages: Message[], maxTokens?: number): boolean {
  return getCompactionManager().needsCompaction(messages, { maxTokens });
}

/**
 * Compact a conversation using default options
 */
export async function compactConversation(
  messages: Message[],
  options?: CompactionOptions
): Promise<CompactionResult> {
  return getCompactionManager().compact(messages, options);
}

// ============ Auto-Compaction Hook ============

/**
 * Check and compact if needed before sending messages
 * Returns compacted messages and whether compaction occurred
 */
export async function checkAndCompact(
  messages: Message[],
  options?: CompactionOptions
): Promise<{ messages: Message[]; wasCompacted: boolean }> {
  const manager = getCompactionManager();

  // Check if compaction is needed
  if (!manager.needsCompaction(messages)) {
    return { messages, wasCompacted: false };
  }

  // Apply compaction
  const result = await manager.compact(messages, options);

  if (!result.success) {
    // Return original messages if compaction failed
    console.warn('Compaction failed:', result.error);
    return { messages, wasCompacted: false };
  }

  // Reconstruct compacted messages from result
  // Note: The compact method modifies internally, so we need to rebuild
  const opts = options ?? { strategy: 'sliding' };
  const preserveRecent = opts.preserveRecent ?? DEFAULT_PRESERVE_RECENT;
  const preserveSystem = opts.preserveSystemPrompt !== false;

  const systemMessages = preserveSystem ? messages.filter((m) => m.role === 'system') : [];
  const nonSystemMessages = messages.filter((m) => m.role !== 'system');
  const recentMessages = nonSystemMessages.slice(-preserveRecent);

  let compactedMessages: Message[];

  if (result.summary) {
    const summaryMessage: Message = {
      role: 'system',
      content: result.summary,
      timestamp: Date.now(),
      metadata: { isSummary: true },
    };
    compactedMessages = [...systemMessages, summaryMessage, ...recentMessages];
  } else {
    compactedMessages = [...systemMessages, ...recentMessages];
  }

  return { messages: compactedMessages, wasCompacted: true };
}

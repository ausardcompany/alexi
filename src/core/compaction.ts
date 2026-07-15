/**
 * Context Compaction System for Alexi
 * Summarize long conversations to free up context window space while preserving important information.
 *
 * Integration points (NOT implemented here, noted for future):
 * - SessionManager should call this before adding messages if near limit
 * - Interactive REPL should expose /compact command
 * - Auto-compact can be disabled via config
 */

import { CompactionStarted, CompactionComplete } from '../bus/index.js';
import type { Message } from './sessionManager.js';

// ============ Types ============

export interface CompactionOptions {
  preserveLastN?: number; // Keep last N messages intact, default 4
  summaryMaxTokens?: number; // Max tokens for summary, default 2000
  triggerThreshold?: number; // Auto-trigger at this % of context, default 90
  keepPruned?: boolean; // Keep pruned messages in history, default false
  maxChunkTokens?: number; // Max tokens per chunk for oversized payloads, default 80000
  overflowTokens?: number; // Tokens that triggered overflow — seeds target summary size
  /**
   * Number of tokens to reserve for the next provider response. When provided
   * along with `maxContextTokens`, compaction targets ~80% of
   * `(maxContextTokens - reserveOutputTokens)` so a freshly compacted turn
   * does not immediately re-cross the trigger threshold. Callers should pass
   * the provider-specific `maxTokens` (e.g. 4096 for the SAP Orchestration
   * default in `src/core/orchestrator.ts`). Default 4096.
   */
  reserveOutputTokens?: number;
  /**
   * Total context window for the model. Required for the 80% target buffer in
   * `compactConversation` to apply; when omitted, compaction falls back to the
   * legacy "drop everything except last N" behaviour.
   */
  maxContextTokens?: number;
}

/**
 * Options bag accepted by the (new) form of `shouldCompact`. The legacy
 * positional `threshold?: number` argument is still supported.
 */
export interface ShouldCompactOptions {
  threshold?: number;
  reserveOutputTokens?: number;
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
const DEFAULT_MAX_CHUNK_TOKENS = 80000;
/**
 * Default reservation for the next provider response. Mirrors the
 * `maxTokens: 4096` used by the SAP Orchestration call in
 * `src/core/orchestrator.ts`.
 */
const DEFAULT_RESERVE_OUTPUT_TOKENS = 4096;
/**
 * Fraction of the trigger budget that `compactConversation` aims to land at
 * after compacting. Mirrors the upstream cline/cline three-part fix.
 */
const POST_COMPACT_TARGET_FRACTION = 0.8;
const MAX_TOOL_OUTPUT_LENGTH = 50000; // 50KB threshold
const PRUNED_TOOL_MARKER = '[Output truncated due to size]';

const SUMMARY_PROMPT = `Summarize this conversation for context continuity. Extract and preserve:
1. KEY DECISIONS: What was decided and why
2. FILES CHANGED: List all files created/modified/deleted
3. CONTEXT: Tech stack, constraints, requirements mentioned
4. CURRENT STATE: What task is in progress, what's next
5. USER INSTRUCTIONS: Preserve ALL user-specified preferences, constraints, and explicit instructions verbatim (coding style, API keys, endpoints, "always do X", "never do Y")

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
 * Estimate total tokens for a list of messages.
 *
 * When a message has a recorded `tokens` field (populated on the hot path by
 * `orchestrator.ts` / `sessionManager.ts`), the recorded value is preferred
 * over the chars/4 heuristic. Falls back to chars/4 only when neither
 * `tokens.input` nor `tokens.output` is set. The +4 per-message structural
 * overhead is kept either way.
 */
export function estimateMessagesTokens(messages: Message[]): number {
  if (!messages || messages.length === 0) {
    return 0;
  }

  let total = 0;
  for (const message of messages) {
    // Add overhead for role/structure (~4 tokens per message)
    total += 4;

    const recordedInput = message.tokens?.input;
    const recordedOutput = message.tokens?.output;
    const hasRecorded =
      (typeof recordedInput === 'number' && recordedInput > 0) ||
      (typeof recordedOutput === 'number' && recordedOutput > 0);

    if (hasRecorded) {
      total += (recordedInput ?? 0) + (recordedOutput ?? 0);
    } else {
      total += estimateTokens(message.content);
    }
  }

  return total;
}

// ============ Core Functions ============

/**
 * Check if compaction is needed based on current token usage.
 *
 * Accepts either the legacy positional `threshold?: number` form or an
 * options bag with `{ threshold, reserveOutputTokens }`. When
 * `reserveOutputTokens` is supplied, it is subtracted from
 * `maxContextTokens` BEFORE applying the percentage threshold so the
 * reserved output budget never trips the trigger.
 */
export function shouldCompact(
  messages: Message[],
  maxContextTokens: number,
  thresholdOrOptions?: number | ShouldCompactOptions
): boolean {
  if (!messages || messages.length === 0) {
    return false;
  }

  const opts: ShouldCompactOptions =
    typeof thresholdOrOptions === 'number'
      ? { threshold: thresholdOrOptions }
      : (thresholdOrOptions ?? {});

  const thresholdPercent = opts.threshold ?? DEFAULT_TRIGGER_THRESHOLD;
  const reserveOutputTokens = opts.reserveOutputTokens ?? 0;
  const triggerTokens = Math.max(0, maxContextTokens - reserveOutputTokens);

  const currentTokens = estimateMessagesTokens(messages);
  const thresholdTokens = (triggerTokens * thresholdPercent) / 100;

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
  if ((message.role as string) === 'tool' && message.content) {
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
 * Split messages into chunks that each fit within maxTokens.
 * Never splits a single message across chunks.
 */
export function chunkMessages(messages: Message[], maxTokens: number): Message[][] {
  if (!messages || messages.length === 0) {
    return [];
  }

  const chunks: Message[][] = [];
  let currentChunk: Message[] = [];
  let currentTokens = 0;

  for (const message of messages) {
    const messageTokens = estimateTokens(message.content) + 4; // +4 for role/structure overhead

    // If a single message exceeds maxTokens, it gets its own chunk
    if (currentChunk.length > 0 && currentTokens + messageTokens > maxTokens) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentTokens = 0;
    }

    currentChunk.push(message);
    currentTokens += messageTokens;
  }

  // Push the last chunk if non-empty
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Summarize message chunks incrementally.
 * Each chunk is summarized independently, then if multiple summaries exist,
 * they are combined into a final coherent summary.
 */
export async function summarizeChunks(
  chunks: Message[][],
  summarizeFn: LLMSummarizeFn
): Promise<string> {
  if (chunks.length === 0) {
    return '';
  }

  // Summarize each chunk independently
  const chunkSummaries: string[] = [];
  for (const chunk of chunks) {
    const prompt = createSummaryPrompt(chunk);
    const summary = await summarizeFn(prompt);
    chunkSummaries.push(summary);
  }

  // If only one chunk, return its summary directly
  if (chunkSummaries.length === 1) {
    return chunkSummaries[0];
  }

  // Combine multiple summaries into a final summary
  const combinePrompt =
    'Combine these conversation summaries into a single coherent summary:\n\n' +
    chunkSummaries.map((s, i) => `--- Summary ${i + 1} ---\n${s}`).join('\n\n');

  return await summarizeFn(combinePrompt);
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

  // From here on we may perform real work (summary generation, potentially
  // over the network). Publish a `CompactionStarted` event so the TUI can
  // render a progress indicator, and always publish `CompactionComplete`
  // via a try/finally guard — even on failure — so the UI never gets stuck
  // showing "Compacting…" forever.
  const compactionStartTime = Date.now();
  const originalTokens = estimateMessagesTokens(messages);
  let compactionEmittedStart = false;
  let compactionErrorMessage: string | undefined;
  let compactionResultForEvent: CompactionResult | null = null;

  const emitCompactionStart = (): void => {
    if (compactionEmittedStart) {
      return;
    }
    compactionEmittedStart = true;
    try {
      CompactionStarted.publish({
        messageCount: messages.length,
        estimatedTokens: originalTokens,
        trigger: 'auto',
        timestamp: compactionStartTime,
      });
    } catch {
      // Never let bus errors break compaction itself.
    }
  };

  const emitCompactionComplete = (): void => {
    if (!compactionEmittedStart) {
      return;
    }
    try {
      const result = compactionResultForEvent ?? {
        originalMessages: messages.length,
        compactedMessages: messages.length,
        estimatedTokensSaved: 0,
        summary: '',
      };
      CompactionComplete.publish({
        originalMessages: result.originalMessages,
        compactedMessages: result.compactedMessages,
        estimatedTokensSaved: result.estimatedTokensSaved,
        durationMs: Date.now() - compactionStartTime,
        trigger: 'auto',
        error: compactionErrorMessage,
        timestamp: Date.now(),
      });
    } catch {
      // Never let bus errors break compaction itself.
    }
  };

  try {
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

    // Default split: keep last N, summarize the rest.
    let messagesToSummarize = nonSystemMessages.slice(0, -preserveLastN);
    let messagesToKeep = nonSystemMessages.slice(-preserveLastN);

    // When the caller passes `maxContextTokens`, target ~80% of the trigger
    // budget (context - reserved output) so the very next turn does not
    // immediately re-cross the compaction threshold. We grow `toKeep` BACKWARDS
    // from the tail past `preserveLastN` while the resulting kept set + the
    // summary budget still fits under the target. Anything that does not fit is
    // moved into `messagesToSummarize`.
    const maxContextTokens = options?.maxContextTokens;
    const reserveOutputTokens = options?.reserveOutputTokens ?? DEFAULT_RESERVE_OUTPUT_TOKENS;
    if (typeof maxContextTokens === 'number' && maxContextTokens > 0) {
      const triggerTokens = Math.max(0, maxContextTokens - reserveOutputTokens);
      const targetTokens = Math.floor(triggerTokens * POST_COMPACT_TARGET_FRACTION);

      // Always keep at least the last `preserveLastN` non-system messages
      // (existing invariant). Grow the kept window leftwards as long as the
      // running total (kept + system + summary budget) stays under target.
      const systemTokens = estimateMessagesTokens(systemMessages);

      let keepStart = Math.max(0, nonSystemMessages.length - preserveLastN);
      // Token cost of the currently-kept window.
      let keptTokens = estimateMessagesTokens(nonSystemMessages.slice(keepStart));

      while (keepStart > 0) {
        const candidate = nonSystemMessages[keepStart - 1];
        const candidateTokens = estimateMessagesTokens([candidate]);
        const projected = systemTokens + summaryMaxTokens + keptTokens + candidateTokens;
        if (projected > targetTokens) {
          break;
        }
        keepStart -= 1;
        keptTokens += candidateTokens;
      }

      messagesToSummarize = nonSystemMessages.slice(0, keepStart);
      messagesToKeep = nonSystemMessages.slice(keepStart);

      // If the target buffer is so generous that there is nothing left to
      // summarize, return early with the original messages — no work to do.
      if (messagesToSummarize.length === 0) {
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
    }

    // Real work starts here (summary generation, potentially LLM calls).
    // This is the point where the UI should show a "Compacting…" indicator.
    emitCompactionStart();

    // Generate summary
    let summary: string;
    const maxChunkTokens = options?.maxChunkTokens ?? DEFAULT_MAX_CHUNK_TOKENS;

    if (globalLLMSummarizeFn) {
      // Check if messages exceed chunk size limit
      const messagesToSummarizeTokens = estimateMessagesTokens(messagesToSummarize);

      // Build target size instruction if overflowTokens is provided
      let targetInstruction: string | undefined;
      if (options?.overflowTokens && options.overflowTokens > 0) {
        const targetSummaryTokens = Math.max(
          500,
          messagesToSummarizeTokens - Math.ceil(options.overflowTokens * 1.5)
        );
        targetInstruction = `Keep your summary under approximately ${targetSummaryTokens} tokens.`;
      }

      if (messagesToSummarizeTokens > maxChunkTokens) {
        // Oversized: use chunked summarization
        const chunks = chunkMessages(messagesToSummarize, maxChunkTokens);
        summary = await summarizeChunks(chunks, globalLLMSummarizeFn);
        if (targetInstruction) {
          // For chunked summaries, append the instruction as a refinement pass
          const refinementPrompt = `${summary}\n\n${targetInstruction}`;
          summary = await globalLLMSummarizeFn(refinementPrompt);
        }
      } else {
        // Within limit: use existing single-call path
        let prompt = createSummaryPrompt(messagesToSummarize);
        if (targetInstruction) {
          prompt += `\n\n${targetInstruction}`;
        }
        summary = await globalLLMSummarizeFn(prompt);
      }

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

    const finalResult: CompactionResult = {
      originalMessages: messages.length,
      compactedMessages: compactedMessages.length,
      estimatedTokensSaved: tokensSaved,
      summary,
    };
    compactionResultForEvent = finalResult;

    return {
      messages: compactedMessages,
      result: finalResult,
    };
  } catch (err) {
    compactionErrorMessage = err instanceof Error ? err.message : String(err);
    throw err;
  } finally {
    emitCompactionComplete();
  }
}

/**
 * Partially compact a conversation by summarizing messages before a boundary index.
 * Messages from the boundary onward are preserved intact.
 *
 * @param messages     Full message array
 * @param boundaryIndex  Index at which to split; messages[0..boundaryIndex-1] are summarized
 * @param summarizeFn  LLM function for generating the summary (optional, falls back to basic summary)
 * @returns New message array: [system messages, summary message, ...messages from boundary onward]
 */
export async function partialCompact(
  messages: Message[],
  boundaryIndex: number,
  summarizeFn?: LLMSummarizeFn
): Promise<Message[]> {
  if (!messages || messages.length === 0) {
    return [];
  }

  if (boundaryIndex <= 0 || boundaryIndex >= messages.length) {
    return [...messages];
  }

  const messagesToSummarize = messages.slice(0, boundaryIndex).filter((m) => m.role !== 'system');
  const systemMessages = messages.slice(0, boundaryIndex).filter((m) => m.role === 'system');
  const messagesToKeep = messages.slice(boundaryIndex);

  if (messagesToSummarize.length === 0) {
    return [...systemMessages, ...messagesToKeep];
  }

  // Announce that a (partial) compaction is underway so the UI can show
  // feedback. Errors from the bus must never break compaction itself.
  const startTime = Date.now();
  let errorMessage: string | undefined;
  let finalCount = messages.length;
  try {
    CompactionStarted.publish({
      messageCount: messages.length,
      estimatedTokens: estimateMessagesTokens(messagesToSummarize),
      trigger: 'partial',
      timestamp: startTime,
    });
  } catch {
    // ignore bus errors
  }

  try {
    // Generate summary
    let summary: string;
    const fn = summarizeFn ?? globalLLMSummarizeFn;

    if (fn) {
      const maxChunkTokens = DEFAULT_MAX_CHUNK_TOKENS;
      const tokensToSummarize = estimateMessagesTokens(messagesToSummarize);

      if (tokensToSummarize > maxChunkTokens) {
        const chunks = chunkMessages(messagesToSummarize, maxChunkTokens);
        summary = await summarizeChunks(chunks, fn);
      } else {
        const prompt = createSummaryPrompt(messagesToSummarize);
        summary = await fn(prompt);
      }
    } else {
      summary = createFallbackSummary(messagesToSummarize);
    }

    const summaryMessage: Message = {
      role: 'system',
      content: `[CONVERSATION SUMMARY]\n${summary}`,
      timestamp: Date.now(),
    };

    const result = [...systemMessages, summaryMessage, ...messagesToKeep];
    finalCount = result.length;
    return result;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
    throw err;
  } finally {
    try {
      CompactionComplete.publish({
        originalMessages: messages.length,
        compactedMessages: finalCount,
        estimatedTokensSaved: Math.max(
          0,
          estimateMessagesTokens(messages.slice(0, boundaryIndex)) -
            estimateMessagesTokens(systemMessages)
        ),
        durationMs: Date.now() - startTime,
        trigger: 'partial',
        error: errorMessage,
        timestamp: Date.now(),
      });
    } catch {
      // ignore bus errors
    }
  }
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

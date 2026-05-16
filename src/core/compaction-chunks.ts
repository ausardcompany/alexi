/**
 * Compaction Chunks Module
 * Handles splitting and compacting large contexts in manageable chunks
 */

const MAX_CHUNK_SIZE = 100000; // Approximate token limit per chunk

export interface ChunkResult {
  chunks: string[];
  totalSize: number;
}

/**
 * Split large content into manageable chunks for compaction.
 * Ensures each chunk stays within API limits while preserving context boundaries.
 */
export function splitForCompaction(content: string, maxSize: number = MAX_CHUNK_SIZE): ChunkResult {
  if (content.length <= maxSize) {
    return { chunks: [content], totalSize: content.length };
  }

  const chunks: string[] = [];
  let remaining = content;

  while (remaining.length > 0) {
    if (remaining.length <= maxSize) {
      chunks.push(remaining);
      break;
    }

    // Find a good break point (newline, paragraph, or sentence)
    let breakPoint = maxSize;
    const newlinePos = remaining.lastIndexOf('\n', maxSize);
    if (newlinePos > maxSize * 0.5) {
      breakPoint = newlinePos + 1;
    }

    chunks.push(remaining.slice(0, breakPoint));
    remaining = remaining.slice(breakPoint);
  }

  return { chunks, totalSize: content.length };
}

/**
 * Compact content in chunks and merge results.
 */
export async function compactInChunks(
  content: string,
  compactFn: (chunk: string) => Promise<string>,
  maxSize?: number
): Promise<string> {
  const { chunks } = splitForCompaction(content, maxSize);

  if (chunks.length === 1) {
    return compactFn(chunks[0]);
  }

  const compactedChunks = await Promise.all(chunks.map(compactFn));
  return compactedChunks.join('\n\n---\n\n');
}

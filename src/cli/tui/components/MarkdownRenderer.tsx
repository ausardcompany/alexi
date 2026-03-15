import React, { useMemo } from 'react';
import { Text } from 'ink';
import { Marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import { highlight } from 'cli-highlight';

import type { MarkdownRendererProps } from '../types/props.js';

export type { MarkdownRendererProps };

/**
 * Close any unclosed code fences in a partial markdown string.
 * When streaming, the markdown may end mid-code-block with an odd
 * number of triple-backtick delimiters. Appending a closing fence
 * allows the parser to produce valid output.
 */
export function closePartialFences(md: string): string {
  const openFences = (md.match(/```/g) || []).length;
  return openFences % 2 === 1 ? md + '\n```' : md;
}

/**
 * Pre-configured Marked instance with terminal renderer and syntax highlighting.
 */
const markedInstance = new Marked(
  markedTerminal({
    code: (code: string, lang: string): string => {
      try {
        return highlight(code, { language: lang, ignoreIllegals: true });
      } catch {
        return code;
      }
    },
    reflowText: true,
    showSectionPrefix: false,
    tab: 2,
  })
);

/**
 * MarkdownRenderer — parses markdown into ANSI-styled terminal output.
 *
 * Uses `marked` with `marked-terminal` for rich terminal rendering and
 * `cli-highlight` for syntax-highlighted code blocks.
 *
 * When `isPartial` is true (streaming), any unclosed code fences are
 * automatically closed before parsing so the output remains valid.
 *
 * The parsed result is memoized and only recomputed when `markdown`
 * or `isPartial` changes.
 */
export function MarkdownRenderer({
  markdown,
  isPartial,
}: MarkdownRendererProps): React.JSX.Element {
  const rendered = useMemo(() => {
    const source = isPartial ? closePartialFences(markdown) : markdown;

    if (!source) {
      return '';
    }

    const result = markedInstance.parse(source, { async: false });
    // Trim trailing newline that marked typically appends
    return result.replace(/\n$/, '');
  }, [markdown, isPartial]);

  return <Text>{rendered}</Text>;
}

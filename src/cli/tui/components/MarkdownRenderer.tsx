import React, { useMemo } from 'react';
import { Text, useWindowSize } from 'ink';
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
 * Create a Marked instance configured for the given terminal width.
 */
function createMarkedInstance(width: number): Marked {
  return new Marked(
    markedTerminal({
      code: (code: string, lang: string): string => {
        const label = lang ? `\x1b[2m${lang}\x1b[22m\n` : '';
        try {
          return label + highlight(code, { language: lang, ignoreIllegals: true });
        } catch {
          return label + code;
        }
      },
      reflowText: true,
      showSectionPrefix: false,
      tab: 2,
      width, // caller already accounts for padding chain
    })
  );
}

/**
 * MarkdownRenderer — parses markdown into ANSI-styled terminal output.
 *
 * Uses `marked` with `marked-terminal` for rich terminal rendering and
 * `cli-highlight` for syntax-highlighted code blocks.
 *
 * When `isPartial` is true (streaming), any unclosed code fences are
 * automatically closed before parsing so the output remains valid.
 *
 * The parsed result is memoized and only recomputed when `markdown`,
 * `isPartial`, or terminal width changes.
 */
export function MarkdownRenderer({
  markdown,
  isPartial,
  maxWidth,
}: MarkdownRendererProps): React.JSX.Element {
  const { columns } = useWindowSize();
  // Full padding chain: paddingX(1)=2 + paddingLeft(2)=2 + paddingX(1)=2 = 6 chars
  // Plus 2 chars safety margin = 8
  const effectiveWidth = maxWidth ?? Math.max(40, columns - 8);

  const rendered = useMemo(() => {
    const source = isPartial ? closePartialFences(markdown) : markdown;

    if (!source) {
      return '';
    }

    const instance = createMarkedInstance(effectiveWidth);
    const result = instance.parse(source, { async: false });
    // Trim trailing newline that marked typically appends
    return result.replace(/\n$/, '');
  }, [markdown, isPartial, effectiveWidth]);

  return <Text>{rendered}</Text>;
}

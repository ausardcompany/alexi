/**
 * Type declarations for marked-terminal (no official types available)
 */

declare module 'marked-terminal' {
  import type { MarkedExtension } from 'marked';

  export interface TerminalRendererOptions {
    /** Whether to use colors (default: true) */
    unescape?: boolean;
    /** Code block language highlighting options */
    code?: (code: string, lang: string) => string;
    /** Heading color */
    firstHeading?: string;
    /** Whether to show reflowText */
    reflowText?: boolean;
    /** Terminal width for wrapping */
    width?: number;
    /** Show section prefix */
    showSectionPrefix?: boolean;
    /** Whether to use word wrapping */
    wordWrap?: boolean;
    /** Tab size */
    tab?: number;
    /** Emoji support */
    emoji?: boolean;
  }

  export class TerminalRenderer {
    constructor(options?: TerminalRendererOptions);
    code(code: string, lang: string): string;
    heading(text: string, level: number): string;
    strong(text: string): string;
    em(text: string): string;
    codespan(text: string): string;
    link(href: string, title: string | null, text: string): string;
    list(body: string, ordered: boolean): string;
    listitem(text: string): string;
    blockquote(quote: string): string;
    paragraph(text: string): string;
    hr(): string;
    br(): string;
    table(header: string, body: string): string;
    tablerow(content: string): string;
    tablecell(content: string, flags: { header: boolean; align: string | null }): string;
    text(text: string): string;
  }

  export function markedTerminal(
    options?: TerminalRendererOptions,
    highlightOptions?: Record<string, unknown>
  ): MarkedExtension;

  const _default: typeof TerminalRenderer;
  export default _default;
}

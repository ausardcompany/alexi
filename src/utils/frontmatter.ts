/**
 * Frontmatter loading helpers with UTF-8 BOM tolerance.
 *
 * Windows Notepad saves files as "UTF-8 with BOM" by default, which prepends
 * a byte-order mark (U+FEFF) to the file. YAML frontmatter parsers such as
 * `gray-matter` and simple regex-style parsers require the opening `---`
 * delimiter to appear at byte offset 0 — with a BOM in the way, they silently
 * treat the file as having no frontmatter, and the loader ends up with an
 * empty metadata object (no error, the skill/command/agent just doesn't
 * load correctly).
 *
 * These helpers strip a leading BOM before the content is handed to
 * `gray-matter` or any other frontmatter parser, so files saved with
 * Windows Notepad's default encoding are handled the same as LF-only files.
 *
 * See: https://github.com/cline/cline/pull/12277 for the original report.
 */
import fs from 'fs';
import fsPromises from 'fs/promises';

/** UTF-8 BOM code point (U+FEFF) as a JavaScript string. */
const BOM = '\uFEFF';

/**
 * Remove a leading UTF-8 BOM (U+FEFF) from `content` if present.
 * No-op when the string does not start with a BOM.
 *
 * Note: only the FIRST character is inspected. A BOM in the middle of a file
 * is left untouched — that would be a genuine data character, not an encoding
 * marker.
 */
export function stripUtf8Bom(content: string): string {
  if (content.length > 0 && content.charCodeAt(0) === 0xfeff) {
    return content.slice(1);
  }
  return content;
}

/**
 * Read a UTF-8 encoded text file and strip a leading BOM if present.
 *
 * Use this in place of `fs.promises.readFile(path, 'utf-8')` when the file is
 * about to be handed to a frontmatter parser (or any other parser that
 * requires known content at byte offset 0).
 */
export async function readUtf8FileStripBom(path: string): Promise<string> {
  const content = await fsPromises.readFile(path, 'utf-8');
  return stripUtf8Bom(content);
}

/**
 * Synchronous variant of {@link readUtf8FileStripBom}. Prefer the async
 * version in new code; this exists to plug into legacy call sites that
 * already use `fs.readFileSync`.
 */
export function readUtf8FileSyncStripBom(path: string): string {
  const content = fs.readFileSync(path, 'utf-8');
  return stripUtf8Bom(content);
}

// Internal export for tests.
export const _BOM = BOM;

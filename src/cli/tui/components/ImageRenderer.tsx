/**
 * ImageRenderer — TUI component for {@link NormalizedImageChunk} payloads.
 *
 * Ink does not render raster images inside the terminal cell buffer;
 * instead this component surfaces a compact, colour-coded reference the
 * user can act on:
 *   - `kind: 'url'`  — prints the URL verbatim (most terminals hyperlink it
 *     automatically) so it can be clicked or copied.
 *   - `kind: 'base64'` — reports the MIME type and, when provided by the
 *     tool layer, the on-disk path where the decoded bytes live.
 *
 * The component is intentionally single-line-per-image to keep chat scroll
 * behaviour predictable. Callers wrap it in a parent `<Box flexDirection="column">`
 * when rendering multi-image responses.
 */

import React from 'react';
import { Box, Text } from 'ink';

import type { NormalizedImageChunk } from '../../../providers/index.js';
import { useTheme } from '../context/ThemeContext.js';

/**
 * Extended chunk shape used by the renderer. `NormalizedImageChunk` is a
 * discriminated union, so we intersect with a plain record carrying the
 * two optional persistence fields (`path`, `sizeBytes`). Downstream tools
 * (see `src/tool/tools/image-gen.ts::persistImageChunk`) populate these
 * after decoding base64 payloads to disk so the TUI can show a clickable
 * path in addition to the raw base64 discriminator.
 */
export type RenderableImageChunk = NormalizedImageChunk & {
  /** Absolute filesystem path when a base64 chunk was persisted to disk. */
  path?: string;
  /** Byte length of the decoded blob when a base64 chunk was persisted. */
  sizeBytes?: number;
};

export interface ImageRendererProps {
  images: readonly RenderableImageChunk[];
}

function formatBytes(bytes: number | undefined): string | undefined {
  if (bytes === undefined || bytes < 0) {
    return undefined;
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageRenderer({ images }: ImageRendererProps): React.JSX.Element | null {
  const { theme } = useTheme();
  const { colors } = theme;

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Box flexDirection="column">
      {images.map((image, idx) => {
        const key = `${idx}-${image.kind}`;
        if (image.kind === 'url') {
          return (
            <Box key={key}>
              <Text color={colors.info} bold>
                [image]
              </Text>
              <Text color={colors.dimText}> {image.mimeType ? `${image.mimeType} ` : ''}</Text>
              <Text color={colors.primary}>{image.url}</Text>
            </Box>
          );
        }

        // kind === 'base64'
        const size = formatBytes(image.sizeBytes);
        const label = image.mimeType ? image.mimeType : 'base64';
        return (
          <Box key={key}>
            <Text color={colors.info} bold>
              [image]
            </Text>
            <Text color={colors.dimText}>
              {' '}
              {label}
              {size ? ` · ${size}` : ''}{' '}
            </Text>
            <Text color={colors.primary}>{image.path ?? '(inline base64)'}</Text>
          </Box>
        );
      })}
    </Box>
  );
}

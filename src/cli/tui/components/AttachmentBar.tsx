import React from 'react';
import { Box, Text } from 'ink';

import { useAttachments } from '../context/AttachmentContext.js';
import { formatSize } from '../../../utils/imageValidation.js';

// ---------------------------------------------------------------------------
// AttachmentBar — shows pending image attachments below the input box
// ---------------------------------------------------------------------------

/**
 * Renders a compact bar showing pending image attachments.
 * Only visible when at least one attachment exists or an error occurred.
 *
 * Shows:
 * - Each attachment: format + size (e.g. "PNG 128 KB")
 * - Reading indicator when clipboard read is in progress
 * - Error message on failure
 * - Hint: "Esc to remove"
 */
export function AttachmentBar(): React.JSX.Element | null {
  const { pending, reading, error } = useAttachments();

  // Nothing to show
  if (pending.length === 0 && !reading && !error) {
    return null;
  }

  return (
    <Box flexDirection="row" gap={1}>
      {/* Reading indicator */}
      {reading && <Text color="yellow">Reading clipboard...</Text>}

      {/* Error message */}
      {error && !reading && <Text color="red">{error}</Text>}

      {/* Attachment chips */}
      {!reading && !error && pending.length > 0 && (
        <>
          <Text color="cyan">{pending.length === 1 ? '1 image' : `${pending.length} images`}:</Text>
          {pending.map((att) => (
            <Text key={att.id} color="cyan">
              [{att.format.toUpperCase()} {formatSize(att.sizeBytes)}]
            </Text>
          ))}
          <Text dimColor>Esc to remove</Text>
        </>
      )}
    </Box>
  );
}

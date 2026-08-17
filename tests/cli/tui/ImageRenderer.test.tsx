import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';

import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import {
  ImageRenderer,
  type RenderableImageChunk,
} from '../../../src/cli/tui/components/ImageRenderer.js';

function renderImages(images: RenderableImageChunk[]) {
  return render(
    <ThemeProvider>
      <ImageRenderer images={images} />
    </ThemeProvider>
  );
}

describe('ImageRenderer', () => {
  it('renders nothing for an empty list', () => {
    const { lastFrame } = renderImages([]);
    expect(lastFrame()?.trim() ?? '').toBe('');
  });

  it('renders URL image chunks with the URL text', () => {
    const { lastFrame } = renderImages([
      { kind: 'url', url: 'https://example.com/cat.png', mimeType: 'image/png' },
    ]);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('[image]');
    expect(frame).toContain('https://example.com/cat.png');
    expect(frame).toContain('image/png');
  });

  it('renders base64 chunks with the resolved path and size', () => {
    const { lastFrame } = renderImages([
      {
        kind: 'base64',
        data: 'AAECAw==',
        mimeType: 'image/jpeg',
        path: '/tmp/alexi-images/foo.jpg',
        sizeBytes: 2048,
      },
    ]);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('[image]');
    expect(frame).toContain('image/jpeg');
    expect(frame).toContain('/tmp/alexi-images/foo.jpg');
    // 2048 bytes -> "2.0 KB"
    expect(frame).toContain('2.0 KB');
  });

  it('falls back to "(inline base64)" when no path is provided', () => {
    const { lastFrame } = renderImages([{ kind: 'base64', data: 'AA==' }]);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('(inline base64)');
  });

  it('renders multiple images stacked', () => {
    const { lastFrame } = renderImages([
      { kind: 'url', url: 'https://a/1.png' },
      { kind: 'url', url: 'https://a/2.png' },
    ]);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('https://a/1.png');
    expect(frame).toContain('https://a/2.png');
  });
});

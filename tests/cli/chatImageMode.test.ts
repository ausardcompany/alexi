/**
 * Tests for `alexi chat --image` mode.
 *
 * These tests exercise the `runChatImageMode` helper directly instead of
 * booting Commander so we can mock the underlying `image_gen` tool and
 * assert on the rendered stdout/stderr lines without shell-invoking the
 * CLI. See `src/cli/commands/chat.ts::runChatImageMode` for the contract.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the tool module BEFORE importing the chat command so vi.mock
// hoisting lands on the same module instance the command imports at
// runtime. Uses the SAME technique as the image-gen tool test.
vi.mock('../../src/tool/tools/image-gen.js', () => ({
  imageGenTool: {
    executeUnsafe: vi.fn(),
  },
}));

import { runChatImageMode } from '../../src/cli/commands/chat.js';
import { imageGenTool } from '../../src/tool/tools/image-gen.js';

const mockedExecuteUnsafe = vi.mocked(imageGenTool.executeUnsafe);

describe('runChatImageMode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects an empty prompt without invoking the tool', async () => {
    const result = await runChatImageMode({ prompt: '' });
    expect(result.exitCode).toBe(1);
    expect(result.errorLines[0]).toMatch(/--image requires a non-empty prompt/);
    expect(mockedExecuteUnsafe).not.toHaveBeenCalled();
  });

  it('rejects a whitespace-only prompt', async () => {
    const result = await runChatImageMode({ prompt: '   \n\t' });
    expect(result.exitCode).toBe(1);
    expect(result.errorLines[0]).toMatch(/--image requires a non-empty prompt/);
  });

  it('renders a URL image as a `url ...` line', async () => {
    mockedExecuteUnsafe.mockResolvedValueOnce({
      success: true,
      data: {
        model: 'gemini-imagen-3',
        prompt: 'sunset over mountains',
        images: [
          {
            kind: 'url',
            url: 'https://example.com/sunset.png',
            mimeType: 'image/png',
          },
        ],
      },
    });

    const result = await runChatImageMode({
      prompt: 'sunset over mountains',
      model: 'gemini-imagen-3',
    });

    expect(result.exitCode).toBe(0);
    expect(result.errorLines).toEqual([]);
    expect(result.lines[0]).toBe('[Model: gemini-imagen-3]');
    expect(result.lines[1]).toBe('url image/png https://example.com/sunset.png');
    expect(mockedExecuteUnsafe).toHaveBeenCalledWith(
      {
        prompt: 'sunset over mountains',
        model: 'gemini-imagen-3',
        size: undefined,
        outputPath: undefined,
      },
      expect.objectContaining({ workdir: expect.any(String) })
    );
  });

  it('renders a base64 image with an on-disk path as a `file ...` line', async () => {
    mockedExecuteUnsafe.mockResolvedValueOnce({
      success: true,
      data: {
        model: 'gemini-imagen-3',
        prompt: 'cat',
        images: [
          {
            kind: 'base64',
            path: '/tmp/alexi-images/image-abc.png',
            mimeType: 'image/png',
            sizeBytes: 4096,
          },
        ],
      },
    });

    const result = await runChatImageMode({ prompt: 'cat' });

    expect(result.exitCode).toBe(0);
    expect(result.lines[0]).toBe('[Model: gemini-imagen-3]');
    expect(result.lines[1]).toBe('file image/png /tmp/alexi-images/image-abc.png (4096 bytes)');
  });

  it('renders an inline base64 image as a `base64 ...` size line (no raw data)', async () => {
    mockedExecuteUnsafe.mockResolvedValueOnce({
      success: true,
      data: {
        model: 'gemini-imagen-3',
        prompt: 'cat',
        images: [
          {
            kind: 'base64',
            data: 'AAAAAAAA',
            mimeType: 'image/png',
            sizeBytes: 6,
          },
        ],
      },
    });

    const result = await runChatImageMode({ prompt: 'cat' });

    expect(result.exitCode).toBe(0);
    expect(result.lines[1]).toBe('base64 image/png (6 bytes)');
    // The raw base64 payload MUST NOT be echoed to stdout.
    expect(result.lines.join('\n')).not.toContain('AAAAAAAA');
  });

  it('forwards size and outputPath to the tool call', async () => {
    mockedExecuteUnsafe.mockResolvedValueOnce({
      success: true,
      data: {
        model: 'gemini-imagen-3',
        prompt: 'x',
        images: [{ kind: 'url', url: 'https://a/1.png' }],
      },
    });

    await runChatImageMode({
      prompt: 'x',
      size: '512x512',
      outputPath: '/tmp/custom-out',
    });

    expect(mockedExecuteUnsafe).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: 'x',
        size: '512x512',
        outputPath: '/tmp/custom-out',
      }),
      expect.any(Object)
    );
  });

  it('returns exit code 1 and prints the error + hint when the tool fails', async () => {
    mockedExecuteUnsafe.mockResolvedValueOnce({
      success: false,
      error: 'Model "gpt-4o" does not advertise the image-generation capability.',
      hint: 'Choose a model that does, or add capability metadata for it.',
    });

    const result = await runChatImageMode({ prompt: 'x', model: 'gpt-4o' });

    expect(result.exitCode).toBe(1);
    expect(result.lines).toEqual([]);
    expect(result.errorLines[0]).toMatch(/Error: /);
    expect(result.errorLines[0]).toMatch(/does not advertise the image-generation capability/);
    expect(result.errorLines[1]).toMatch(/^Hint:/);
  });

  it('renders a partial-success hint when the tool truncates', async () => {
    mockedExecuteUnsafe.mockResolvedValueOnce({
      success: true,
      truncated: true,
      hint: 'The provider reported a rate limit. Partial result: 1 image(s) delivered.',
      data: {
        model: 'gemini-imagen-3',
        prompt: 'x',
        images: [{ kind: 'url', url: 'https://a/1.png' }],
      },
    });

    const result = await runChatImageMode({ prompt: 'x' });

    expect(result.exitCode).toBe(0);
    const rendered = result.lines.join('\n');
    expect(rendered).toContain('[Model: gemini-imagen-3]');
    expect(rendered).toContain('url  https://a/1.png');
    expect(rendered).toMatch(/\[Partial: .*rate limit/);
  });

  it('handles a missing hint on a failure gracefully', async () => {
    mockedExecuteUnsafe.mockResolvedValueOnce({
      success: false,
      error: 'unclassified',
    });

    const result = await runChatImageMode({ prompt: 'x' });
    expect(result.exitCode).toBe(1);
    expect(result.errorLines).toHaveLength(1);
    expect(result.errorLines[0]).toBe('Error: unclassified');
  });

  it('handles a success payload without images by treating it as failure surface', async () => {
    // The image_gen tool never returns success=true with an empty images
    // array (it returns a failure with hint instead), but the render loop
    // MUST tolerate a data-less success without throwing. Reproduces the
    // contract: no data -> exit 1 with a generic error.
    mockedExecuteUnsafe.mockResolvedValueOnce({
      success: true,
    });

    const result = await runChatImageMode({ prompt: 'x' });
    expect(result.exitCode).toBe(1);
    expect(result.errorLines[0]).toBe('Error: image generation failed');
  });
});

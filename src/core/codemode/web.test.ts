/**
 * codemodeFetch — file:// SSRF guard tests.
 *
 * Mirrors upstream opencode test(core) e5f4bf4c which matches the exact
 * error wording so operators find the same guidance across tools.
 */

import { describe, it, expect } from 'vitest';
import { codemodeFetch } from './web.js';

describe('codemodeFetch', () => {
  it('rejects file:// urls', async () => {
    await expect(codemodeFetch('file:///etc/passwd')).rejects.toThrow(
      /refusing to fetch file:\/\//
    );
  });

  it('rejects file:// urls with uppercase scheme', async () => {
    // URL parser lowercases schemes, but we assert nonetheless that the
    // guard does not get bypassed by casing tricks in the input.
    await expect(codemodeFetch('FILE:///etc/passwd')).rejects.toThrow(
      /refusing to fetch file:\/\//
    );
  });

  it('rejects any file:// path, not just /etc/passwd', async () => {
    await expect(codemodeFetch('file:///home/runner/.alexi/sessions/x.json')).rejects.toThrow(
      /refusing to fetch file:\/\//
    );
  });
});

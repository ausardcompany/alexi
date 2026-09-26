/**
 * Tests for the safe URL opener. We only exercise the scheme allow-list
 * here — actually spawning `xdg-open` in CI would be flaky and platform-
 * specific.
 */

import { describe, expect, it } from 'vitest';
import { openUrl } from './open.js';

describe('openUrl', () => {
  it('rejects non-URL values', async () => {
    await expect(openUrl('not a url')).rejects.toThrow(/Only http and https links/);
    await expect(openUrl('')).rejects.toThrow(/Only http and https links/);
  });

  it('rejects dangerous schemes', async () => {
    await expect(openUrl('file:///etc/hosts')).rejects.toThrow(/Only http and https links/);
    await expect(openUrl('javascript:alert(1)')).rejects.toThrow(/Only http and https links/);
    await expect(openUrl('ms-msdt:/id PCWDiagnostic')).rejects.toThrow(/Only http and https links/);
    await expect(openUrl('data:text/html,<script>alert(1)</script>')).rejects.toThrow(
      /Only http and https links/
    );
    await expect(openUrl('vbscript:msgbox(1)')).rejects.toThrow(/Only http and https links/);
  });

  it('rejects UNC-style paths that would otherwise coerce to file:', async () => {
    await expect(openUrl('\\\\server\\share\\file.html')).rejects.toThrow(
      /Only http and https links/
    );
    await expect(openUrl('//server/share/file.html')).rejects.toThrow(/Only http and https links/);
  });
});

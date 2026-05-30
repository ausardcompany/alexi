/**
 * `/reload-skills` command-layer test.
 *
 * Stubs the underlying `reloadSkills` registry function and verifies the
 * command formats the count summary correctly.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const { reloadSkillsMock } = vi.hoisted(() => ({ reloadSkillsMock: vi.fn() }));

vi.mock('../skill/index.js', () => ({
  reloadSkills: reloadSkillsMock,
}));

import { runReloadSkills } from './reloadSkills.js';

describe('runReloadSkills', () => {
  beforeEach(() => {
    reloadSkillsMock.mockReset();
  });

  it('returns a one-line summary using the underlying reloadSkills counts', async () => {
    reloadSkillsMock.mockReturnValue({ added: 2, removed: 1, total: 7 });

    const summary = await runReloadSkills('/some/workdir');

    expect(reloadSkillsMock).toHaveBeenCalledWith('/some/workdir');
    expect(summary).toBe('Skills reloaded: +2 added, -1 removed, 7 total.');
  });

  it('handles a no-op reload (no skills changed)', async () => {
    reloadSkillsMock.mockReturnValue({ added: 0, removed: 0, total: 0 });

    const summary = await runReloadSkills(process.cwd());

    expect(summary).toBe('Skills reloaded: +0 added, -0 removed, 0 total.');
  });
});

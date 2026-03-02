import { describe, it, expect } from 'vitest';
import {
  buildAttributionTrailers,
  appendTrailers,
  buildAuthorEnv,
  formatCommitMessage,
} from '../../src/git/attribution.js';
import type { GitConfig } from '../../src/git/config.js';

const baseConfig: GitConfig = {
  autoCommits: true,
  dirtyCommits: true,
  commitVerify: false,
  attribution: {
    style: 'co-authored-by',
    name: 'Alexi AI',
    email: 'alexi@assistant.local',
  },
  commitMessage: {
    useAI: false,
    conventional: true,
  },
};

describe('buildAttributionTrailers', () => {
  it('returns empty array for style=none', () => {
    const config: GitConfig = {
      ...baseConfig,
      attribution: { ...baseConfig.attribution, style: 'none' },
    };
    expect(buildAttributionTrailers(config)).toEqual([]);
  });

  it('returns Co-authored-by trailer for style=co-authored-by', () => {
    const trailers = buildAttributionTrailers(baseConfig);
    expect(trailers).toEqual(['Co-authored-by: Alexi AI <alexi@assistant.local>']);
  });

  it('returns Co-authored-by trailer for style=author (for recording purposes)', () => {
    const config: GitConfig = {
      ...baseConfig,
      attribution: { ...baseConfig.attribution, style: 'author' },
    };
    const trailers = buildAttributionTrailers(config);
    expect(trailers).toEqual(['Co-authored-by: Alexi AI <alexi@assistant.local>']);
  });

  it('returns Committed-by trailer for style=committer', () => {
    const config: GitConfig = {
      ...baseConfig,
      attribution: { ...baseConfig.attribution, style: 'committer' },
    };
    const trailers = buildAttributionTrailers(config);
    expect(trailers).toEqual(['Committed-by: Alexi AI <alexi@assistant.local>']);
  });
});

describe('appendTrailers', () => {
  it('appends trailers separated by blank line', () => {
    const result = appendTrailers('feat: add thing', ['Co-authored-by: Bot <b@b.com>']);
    expect(result).toBe('feat: add thing\n\nCo-authored-by: Bot <b@b.com>');
  });

  it('returns message unchanged when trailers is empty', () => {
    expect(appendTrailers('feat: add thing', [])).toBe('feat: add thing');
  });

  it('trims trailing whitespace from message before appending', () => {
    const result = appendTrailers('feat: add thing   ', ['Co-authored-by: Bot <b@b.com>']);
    expect(result).toBe('feat: add thing\n\nCo-authored-by: Bot <b@b.com>');
  });
});

describe('buildAuthorEnv', () => {
  it('returns undefined for non-author styles', () => {
    expect(buildAuthorEnv(baseConfig)).toBeUndefined();
    const none: GitConfig = {
      ...baseConfig,
      attribution: { ...baseConfig.attribution, style: 'none' },
    };
    expect(buildAuthorEnv(none)).toBeUndefined();
  });

  it('returns env vars for style=author', () => {
    const config: GitConfig = {
      ...baseConfig,
      attribution: { ...baseConfig.attribution, style: 'author' },
    };
    const env = buildAuthorEnv(config);
    expect(env).toEqual({
      GIT_AUTHOR_NAME: 'Alexi AI',
      GIT_AUTHOR_EMAIL: 'alexi@assistant.local',
    });
  });
});

describe('formatCommitMessage', () => {
  it('appends Co-authored-by to message with co-authored-by style', () => {
    const msg = formatCommitMessage('feat: do something', baseConfig);
    expect(msg).toBe('feat: do something\n\nCo-authored-by: Alexi AI <alexi@assistant.local>');
  });

  it('returns plain message when attribution style is none', () => {
    const config: GitConfig = {
      ...baseConfig,
      attribution: { ...baseConfig.attribution, style: 'none' },
    };
    const msg = formatCommitMessage('feat: do something', config);
    expect(msg).toBe('feat: do something');
  });
});

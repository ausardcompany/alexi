import { describe, it, expect } from 'vitest';
import { matchCommand, matchPattern } from '../../src/permission/wildcard.js';

describe('matchCommand', () => {
  describe('backwards compatibility (plain first-token patterns)', () => {
    it('matches an exact command name', () => {
      expect(matchCommand('find . -name foo', ['find'])).toBe(true);
      expect(matchCommand('ls -la', ['ls'])).toBe(true);
    });

    it('does not match a different command name', () => {
      expect(matchCommand('cat file', ['ls'])).toBe(false);
    });

    it('matches the bare wildcard', () => {
      expect(matchCommand('anything goes', ['*'])).toBe(true);
    });

    it('matches an empty allowlist as false', () => {
      expect(matchCommand('find .', [])).toBe(false);
    });
  });

  describe('non-leading wildcards (full-command match)', () => {
    it('matches mkfs* against mkfs.ext4 with a path argument', () => {
      // Regression: previously `mkfs*` compared only to `cmdName` (which
      // happens to contain no `/`), but the widened matcher must still
      // fire even when the full command contains `/`.
      expect(matchCommand('mkfs.ext4 /dev/sda', ['mkfs*'])).toBe(true);
    });

    it('does not match unrelated commands via non-leading wildcards', () => {
      expect(matchCommand('ls -la', ['mkfs*'])).toBe(false);
    });
  });

  describe('whitespace patterns (full-command match)', () => {
    it('matches find -exec via `find *-exec*`', () => {
      expect(matchCommand('find . -exec sh -c whoami ;', ['find *-exec*'])).toBe(true);
    });

    it('matches find -execdir via `find *-execdir*`', () => {
      expect(matchCommand('find . -execdir sh -c pwd ;', ['find *-execdir*'])).toBe(true);
    });

    it('matches find -delete via `find *-delete*`', () => {
      expect(matchCommand('find . -delete', ['find *-delete*'])).toBe(true);
    });

    it('matches find -fprint / -fprintf / -fls', () => {
      expect(matchCommand('find . -fprint out', ['find *-fprint*'])).toBe(true);
      expect(matchCommand('find . -fprintf out %p', ['find *-fprintf*'])).toBe(true);
      expect(matchCommand('find . -fls out', ['find *-fls*'])).toBe(true);
    });

    it('does NOT match benign find invocations via -exec pattern', () => {
      expect(matchCommand("find . -name '*.ts'", ['find *-exec*'])).toBe(false);
      expect(matchCommand('find . -type f', ['find *-exec*'])).toBe(false);
    });

    it('still allows plain find via the plain `find` pattern', () => {
      expect(matchCommand("find . -name '*.ts'", ['find'])).toBe(true);
    });

    it('matches `sort -o out` via `sort *-o *`', () => {
      expect(matchCommand('sort file -o out', ['sort *-o *'])).toBe(true);
    });

    it('matches `sort file -o out` via `sort * -o *`', () => {
      expect(matchCommand('sort file -o out', ['sort * -o *'])).toBe(true);
    });

    it('matches `sort --output=out file` via `sort *--output*`', () => {
      expect(matchCommand('sort --output=out file', ['sort *--output*'])).toBe(true);
    });

    it('matches --compress-program and --files0-from', () => {
      expect(matchCommand('sort --compress-program=gzip file', ['sort *--compress-program*'])).toBe(
        true
      );
      expect(matchCommand('sort --files0-from=list', ['sort *--files0-from*'])).toBe(true);
    });

    it('does NOT match plain `sort file`', () => {
      const denyList = [
        'sort *-o *',
        'sort * -o *',
        'sort *--output*',
        'sort *--compress-program*',
        'sort *--files0-from*',
      ];
      expect(matchCommand('sort file', denyList)).toBe(false);
    });

    it('matches the classic dangerous shape `rm -rf /`', () => {
      // Regression: whitespace patterns like `rm -rf /` used to be dead
      // rules because matchCommand only inspected the first token.
      expect(matchCommand('rm -rf /', ['rm -rf /'])).toBe(true);
    });

    it('matches `rm -rf /*` glob shape', () => {
      expect(matchCommand('rm -rf /home', ['rm -rf /*'])).toBe(true);
    });

    it('is not bypassed by leading or trailing whitespace', () => {
      // Regression: a stray leading space used to make the full-command
      // regex (`^find.*-exec.*$`) miss and silently allow the command.
      expect(matchCommand('  find . -exec sh -c whoami ;', ['find *-exec*'])).toBe(true);
      expect(matchCommand('find . -exec sh -c whoami ;   ', ['find *-exec*'])).toBe(true);
      expect(matchCommand('\tfind . -exec sh -c whoami ;', ['find *-exec*'])).toBe(true);
    });
  });

  describe('multiple patterns', () => {
    it('returns true if any pattern in the list matches', () => {
      expect(matchCommand('find . -exec sh -c whoami ;', ['find *-delete*', 'find *-exec*'])).toBe(
        true
      );
    });

    it('returns false if no pattern matches', () => {
      expect(matchCommand('ls -la', ['find *-exec*', 'sort *-o *'])).toBe(false);
    });
  });
});

describe('matchPattern (used elsewhere; sanity check)', () => {
  it('still respects `/` boundaries for file globs', () => {
    // Regression sanity: file glob semantics should be unchanged.
    expect(matchPattern('src/*', 'src/foo.ts').matched).toBe(true);
    expect(matchPattern('src/*', 'src/nested/foo.ts').matched).toBe(false);
  });
});

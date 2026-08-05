/**
 * Unit tests for the read-only bash command parser used by plan mode.
 *
 * Verifies that `isCommandReadOnly` correctly distinguishes
 * investigation commands (allowed in plan mode) from any command that
 * modifies files, VCS state, package manager state, or the network.
 *
 * Ported concepts from kilocode #12906.
 */

import { describe, it, expect } from 'vitest';
import { isCommandReadOnly, _testing } from '../../../src/tool/tools/bash-command-parser.js';

describe('isCommandReadOnly - read-only commands allowed', () => {
  it.each([
    'ls',
    'ls -la',
    'ls /tmp',
    'cat README.md',
    'head -n 20 file.txt',
    'tail -f logs.txt',
    'grep -r foo src',
    'rg foo src',
    'pwd',
    'echo hello world',
    'find src -name "*.ts"',
    'wc -l file.txt',
    'diff a.txt b.txt',
    'du -sh .',
    'df -h',
    'stat file.txt',
    'which node',
    'date',
    'uname -a',
  ])('allows: %s', (cmd) => {
    expect(isCommandReadOnly(cmd)).toBe(true);
  });
});

describe('isCommandReadOnly - git subcommands', () => {
  it.each([
    'git status',
    'git log',
    'git log --oneline -20',
    'git diff',
    'git diff HEAD~1',
    'git show HEAD',
    'git branch',
    'git tag',
    'git remote',
    'git ls-files',
    'git stash list',
    'git worktree list',
    'git submodule status',
    'git help',
    'git -C /tmp/repo status',
    'git --no-pager log',
  ])('allows read-only git: %s', (cmd) => {
    expect(isCommandReadOnly(cmd)).toBe(true);
  });

  it.each([
    'git add .',
    'git commit -m "wip"',
    'git push origin master',
    'git pull',
    'git fetch',
    'git merge feature',
    'git rebase master',
    'git cherry-pick abc123',
    'git revert HEAD',
    'git reset --hard',
    'git checkout master',
    'git switch feature',
    'git restore file.txt',
    'git clean -fdx',
    'git stash save "wip"',
    'git stash push',
    'git stash apply',
    'git stash pop',
    'git stash drop',
    'git stash clear',
  ])('blocks mutating git: %s', (cmd) => {
    expect(isCommandReadOnly(cmd)).toBe(false);
  });
});

describe('isCommandReadOnly - write commands blocked', () => {
  it.each([
    'rm file.txt',
    'rm -rf /tmp/foo',
    'mv a.txt b.txt',
    'cp a.txt b.txt',
    'tee output.txt',
    'touch newfile.txt',
    'truncate -s 0 file.txt',
    'chmod +x script.sh',
    'chown user:user file',
    'mkdir newdir',
    'rmdir olddir',
    'ln -s source target',
    'dd if=/dev/zero of=file bs=1M',
  ])('blocks: %s', (cmd) => {
    expect(isCommandReadOnly(cmd)).toBe(false);
  });
});

describe('isCommandReadOnly - in-place editors blocked', () => {
  it('blocks sed -i', () => {
    expect(isCommandReadOnly('sed -i s/foo/bar/g file.txt')).toBe(false);
  });

  it('blocks sed --in-place', () => {
    expect(isCommandReadOnly('sed --in-place s/foo/bar/g file.txt')).toBe(false);
  });

  it('allows sed without -i', () => {
    expect(isCommandReadOnly('sed s/foo/bar/g file.txt')).toBe(true);
  });

  it('blocks perl -i', () => {
    expect(isCommandReadOnly('perl -i -pe s/foo/bar/g file.txt')).toBe(false);
  });

  it('blocks perl -i.bak', () => {
    expect(isCommandReadOnly('perl -i.bak -pe s/foo/bar/g file.txt')).toBe(false);
  });

  it('blocks gawk -i inplace', () => {
    expect(isCommandReadOnly('gawk -i inplace {print} file.txt')).toBe(false);
  });

  it('blocks sort -o', () => {
    expect(isCommandReadOnly('sort -o out.txt in.txt')).toBe(false);
  });

  it('allows sort without -o', () => {
    expect(isCommandReadOnly('sort in.txt')).toBe(true);
  });
});

describe('isCommandReadOnly - output redirects', () => {
  it('blocks > to file path', () => {
    expect(isCommandReadOnly('echo hello > out.txt')).toBe(false);
  });

  it('blocks >> to file path', () => {
    expect(isCommandReadOnly('echo hello >> out.txt')).toBe(false);
  });

  it('blocks stderr redirect 2> to file', () => {
    expect(isCommandReadOnly('ls foo 2> err.txt')).toBe(false);
  });

  it('allows > /dev/null', () => {
    expect(isCommandReadOnly('echo hi > /dev/null')).toBe(true);
  });

  it('allows 2> /dev/null', () => {
    expect(isCommandReadOnly('ls /nonexistent 2> /dev/null')).toBe(true);
  });

  it('allows > /tmp/foo', () => {
    expect(isCommandReadOnly('echo hi > /tmp/foo')).toBe(true);
  });

  it('rejects .. traversal in /tmp redirect', () => {
    expect(isCommandReadOnly('echo hi > /tmp/../etc/passwd')).toBe(false);
  });

  it('rejects .. traversal in /dev redirect', () => {
    expect(isCommandReadOnly('echo hi > /dev/../etc/passwd')).toBe(false);
  });

  it('blocks <> read-write redirect', () => {
    expect(isCommandReadOnly('cat <> file.txt')).toBe(false);
  });
});

describe('isCommandReadOnly - package managers blocked', () => {
  it.each([
    'npm install',
    'npm i lodash',
    'npm ls',
    'pnpm install',
    'yarn add react',
    'pip install requests',
    'pip3 install pytest',
    'cargo install ripgrep',
    'cargo build',
    'gem install bundler',
    'apt install curl',
    'brew install jq',
    'docker run -it alpine',
    'kubectl apply -f pod.yaml',
    'terraform apply',
  ])('blocks package manager: %s', (cmd) => {
    expect(isCommandReadOnly(cmd)).toBe(false);
  });
});

describe('isCommandReadOnly - find flags', () => {
  it('allows find with -name', () => {
    expect(isCommandReadOnly('find . -name "*.ts"')).toBe(true);
  });

  it('blocks find -delete', () => {
    expect(isCommandReadOnly('find . -name "*.tmp" -delete')).toBe(false);
  });

  it('blocks find -exec', () => {
    expect(isCommandReadOnly('find . -name "*.tmp" -exec rm {} \\;')).toBe(false);
  });

  it('blocks find -execdir', () => {
    expect(isCommandReadOnly('find . -name x -execdir rm {} \\;')).toBe(false);
  });
});

describe('isCommandReadOnly - xargs', () => {
  it('allows xargs with read-only inner command', () => {
    expect(isCommandReadOnly('ls | xargs echo')).toBe(true);
  });

  it('allows xargs cat', () => {
    expect(isCommandReadOnly('ls *.md | xargs cat')).toBe(true);
  });

  it('blocks xargs rm', () => {
    expect(isCommandReadOnly('ls | xargs rm')).toBe(false);
  });

  it('blocks xargs mv', () => {
    expect(isCommandReadOnly('ls | xargs -I {} mv {} /tmp')).toBe(false);
  });

  it('blocks xargs sh -c', () => {
    expect(isCommandReadOnly('echo foo | xargs sh -c "rm $1"')).toBe(false);
  });
});

describe('isCommandReadOnly - nested shells and eval', () => {
  it.each([
    'sh -c "ls"',
    'bash -c "cat file"',
    'zsh -c pwd',
    'eval "ls"',
    'sudo ls',
    'sudo -u root ls',
    'source setup.sh',
    '. setup.sh',
  ])('blocks nested shell / eval / sudo: %s', (cmd) => {
    expect(isCommandReadOnly(cmd)).toBe(false);
  });
});

describe('isCommandReadOnly - quoting and masking', () => {
  it('does NOT trip on "rm" inside a double-quoted echo argument', () => {
    expect(isCommandReadOnly('echo "rm foo.txt"')).toBe(true);
  });

  it('does NOT trip on rm inside a single-quoted echo argument', () => {
    expect(isCommandReadOnly("echo 'rm foo.txt'")).toBe(true);
  });

  it('does NOT trip on rm inside a heredoc body', () => {
    const cmd = 'cat <<EOF\nrm foo.txt\nEOF';
    expect(isCommandReadOnly(cmd)).toBe(true);
  });

  it('does NOT trip on rm inside an indented heredoc body with <<-', () => {
    const cmd = 'cat <<-EOF\n\trm foo.txt\n\tEOF';
    expect(isCommandReadOnly(cmd)).toBe(true);
  });

  it('does NOT trip on rm inside a comment', () => {
    expect(isCommandReadOnly('ls # rm foo.txt')).toBe(true);
  });

  it('blocks command substitution $(...)', () => {
    expect(isCommandReadOnly('echo $(rm foo)')).toBe(false);
  });

  it('blocks process substitution <(...)', () => {
    expect(isCommandReadOnly('diff <(ls) <(ls -a)')).toBe(false);
  });
});

describe('isCommandReadOnly - pipelines and separators', () => {
  it('allows a fully read-only pipeline', () => {
    expect(isCommandReadOnly('ls | grep foo | wc -l')).toBe(true);
  });

  it('blocks a pipeline where any stage mutates', () => {
    expect(isCommandReadOnly('ls | tee out.txt')).toBe(false);
  });

  it('allows chained read-only commands with ;', () => {
    expect(isCommandReadOnly('pwd; ls; date')).toBe(true);
  });

  it('blocks chained commands when any is mutating', () => {
    expect(isCommandReadOnly('pwd; rm file.txt')).toBe(false);
  });

  it('blocks && when second command mutates', () => {
    expect(isCommandReadOnly('ls && rm foo')).toBe(false);
  });

  it('allows && when both sides are read-only', () => {
    expect(isCommandReadOnly('ls && pwd')).toBe(true);
  });

  it('blocks background & when command mutates', () => {
    expect(isCommandReadOnly('rm foo &')).toBe(false);
  });
});

describe('isCommandReadOnly - env var assignments', () => {
  it('allows env-prefixed read-only command', () => {
    expect(isCommandReadOnly('FOO=bar ls')).toBe(true);
  });

  it('blocks env-prefixed mutating command', () => {
    expect(isCommandReadOnly('FOO=bar rm x')).toBe(false);
  });
});

describe('isCommandReadOnly - edge cases', () => {
  it('rejects empty string', () => {
    expect(isCommandReadOnly('')).toBe(false);
  });

  it('rejects whitespace-only string', () => {
    expect(isCommandReadOnly('   ')).toBe(false);
  });

  it('rejects non-string input', () => {
    // deliberately violating types
    expect(isCommandReadOnly(undefined as unknown as string)).toBe(false);
    expect(isCommandReadOnly(null as unknown as string)).toBe(false);
    expect(isCommandReadOnly(42 as unknown as string)).toBe(false);
  });

  it('rejects unknown commands (conservative default)', () => {
    expect(isCommandReadOnly('my-random-tool --do-something')).toBe(false);
  });

  it('allows git alone', () => {
    expect(isCommandReadOnly('git')).toBe(true);
  });

  it('blocks node with arbitrary script', () => {
    expect(isCommandReadOnly('node script.js')).toBe(false);
  });

  it('allows node --version', () => {
    expect(isCommandReadOnly('node --version')).toBe(true);
  });
});

describe('isCommandReadOnly - internal helpers', () => {
  it('maskLiterals preserves length', () => {
    const input = 'echo "hi there" # comment';
    const masked = _testing.maskLiterals(input);
    expect(masked.length).toBe(input.length);
  });

  it('isRedirectTargetSafe accepts /dev/null', () => {
    expect(_testing.isRedirectTargetSafe('/dev/null')).toBe(true);
  });

  it('isRedirectTargetSafe rejects relative paths', () => {
    expect(_testing.isRedirectTargetSafe('foo.txt')).toBe(false);
  });

  it('isRedirectTargetSafe rejects .. traversal', () => {
    expect(_testing.isRedirectTargetSafe('/tmp/../etc/passwd')).toBe(false);
  });

  it('splitSegments splits on ; | && || & and newlines', () => {
    const segs = _testing.splitSegments('a ; b | c && d || e & f\ng');
    expect(segs).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
  });
});

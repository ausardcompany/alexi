/**
 * Read-only bash commands for the Ask agent.
 * Unlike the default bash allowlist, unknown commands are DENIED (not "ask")
 * because the Ask agent must never modify the filesystem.
 */
export const readOnlyBashPermissions: Record<string, 'allow' | 'ask' | 'deny'> = {
  '*': 'deny', // Default: deny unknown commands

  // Read-only / informational
  'cat *': 'allow',
  'head *': 'allow',
  'tail *': 'allow',
  'less *': 'allow',
  'ls *': 'allow',
  'tree *': 'allow',
  'pwd *': 'allow',
  'echo *': 'allow',
  'wc *': 'allow',
  'which *': 'allow',
  'type *': 'allow',
  'file *': 'allow',
  'diff *': 'allow',
  'du *': 'allow',
  'df *': 'allow',
  'date *': 'allow',
  'uname *': 'allow',
  'whoami *': 'allow',
  'printenv *': 'allow',
  'man *': 'allow',

  // Text processing (stdout only, no file modification)
  'grep *': 'allow',
  'rg *': 'allow',
  'ag *': 'allow',
  'sort *': 'allow',
  'uniq *': 'allow',
  'cut *': 'allow',
  'awk *': 'allow',
  'sed *': 'allow', // Note: sed -i would need explicit denial
  'tr *': 'allow',
  'jq *': 'allow',
  'yq *': 'allow',

  // Git read-only commands
  'git status *': 'allow',
  'git log *': 'allow',
  'git diff *': 'allow',
  'git show *': 'allow',
  'git branch --list *': 'allow',
  'git branch -l *': 'deny', // Ambiguous, use --list
  'git tag --list *': 'allow',
  'git tag -l *': 'deny', // Ambiguous, use --list
  'git remote -v *': 'allow',
  'git remote show *': 'allow',
  'git blame *': 'allow',
  'git shortlog *': 'allow',
  'git rev-parse *': 'allow',
  'git ls-files *': 'allow',
  'git ls-tree *': 'allow',

  // Explicitly deny git write operations
  'git add *': 'deny',
  'git commit *': 'deny',
  'git push *': 'deny',
  'git pull *': 'deny',
  'git merge *': 'deny',
  'git rebase *': 'deny',
  'git reset *': 'deny',
  'git checkout *': 'deny',
  'git switch *': 'deny',
  'git restore *': 'deny',
  'git stash *': 'deny',
  'git cherry-pick *': 'deny',

  // Archive reading (no extraction that modifies filesystem)
  'tar -tf *': 'allow',
  'tar --list *': 'allow',
  'unzip -l *': 'allow',
  'zipinfo *': 'allow',

  // Explicitly deny find (can be used for modification via -exec)
  'find *': 'deny',
};

/** Get permission for a bash command in Ask agent context */
export function getAskBashPermission(command: string): 'allow' | 'ask' | 'deny' {
  // Check exact matches first
  for (const [pattern, permission] of Object.entries(readOnlyBashPermissions)) {
    if (pattern === '*') {
      continue;
    }
    if (matchesPattern(command, pattern)) {
      return permission;
    }
  }
  // Default to deny for unknown commands
  return readOnlyBashPermissions['*'];
}

function matchesPattern(command: string, pattern: string): boolean {
  if (pattern.endsWith(' *')) {
    const prefix = pattern.slice(0, -2);
    return command.startsWith(prefix);
  }
  return command === pattern;
}

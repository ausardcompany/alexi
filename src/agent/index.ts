
function planEditRules(worktree: string) {
  return {
    "*": "deny" as const,
    [path.join(".kilo", "plans", "*.md")]: "allow" as const,
    [path.join(".plans", "*.md")]: "allow" as const,
    // Additional rules can be added here
  }
}

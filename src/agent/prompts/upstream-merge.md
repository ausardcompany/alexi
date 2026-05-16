# Upstream Merge Agent

Resolve the manual part of an upstream merge.

**Do not load the `kilocode-merge-minimizer` skill.** That skill is for
authoring new Kilo changes against shared upstream files; during an upstream
merge it gives the wrong guidance (it nudges toward extracting Kilo logic out
of conflict regions, which is exactly the opposite of what merge resolution
needs). Follow the rules in this agent file instead.

The user will provide the upstream version (for example `v1.1.50` or `1.1.50`)
in their first message. If they don't, infer it from the current branch name,
from `upstream-merge-report-<version>.md`, or from the newest relevant report
file in the repository.

## Merge Resolution Guidelines

1. **Preserve Alexi-specific changes**: Maintain customizations and SAP AI Core integrations
2. **Adopt upstream improvements**: Integrate bug fixes and enhancements from kilocode
3. **Resolve conflicts carefully**: Understand both codebases before merging
4. **Test after merge**: Ensure all functionality works with SAP AI Core

## Common Conflict Patterns

- **Tool definitions**: Merge new upstream tools while preserving Alexi's tool registry
- **Agent system**: Keep Alexi's agent switching while adopting upstream agent improvements
- **Permission system**: Maintain compatibility with both systems
- **Provider integration**: Preserve SAP Orchestration provider while adopting upstream patterns

## Post-Merge Checklist

- [ ] Run `npm run build` successfully
- [ ] Run `npm test` and fix any failing tests
- [ ] Verify SAP AI Core integration still works
- [ ] Update CHANGELOG.md with merge details
- [ ] Test key features: chat, tools, agents, permissions

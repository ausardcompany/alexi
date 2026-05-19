# Planning Task

## Research Input

Read the latest research report at: `{{RESEARCH_FILE}}`

## Current State

- Open auto-implement issues: {{OPEN_COUNT}}
- Maximum new issues to create: {{MAX_ISSUES}}
- Dry run: {{DRY_RUN}}

## Instructions

1. Read the research file above
2. Explore the current codebase (src/, tests/) to understand what exists
3. Create a development plan saved to `.github/research/{{DATE}}-plan.md`
4. Create GitHub issues for the top {{MAX_ISSUES}} actionable tasks

{{#DRY_RUN}}
**DRY RUN MODE**: Only write the plan file. Do NOT create GitHub issues.
{{/DRY_RUN}}

{{^DRY_RUN}}
Create issues using: `gh issue create --title "..." --label "auto-implement,enhancement,..." --body-file /tmp/issue-N.md`

Important rules for issue creation:
- Check if similar issues already exist: `gh issue list --label auto-implement --state open`
- Only categories: tool, provider, command, mcp, hook, skill, config
- Each issue MUST be self-contained with full implementation guide
- Include acceptance criteria and files to modify
- Write issue body to a temp file first, then use --body-file
{{/DRY_RUN}}

Follow the format from .github/prompts/agent2-planning-system.md

# Research Task — {{DATE}}

Focus area: **{{FOCUS}}**

{{#LAST_RESEARCH}}
## Previous Research

Last research was saved to: {{LAST_RESEARCH}}
Read it to understand what was already analyzed and focus on NEW developments.
{{/LAST_RESEARCH}}

## Instructions

1. Use `gh api` to check recent commits (last 7 days) in these repos:
   - `gh api repos/Kilo-Org/kilocode/commits?per_page=20 --jq '.[].commit.message'`
   - `gh api repos/anthropics/claude-code/commits?per_page=20 --jq '.[].commit.message'`
   - `gh api repos/cline/cline/commits?per_page=20 --jq '.[].commit.message'`
   - `gh api repos/aider-ai/aider/commits?per_page=20 --jq '.[].commit.message'`
   - `gh api repos/continuedev/continue/commits?per_page=20 --jq '.[].commit.message'`

2. Identify significant new features, patterns, or improvements

3. Compare against our current codebase (explore src/ to see what we have)

4. Save your findings to: `.github/research/{{DATE}}-research.md`

5. The file MUST include:
   - Executive Summary (5-10 bullet points)
   - Detailed Findings with priority/effort/category
   - Actionable Recommendations

Use the format described in .github/prompts/agent1-research-system.md

IMPORTANT: Save the file using the write tool. Do not skip this step.

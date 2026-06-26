# Research Task — {{DATE}}

Focus area: **{{FOCUS}}**

{{#LAST_RESEARCH}}
## Previous Research

Last research was saved to: {{LAST_RESEARCH}}
Read it to understand what was already analyzed and focus on NEW developments.
{{/LAST_RESEARCH}}

## Instructions

> Rotation policy: if a **daily** repo has a 5-cycle dryness streak
> (zero actionable items for 5 consecutive cycles), propose demoting
> it to **weekly** in the next brief's `Actionable Recommendations`
> section.

1. Fetch reference-repo commits. Each repo has a polling cadence
   tagged at the end of its line. **Daily** repos run every cycle.
   **Weekly** repos run only on Mondays (UTC). Skip a weekly repo
   silently when the cadence does not match today.

   - `gh api repos/Kilo-Org/kilocode/commits?per_page=20 --jq '.[].commit.message'`  <!-- daily -->
   - `gh api repos/cline/cline/commits?per_page=20 --jq '.[].commit.message'`        <!-- daily -->
   - `gh api repos/sst/opencode/commits?per_page=20 --jq '.[].commit.message'`      <!-- daily -->
   - `gh api repos/anthropics/claude-code/commits?per_page=20 --jq '.[].commit.message'`  <!-- weekly (Mon) -->
   - `gh api repos/aider-ai/aider/commits?per_page=20 --jq '.[].commit.message'`     <!-- weekly (Mon) -->

   To compute the day, use `$(date -u +%u)` (1 = Monday).

2. Identify significant new features, patterns, or improvements

3. Compare against our current codebase (explore src/ to see what we have)

4. Save your findings to: `.github/research/{{DATE}}-research.md`

5. The file MUST include:
   - Executive Summary (5-10 bullet points)
   - Detailed Findings with priority/effort/category
   - Actionable Recommendations

Use the format described in .github/prompts/agent1-research-system.md

IMPORTANT: Save the file using the write tool. Do not skip this step.

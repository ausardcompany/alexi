# Update Plan for Alexi

Generated: 2026-04-17
Based on upstream commits: kilocode 883f12819..36c5d9e59 (61 commits)

## Summary
- Total changes planned: 1
- Critical: 0 | High: 0 | Medium: 1 | Low: 0

## Changes

### 1. Add test for built-in kilo-config skill legacy paths lookup
**File**: `src/tool/skill.test.ts`
**Priority**: medium
**Type**: feature
**Reason**: The upstream kilocode repository added a new test case to verify that the built-in `kilo-config` skill includes named command lookup guidance. This test ensures that the skill description and output contain the expected configuration path information (`~/.config/kilo/`, `~/.kilocode/`, `**/command/`) and lookup guidance. Adding this test to Alexi ensures parity with upstream behavior and validates that the skill tool correctly provides configuration path documentation.

**New code** (append to existing test file):
```typescript
test("built-in kilo-config includes named command lookup guidance", async () => {
  await using tmp = await tmpdir({ git: true })

  const home = process.env.ALEXI_TEST_HOME
  process.env.ALEXI_TEST_HOME = tmp.path

  try {
    await Instance.provide({
      directory: tmp.path,
      fn: async () => {
        const tool = await SkillTool.init()
        const ctx: Tool.Context = {
          ...baseCtx,
          ask: async () => {},
        }

        const result = await tool.execute({ name: "alexi-config" }, ctx)

        expect(tool.description).toContain("where it loads things from")
        expect(result.metadata.dir).toBe("builtin")
        expect(result.output).toContain("Finding a named command")
        expect(result.output).toContain("~/.config/alexi/")
        expect(result.output).toContain("~/.alexi/")
        expect(result.output).toContain("**/command/")
        expect(result.output).toContain("explicit search")
      },
    })
  } finally {
    process.env.ALEXI_TEST_HOME = home
  }
})
```

**Notes**: 
- Environment variable renamed from `KILO_TEST_HOME` to `ALEXI_TEST_HOME` to match Alexi's naming convention
- Skill name changed from `kilo-config` to `alexi-config` to match Alexi's branding
- Config paths changed from `~/.config/kilo/` and `~/.kilocode/` to `~/.config/alexi/` and `~/.alexi/` respectively
- Ensure the built-in `alexi-config` skill exists and contains the expected guidance text before this test will pass

## Testing Recommendations
- Run the full skill test suite: `npm test -- src/tool/skill.test.ts`
- Verify that the `alexi-config` built-in skill exists and contains the expected lookup guidance content
- Ensure the test properly cleans up the temporary directory and restores the original environment variable

## Potential Risks
- **Dependency on built-in skill**: This test assumes the existence of a built-in `alexi-config` skill with specific content. If this skill doesn't exist in Alexi, it must be created first, or the skill name should be adjusted to match an existing equivalent skill.
- **Environment variable naming**: The test uses `ALEXI_TEST_HOME` - verify this is the correct environment variable name used in Alexi's test infrastructure.
- **Path expectations**: The test expects specific path patterns in the output. Ensure Alexi's configuration paths match the expected values (`~/.config/alexi/`, `~/.alexi/`).
{"prompt_tokens":9970,"completion_tokens":918,"total_tokens":10888}

[Session: de1f35a8-8573-48b1-907b-319ea53451c5]
[Messages: 2, Tokens: 10888]

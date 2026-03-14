import { describe, it, expect } from "vitest";
import { matchesPattern, evaluatePatternRules } from "./next";

describe("matchesPattern", () => {
  it("matches exact paths", () => {
    expect(matchesPattern("src/file.ts", "src/file.ts")).toBe(true);
    expect(matchesPattern("src/file.ts", "src/other.ts")).toBe(false);
  });

  it("matches single wildcard patterns", () => {
    expect(matchesPattern("*.md", "README.md")).toBe(true);
    expect(matchesPattern("*.md", "src/README.md")).toBe(false);
    expect(matchesPattern("src/*.ts", "src/index.ts")).toBe(true);
  });

  it("matches globstar patterns", () => {
    expect(matchesPattern("src/**/*.ts", "src/deep/nested/file.ts")).toBe(true);
    expect(matchesPattern("**/*.md", "any/path/file.md")).toBe(true);
  });

  it("handles universal wildcard", () => {
    expect(matchesPattern("*", "anything")).toBe(true);
  });
});

describe("evaluatePatternRules", () => {
  it("returns first matching rule action", () => {
    const rules = [
      { pattern: "*.secret", action: "deny" as const },
      { pattern: "*.md", action: "allow" as const },
      { pattern: "*", action: "deny" as const },
    ];
    
    expect(evaluatePatternRules(rules, "config.secret")).toBe("deny");
    expect(evaluatePatternRules(rules, "README.md")).toBe("allow");
    expect(evaluatePatternRules(rules, "other.txt")).toBe("deny");
  });

  it("returns undefined when no rules match", () => {
    const rules = [{ pattern: "*.md", action: "allow" as const }];
    expect(evaluatePatternRules(rules, "file.ts")).toBeUndefined();
  });
});

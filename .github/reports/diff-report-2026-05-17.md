# Upstream Changes Report
Generated: 2026-05-17 08:22:40

## Summary
- kilocode: 77 commits, 120 files changed
- opencode: 66 commits, 164 files changed

## kilocode Changes (8de6c2ea8..a23fe160d)

### Commits

- a23fe160d - Merge pull request #10220 from nv-kasikritc/nvidia-nim-origin-header (Joshua Lambert, 2026-05-16)
- 2bdee4781 - fix(cli): provide spawner for nvidia header test (kchantharuan, 2026-05-15)
- 3df80b48c - Merge branch 'main' into nvidia-nim-origin-header (Joshua Lambert, 2026-05-15)
- f44d75d9d - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-05-15)
- 9095d6ecb - Merge pull request #10293 from Kilo-Org/security-mermaid-11-15-0 (Marius, 2026-05-15)
- 7e06c68e8 - Merge pull request #10290 from shssoichiro/semantic-search-use (Marius, 2026-05-15)
- 2b424b1f0 - fix: unblock patched mermaid installs (marius-kilocode, 2026-05-15)
- 05cf9b98c - fix: allow vetted mermaid security release (marius-kilocode, 2026-05-15)
- af115afe2 - fix: update mermaid to patched release (marius-kilocode, 2026-05-15)
- dc5dd8a29 - Merge pull request #10291 from Kilo-Org/catrielmuller/fix-tts-linux-pipewire (Catriel Müller, 2026-05-15)
- 59af47d97 - Merge pull request #10162 from Kilo-Org/glaze-nickel (Kirill Kalishev, 2026-05-15)
- 98e314fde - Merge pull request #10269 from Kilo-Org/flourish-donkey (Kirill Kalishev, 2026-05-15)
- 62d2740fb - style(vscode): format speech capture pipeline (Catriel Müller, 2026-05-15)
- 0d7bd4fb3 - test: update assertions (Josh Holmer, 2026-05-15)
- ff1c50050 - fix(vscode): handle pipewire recorder failures (Catriel Müller, 2026-05-15)
- 5fe4dbcaf - test(agent-manager): avoid tsx import in annotation test (Catriel Müller, 2026-05-15)
- 1789f3670 - fix(vscode): support pipewire speech input (Catriel Müller, 2026-05-15)
- deddacf06 - fix: only include semantic search tool hint when enabled (Josh Holmer, 2026-05-15)
- 3ec9be9ab - Merge pull request #10287 from Kilo-Org/eight-timbale (Marius, 2026-05-15)
- 863ca97ab - fix(indexing): clarifications and improvements to semantic search tool description (Josh Holmer, 2026-05-15)
- 1acecd703 - test(agent-manager): cover markdown annotation mutations (marius-kilocode, 2026-05-15)
- 233da8276 - fix(agent-manager): stabilize markdown review capture (marius-kilocode, 2026-05-15)
- d5f93bddf - Merge pull request #10286 from Kilo-Org/shine-lake (Marius, 2026-05-15)
- 35f7aa3e6 - Merge pull request #10285 from Kilo-Org/sun-culotte (Marius, 2026-05-15)
- 5fa471dc1 - Merge pull request #10280 from Kilo-Org/uncovered-telephone (Marius, 2026-05-15)
- 6fcc3b6a1 - feat(vscode): export session transcripts as markdown (marius-kilocode, 2026-05-15)
- d23e16205 - chore(cli): track codebase search usage (marius-kilocode, 2026-05-15)
- a793e5954 - Merge pull request #10219 from Kilo-Org/fix/agent-manager-attribution (Marius, 2026-05-15)
- c868ccb27 - Merge pull request #10132 from Kilo-Org/sugared-sense (Marius, 2026-05-15)
- cebe4c0ca - fix(vscode): isolate speech unit toast import (marius-kilocode, 2026-05-15)
- 76bd73e7a - Merge remote-tracking branch 'origin/main' into fix/agent-manager-attribution (marius-kilocode, 2026-05-15)
- 64bbc1171 - Merge remote-tracking branch 'origin/main' into sugared-sense (marius-kilocode, 2026-05-15)
- aeeea7cd5 - Merge branch 'main' into fix/agent-manager-attribution (marius-kilocode, 2026-05-15)
- 304e33f2e - Merge pull request #10274 from Kilo-Org/safe-apparel (Marius, 2026-05-15)
- 630bf8f86 - Merge pull request #10277 from Kilo-Org/almond-yoke (Marius, 2026-05-15)
- 81f91775e - Merge pull request #10278 from Kilo-Org/whimsical-adasaurus (Marius, 2026-05-15)
- 75fb7903f - Merge branch 'main' into sugared-sense (Marius, 2026-05-15)
- 27b591f03 - Merge branch 'main' into almond-yoke (Marius, 2026-05-15)
- 849d0e356 - Merge branch 'main' into safe-apparel (Marius, 2026-05-15)
- 631a3ad90 - Merge branch 'main' into whimsical-adasaurus (Marius, 2026-05-15)
- d1404579f - release: v7.3.0 (kilo-maintainer[bot], 2026-05-15)
- 48545bb1c - Merge pull request #10279 from Kilo-Org/tulip-cabin (Marius, 2026-05-15)
- b4e41980c - fix(agent-manager): satisfy CSS prefix guard (marius-kilocode, 2026-05-15)
- 3ac16c5be - fix(agent-manager): prevent prompt selector clipping (marius-kilocode, 2026-05-15)
- a3769d83d - fix(cli): keep prompt enhancement in rewrite mode (marius-kilocode, 2026-05-15)
- 6f24f78e5 - ci: retry Windows Node setup in tests (marius-kilocode, 2026-05-15)
- d6341d3e6 - Merge remote-tracking branch 'origin/main' into whimsical-adasaurus (marius-kilocode, 2026-05-15)
- 12acd6f8b - fix(agent-manager): preserve active session while routing worktrees (marius-kilocode, 2026-05-15)
- a26659b62 - fix(agent-manager): harden inline review speech renderer (marius-kilocode, 2026-05-15)
- 3031de630 - fix(agent-manager): continue sessions in worktrees (marius-kilocode, 2026-05-15)
- 4b816f621 - fix(vscode): send recorded prompts from send button (marius-kilocode, 2026-05-15)
- 62bd02891 - test(agent-manager): include speech annotation source (marius-kilocode, 2026-05-15)
- 14a25b037 - feat(agent-manager): add voice input to inline review comments (marius-kilocode, 2026-05-15)
- bcb21806f - docs(jetbrains): add RELEASING.md with RC release instructions and link from READMEs (kirillk, 2026-05-14)
- 7bd3979f7 - Merge branch 'main' into nvidia-nim-origin-header (Mark IJbema, 2026-05-14)
- cb681c6ca - Merge branch 'main' into nvidia-nim-origin-header (Mark IJbema, 2026-05-14)
- 9f6997ef3 - fix(cli): preserve child task attribution (marius-kilocode, 2026-05-14)
- fff4277c4 - chore(i18n): remove plan ready comments (kirillk, 2026-05-13)
- 064bb1b6a - chore: remove plan files (kirillk, 2026-05-13)
- 62e98e8b3 - style(vscode): format assistant message (kirillk, 2026-05-13)
- aeac49488 - fix(cli): add NVIDIA NIM origin header (kchantharuan, 2026-05-13)
- fb420a1af - fix(vscode): use inert plan link href (kirillk, 2026-05-13)
- 0db819580 - chore: add plan files (kirillk, 2026-05-13)
- 233dc4b1d - Merge remote-tracking branch 'origin/glaze-nickel' into glaze-nickel (kirillk, 2026-05-13)
- efc411eeb - fix(i18n): add plan ready translations (kirillk, 2026-05-13)
- 8de3db437 - Merge branch 'main' into glaze-nickel (Kirill Kalishev, 2026-05-13)
- e858b06c8 - Merge remote-tracking branch 'origin/glaze-nickel' into glaze-nickel (kirillk, 2026-05-13)
- e5f7f6d8e - fix(vscode): simplify plan ready label (kirillk, 2026-05-13)
- 997f522d1 - fix(cli): keep session bootstrap compatible (marius-kilocode, 2026-05-13)
- 187c7a631 - fix(cli): guard session bootstrap parent recursion (marius-kilocode, 2026-05-13)
- 827e75acc - refactor(cli): keep attribution lookups in memory (marius-kilocode, 2026-05-13)
- ce64a962b - fix(vscode): attribute Agent Manager sessions by root context (marius-kilocode, 2026-05-13)
- a0262c19a - Merge remote-tracking branch 'origin/main' into glaze-nickel (kirillk, 2026-05-13)
- cb3ffada7 - Merge branch 'main' into glaze-nickel (Kirill Kalishev, 2026-05-12)
- 25df75d17 - fix(vscode): render plan exit as file link (kirillk, 2026-05-11)
- 1f3df3557 - fix(vscode): address restore review feedback (marius-kilocode, 2026-05-11)
- b91457673 - fix(vscode): restore only previously open Kilo views (marius-kilocode, 2026-05-11)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/registry.ts` (+11, -0)
- `packages/opencode/src/kilocode/tool/semantic-search.txt` (+28, -13)
- `packages/opencode/src/tool/grep.txt` (+0, -1)
- `packages/opencode/src/tool/registry.ts` (+25, -22)
- `packages/opencode/src/tool/warpgrep.ts` (+2, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/agent-manager-prompt-picker.md` (+5, -0)
- `.changeset/bright-searches-count.md` (+5, -0)
- `.changeset/continue-worktree-sessions.md` (+5, -0)
- `.changeset/inline-review-speech.md` (+5, -0)
- `.changeset/markdown-review-voice.md` (+5, -0)
- `.changeset/mermaid-security-fixes.md` (+6, -0)
- `.changeset/shiny-sessions-export.md` (+5, -0)
- `.changeset/smart-views-restore.md` (+5, -0)
- `.changeset/swift-voices-send.md` (+5, -0)
- `.github/workflows/test.yml` (+11, -1)
- `README.md` (+3, -1)
- `bun.lock` (+22, -54)
- `bunfig.toml` (+1, -0)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/package.json` (+2, -2)
- `packages/kilo-docs/pages/code-with-ai/agents/chat-interface.md` (+6, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/vscode/index.md` (+1, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/api/constants.ts` (+1, -0)
- `packages/kilo-gateway/src/headers.ts` (+2, -0)
- `packages/kilo-gateway/src/index.ts` (+1, -0)
- `packages/kilo-gateway/src/provider-debug.ts` (+2, -6)
- `packages/kilo-gateway/src/provider.ts` (+9, -6)
- `packages/kilo-gateway/test/provider.test.ts` (+23, -0)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/README.md` (+2, -19)
- `packages/kilo-jetbrains/RELEASING.md` (+62, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+2, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+64, -18)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+47, -2)
- `packages/kilo-vscode/src/agent-manager/__tests__/AgentManagerProvider.spec.ts` (+26, -0)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+3, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+6, -0)
- `packages/kilo-vscode/src/extension.ts` (+30, -1)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+5, -1)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+6, -0)
- `packages/kilo-vscode/src/kilo-provider/export-transcript.ts` (+58, -0)
- `packages/kilo-vscode/src/kilo-provider/options.ts` (+3, -0)
- `packages/kilo-vscode/src/speech-to-text/capture.ts` (+80, -13)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/export-transcript.test.ts` (+58, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-worktree-context.test.ts` (+11, -0)
- `packages/kilo-vscode/tests/unit/markdown-annotation-layer.test.ts` (+20, -0)
- `packages/kilo-vscode/tests/unit/plan-exit.test.ts` (+105, -0)
- `packages/kilo-vscode/tests/unit/review-comments.test.ts` (+52, -0)
- `packages/kilo-vscode/tests/unit/speech-to-text-capture.test.ts` (+18, -1)
- `packages/kilo-vscode/tests/unit/use-speech-to-text.test.ts` (+89, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+25, -70)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/FullScreenDiffView.tsx` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/MarkdownAnnotationLayer.tsx` (+8, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+18, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/markdown-annotation-mutation.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/review-annotation-speech.tsx` (+138, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/review-annotations.ts` (+27, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/shortcuts.ts` (+67, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+84, -16)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+57, -14)
- `packages/kilo-vscode/webview-ui/src/components/history/SessionList.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/useSpeechToText.ts` (+15, -2)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/plan-exit.css` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/utils/plan-path.ts` (+43, -0)
- `packages/opencode/CHANGELOG.md` (+6, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+1, -1)
- `packages/opencode/src/kilocode/enhance-prompt.ts` (+11, -5)
- `packages/opencode/src/kilocode/session/index.ts` (+46, -0)
- `packages/opencode/src/provider/provider.ts` (+1, -0)
- `packages/opencode/src/session/llm.ts` (+13, -1)
- `packages/opencode/src/session/session.ts` (+6, -5)
- `packages/opencode/test/kilocode/enhance-prompt.test.ts` (+12, -1)
- `packages/opencode/test/kilocode/nvidia-headers.test.ts` (+74, -0)
- `packages/opencode/test/kilocode/semantic-search.test.ts` (+2, -3)
- `packages/opencode/test/kilocode/session/platform-attribution.test.ts` (+118, -0)
- `packages/opencode/test/kilocode/session/session.test.ts` (+105, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+57, -1)
- `packages/opencode/test/session/session.test.ts` (+0, -185)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+2, -2)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index efde47c76..9f1fd76ff 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.2.54",
+  "version": "7.3.0",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/kilocode/tool/registry.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/registry.ts b/packages/opencode/src/kilocode/tool/registry.ts
index 8db1561d4..503214db5 100644
--- a/packages/opencode/src/kilocode/tool/registry.ts
+++ b/packages/opencode/src/kilocode/tool/registry.ts
@@ -13,6 +13,9 @@ const log = Log.create({ service: "kilocode-tool-registry" })
 type Deps = { agent: Agent.Interface; truncate: Truncate.Interface }
 
 export namespace KiloToolRegistry {
+  const hint =
+    "- When you are doing an open-ended search where you do not know the exact symbol name, use the `semantic_search` tool first to narrow down the search scope, then follow up with `Grep` and/or `Read`"
+
   /** Resolve Kilo-specific tool Infos outside any InstanceState, so their Truncate/Agent deps are
    * satisfied at the outer registry scope instead of leaking into InstanceState's Effect. */
   export function infos() {
@@ -84,4 +87,12 @@ export namespace KiloToolRegistry {
       ...(Flag.KILO_CLIENT === "vscode" && cfg.experimental?.agent_manager_tool === true ? [tools.manager] : []),
     ]
   }
+
+  export function describe(tools: Tool.Def[], extra: { semantic?: Tool.Def }): Tool.Def[] {
+    if (!extra.semantic) return tools
+    return tools.map((tool) => {
+      if (tool.id !== "glob" && tool.id !== "grep") return tool
+      return { ...tool, description: `${tool.description}\n${hint}` }
+    })
+  }
 }
```

#### packages/opencode/src/kilocode/tool/semantic-search.txt
```diff
diff --git a/packages/opencode/src/kilocode/tool/semantic-search.txt b/packages/opencode/src/kilocode/tool/semantic-search.txt
index f4cd41664..b5245c16e 100644
--- a/packages/opencode/src/kilocode/tool/semantic-search.txt
+++ b/packages/opencode/src/kilocode/tool/semantic-search.txt
@@ -1,13 +1,28 @@
-- Find code snippets most relevant to the search query using semantic search.
-- Returns matching content with file paths, line ranges, and relevance scores.
-- Searches based on meaning rather than exact text matches.
-- By default searches entire workspace, with capability to filter by path.
-
-Usage Notes:
-- Use this tool any time you start exploring a new area of the codebase. This tool will help discover all areas of the codebase related to the query, even if they do not match an exact symbol name.
-- Queries MUST be in English (translate if needed).
-- Prefer the Grep tool if you know the exact symbol name to search for and do not need semantic context.
-
-Example Queries:
-- "User login and password hashing"
-- "database connection pooling"
+Find code snippets by semantic meaning and return ranked matches with file paths and line ranges.
+
+## When to use
+
+- Explore an unfamiliar code area before you know exact identifiers
+- Find related implementations of a concept or behavior across the workspace
+- Search by intent such as authentication, caching, or session resume logic
+- Narrow a large codebase before following up with `Read` or `Grep`
+- Limit semantic search to one subdirectory with `path`
+
+## When NOT to use
+
+- Search for an exact symbol or regex pattern — use `Grep`
+- Find files by filename or extension — use `Glob`
+- Read the contents of a known file — use `Read`
+- Explore files outside the current workspace - use `Grep`, `Glob`, and `Read`
+
+## Examples
+
+- "User login and password hashing" → search for auth-related code by meaning
+- "Database connection pooling" → find conceptually similar implementations
+- "Session resume flow" → retrieve snippets involved in restoring session state
+- "Tool approval UI" with `path: "packages/opencode/src"` → combine a natural-language query with `path`
+
+## Constraints
+
+- Write the query in English.
+- Use `path` only for subdirectories inside the current workspace.
```

#### packages/opencode/src/tool/grep.txt
```diff
diff --git a/packages/opencode/src/tool/grep.txt b/packages/opencode/src/tool/grep.txt
index e9d53d057..7cc933291 100644
--- a/packages/opencode/src/tool/grep.txt
+++ b/packages/opencode/src/tool/grep.txt
@@ -5,5 +5,4 @@
 - Returns file paths and line numbers with at least one match sorted by modification time
 - Use this tool when you need to find files containing specific patterns
 - If you need to identify/count the number of matches within files, use the Bash tool with `rg` (ripgrep) directly. Do NOT use `grep`.
-- When you are doing an open-ended search where you do not know the exact symbol name, use the SemanticSearch tool instead
 - When you are doing a deep search that may require multiple tool invocations, use the Task tool instead
```

#### packages/opencode/src/tool/registry.ts
```diff
diff --git a/packages/opencode/src/tool/registry.ts b/packages/opencode/src/tool/registry.ts
index 6c64c82ce..6a477aba0 100644
--- a/packages/opencode/src/tool/registry.ts
+++ b/packages/opencode/src/tool/registry.ts
@@ -226,28 +226,31 @@ export const layer: Layer.Layer<
 
         return {
           custom,
-          builtin: [
-            tool.invalid,
-            ...(questionEnabled ? [tool.question] : []),
-            tool.bash,
-            tool.read,
-            tool.glob,
-            tool.grep,
-            tool.edit,
-            tool.write,
-            tool.task,
-            tool.fetch,
-            tool.todo,
-            tool.search,
-            tool.skill,
-            tool.patch,
-            // kilocode_change start
-            tool.plan,
-            ...(["cli", "vscode"].includes(Flag.KILO_CLIENT) ? [tool.suggest] : []),
-            ...KiloToolRegistry.extra(kilo, cfg),
-            // kilocode_change end
-            ...(Flag.KILO_EXPERIMENTAL_LSP_TOOL ? [tool.lsp] : []),
-          ],
+          builtin: KiloToolRegistry.describe(
+            [
+              tool.invalid,
+              ...(questionEnabled ? [tool.question] : []),
+              tool.bash,
+              tool.read,
+              tool.glob,
+              tool.grep,
+              tool.edit,
+              tool.write,
+              tool.task,
+              tool.fetch,
+              tool.todo,
+              tool.search,
+              tool.skill,
+              tool.patch,
+              // kilocode_change start
+              tool.plan,
+              ...(["cli", "vscode"].includes(Flag.KILO_CLIENT) ? [tool.suggest] : []),
+              ...KiloToolRegistry.extra(kilo, cfg),
```


*... and more files (showing first 5)*

## opencode Changes (202cc86..53e89f9)

### Commits

- 53e89f9 - chore: generate (opencode-agent[bot], 2026-05-17)
- de247b7 - sync (Frank, 2026-05-17)
- 0b8050d - sync (Frank, 2026-05-17)
- be6a89a - docs: update README.es.md (#27739) (Gustavo Viana, 2026-05-16)
- c0a8b50 - style(tui): distinguish markdown h1 headings (#27814) (Kit Langton, 2026-05-16)
- f80651f - sync release versions for v1.15.3 (opencode, 2026-05-16)
- 68af953 - fix: hide task background instructions by default (#27872) (Shoubhit Dash, 2026-05-16)
- 321db7a - chore: generate (opencode-agent[bot], 2026-05-16)
- 6d2219e - fix(cli): preserve instance context in async commands (Dax Raad, 2026-05-16)
- dd432e3 - chore: generate (opencode-agent[bot], 2026-05-16)
- 77db212 - fix read stream byte cap (Dax Raad, 2026-05-16)
- f562637 - sync release versions for v1.15.2 (opencode, 2026-05-16)
- 88363f1 - fixed issue in opencode run (Dax Raad, 2026-05-16)
- c5db39f - Remove Ring 2.6 1T from Zen docs (#27849) (Jack, 2026-05-16)
- b5aed28 - chore: reduce alerts noise (vimtor, 2026-05-16)
- 53849bd - fix(sync): publish events on injected project bus (#27825) (Dax, 2026-05-16)
- e33912b - sync release versions for v1.15.1 (opencode, 2026-05-16)
- 548648a - core: reduce prompts for shell, todowrite, and task tools (#26821) (Aiden Cline, 2026-05-16)
- 4643e13 - feat(nix): add opencode-electron derivation (#16163) (Caleb Norton, 2026-05-15)
- 042e6a5 - tui: newly pinned sessions now append to the end of the list instead of jumping to the top (Dax Raad, 2026-05-15)
- e36d6a0 - core: clarify postinstall error message when binary is missing (Dax Raad, 2026-05-15)
- cc9c0b1 - Revert "add dialog prompt submit keybind (#27807)" (#27815) (Sebastian, 2026-05-16)
- f3b0d3d - fix(tui): dedupe consecutive prompt history entries (#27816) (Kit Langton, 2026-05-16)
- 764c6bc - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-16)
- d441e93 - add dialog prompt submit keybind (#27807) (Sebastian, 2026-05-16)
- ad79ad9 - upgrade opentui to 0.2.11 (#27808) (Sebastian, 2026-05-16)
- d6b23fd - chore: generate (opencode-agent[bot], 2026-05-16)
- 5911bd5 - fix(tui): show config error details on startup (#27803) (Kit Langton, 2026-05-15)
- 2385123 - Fix thinking toggle defaults (Dax Raad, 2026-05-15)
- 0954966 - Fix npm CLI binary installation (#27801) (Dax, 2026-05-15)
- da495fd - chore: generate (opencode-agent[bot], 2026-05-15)
- 85cd447 - chore: reduce alerts noise (vimtor, 2026-05-16)
- 0f31fd6 - Fix multiline mentions (#27649) (Sebastian, 2026-05-15)
- aa07e21 - handle undefined tips (#27635) (Sebastian, 2026-05-15)
- f060874 - feat(tui): add minimal thinking mode with click-to-expand (#27623) (Shoubhit Dash, 2026-05-16)
- f21c582 - chore: reduce alerting noise (vimtor, 2026-05-15)
- 65f96a5 - refactor(instance): retire WithInstance adapter (#27782) (Shoubhit Dash, 2026-05-16)
- 48122b3 - fix(tool): bridge custom tool zod metadata (#27770) (Aiden Cline, 2026-05-15)
- 0df2f5b - chore: generate (opencode-agent[bot], 2026-05-15)
- 499e8e4 - test(instance): add effect-native fixture helpers (#27781) (Shoubhit Dash, 2026-05-16)
- f33b445 - feat(tui): enable pinned session switching (#27780) (Shoubhit Dash, 2026-05-16)
- a24abd2 - refactor(lsp): require explicit instance context (#27767) (Shoubhit Dash, 2026-05-16)
- d44bef2 - chore: generate (opencode-agent[bot], 2026-05-15)
- f99339e - fix(tui): keep session switching pinned-only (#27775) (Shoubhit Dash, 2026-05-16)
- 2b0e72a - refactor(workspace): centralize adapter invocation (#27768) (Shoubhit Dash, 2026-05-15)
- 2fdee50 - refactor(acp): extract runtime reentry (#27769) (Shoubhit Dash, 2026-05-15)
- 48293c5 - chore: generate (opencode-agent[bot], 2026-05-15)
- 0c9cfe9 - refactor(instance): remove legacy runtime fallback (#27757) (Shoubhit Dash, 2026-05-15)
- 9975c1e - chore: generate (opencode-agent[bot], 2026-05-15)
- ef7d801 - fix(tool): preserve custom tool arg descriptions (#27750) (Aiden Cline, 2026-05-15)
- eb63007 - chore: generate (opencode-agent[bot], 2026-05-15)
- a2392ca - refactor(worktree): provide runtime reentry refs (#27754) (Shoubhit Dash, 2026-05-15)
- f9371eb - chore: generate (opencode-agent[bot], 2026-05-15)
- fa9a2cb - refactor(instance): remove remaining bind call sites (#27731) (Shoubhit Dash, 2026-05-15)
- 2d90f32 - ci: catch provider errors across all opencode tiers (#27495) (Victor Navarro, 2026-05-15)
- c2ffd7c - fix: markdown table rendering (#27747) (Aiden Cline, 2026-05-15)
- 104f5d5 - chore: exclude provider from triggers (vimtor, 2026-05-15)
- 1c7c033 - test(workspace): avoid legacy instance reads (#27727) (Shoubhit Dash, 2026-05-15)
- 984eefa - chore: generate (opencode-agent[bot], 2026-05-15)
- bf64f8c - refactor(cli): dispose bootstrap instance explicitly (#27721) (Shoubhit Dash, 2026-05-15)
- 727a83a - chore: generate (opencode-agent[bot], 2026-05-15)
- e653838 - refactor(tool): read repo overview directory from instance state (#27717) (Shoubhit Dash, 2026-05-15)
- 12b666e - refactor(project): import instance context directly (#27714) (Shoubhit Dash, 2026-05-15)
- eb5ef1c - refactor(flags): remove unused flag exports (#27709) (Shoubhit Dash, 2026-05-15)
- 356f684 - refactor(flags): migrate skip migrations flag (#27705) (Shoubhit Dash, 2026-05-15)
- 7b37040 - refactor(flags): migrate lsp download flag (#27699) (Shoubhit Dash, 2026-05-15)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/read.ts` (+14, -10)
- `packages/opencode/src/tool/registry.ts` (+27, -1)
- `packages/opencode/src/tool/repo_overview.ts` (+4, -2)
- `packages/opencode/src/tool/shell.ts` (+5, -5)
- `packages/opencode/src/tool/shell/shell.txt` (+9, -65)
- `packages/opencode/src/tool/task.ts` (+9, -1)
- `packages/opencode/src/tool/task.txt` (+6, -46)
- `packages/opencode/src/tool/todowrite.txt` (+44, -167)
- `packages/opencode/test/tool/external-directory.test.ts` (+1, -1)
- `packages/opencode/test/tool/lsp.test.ts` (+0, -1)
- `packages/opencode/test/tool/read.test.ts` (+33, -2)
- `packages/opencode/test/tool/registry.test.ts` (+68, -1)
- `packages/opencode/test/tool/repo_overview.test.ts` (+15, -0)
- `packages/opencode/test/tool/skill.test.ts` (+0, -1)
- `packages/opencode/test/tool/write.test.ts` (+0, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/migrations/20260517075207_famous_chat/migration.sql` (+1, -0)
- `packages/console/core/migrations/20260517075207_famous_chat/snapshot.json` (+2765, -0)
- `packages/console/core/package.json` (+1, -1)
- `packages/console/core/script/promote-limits.ts` (+1, -1)
- `packages/console/core/script/update-limits.ts` (+4, -2)
- `packages/console/core/src/billing.ts` (+41, -33)
- `packages/console/core/src/schema/billing.sql.ts` (+8, -1)
- `packages/console/core/src/subscription.ts` (+2, -0)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/flag/flag.ts` (+0, -15)

#### Other Changes
- `.github/workflows/publish.yml` (+1, -0)
- `README.es.md` (+11, -11)
- `bun.lock` (+32, -32)
- `flake.nix` (+7, -10)
- `infra/monitoring.ts` (+11, -27)
- `nix/desktop.nix` (+72, -71)
- `nix/hashes.json` (+4, -4)
- `nix/opencode.nix` (+3, -2)
- `package.json` (+3, -3)
- `packages/app/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/routes/stripe/webhook.ts` (+3, -1)
- `packages/console/app/src/routes/zen/util/ipRateLimiter.ts` (+5, -2)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/AGENTS.md` (+3, -12)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/script/build.ts` (+1, -0)
- `packages/opencode/script/postinstall.mjs` (+155, -68)
- `packages/opencode/script/publish.ts` (+20, -3)
- `packages/opencode/specs/effect/errors.md` (+84, -0)
- `packages/opencode/specs/effect/facades.md` (+0, -3)
- `packages/opencode/specs/effect/guide.md` (+3, -7)
- `packages/opencode/specs/effect/instance-context.md` (+9, -305)
- `packages/opencode/specs/effect/loose-ends.md` (+0, -4)
- `packages/opencode/specs/effect/todo.md` (+10, -73)
- `packages/opencode/src/acp/agent.ts` (+3, -5)
- `packages/opencode/src/acp/runtime.ts` (+22, -0)
- `packages/opencode/src/cli/bootstrap.ts` (+7, -13)
- `packages/opencode/src/cli/cmd/agent.ts` (+3, -1)
- `packages/opencode/src/cli/cmd/debug/agent.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/github.ts` (+34, -29)
- `packages/opencode/src/cli/cmd/prompt-display.ts` (+14, -5)
- `packages/opencode/src/cli/cmd/run.ts` (+5, -1)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+10, -41)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-list.tsx` (+30, -44)
- `packages/opencode/src/cli/cmd/tui/component/prompt/history.tsx` (+9, -0)
- `packages/opencode/src/cli/cmd/tui/config/keybind.ts` (+0, -6)
- `packages/opencode/src/cli/cmd/tui/context/aggregate-failures.ts` (+18, -1)
- `packages/opencode/src/cli/cmd/tui/context/local.tsx` (+4, -102)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/context/thinking.ts` (+66, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips-view.tsx` (+14, -26)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/session-v2.tsx` (+60, -21)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+80, -25)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+9, -3)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+2, -7)
- `packages/opencode/src/cli/effect-cmd.ts` (+1, -10)
- `packages/opencode/src/cli/error.ts` (+14, -15)
- `packages/opencode/src/command/index.ts` (+1, -1)
- `packages/opencode/src/config/config.ts` (+1, -2)
- `packages/opencode/src/control-plane/adapters/worktree.ts` (+52, -23)
- `packages/opencode/src/control-plane/types.ts` (+16, -5)
- `packages/opencode/src/control-plane/workspace-adapter-runtime.ts` (+51, -0)
- `packages/opencode/src/control-plane/workspace.ts` (+40, -57)
- `packages/opencode/src/effect/bridge.ts` (+41, -35)
- `packages/opencode/src/effect/instance-ref.ts` (+1, -1)
- `packages/opencode/src/effect/instance-state.ts` (+5, -16)
- `packages/opencode/src/effect/run-service.ts` (+2, -12)
- `packages/opencode/src/effect/runtime-flags.ts` (+2, -0)
- `packages/opencode/src/file/watcher.ts` (+3, -2)
- `packages/opencode/src/format/formatter.ts` (+1, -1)
- `packages/opencode/src/lsp/client.ts` (+26, -7)
- `packages/opencode/src/lsp/lsp.ts` (+1, -0)
- `packages/opencode/src/lsp/server.ts` (+51, -52)
- `packages/opencode/src/project/instance.ts` (+0, -36)
- `packages/opencode/src/project/with-instance.ts` (+0, -12)
- `packages/opencode/src/server/routes/instance/httpapi/lifecycle.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/error.ts` (+8, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/instance-context.ts` (+5, -4)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts` (+2, -4)
- `packages/opencode/src/session/llm.ts` (+1, -1)
- `packages/opencode/src/session/prompt/default.txt` (+0, -10)
- `packages/opencode/src/session/session.ts` (+1, -1)
- `packages/opencode/src/storage/db.ts` (+8, -8)
- `packages/opencode/src/sync/index.ts` (+20, -5)
- `packages/opencode/test/AGENTS.md` (+1, -1)
- `packages/opencode/test/EFFECT_TEST_MIGRATION.md` (+1, -1)
- `packages/opencode/test/cli/cmd/tui/aggregate-failures.test.ts` (+40, -2)
- `packages/opencode/test/cli/cmd/tui/prompt-history.test.ts` (+44, -0)
- `packages/opencode/test/cli/effect-cmd-instance-als.test.ts` (+8, -27)
- `packages/opencode/test/cli/run/prompt.shared.test.ts` (+6, -0)
- `packages/opencode/test/config/config.test.ts` (+218, -189)
- `packages/opencode/test/control-plane/workspace.test.ts` (+121, -95)
- `packages/opencode/test/effect/instance-state.test.ts` (+22, -24)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+42, -0)
- `packages/opencode/test/fixture/fixture.ts` (+26, -16)
- `packages/opencode/test/lsp/client.test.ts` (+37, -27)
- `packages/opencode/test/lsp/index.test.ts` (+30, -0)
- `packages/opencode/test/plugin/workspace-adapter.test.ts` (+3, -2)
- `packages/opencode/test/project/instance-bootstrap.test.ts` (+24, -1)
- `packages/opencode/test/project/instance.test.ts` (+2, -21)
- `packages/opencode/test/project/worktree.test.ts` (+5, -2)
- `packages/opencode/test/provider/amazon-bedrock.test.ts` (+74, -55)
- `packages/opencode/test/provider/gitlab-duo.test.ts` (+14, -16)
- `packages/opencode/test/provider/provider.test.ts` (+330, -307)
- `packages/opencode/test/question/question.test.ts` (+5, -2)
- `packages/opencode/test/server/httpapi-error-middleware.test.ts` (+22, -0)
- `packages/opencode/test/server/httpapi-event.test.ts` (+6, -3)
- `packages/opencode/test/server/httpapi-exercise/runtime.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-file.test.ts` (+0, -1)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+0, -1)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+0, -1)
- `packages/opencode/test/server/httpapi-raw-route-auth.test.ts` (+0, -1)
- `packages/opencode/test/server/httpapi-workspace.test.ts` (+6, -3)
- `packages/opencode/test/session/llm.test.ts` (+155, -132)
- `packages/opencode/test/storage/db.test.ts` (+9, -0)
- `packages/opencode/test/sync/index.test.ts` (+6, -2)
- `packages/plugin/package.json` (+4, -4)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/bs/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/da/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/de/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/es/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/fr/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/it/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/ja/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/ko/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/nb/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/pl/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/ru/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/th/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/tr/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+0, -4)
- `script/github/close-prs.ts` (+0, -0)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/migrations/20260517075207_famous_chat/migration.sql
```diff
diff --git a/packages/console/core/migrations/20260517075207_famous_chat/migration.sql b/packages/console/core/migrations/20260517075207_famous_chat/migration.sql
new file mode 100644
index 0000000..33ca132
--- /dev/null
+++ b/packages/console/core/migrations/20260517075207_famous_chat/migration.sql
@@ -0,0 +1 @@
+ALTER TABLE `coupon` MODIFY COLUMN `type` enum('BUILDATHON','GO1MONTH50','GOFREEMONTH','GO3MONTHS100','GO6MONTHS100','GO12MONTHS100') NOT NULL;
\ No newline at end of file
```

#### packages/console/core/migrations/20260517075207_famous_chat/snapshot.json
```diff
diff --git a/packages/console/core/migrations/20260517075207_famous_chat/snapshot.json b/packages/console/core/migrations/20260517075207_famous_chat/snapshot.json
new file mode 100644
index 0000000..b2ba113
--- /dev/null
+++ b/packages/console/core/migrations/20260517075207_famous_chat/snapshot.json
@@ -0,0 +1,2765 @@
+{
+  "version": "6",
+  "dialect": "mysql",
+  "id": "dc498f8b-c8e7-4da5-b70a-419427dd5901",
+  "prevIds": ["1f04bd59-35b0-493b-9d55-cfa08207ba8e"],
+  "ddl": [
+    {
+      "name": "account",
+      "entityType": "tables"
+    },
+    {
+      "name": "auth",
+      "entityType": "tables"
+    },
+    {
+      "name": "benchmark",
+      "entityType": "tables"
+    },
+    {
+      "name": "billing",
+      "entityType": "tables"
+    },
+    {
+      "name": "coupon",
+      "entityType": "tables"
+    },
+    {
+      "name": "lite",
+      "entityType": "tables"
+    },
+    {
+      "name": "payment",
+      "entityType": "tables"
+    },
+    {
+      "name": "subscription",
+      "entityType": "tables"
+    },
+    {
+      "name": "usage",
+      "entityType": "tables"
+    },
+    {
+      "name": "ip_rate_limit",
```

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index b58e595..c656037 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.15.0",
+  "version": "1.15.3",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/script/promote-limits.ts
```diff
diff --git a/packages/console/core/script/promote-limits.ts b/packages/console/core/script/promote-limits.ts
index a54fcd0..55dabdb 100755
--- a/packages/console/core/script/promote-limits.ts
+++ b/packages/console/core/script/promote-limits.ts
@@ -10,7 +10,7 @@ if (!stage) throw new Error("Stage is required")
 const root = path.resolve(process.cwd(), "..", "..", "..")
 
 // read the secret
-const ret = await $`bun sst secret list --stage frank`.cwd(root).text()
+const ret = await $`bun sst secret list --fallback`.cwd(root).text()
 const lines = ret.split("\n")
 const value = lines.find((line) => line.startsWith("ZEN_LIMITS"))?.split("=")[1]
 if (!value) throw new Error("ZEN_LIMITS not found")
```

#### packages/console/core/script/update-limits.ts
```diff
diff --git a/packages/console/core/script/update-limits.ts b/packages/console/core/script/update-limits.ts
index 29794f5..f69a274 100755
--- a/packages/console/core/script/update-limits.ts
+++ b/packages/console/core/script/update-limits.ts
@@ -6,7 +6,7 @@ import os from "os"
 import { Subscription } from "../src/subscription"
 
 const root = path.resolve(process.cwd(), "..", "..", "..")
-const secrets = await $`bun sst secret list --stage frank`.cwd(root).text()
+const secrets = await $`bun sst secret list --fallback`.cwd(root).text()
 
 // read value
 const lines = secrets.split("\n")
@@ -25,4 +25,6 @@ const newValue = JSON.stringify(JSON.parse(await tempFile.text()))
 Subscription.validate(JSON.parse(newValue))
 
 // update the secret
-await $`bun sst secret set ZEN_LIMITS ${newValue} --stage frank`.cwd(root)
+const envFile = Bun.file(path.join(os.tmpdir(), `limits-${Date.now()}.env`))
+await envFile.write(`ZEN_LIMITS="${newValue.replace(/"/g, '\\"')}"`)
+await $`bun sst secret load ${envFile.name} --fallback`.cwd(root)
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/tool/external-directory.test.ts` - update based on opencode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/grep.txt.ts` - update based on kilocode packages/opencode/src/tool/grep.txt changes
- `src/tool/lsp.test.ts` - update based on opencode packages/opencode/test/tool/lsp.test.ts changes
- `src/tool/read.test.ts` - update based on opencode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on opencode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/repo_overview.test.ts` - update based on opencode packages/opencode/test/tool/repo_overview.test.ts changes
- `src/tool/repo_overview.ts` - update based on opencode packages/opencode/src/tool/repo_overview.ts changes
- `src/tool/semantic-search.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/semantic-search.txt changes
- `src/tool/shell.ts` - update based on opencode packages/opencode/src/tool/shell.ts changes
- `src/tool/shell.txt.ts` - update based on opencode packages/opencode/src/tool/shell/shell.txt changes
- `src/tool/skill.test.ts` - update based on opencode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/task.txt.ts` - update based on opencode packages/opencode/src/tool/task.txt changes
- `src/tool/todowrite.txt.ts` - update based on opencode packages/opencode/src/tool/todowrite.txt changes
- `src/tool/warpgrep.ts` - update based on kilocode packages/opencode/src/tool/warpgrep.ts changes
- `src/tool/write.test.ts` - update based on opencode packages/opencode/test/tool/write.test.ts changes

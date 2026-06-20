# Upstream Changes Report
Generated: 2026-06-19 10:27:21

## Summary
- kilocode: 162 commits, 899 files changed
- opencode: 3 commits, 11 files changed

## kilocode Changes (7606ee893..4bfd65264)

### Commits

- 4bfd65264 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-19)
- ff7db0dab - Merge pull request #11421 from Kilo-Org/feat/byok-model-badges (Christiaan Arnoldus, 2026-06-19)
- 87b6b8e9f - Merge pull request #11453 from Kilo-Org/wool-jeans (Marius, 2026-06-19)
- c726f8776 - Merge pull request #11433 from Kilo-Org/candy-mouth (Marius, 2026-06-19)
- 9b6b7754f - Merge pull request #11416 from Kilo-Org/docs/hide-prompt-training-models (Christiaan Arnoldus, 2026-06-19)
- 576a6fb15 - Merge pull request #11423 from Kilo-Org/honored-responsibility (Marius, 2026-06-19)
- d3c58e6c1 - test(cli): preserve promise facade ratchet (marius-kilocode, 2026-06-19)
- f7e68d19d - fix: silence subagent completion sounds (marius-kilocode, 2026-06-19)
- 3a0a4a40c - Merge pull request #10940 from mjnaderi/fix/vscode-panel-command-registration (Marius, 2026-06-19)
- 5f54b5433 - Merge branch 'main' into feat/byok-model-badges (Christiaan Arnoldus, 2026-06-19)
- 02a728da5 - Merge pull request #11451 from Kilo-Org/small-leaf (Marius, 2026-06-19)
- 6bd1e79c5 - fix(vscode): preserve panel command outcomes (marius-kilocode, 2026-06-19)
- d319acac1 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-19)
- 732fbc30d - fix(vscode): widen chat readable lane (marius-kilocode, 2026-06-19)
- b78c9b5ad - Merge branch 'main' into feat/byok-model-badges (Christiaan Arnoldus, 2026-06-19)
- 6f86c9527 - Merge pull request #11434 from Kilo-Org/zest-canoe (Catriel Müller, 2026-06-18)
- 7a1be0564 - Merge pull request #11435 from Kilo-Org/jetbrains/release/v7.0.1-rc.12 (Kirill Kalishev, 2026-06-18)
- 33fb3a2f2 - docs(jetbrains): edit changelog for v7.0.1-rc.12 (Kirill Kalishev, 2026-06-18)
- d1bfd7dbe - release(jetbrains): v7.0.1-rc.12 (kilo-maintainer[bot], 2026-06-18)
- b45dd9b30 - feat: add account profile to Kilo Console (Catriel Müller, 2026-06-18)
- 1cd34f2e3 - Merge pull request #11431 from Kilo-Org/docs/add-auto-efficient-tier (Rietie, 2026-06-18)
- 2dcd90e17 - test(agent-manager): cover rendered tool identity (marius-kilocode, 2026-06-18)
- 9d2c8965e - test(agent-manager): remove implicit DOM dependency (marius-kilocode, 2026-06-18)
- 8e622255d - test(agent-manager): verify rendered tool identity (marius-kilocode, 2026-06-18)
- 867beac3a - fix(agent-manager): stabilize concurrent subagent rendering (marius-kilocode, 2026-06-18)
- c18baae9c - docs: add Auto Efficient tier to Auto Model documentation (kiloconnect[bot], 2026-06-18)
- 4ff799f4a - docs: clarify BYOK badge applicability in documentation (chrarnoldus, 2026-06-18)
- f0b432e1d - fix: prioritize BYOK model badges (chrarnoldus, 2026-06-18)
- 48b28e819 - Merge branch 'main' into feat/byok-model-badges (Christiaan Arnoldus, 2026-06-18)
- f6a05fb3d - fix(jetbrains): distinguish BYOK model badges (chrarnoldus, 2026-06-18)
- aa17a8a41 - fix(vscode): keep diff identifiers intact (marius-kilocode, 2026-06-18)
- ccec21623 - feat: show BYOK availability in model pickers (chrarnoldus, 2026-06-18)
- b930a19b7 - Merge pull request #11412 from Kilo-Org/fix/kilo-gateway-data-collection (Christiaan Arnoldus, 2026-06-18)
- d59825c69 - Merge pull request #11419 from Kilo-Org/revert-11379-add-top-level-announcement-notification (Mark IJbema, 2026-06-18)
- 6190c704c - Revert "Add top-level announcement notification" (Mark IJbema, 2026-06-18)
- b134c1c18 - release: v7.3.49 (kilo-maintainer[bot], 2026-06-18)
- c8a05db14 - docs: document prompt-training model visibility (chrarnoldus, 2026-06-18)
- 47a302f34 - Merge pull request #11303 from Kilo-Org/mark/replace-roo-code-session-import (Mark IJbema, 2026-06-18)
- 6187a557b - release: v7.3.48 (kilo-maintainer[bot], 2026-06-18)
- bcae818d9 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-18)
- 036d1cf4f - Merge pull request #11356 from Kilo-Org/imanolmaiztegui/kilo-opencode-v1.15.9 (Imanol Maiztegui, 2026-06-18)
- a5277487f - Merge branch 'main' into fix/kilo-gateway-data-collection (Christiaan Arnoldus, 2026-06-18)
- b46a40d53 - Merge branch 'main' into imanolmaiztegui/kilo-opencode-v1.15.9 (Imanol Maiztegui, 2026-06-18)
- ec00d6c9c - Merge pull request #11404 from Kilo-Org/toothsome-mask (Marius, 2026-06-18)
- 3bb2b2026 - refactor(gateway): transform request bodies once (chrarnoldus, 2026-06-18)
- bbd520dce - Merge pull request #11410 from Kilo-Org/jungle-cobbler (Marius, 2026-06-18)
- 09a7e89f5 - refactor(vscode): extract session abort tracking (marius-kilocode, 2026-06-18)
- f8156de65 - style(vscode): format Roo import translations (Mark IJbema, 2026-06-18)
- 2c9e72c14 - fix: deny Kilo Gateway data collection (chrarnoldus, 2026-06-18)
- 145a9b4e6 - chore(sync): trim irrelevant upstream entries and rebrand env vars in changeset (Imanol Maiztegui, 2026-06-18)
- 44d427520 - i18n(vscode): translate Roo Code import strings for all locales (markijbema, 2026-06-18)
- 338630bd8 - Merge pull request #11400 from Kilo-Org/docs/remove-managed-indexing (Marius, 2026-06-18)
- d83fe7206 - refactor(vscode): drop dead meta parameter from session migrate() (markijbema, 2026-06-18)
- 344a6a5f0 - fix(cli): share listener session runtime (marius-kilocode, 2026-06-18)
- 31f1f3118 - fix(vscode): make Roo session discovery reliable (markijbema, 2026-06-18)
- d43df066d - refactor(vscode): minimize moved session abort fix (marius-kilocode, 2026-06-18)
- f35d9c5fa - fix(vscode): stop moved active sessions (marius-kilocode, 2026-06-18)
- ee3846fe2 - docs(kilo-docs): remove managed indexing docs (marius-kilocode, 2026-06-18)
- 326ff3514 - docs(changeset): add upstream sync notes for opencode v1.15.4 to v1.15.9 (Imanol Maiztegui, 2026-06-18)
- 7a17de11a - refactor(vscode): drop unused data payload from migrationState message (markijbema, 2026-06-18)
- 77105faf3 - fix(vscode): bound migration cache by evicting stale and completed operations (markijbema, 2026-06-18)
- 0ae925230 - fix(vscode): keep legacy session detection history-driven and stat-only (markijbema, 2026-06-18)
- 45eab8893 - docs(vscode): correct Roo import changeset to match settings UX (markijbema, 2026-06-18)
- a87906700 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-17)
- 6b6b04bd9 - Merge branch 'main' into imanolmaiztegui/kilo-opencode-v1.15.9 (Imanol Maiztegui, 2026-06-17)
- 9c182afcd - fix(providers): enforce provider ID matching to isolate custom configurations (Imanol Maiztegui, 2026-06-17)
- 45e3f552e - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-17)
- 464fcb0a6 - refactor(vscode): share session migration pipeline (Mark IJbema, 2026-06-17)
- d5f1495f1 - refactor(build): remove sidecar models-snapshot distribution (Imanol Maiztegui, 2026-06-17)
- abdef9a7e - feat(opencode): add tool metadata buffering and migrate virtua to v0.42.3 (Imanol Maiztegui, 2026-06-17)
- b1045ac09 - Merge branch 'main' into imanolmaiztegui/kilo-opencode-v1.15.9 (Imanol Maiztegui, 2026-06-17)
- d2162d868 - fix(opencode): remove duplicate import in httpapi-sdk test (Imanol Maiztegui, 2026-06-17)
- 27d19a8de - Merge branch 'main' into imanolmaiztegui/kilo-opencode-v1.15.9 (Imanol Maiztegui, 2026-06-17)
- 280fa5414 - Merge branch 'main' into mark/replace-roo-code-session-import (Mark IJbema, 2026-06-17)
- 7a8626ad7 - refactor(kilo): align codebase with upstream v1.15.9 API changes (Imanol Maiztegui, 2026-06-17)
- b37a54645 - resolve merge conflicts (Imanol Maiztegui, 2026-06-17)
- 8fe0b8afc - fix(vscode): use migration wizard for Roo import (Mark IJbema, 2026-06-16)
- c6f332e51 - fix(vscode): import Roo sessions with UI-only history (Mark IJbema, 2026-06-16)
- a2efd4c8a - feat(vscode): add Roo import to settings UI (Mark IJbema, 2026-06-16)
- fd512efaa - Merge remote-tracking branch 'origin/main' into mark/replace-roo-code-session-import (Mark IJbema, 2026-06-16)
- 173837d09 - style(vscode): fix prettier formatting in roo-import/service.ts (kiloconnect[bot], 2026-06-16)
- d34d91455 - fix(vscode): inspect migrate() result and improve Roo Code session metadata (kiloconnect[bot], 2026-06-16)
- 6faa3f14b - feat(vscode): add Import Sessions from Roo Code command (kiloconnect[bot], 2026-06-15)
- cdae2ce7d - merge: record upstream v1.15.9 (Imanol Maiztegui, 2026-06-15)
- 5b9e33cfe - refactor: kilo compat for v1.15.9 (Imanol Maiztegui, 2026-06-15)
- 4de82931e - fix(vscode): tolerate duplicate panel command registration (Mohammad Javad Naderi, 2026-06-05)
- ce6c114d9 - release: v1.15.9 (opencode, 2026-05-22)
- 1a329e4e6 - chore: generate (opencode-agent[bot], 2026-05-22)
- bfb2d8dc7 - fix(tui): when diff viewer closes always return to last route (#28903) (James Long, 2026-05-22)
- 8f7a6c4a0 - fix(tui): refine diff view keyboard shortcuts (#28896) (James Long, 2026-05-22)
- 1857c7356 - chore: generate (opencode-agent[bot], 2026-05-22)
- 5f4235115 - fix(provider): type default model failures (#28881) (Shoubhit Dash, 2026-05-22)
- 968aaa3cf - fix(pty): expose missing session errors (#28884) (Shoubhit Dash, 2026-05-22)
- b8266e581 - chore: generate (opencode-agent[bot], 2026-05-22)
- ba746e36d - fix(tui): empty states, context, and minor improvements to diff viewer (#28878) (James Long, 2026-05-22)
- d5068ba28 - chore: generate (opencode-agent[bot], 2026-05-22)
- 7265c46af - fix(skill): type expected skill failures (#28885) (Shoubhit Dash, 2026-05-22)
- 536ee857c - fix(installation): type upgrade failures (#28883) (Shoubhit Dash, 2026-05-22)
- dda69d77e - chore: generate (opencode-agent[bot], 2026-05-22)
- 0e14404e5 - fix(sync): map workspace warp not found (#28882) (Shoubhit Dash, 2026-05-22)
- 05f51bfe4 - chore: generate (opencode-agent[bot], 2026-05-22)
- aee552c04 - fix(repository): type expected reference failures (#28880) (Shoubhit Dash, 2026-05-22)
- 4f6eaf859 - chore: generate (opencode-agent[bot], 2026-05-22)
- d0cb58782 - fix(llm): surface code, type, and nested fields on provider stream errors (#28757) (Kit Langton, 2026-05-22)
- a3430db73 - chore: generate (opencode-agent[bot], 2026-05-22)
- 3e1972fd9 - fix(httpapi): return project not found errors (#28856) (Shoubhit Dash, 2026-05-22)
- b368e5adb - chore: generate (opencode-agent[bot], 2026-05-22)
- 69e4f5227 - fix(tui): interaction improvements to diff viewer (#28851) (James Long, 2026-05-22)
- 8a5592053 - chore: generate (opencode-agent[bot], 2026-05-22)
- 9db90a0b7 - fix(llm): emit structured image blocks for tool-result media in Anthropic Messages (#28755) (Kit Langton, 2026-05-22)
- 700d01202 - fix(llm): emit structured input_image content for tool-result media in OpenAI Responses (#28754) (Kit Langton, 2026-05-22)
- 59e486a91 - fix(tui): restore question prompt key handling (#28835) (Shoubhit Dash, 2026-05-22)
- 859696741 - ci: "fix: exempt team members from compliance cleanup" (#28865) (Aiden Cline, 2026-05-22)
- 00038027c - chore: generate (opencode-agent[bot], 2026-05-22)
- 5cf597d58 - fix(httpapi): return pty error bodies (#28838) (Shoubhit Dash, 2026-05-22)
- d92b8d800 - chore: generate (opencode-agent[bot], 2026-05-22)
- 854c53553 - fix(tui): enable diff viewer by default (Dax Raad, 2026-05-22)
- 3cf955e9a - fix(desktop): correct user code extraction when URL contains colons (#28837) (OpeOginni, 2026-05-22)
- 63f3e8479 - chore: generate (opencode-agent[bot], 2026-05-22)
- 0beb4de3e - fix(httpapi): return mcp server not found errors (#28817) (Shoubhit Dash, 2026-05-22)
- 51da3483a - feat(tui): copy worktree path from palette (#28823) (Shoubhit Dash, 2026-05-22)
- 060fbc9ce - chore: generate (opencode-agent[bot], 2026-05-22)
- 7a769dab3 - fix(mcp): include scope in clientMetadata and add callbackPort option (#28810) (Sebin, 2026-05-22)
- 2663ecd39 - chore: generate (opencode-agent[bot], 2026-05-22)
- 4ce247eab - fix(httpapi): return request not found errors (#28693) (Shoubhit Dash, 2026-05-22)
- 76d9c2cd7 - fix(app): debounce vcs refresh in session page (#28784) (Brendan Allan, 2026-05-22)
- f6101aef8 - refactor(app): consolidate sdk and sync contexts (#28782) (Brendan Allan, 2026-05-22)
- f3874ec2f - refactor(app): move tab navigation to titlebar and conditionally register project shortcuts (#28773) (Brendan Allan, 2026-05-22)
- 6466fcfde - refactor(app): simplify session routing and tab close handling (#28767) (Brendan Allan, 2026-05-22)
- 1f0390cfb - app: wrap provider data in Map to avoid store (#28765) (Brendan Allan, 2026-05-22)
- 9f06accfb - chore: generate (opencode-agent[bot], 2026-05-22)
- 7a9724496 - fix(vertex): Vertex (Antropic) provider: use .rep.googleapis.com for continental multi-region endpoints (us, eu) (#28347) (JPFrancoia, 2026-05-21)
- 3e931152d - tweak(tui): remove italics from thinking labels (#28737) (Aiden Cline, 2026-05-21)
- ad1d14775 - sync (Frank, 2026-05-21)
- fcf4dff2c - sync (Frank, 2026-05-21)
- 56714327f - sync (Frank, 2026-05-21)
- 21f338652 - sync (Frank, 2026-05-21)
- 8115f0c66 - sync (Frank, 2026-05-21)
- 87d4cb07b - chore: generate (opencode-agent[bot], 2026-05-21)
- ee008923f - feat(tui): design revamp of diff viewer (#28728) (James Long, 2026-05-21)
- bbbef0da1 - sync (Frank, 2026-05-21)
- 1268f8657 - fix: exempt team members from compliance cleanup (Aiden Cline, 2026-05-21)
- 39e7ff932 - sync (Frank, 2026-05-21)
- e92c4fb46 - chore: drop dead imports across opencode/core/llm (#28720) (Kit Langton, 2026-05-21)
- 4b496066b - fix(opencode): update spinner color logic (#28032) (OpeOginni, 2026-05-21)
- e63dcd30f - sync (Frank, 2026-05-21)
- 2935d1819 - refactor(server): rename Fence.waitEffect to Fence.wait (#28717) (Kit Langton, 2026-05-21)
- 86907e2e4 - refactor(server): drop dead Fence.wait + redundant casts (#28710) (Kit Langton, 2026-05-21)
- 31d2d38d7 - sync (Frank, 2026-05-21)
- d21477d55 - sync (Frank, 2026-05-21)
- 80fa6e6c4 - sync (Frank, 2026-05-21)
- b99787e95 - refactor(opencode): fetch remote config with http client (#28661) (Kit Langton, 2026-05-21)
- 562d299a4 - sync (Frank, 2026-05-21)
- 9ecb04e35 - chore: generate (opencode-agent[bot], 2026-05-21)
- 231689c76 - test(config): port env-var config tests to it.instance (#28706) (Kit Langton, 2026-05-21)
- d70942079 - sync (Frank, 2026-05-21)
- 0cc55c11a - sync (Frank, 2026-05-21)
- 40da77e77 - test(opencode): cover native reasoning continuation (#28683) (Kit Langton, 2026-05-21)
- 0d2de7db6 - sync (Frank, 2026-05-21)
- a568f616c - sync (Frank, 2026-05-21)
- e4957a78e - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-21)
- 7e35cff4f - chore: generate (opencode-agent[bot], 2026-05-21)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/registry.ts` (+2, -2)
- `packages/opencode/src/kilocode/tool/task.ts` (+2, -2)
- `packages/opencode/src/tool/registry.ts` (+13, -4)
- `packages/opencode/src/tool/repo_clone.ts` (+10, -13)
- `packages/opencode/src/tool/shell.ts` (+2, -1)
- `packages/opencode/src/tool/skill.ts` (+3, -6)
- `packages/opencode/src/tool/task.ts` (+3, -2)
- `packages/opencode/src/tool/tool.ts` (+24, -7)
- `packages/opencode/src/tool/warpgrep.ts` (+2, -1)
- `packages/opencode/test/tool/glob.test.ts` (+109, -5)
- `packages/opencode/test/tool/grep.test.ts` (+103, -5)
- `packages/opencode/test/tool/read.test.ts` (+2, -3)
- `packages/opencode/test/tool/registry.test.ts` (+117, -40)
- `packages/opencode/test/tool/repo_clone.test.ts` (+19, -0)
- `packages/opencode/test/tool/skill.test.ts` (+87, -49)
- `packages/opencode/test/tool/tool-define.test.ts` (+63, -14)
- `packages/opencode/test/tool/write.test.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+6, -2)
- `packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts` (+6, -6)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+3, -1)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/rule.ts` (+1, -1)
- `packages/opencode/src/permission/evaluate.ts` (+1, -15)
- `packages/opencode/src/permission/index.ts` (+50, -41)
- `packages/opencode/test/kilocode/permission/next.always-rules.test.ts` (+10, -4)
- `packages/opencode/test/kilocode/permission/next.reply-http.test.ts` (+12, -5)
- `packages/opencode/test/kilocode/permission/next.reply-routing.test.ts` (+30, -37)
- `packages/opencode/test/permission/next.test.ts` (+6, -2)

#### Event Bus (**/bus/, **/event/)
- `packages/opencode/src/bus/index.ts` (+32, -21)
- `packages/opencode/test/bus/bus-effect.test.ts` (+92, -6)

#### Core (**/core/)
- `packages/core/package.json` (+2, -2)
- `packages/core/src/account.ts` (+331, -0)
- `packages/core/src/agent.ts` (+147, -0)
- `packages/core/src/auth.ts` (+0, -265)
- `packages/core/src/catalog.ts` (+141, -53)
- `packages/core/src/event.ts` (+2, -2)
- `packages/core/src/flag/flag.ts` (+3, -1)
- `packages/core/src/location-layer.ts` (+5, -4)
- `packages/core/src/{models.ts => models-dev.ts}` (+17, -11)
- `packages/core/src/models-snapshot.d.ts` (+0, -2)
- `packages/core/src/models-snapshot.js` (+0, -71726)
- `packages/core/src/permission.ts` (+45, -0)
- `packages/core/src/plugin.ts` (+63, -18)
- `packages/core/src/plugin/account.ts` (+48, -0)
- `packages/core/src/plugin/auth.ts` (+0, -30)
- `packages/core/src/plugin/boot.ts` (+50, -40)
- `packages/core/src/plugin/env.ts` (+10, -6)
- `packages/core/src/plugin/models-dev.ts` (+57, -45)
- `packages/core/src/plugin/provider/amazon-bedrock.ts` (+13, -8)
- `packages/core/src/plugin/provider/anthropic.ts` (+9, -5)
- `packages/core/src/plugin/provider/azure.ts` (+22, -10)
- `packages/core/src/plugin/provider/cerebras.ts` (+8, -4)
- `packages/core/src/plugin/provider/cloudflare-ai-gateway.ts` (+1, -1)
- `packages/core/src/plugin/provider/cloudflare-workers-ai.ts` (+9, -7)
- `packages/core/src/plugin/provider/github-copilot.ts` (+8, -8)
- `packages/core/src/plugin/provider/google-vertex.ts` (+58, -37)
- `packages/core/src/plugin/provider/kilo.ts` (+27, -19)
- `packages/core/src/plugin/provider/llmgateway.ts` (+16, -7)
- `packages/core/src/plugin/provider/nvidia.ts` (+15, -6)
- `packages/core/src/plugin/provider/openai.ts` (+11, -5)
- `packages/core/src/plugin/provider/opencode.ts` (+15, -10)
- `packages/core/src/plugin/provider/openrouter.ts` (+19, -12)
- `packages/core/src/plugin/provider/vercel.ts` (+11, -5)
- `packages/core/src/plugin/provider/zenmux.ts` (+12, -5)
- `packages/core/src/provider.ts` (+1, -1)
- `packages/core/src/util/error.ts` (+1, -0)
- `packages/core/src/util/wildcard.ts` (+14, -0)
- `packages/core/test/account.test.ts` (+284, -0)
- `packages/core/test/catalog.test.ts` (+132, -125)
- `packages/core/test/effect/cross-spawn-spawner.test.ts` (+4, -8)
- `packages/core/test/kilocode/account-auth-v2-migration.test.ts` (+97, -0)
- `packages/core/test/kilocode/provider-isolation.test.ts` (+71, -0)
- `packages/core/test/models.test.ts` (+5, -3)
- `packages/core/test/plugin/provider-amazon-bedrock.test.ts` (+22, -17)
- `packages/core/test/plugin/provider-anthropic.test.ts` (+20, -14)
- `packages/core/test/plugin/provider-azure-cognitive-services.test.ts` (+35, -21)
- `packages/core/test/plugin/provider-azure.test.ts` (+89, -50)
- `packages/core/test/plugin/provider-cerebras.test.ts` (+19, -14)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+63, -46)
- `packages/core/test/plugin/provider-github-copilot.test.ts` (+22, -14)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+55, -27)
- `packages/core/test/plugin/provider-google-vertex-anthropic.test.ts` (+91, -23)
- `packages/core/test/plugin/provider-google-vertex.test.ts` (+82, -64)
- `packages/core/test/plugin/provider-helper.ts` (+32, -1)
- `packages/core/test/plugin/provider-kilo.test.ts` (+104, -85)
- `packages/core/test/plugin/provider-llmgateway.test.ts` (+36, -26)
- `packages/core/test/plugin/provider-nvidia.test.ts` (+47, -40)
- `packages/core/test/plugin/provider-openai.test.ts` (+27, -17)
- `packages/core/test/plugin/provider-opencode.test.ts` (+126, -98)
- `packages/core/test/plugin/provider-openrouter.test.ts` (+55, -38)
- `packages/core/test/plugin/provider-vercel.test.ts` (+31, -16)
- `packages/core/test/plugin/provider-zenmux.test.ts` (+60, -45)

#### Other Changes
- `.changeset/allow-keyless-indexing.md` (+0, -7)
- `.changeset/bright-badgers-bring-keys.md` (+7, -0)
- `.changeset/calm-models-reason.md` (+0, -5)
- `.changeset/calm-snapshot-spinner.md` (+0, -5)
- `.changeset/clear-rate-limit-errors.md` (+0, -6)
- `.changeset/close-other-tabs.md` (+0, -5)
- `.changeset/close-read-tui-news.md` (+0, -5)
- `.changeset/code-edit-block-display.md` (+0, -5)
- `.changeset/copy-command-scope.md` (+0, -5)
- `.changeset/deny-gateway-data-collection.md` (+6, -0)
- `.changeset/fast-monkeys-smoke.md` (+0, -5)
- `.changeset/fix-diff-viewer-corners.md` (+0, -5)
- `.changeset/fix-jetbrains-provider-settings.md` (+0, -5)
- `.changeset/fix-kilo-npm-upgrade.md` (+0, -5)
- `.changeset/fix-llm-user-agent.md` (+0, -5)
- `.changeset/fix-model-picker-navigation.md` (+0, -5)
- `.changeset/fix-session-scope-toggle.md` (+0, -5)
- `.changeset/fix-string-permission-migration.md` (+0, -5)
- `.changeset/hide-prompt-training-models.md` (+0, -6)
- `.changeset/highlight-changed-characters.md` (+0, -5)
- `.changeset/highlight-jetbrains-shell-commands.md` (+0, -5)
- `.changeset/ime-enter-composition-guard.md` (+0, -5)
- `.changeset/improve-jetbrains-markdown.md` (+0, -5)
- `.changeset/jetbrains-hide-read-payloads.md` (+0, -5)
- `.changeset/jetbrains-horizontal-attachments.md` (+0, -5)
- `.changeset/jetbrains-hover-copy-overlay.md` (+0, -5)
- `.changeset/jetbrains-message-toolbar.md` (+0, -5)
- `.changeset/jetbrains-model-provider-label.md` (+0, -5)
- `.changeset/jetbrains-paste-attachments.md` (+0, -5)
- `.changeset/jetbrains-prompt-attachment-preview.md` (+0, -5)
- `.changeset/jetbrains-prompt-attachments.md` (+0, -5)
- `.changeset/jetbrains-prompt-input-height.md` (+0, -5)
- `.changeset/jetbrains-provider-disconnect.md` (+0, -5)
- `.changeset/jetbrains-provider-headless-oauth.md` (+0, -5)
- `.changeset/jetbrains-provider-oauth-cancel.md` (+0, -5)
- `.changeset/jetbrains-restartless-unload.md` (+0, -5)
- `.changeset/jetbrains-session-copy.md` (+0, -5)
- `.changeset/jetbrains-session-drop-overlay.md` (+0, -5)
- `.changeset/jetbrains-session-icons.md` (+0, -5)
- `.changeset/jetbrains-vfs-frontend-handoff.md` (+0, -5)
- `.changeset/keep-diff-identifiers-intact.md` (+5, -0)
- `.changeset/kilo-branding-leftovers.md` (+0, -5)
- `.changeset/list-agent-manager-worktrees.md` (+0, -5)
- `.changeset/load-bundled-atomic-chat.md` (+0, -5)
- `.changeset/minimax-m3-reasoning-toggle.md` (+0, -6)
- `.changeset/move-worktrees-safely.md` (+0, -5)
- `.changeset/name-compact-settings-tabs.md` (+0, -5)
- `.changeset/native-plan-architect-parity.md` (+0, -5)
- `.changeset/neat-jetbrains-provider-list.md` (+0, -5)
- `.changeset/notify-background-sessions.md` (+0, -5)
- `.changeset/open-worktree-pull-request.md` (+0, -5)
- `.changeset/opencode-v1-14-51-to-v1-15-4.md` (+0, -33)
- `.changeset/plan-timestamp-prefix.md` (+0, -5)
- `.changeset/polish-vscode-tool-previews.md` (+0, -5)
- `.changeset/preserve-cli-telemetry-exit.md` (+0, -5)
- `.changeset/preserve-console-review-expansion.md` (+0, -5)
- `.changeset/preserve-console-terminals.md` (+0, -5)
- `.changeset/prevent-atomic-chat-install.md` (+0, -5)
- `.changeset/quiet-interrupted-sessions.md` (+0, -6)
- `.changeset/quiet-subagent-finishes.md` (+7, -0)
- `.changeset/quiet-terminal-panel.md` (+5, -0)
- `.changeset/readable-agent-chat.md` (+0, -5)
- `.changeset/remote-agent-manager-sessions.md` (+0, -5)
- `.changeset/remove-chat-input-divider.md` (+0, -5)
- `.changeset/render-image-diffs.md` (+0, -5)
- `.changeset/render-jetbrains-attachment-cards.md` (+0, -5)
- `.changeset/render-jetbrains-shell-markdown.md` (+0, -5)
- `.changeset/restore-authenticated-speech-input.md` (+0, -7)
- `.changeset/restore-jetbrains-popular-providers.md` (+0, -5)
- `.changeset/restore-popular-providers.md` (+0, -5)
- `.changeset/revert-file-moves.md` (+0, -5)
- `.changeset/search-agent-manager-sidebar.md` (+0, -5)
- `.changeset/share-worktree-indexes.md` (+0, -6)
- `.changeset/shared-provider-icons.md` (+0, -7)
- `.changeset/show-console-training-filter.md` (+0, -5)
- `.changeset/show-edit-approval-line-numbers.md` (+0, -5)
- `.changeset/silent-comet-attachments.md` (+0, -5)
- `.changeset/stabilize-agent-manager-transcripts.md` (+5, -0)
- `.changeset/steady-codex-refresh.md` (+0, -5)
- `.changeset/steady-shell-expansion.md` (+0, -5)
- `.changeset/switch-model-agent-links.md` (+0, -5)
- `.changeset/terminal-title-status.md` (+0, -6)
- `.changeset/widen-chat-lane-further.md` (+5, -0)
- `.changeset/widen-chat-readable-lane.md` (+0, -5)
- `.github/workflows/publish.yml` (+1, -1)
- `.opencode-version` (+1, -1)
- `.prettierignore` (+0, -4)
- `AGENTS.md` (+8, -0)
- `bun.lock` (+617, -634)
- `nix/hashes.json` (+4, -4)
- `package.json` (+10, -9)
- `packages/effect-drizzle-sqlite/AGENTS.md` (+19, -0)
- `packages/effect-drizzle-sqlite/examples/basic.ts` (+92, -0)
- `packages/effect-drizzle-sqlite/examples/migrations/20240101000000_create_users/migration.sql` (+4, -0)
- `packages/effect-drizzle-sqlite/package.json` (+29, -0)
- `packages/effect-drizzle-sqlite/src/effect-sqlite/driver.ts` (+77, -0)
- `packages/effect-drizzle-sqlite/src/effect-sqlite/index.ts` (+4, -0)
- `packages/effect-drizzle-sqlite/src/effect-sqlite/migrator.ts` (+14, -0)
- `packages/effect-drizzle-sqlite/src/effect-sqlite/session.ts` (+214, -0)
- `packages/effect-drizzle-sqlite/src/index.ts` (+6, -0)
- `packages/effect-drizzle-sqlite/src/internal/drizzle-utils.ts` (+127, -0)
- `packages/effect-drizzle-sqlite/src/sqlite-core/effect/count.ts` (+58, -0)
- `packages/effect-drizzle-sqlite/src/sqlite-core/effect/db.ts` (+296, -0)
- `packages/effect-drizzle-sqlite/src/sqlite-core/effect/delete.ts` (+261, -0)
- `packages/effect-drizzle-sqlite/src/sqlite-core/effect/index.ts` (+10, -0)
- `packages/effect-drizzle-sqlite/src/sqlite-core/effect/insert.ts` (+349, -0)
- `packages/effect-drizzle-sqlite/src/sqlite-core/effect/query.ts` (+198, -0)
- `packages/effect-drizzle-sqlite/src/sqlite-core/effect/raw.ts` (+49, -0)
- `packages/effect-drizzle-sqlite/src/sqlite-core/effect/select.ts` (+279, -0)
- `packages/effect-drizzle-sqlite/src/sqlite-core/effect/session.ts` (+490, -0)
- `packages/effect-drizzle-sqlite/src/sqlite-core/effect/update.ts` (+402, -0)
- `packages/effect-drizzle-sqlite/src/up-migrations/effect-sqlite.ts` (+102, -0)
- `packages/effect-drizzle-sqlite/src/up-migrations/sqlite.ts` (+253, -0)
- `packages/effect-drizzle-sqlite/src/up-migrations/utils.ts` (+45, -0)
- `packages/effect-drizzle-sqlite/sst-env.d.ts` (+10, -0)
- `packages/effect-drizzle-sqlite/test/sqlite.test.ts` (+139, -0)
- `packages/effect-drizzle-sqlite/tsconfig.json` (+16, -0)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-console/src/client.ts` (+44, -0)
- `packages/kilo-console/src/index.tsx` (+2, -0)
- `packages/kilo-console/src/routes/profile/LoginRoute.tsx` (+244, -0)
- `packages/kilo-console/src/routes/profile/ProfileRoute.tsx` (+310, -4)
- `packages/kilo-console/src/routes/profile/profile-utils.test.ts` (+44, -0)
- `packages/kilo-console/src/routes/profile/profile-utils.ts` (+80, -0)
- `packages/kilo-console/src/routes/profile/server.ts` (+71, -0)
- `packages/kilo-console/src/shared/navigation.test.ts` (+1, -0)
- `packages/kilo-console/src/shared/navigation.ts` (+1, -1)
- `packages/kilo-console/src/styles.css` (+1, -0)
- `packages/kilo-console/src/styles/profile.css` (+480, -0)
- `packages/kilo-docs/docs/getting-started/switching-from-cline.md` (+2, -2)
- `packages/kilo-docs/lib/nav/deploy-secure.ts` (+0, -1)
- `packages/kilo-docs/mappingplan.md` (+0, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/auto-model.md` (+11, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/model-selection.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+2, -0)
- `packages/kilo-docs/pages/collaborate/adoption-dashboard/for-team-leads.md` (+3, -3)
- `packages/kilo-docs/pages/collaborate/adoption-dashboard/improving-your-score.md` (+2, -2)
- `packages/kilo-docs/pages/deploy-secure/index.md` (+1, -11)
- `packages/kilo-docs/pages/deploy-secure/managed-indexing.md` (+0, -121)
- `packages/kilo-docs/pages/getting-started/byok.md` (+2, -1)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+12, -0)
- `packages/kilo-docs/pages/index.tsx` (+0, -1)
- `packages/kilo-docs/previous-docs-redirects.js` (+7, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/labs-tool-call-lab/search-previews-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/migration/roo-wizard-selecting-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/source-links.md` (+0, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/api/models.ts` (+2, -0)
- `packages/kilo-gateway/src/provider.ts` (+2, -2)
- `packages/kilo-gateway/src/responses.ts` (+16, -7)
- `packages/kilo-gateway/src/tui/types.ts` (+0, -1)
- `packages/kilo-gateway/src/types.ts` (+5, -0)
- `packages/kilo-gateway/src/types/tui.d.ts` (+0, -4)
- `packages/kilo-gateway/test/api/models.test.ts` (+2, -0)
- `packages/kilo-gateway/test/responses.test.ts` (+29, -6)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+73, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt` (+0, -3)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+2, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceDtoMapper.kt` (+1, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloWorkspaceState.kt` (+1, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/GeneratedApiModelSerializationTest.kt` (+3, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+4, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/ProjectModelSerializationTest.kt` (+3, -1)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/CheckCliTask.kt` (+1, -1)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/PrepareLocalCliTask.kt` (+3, -11)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPickerRenderer.kt` (+14, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/models/ModelsSettingsUi.kt` (+10, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/model/ModelPickerTest.kt` (+17, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/script/build.ts` (+3, -10)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ProviderDto.kt` (+1, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+1, -1)
- `packages/kilo-ui/src/pierre/index.test.ts` (+3, -3)
- `packages/kilo-ui/src/pierre/index.ts` (+3, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+172, -0)
- `packages/kilo-vscode/package.json` (+2, -1)
- `packages/kilo-vscode/script/build.ts` (+0, -6)
- `packages/kilo-vscode/script/local-bin.ts` (+2, -16)
- `packages/kilo-vscode/script/watch-cli.ts` (+2, -14)
- `packages/kilo-vscode/src/KiloProvider.ts` (+23, -34)
- `packages/kilo-vscode/src/agent-manager/SessionTerminalManager.ts` (+17, -4)
- `packages/kilo-vscode/src/extension.ts` (+1, -1)
- `packages/kilo-vscode/src/kilo-provider/abort.ts` (+66, -1)
- `packages/kilo-vscode/src/kilo-provider/handlers/migration.ts` (+148, -29)
- `packages/kilo-vscode/src/legacy-migration/migration-service.ts` (+20, -58)
- `packages/kilo-vscode/src/legacy-migration/session-batch.ts` (+63, -0)
- `packages/kilo-vscode/src/legacy-migration/sessions/lib/session.ts` (+2, -1)
- `packages/kilo-vscode/src/legacy-migration/sessions/migrate.ts` (+12, -11)
- `packages/kilo-vscode/src/legacy-migration/sessions/parser.ts` (+12, -7)
- `packages/kilo-vscode/src/legacy-migration/task-store.ts` (+244, -0)
- `packages/kilo-vscode/src/roo-import/service.ts` (+64, -0)
- `packages/kilo-vscode/src/services/attention/service.ts` (+9, -16)
- `packages/kilo-vscode/tests/accessibility.spec.ts` (+60, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/setup/vscode-mock.ts` (+6, -0)
- `packages/kilo-vscode/tests/unit/abort.test.ts` (+48, -1)
- `packages/kilo-vscode/tests/unit/attention.test.ts` (+21, -11)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+75, -2)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/legacy-migration/migration-cache.test.ts` (+87, -0)
- `packages/kilo-vscode/tests/unit/legacy-migration/session-batch.test.ts` (+36, -0)
- `packages/kilo-vscode/tests/unit/legacy-migration/task-store.test.ts` (+49, -0)
- `packages/kilo-vscode/tests/unit/model-preview-data-line.test.ts` (+26, -7)
- `packages/kilo-vscode/tests/unit/model-selector-utils.test.ts` (+9, -0)
- `packages/kilo-vscode/tests/unit/roo-import.test.ts` (+172, -0)
- `packages/kilo-vscode/tests/unit/session-terminal-manager.test.ts` (+66, -4)
- `packages/kilo-vscode/tests/unit/task-tool-identity.test.ts` (+72, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/MultiModelSelector.tsx` (+8, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+53, -3)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+10, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+28, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+6, -8)
- `packages/kilo-vscode/webview-ui/src/components/migration/MigrationWizard.tsx` (+152, -142)
- `packages/kilo-vscode/webview-ui/src/components/settings/AboutKiloCodeTab.tsx` (+15, -17)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelPreview.tsx` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+8, -2)
- `packages/kilo-vscode/webview-ui/src/components/shared/model-selector-utils.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/context/notifications.tsx` (+1, -12)
- `packages/kilo-vscode/webview-ui/src/context/session-utils.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+10, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/stories/history.stories.tsx` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/stories/migration.stories.tsx` (+62, -0)
- `packages/kilo-vscode/webview-ui/src/stories/shell.stories.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/styles/model-selector.css` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+8, -8)
- `packages/kilo-vscode/webview-ui/src/types/messages/migration.ts` (+27, -20)
- `packages/kilo-vscode/webview-ui/src/types/messages/providers.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+4, -4)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/AGENTS.md` (+43, -37)
- `packages/llm/README.md` (+15, -13)
- `packages/llm/example/call-sites.md` (+591, -0)
- `packages/llm/example/tutorial.ts` (+20, -16)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/cache-policy.ts` (+1, -1)
- `packages/llm/src/index.ts` (+1, -2)
- `packages/llm/src/llm.ts` (+3, -7)
- `packages/llm/src/protocols/anthropic-messages.ts` (+96, -22)
- `packages/llm/src/protocols/bedrock-converse.ts` (+36, -54)
- `packages/llm/src/protocols/gemini.ts` (+5, -10)
- `packages/llm/src/protocols/openai-chat.ts` (+7, -17)
- `packages/llm/src/protocols/openai-compatible-chat.ts` (+3, -7)
- `packages/llm/src/protocols/openai-responses.ts` (+213, -47)
- `packages/llm/src/protocols/shared.ts` (+13, -8)
- `packages/llm/src/protocols/utils/bedrock-auth.ts` (+25, -58)
- `packages/llm/src/protocols/utils/openai-options.ts` (+5, -0)
- `packages/llm/src/provider.ts` (+13, -7)
- `packages/llm/src/providers/amazon-bedrock.ts` (+23, -28)
- `packages/llm/src/providers/anthropic.ts` (+27, -10)
- `packages/llm/src/providers/azure.ts` (+67, -40)
- `packages/llm/src/providers/cloudflare.ts` (+60, -72)
- `packages/llm/src/providers/github-copilot.ts` (+40, -22)
- `packages/llm/src/providers/google.ts` (+27, -10)
- `packages/llm/src/providers/index.ts` (+1, -0)
- `packages/llm/src/providers/openai-compatible.ts` (+42, -38)
- `packages/llm/src/providers/openai-options.ts` (+1, -2)
- `packages/llm/src/providers/openai.ts` (+35, -25)
- `packages/llm/src/providers/openrouter.ts` (+27, -17)
- `packages/llm/src/providers/xai.ts` (+29, -25)
- `packages/llm/src/route/auth.ts` (+19, -60)
- `packages/llm/src/route/client.ts` (+115, -188)
- `packages/llm/src/route/endpoint.ts` (+21, -7)
- `packages/llm/src/route/index.ts` (+3, -4)
- `packages/llm/src/route/transport/http.ts` (+27, -41)
- `packages/llm/src/route/transport/index.ts` (+12, -1)
- `packages/llm/src/route/transport/websocket.ts` (+13, -15)
- `packages/llm/src/schema/events.ts` (+4, -2)
- `packages/llm/src/schema/messages.ts` (+46, -15)
- `packages/llm/src/schema/options.ts` (+48, -57)
- `packages/llm/src/tool-runtime.ts` (+13, -7)
- `packages/llm/src/utils/record.ts` (+3, -0)
- `packages/llm/test/adapter.test.ts` (+38, -51)
- `packages/llm/test/auth-options.types.ts` (+96, -28)
- `packages/llm/test/auth.test.ts` (+3, -1)
- `packages/llm/test/cache-policy.test.ts` (+16, -20)
- `packages/llm/test/continuation-scenarios.ts` (+104, -0)
- `packages/llm/test/endpoint.test.ts` (+18, -14)
- `packages/llm/test/executor.test.ts` (+6, -4)
- `packages/llm/test/exports.test.ts` (+22, -16)
- `packages/llm/test/fixtures/media/restroom.png` (+-, --)
- `packages/llm/test/fixtures/recordings/anthropic-messages/anthropic-opus-4-7-image-tool-result.json` (+43, -0)
- `packages/llm/test/fixtures/recordings/gemini/gemini-2-5-flash-image.json` (+32, -0)
- `packages/llm/test/fixtures/recordings/openai-responses-cache/reports-cached-tokens-on-identical-second-call.json` (+2, -2)
- `packages/llm/test/fixtures/recordings/openai-responses/openai-responses-gpt-5-5-image-tool-result.json` (+42, -0)
- `packages/llm/test/fixtures/recordings/openai-responses/openai-responses-gpt-5-5-reasoning-continuation.json` (+58, -0)
- `packages/llm/test/fixtures/recordings/openai-responses/openai-responses-gpt-5-5-reasoning.json` (+32, -0)
- `packages/llm/test/generate-object.test.ts` (+4, -5)
- `packages/llm/test/lib/http.ts` (+6, -4)
- `packages/llm/test/lib/tool-runtime.ts` (+0, -1)
- `packages/llm/test/llm.test.ts` (+32, -19)
- `packages/llm/test/provider.types.ts` (+6, -4)
- `packages/llm/test/provider/anthropic-messages-cache.recorded.test.ts` (+3, -4)
- `packages/llm/test/provider/anthropic-messages.recorded.test.ts` (+3, -4)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+208, -14)
- `packages/llm/test/provider/bedrock-converse-cache.recorded.test.ts` (+3, -4)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+60, -21)
- `packages/llm/test/provider/cloudflare.test.ts` (+22, -22)
- `packages/llm/test/provider/gemini-cache.recorded.test.ts` (+3, -4)
- `packages/llm/test/provider/gemini.test.ts` (+7, -6)
- `packages/llm/test/provider/golden.recorded.test.ts` (+45, -42)
- `packages/llm/test/provider/openai-chat.test.ts` (+46, -15)
- `packages/llm/test/provider/openai-compatible-chat.test.ts` (+23, -22)
- `packages/llm/test/provider/openai-responses-cache.recorded.test.ts` (+3, -4)
- `packages/llm/test/provider/openai-responses.test.ts` (+471, -53)
- `packages/llm/test/provider/openrouter.test.ts` (+6, -6)
- `packages/llm/test/recorded-golden.ts` (+8, -14)
- `packages/llm/test/recorded-scenarios.ts` (+274, -73)
- `packages/llm/test/recorded-test.ts` (+1, -3)
- `packages/llm/test/route.test.ts` (+43, -0)
- `packages/llm/test/schema.test.ts` (+13, -10)
- `packages/llm/test/tool-runtime.test.ts` (+49, -8)
- `packages/llm/test/tool.types.ts` (+2, -1)
- `packages/opencode/.gitignore` (+0, -3)
- `packages/opencode/CHANGELOG.md` (+163, -0)
- `packages/opencode/package.json` (+7, -3)
- `packages/opencode/parsers-config.ts` (+76, -0)
- `packages/opencode/script/bench-test-suite.ts` (+52, -0)
- `packages/opencode/script/build-node.ts` (+2, -1)
- `packages/opencode/script/build.ts` (+5, -11)
- `packages/opencode/script/generate.ts` (+7, -3)
- `packages/opencode/script/kilocode/models-snapshot.ts` (+0, -76)
- `packages/opencode/script/profile-test-files.ts` (+42, -0)
- `packages/opencode/specs/tui-plugins.md` (+64, -1)
- `packages/opencode/src/account/account.ts` (+3, -0)
- `packages/opencode/src/account/repo.ts` (+3, -0)
- `packages/opencode/src/acp/agent.ts` (+0, -2)
- `packages/opencode/src/cli/cmd/account.ts` (+4, -3)
- `packages/opencode/src/cli/cmd/debug/agent.ts` (+30, -3)
- `packages/opencode/src/cli/cmd/debug/v2.ts` (+11, -12)
- `packages/opencode/src/cli/cmd/github.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/import.ts` (+11, -4)
- `packages/opencode/src/cli/cmd/mcp.ts` (+0, -1)
- `packages/opencode/src/cli/cmd/models.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/providers.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+32, -2)
- `packages/opencode/src/cli/cmd/run/footer.command.tsx` (+139, -2)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+129, -11)
- `packages/opencode/src/cli/cmd/run/footer.question.tsx` (+2, -2)
- `packages/opencode/src/cli/cmd/run/footer.subagent.tsx` (+48, -68)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+15, -13)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+146, -104)
- `packages/opencode/src/cli/cmd/run/prompt.shared.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/run/runtime.queue.ts` (+8, -6)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+10, -0)
- `packages/opencode/src/cli/cmd/run/session-data.ts` (+141, -0)
- `packages/opencode/src/cli/cmd/run/session-replay.ts` (+188, -0)
- `packages/opencode/src/cli/cmd/run/session.shared.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+301, -106)
- `packages/opencode/src/cli/cmd/run/subagent-data.ts` (+19, -2)
- `packages/opencode/src/cli/cmd/run/tool.ts` (+32, -3)
- `packages/opencode/src/cli/cmd/run/types.ts` (+8, -0)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+59, -22)
- `packages/opencode/src/cli/cmd/tui/component/command-palette.tsx` (+79, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-model.tsx` (+6, -3)
- `packages/opencode/src/cli/cmd/tui/component/dialog-tag.tsx` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-create.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx` (+18, -12)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+12, -20)
- `packages/opencode/src/cli/cmd/tui/component/prompt/part.ts` (+7, -0)
- `packages/opencode/src/cli/cmd/tui/config/keybind.ts` (+27, -0)
- `packages/opencode/src/cli/cmd/tui/context/command-palette.tsx` (+0, -163)
- `packages/opencode/src/cli/cmd/tui/context/editor-zed.ts` (+4, -0)
- `packages/opencode/src/cli/cmd/tui/context/editor.ts` (+8, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+5, -2)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/diff-viewer-file-tree-utils.ts` (+232, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/diff-viewer-file-tree.tsx` (+162, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/diff-viewer-ui.tsx` (+103, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/diff-viewer.tsx` (+959, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/notifications.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/session-v2.tsx` (+37, -33)
- `packages/opencode/src/cli/cmd/tui/keymap.tsx` (+116, -9)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+8, -1)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+26, -7)
- `packages/opencode/src/cli/cmd/tui/routes/home.tsx` (+2, -14)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+42, -42)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+4, -7)
- `packages/opencode/src/cli/cmd/tui/routes/session/question.tsx` (+16, -8)
- `packages/opencode/src/cli/cmd/tui/routes/session/subagent-footer.tsx` (+5, -6)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-prompt.tsx` (+33, -8)
- `packages/opencode/src/cli/cmd/tui/ui/dialog.tsx` (+9, -2)
- `packages/opencode/src/cli/cmd/tui/util/collapse-tool-output.ts` (+19, -0)
- `packages/opencode/src/cli/cmd/tui/util/selection.ts` (+10, -2)
- `packages/opencode/src/config/agent.ts` (+3, -15)
- `packages/opencode/src/config/command.ts` (+2, -13)
- `packages/opencode/src/config/config.ts` (+86, -42)
- `packages/opencode/src/config/entry-name.ts` (+11, -8)
- `packages/opencode/src/config/managed.ts` (+0, -1)
- `packages/opencode/src/config/mcp.ts` (+4, -0)
- `packages/opencode/src/config/reference.ts` (+46, -0)
- `packages/opencode/src/config/variable.ts` (+3, -2)
- `packages/opencode/src/control-plane/workspace.ts` (+6, -1)
- `packages/opencode/src/effect/app-runtime.ts` (+1, -1)
- `packages/opencode/src/effect/bridge.ts` (+2, -1)
- `packages/opencode/src/effect/config-service.ts` (+7, -7)
- `packages/opencode/src/effect/runtime-flags.ts` (+1, -0)
- `packages/opencode/src/env/index.ts` (+3, -0)
- `packages/opencode/src/event-v2-bridge.ts` (+2, -1)
- `packages/opencode/src/file/index.ts` (+3, -0)
- `packages/opencode/src/file/ripgrep.ts` (+3, -0)
- `packages/opencode/src/format/index.ts` (+3, -0)
- `packages/opencode/src/installation/index.ts` (+79, -31)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+9, -5)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+1, -1)
- `packages/opencode/src/kilocode/claw/autocomplete.tsx` (+9, -10)
- `packages/opencode/src/kilocode/cli/cmd/tui/app.tsx` (+0, -2)
- `packages/opencode/src/kilocode/commands.ts` (+0, -2)
- `packages/opencode/src/kilocode/components/free-model-disclosure.ts` (+4, -0)
- `packages/opencode/src/kilocode/components/model-info-panel.tsx` (+5, -0)
- `packages/opencode/src/kilocode/provider/models-snapshot.ts` (+0, -32)
- `packages/opencode/src/kilocode/provider/provider.ts` (+13, -1)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+26, -0)
- `packages/opencode/src/kilocode/server/listener.ts` (+8, -0)
- `packages/opencode/src/kilocode/session-export/llm.ts` (+120, -0)
- `packages/opencode/src/kilocode/session/index.ts` (+17, -16)
- `packages/opencode/src/kilocode/session/llm.ts` (+4, -10)
- `packages/opencode/src/kilocode/tui/app-exit.ts` (+0, -21)
- `packages/opencode/src/mcp/auth.ts` (+3, -0)
- `packages/opencode/src/mcp/index.ts` (+43, -27)
- `packages/opencode/src/mcp/oauth-provider.ts` (+4, -1)
- `packages/opencode/src/plugin/codex.ts` (+42, -14)
- `packages/opencode/src/plugin/index.ts` (+3, -3)
- `packages/opencode/src/plugin/loader.ts` (+38, -18)
- `packages/opencode/src/plugin/xai.ts` (+10, -5)
- `packages/opencode/src/project/instance-store.ts` (+3, -0)
- `packages/opencode/src/project/project.ts` (+10, -4)
- `packages/opencode/src/project/vcs.ts` (+45, -16)
- `packages/opencode/src/provider/auth.ts` (+3, -0)
- `packages/opencode/src/provider/model-cache.ts` (+1, -1)
- `packages/opencode/src/provider/model-status.ts` (+1, -1)
- `packages/opencode/src/provider/models.ts` (+1, -1)
- `packages/opencode/src/provider/provider.ts` (+47, -8)
- `packages/opencode/src/provider/sdk/copilot/AGENTS.md` (+0, -1)
- `packages/opencode/src/provider/transform.ts` (+1, -1)
- `packages/opencode/src/pty/index.ts` (+33, -25)
- `packages/opencode/src/question/index.ts` (+27, -18)
- `packages/opencode/src/reference/reference.ts` (+74, -76)
- `packages/opencode/src/reference/repository-cache.ts` (+191, -18)
- `packages/opencode/src/server/routes/instance/httpapi/errors.ts` (+175, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/instance.ts` (+1, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/mcp.ts` (+7, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/permission.ts` (+4, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project.ts` (+4, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/provider.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/pty.ts` (+6, -6)
- `packages/opencode/src/server/routes/instance/httpapi/groups/question.ts` (+3, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+6, -6)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/message.ts` (+5, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/model.ts` (+4, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/provider.ts` (+5, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/session.ts` (+15, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/workspace.ts` (+2, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/event.ts` (+5, -4)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/instance.ts` (+4, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/mcp.ts` (+54, -11)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/permission.ts` (+34, -14)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/project.ts` (+11, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+60, -19)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/question.ts` (+22, -7)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session-errors.ts` (+10, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+18, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/message.ts` (+36, -9)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/model.ts` (+7, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/provider.ts` (+18, -6)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/session.ts` (+119, -15)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/workspace.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/authorization.ts` (+45, -15)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/error.ts` (+3, -8)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/schema-error.ts` (+13, -1)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts` (+32, -3)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+40, -12)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+18, -3)
- `packages/opencode/src/server/server.ts` (+3, -2)
- `packages/opencode/src/server/shared/fence.ts` (+7, -13)
- `packages/opencode/src/session/compaction.ts` (+4, -2)
- `packages/opencode/src/session/llm.ts` (+145, -392)
- `packages/opencode/src/session/llm/AGENTS.md` (+90, -0)
- `packages/opencode/src/session/llm/ai-sdk.ts` (+256, -0)
- `packages/opencode/src/session/llm/native-request.ts` (+196, -0)
- `packages/opencode/src/session/llm/native-runtime.ts` (+143, -0)
- `packages/opencode/src/session/llm/request.ts` (+254, -0)
- `packages/opencode/src/session/message-v2.ts` (+1, -0)
- `packages/opencode/src/session/processor.ts` (+218, -129)
- `packages/opencode/src/session/prompt.ts` (+30, -348)
- `packages/opencode/src/session/prompt/plan-mode.txt` (+70, -0)
- `packages/opencode/src/session/prompt/reference.ts` (+73, -0)
- `packages/opencode/src/session/reminders.ts` (+75, -0)
- `packages/opencode/src/session/session.ts` (+11, -10)
- `packages/opencode/src/session/tools.ts` (+204, -0)
- `packages/opencode/src/share/share-next.ts` (+14, -7)
- `packages/opencode/src/skill/index.ts` (+22, -5)
- `packages/opencode/src/snapshot/index.ts` (+4, -2)
- `packages/opencode/src/sync/index.ts` (+51, -69)
- `packages/opencode/src/util/repository.ts` (+94, -20)
- `packages/opencode/src/v2/session.ts` (+54, -21)
- `packages/opencode/src/worktree/index.ts` (+0, -1)
- `packages/opencode/test/account/repo.test.ts` (+20, -20)
- `packages/opencode/test/account/service.test.ts` (+9, -13)
- `packages/opencode/test/cli/account.test.ts` (+5, -1)
- `packages/opencode/test/cli/acp/acp-process.test.ts` (+70, -0)
- `packages/opencode/test/cli/cmd/tui/app-exit.test.ts` (+0, -51)
- `packages/opencode/test/cli/cmd/tui/notifications.test.ts` (+2, -8)
- `packages/opencode/test/cli/help/__snapshots__/help-snapshots.test.ts.snap` (+629, -0)
- `packages/opencode/test/cli/help/help-snapshots.test.ts` (+147, -0)
- `packages/opencode/test/cli/run/entry.body.test.ts` (+67, -0)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+237, -1)
- `packages/opencode/test/cli/run/run-process.test.ts` (+84, -0)
- `packages/opencode/test/cli/run/runtime.queue.test.ts` (+60, -2)
- `packages/opencode/test/cli/run/scrollback.surface.test.ts` (+83, -0)
- `packages/opencode/test/cli/run/session-data.test.ts` (+184, -0)
- `packages/opencode/test/cli/run/session-replay.test.ts` (+159, -0)
- `packages/opencode/test/cli/run/stream.transport.test.ts` (+489, -8)
- `packages/opencode/test/cli/run/subagent-data.test.ts` (+1, -1)
- `packages/opencode/test/cli/serve/serve-process.test.ts` (+61, -0)
- `packages/opencode/test/cli/smokes/read-only.test.ts` (+115, -0)
- `packages/opencode/test/cli/tui/dialog-prompt.test.tsx` (+146, -0)
- `packages/opencode/test/cli/tui/diff-viewer-file-tree-utils.test.ts` (+323, -0)
- `packages/opencode/test/cli/tui/diff-viewer-file-tree.test.tsx` (+197, -0)
- `packages/opencode/test/cli/tui/diff-viewer.test.tsx` (+111, -0)
- `packages/opencode/test/cli/tui/editor-context-zed.test.ts` (+30, -2)
- `packages/opencode/test/cli/tui/keymap.test.tsx` (+54, -0)
- `packages/opencode/test/cli/tui/plugin-lifecycle.test.ts` (+2, -2)
- `packages/opencode/test/cli/tui/plugin-loader.test.ts` (+169, -0)
- `packages/opencode/test/cli/tui/plugin-toggle.test.ts` (+64, -0)
- `packages/opencode/test/cli/tui/slot-replace.test.tsx` (+6, -3)
- `packages/opencode/test/config/agent-color.test.ts` (+3, -3)
- `packages/opencode/test/config/config.test.ts` (+1367, -1794)
- `packages/opencode/test/config/entry-name.test.ts` (+57, -0)
- `packages/opencode/test/config/tui.test.ts` (+3, -1)
- `packages/opencode/test/control-plane/workspace.test.ts` (+524, -492)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+11, -0)
- `packages/opencode/test/file/fsmonitor.test.ts` (+2, -2)
- `packages/opencode/test/file/path-traversal.test.ts` (+2, -2)
- `packages/opencode/test/file/ripgrep.test.ts` (+6, -6)
- `packages/opencode/test/file/watcher.test.ts` (+47, -19)
- `packages/opencode/test/fixture/fixture.ts` (+14, -4)
- `packages/opencode/test/fixture/plugin.ts` (+10, -0)
- `packages/opencode/test/fixture/tui-plugin.ts` (+5, -0)
- `packages/opencode/test/fixtures/recordings/kilocode/session/native-anthropic-tool-loop.json` (+53, -0)
- `packages/opencode/test/fixtures/recordings/kilocode/session/native-openai-oauth-tool-loop.json` (+50, -0)
- `packages/opencode/test/fixtures/recordings/kilocode/session/native-zen-tool-loop.json` (+54, -0)
- `packages/opencode/test/fixtures/recordings/session/native-anthropic-tool-loop.json` (+49, -0)
- `packages/opencode/test/fixtures/recordings/session/native-openai-oauth-tool-loop.json` (+45, -0)
- `packages/opencode/test/fixtures/recordings/session/native-zen-tool-loop.json` (+49, -0)
- `packages/opencode/test/format/format.test.ts` (+3, -3)
- `packages/opencode/test/installation/installation.test.ts` (+59, -15)
- `packages/opencode/test/kilocode/compaction-payload-recovery.test.ts` (+20, -49)
- `packages/opencode/test/kilocode/config-gitignore.test.ts` (+6, -0)
- `packages/opencode/test/kilocode/config/config.test.ts` (+5, -0)
- `packages/opencode/test/kilocode/config/indexing-default-plugin.test.ts` (+5, -0)
- `packages/opencode/test/kilocode/free-model-disclosure.test.ts` (+7, -0)
- `packages/opencode/test/kilocode/help.test.ts` (+3, -2)
- `packages/opencode/test/kilocode/kilo-loader-auth.test.ts` (+17, -2)
- `packages/opencode/test/kilocode/project-config-update.test.ts` (+6, -0)
- `packages/opencode/test/kilocode/provider-cost.test.ts` (+67, -44)
- `packages/opencode/test/kilocode/provider-list-failed-state.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/provider/models-snapshot.test.ts` (+26, -90)
- `packages/opencode/test/kilocode/server/listener-runtime.test.ts` (+67, -0)
- `packages/opencode/test/kilocode/session-compaction-cap.test.ts` (+3, -0)
- `packages/opencode/test/kilocode/session-compaction-chunks.test.ts` (+11, -100)
- `packages/opencode/test/kilocode/session-processor-empty-tool-calls.test.ts` (+29, -68)
- `packages/opencode/test/kilocode/session-processor-network-offline.test.ts` (+6, -11)
- `packages/opencode/test/kilocode/session-processor-retry-limit.test.ts` (+3, -2)
- `packages/opencode/test/kilocode/session-prompt-compaction-safety.test.ts` (+3, -0)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+3, -0)
- `packages/opencode/test/kilocode/session/llm.test.ts` (+7, -10)
- `packages/opencode/test/kilocode/session/platform-attribution.test.ts` (+68, -79)
- `packages/opencode/test/kilocode/session/session.test.ts` (+0, -122)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+1, -2)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+1, -3)
- `packages/opencode/test/lib/cli-process.ts` (+459, -0)
- `packages/opencode/test/lib/effect.ts` (+32, -4)
- `packages/opencode/test/lib/snapshot.ts` (+73, -0)
- `packages/opencode/test/lib/test-provider.ts` (+37, -0)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+13, -7)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+3, -3)
- `packages/opencode/test/mcp/oauth-provider.test.ts` (+61, -0)
- `packages/opencode/test/permission-task.test.ts` (+1, -1)
- `packages/opencode/test/plugin/auth-override.test.ts` (+4, -7)
- `packages/opencode/test/plugin/codex.test.ts` (+106, -0)
- `packages/opencode/test/plugin/install-concurrency.test.ts` (+3, -3)
- `packages/opencode/test/plugin/loader-shared.test.ts` (+50, -10)
- `packages/opencode/test/plugin/trigger.test.ts` (+7, -12)
- `packages/opencode/test/plugin/workspace-adapter.test.ts` (+6, -11)
- `packages/opencode/test/plugin/xai.test.ts` (+4, -5)
- `packages/opencode/test/project/project.test.ts` (+3, -5)
- `packages/opencode/test/provider/amazon-bedrock.test.ts` (+193, -378)
- `packages/opencode/test/provider/model-status.test.ts` (+1, -1)
- `packages/opencode/test/provider/provider.test.ts` (+1329, -2365)
- `packages/opencode/test/pty/pty-session.test.ts` (+50, -2)
- `packages/opencode/test/question/question.test.ts` (+21, -16)
- `packages/opencode/test/reference/reference.test.ts` (+74, -7)
- `packages/opencode/test/server/global-session-list.test.ts` (+4, -5)
- `packages/opencode/test/server/httpapi-authorization.test.ts` (+37, -1)
- `packages/opencode/test/server/httpapi-config.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-error-middleware.test.ts` (+18, -15)
- `packages/opencode/test/server/httpapi-event-diagnostics.test.ts` (+279, -0)
- `packages/opencode/test/server/httpapi-event.test.ts` (+180, -198)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+29, -69)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-instance.test.ts` (+79, -0)
- `packages/opencode/test/server/httpapi-listen.test.ts` (+25, -45)
- `packages/opencode/test/server/httpapi-mcp.test.ts` (+32, -0)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+20, -0)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+82, -0)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+219, -0)
- `packages/opencode/test/server/httpapi-schema-error-body.test.ts` (+18, -0)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+73, -40)
- `packages/opencode/test/server/httpapi-session.test.ts` (+243, -20)
- `packages/opencode/test/server/httpapi-sync.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-workspace-routing.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-workspace.test.ts` (+25, -5)
- `packages/opencode/test/server/project-init-git.test.ts` (+1, -1)
- `packages/opencode/test/server/session-actions.test.ts` (+2, -3)
- `packages/opencode/test/server/session-diff-missing-patch.test.ts` (+1, -4)
- `packages/opencode/test/server/session-list.test.ts` (+6, -7)
- `packages/opencode/test/server/session-messages.test.ts` (+2, -3)
- `packages/opencode/test/server/session-select.test.ts` (+1, -1)
- `packages/opencode/test/session/compaction.test.ts` (+179, -289)
- `packages/opencode/test/session/llm-native-recorded.test.ts` (+426, -0)
- `packages/opencode/test/session/llm-native.test.ts` (+659, -0)
- `packages/opencode/test/session/llm.test.ts` (+1276, -694)
- `packages/opencode/test/session/processor-effect.test.ts` (+79, -12)
- `packages/opencode/test/session/prompt.test.ts` (+1845, -1701)
- `packages/opencode/test/session/session.test.ts` (+187, -0)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+2, -0)
- `packages/opencode/test/session/system.test.ts` (+5, -0)
- `packages/opencode/test/share/share-next.test.ts` (+7, -9)
- `packages/opencode/test/skill/skill.test.ts` (+31, -0)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+7, -6)
- `packages/opencode/test/sync/index.test.ts` (+40, -2)
- `packages/opencode/test/util/repository.test.ts` (+93, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+4, -4)
- `packages/plugin/src/tool.ts` (+1, -2)
- `packages/plugin/src/tui.ts` (+7, -5)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/script/build.ts` (+18, -0)
- `packages/sdk/js/src/v2/gen/client/types.gen.ts` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+212, -83)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1337, -244)
- `packages/sdk/openapi.json` (+2709, -307)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+4, -2)
- `packages/ui/script/colors.txt` (+55, -0)
- `packages/ui/src/components/basic-tool.tsx` (+69, -17)
- `packages/ui/src/components/logo.tsx` (+1, -1)
- `packages/ui/src/components/markdown.tsx` (+3, -2)
- `packages/ui/src/components/message-nav.css` (+12, -8)
- `packages/ui/src/components/message-nav.tsx` (+30, -20)
- `packages/ui/src/components/message-part-text.ts` (+3, -0)
- `packages/ui/src/components/message-part.css` (+1, -1)
- `packages/ui/src/components/message-part.test.ts` (+28, -0)
- `packages/ui/src/components/message-part.tsx` (+68, -30)
- `packages/ui/src/context/data.tsx` (+10, -2)
- `packages/ui/src/context/dialog.tsx` (+2, -1)
- `packages/ui/src/i18n/ar.ts` (+9, -0)
- `packages/ui/src/i18n/br.ts` (+9, -0)
- `packages/ui/src/i18n/bs.ts` (+9, -0)
- `packages/ui/src/i18n/da.ts` (+9, -0)
- `packages/ui/src/i18n/de.ts` (+9, -0)
- `packages/ui/src/i18n/en.ts` (+9, -0)
- `packages/ui/src/i18n/es.ts` (+9, -0)
- `packages/ui/src/i18n/fr.ts` (+9, -0)
- `packages/ui/src/i18n/it.ts` (+9, -0)
- `packages/ui/src/i18n/ja.ts` (+9, -0)
- `packages/ui/src/i18n/ko.ts` (+9, -0)
- `packages/ui/src/i18n/nl.ts` (+11, -0)
- `packages/ui/src/i18n/no.ts` (+9, -0)
- `packages/ui/src/i18n/pl.ts` (+9, -0)
- `packages/ui/src/i18n/ru.ts` (+9, -0)
- `packages/ui/src/i18n/th.ts` (+9, -0)
- `packages/ui/src/i18n/tr.ts` (+9, -0)
- `packages/ui/src/i18n/uk.ts` (+82, -68)
- `packages/ui/src/i18n/zh.ts` (+8, -0)
- `packages/ui/src/i18n/zht.ts` (+8, -0)
- `packages/ui/src/styles/tailwind/colors.css` (+49, -0)
- `packages/ui/src/theme/context.tsx` (+4, -0)
- `packages/ui/src/v2/components/accordion-v2.css` (+141, -0)
- `packages/ui/src/v2/components/accordion-v2.stories.tsx` (+177, -0)
- `packages/ui/src/v2/components/accordion-v2.tsx` (+86, -0)
- `packages/ui/src/v2/components/avatar-v2.css` (+71, -0)
- `packages/ui/src/v2/components/avatar-v2.stories.tsx` (+85, -0)
- `packages/ui/src/v2/components/avatar-v2.tsx` (+59, -0)
- `packages/ui/src/v2/components/badge-v2.css` (+28, -0)
- `packages/ui/src/v2/components/badge-v2.stories.tsx` (+54, -0)
- `packages/ui/src/v2/components/badge-v2.tsx` (+20, -0)
- `packages/ui/src/v2/components/basic-tool-v2.css` (+164, -0)
- `packages/ui/src/v2/components/basic-tool-v2.stories.tsx` (+137, -0)
- `packages/ui/src/v2/components/basic-tool-v2.tsx` (+139, -0)
- `packages/ui/src/v2/components/button-v2.css` (+147, -0)
- `packages/ui/src/v2/components/button-v2.stories.tsx` (+147, -0)
- `packages/ui/src/v2/components/button-v2.tsx` (+35, -0)
- `packages/ui/src/v2/components/checkbox-v2.css` (+181, -0)
- `packages/ui/src/v2/components/checkbox-v2.stories.tsx` (+92, -0)
- `packages/ui/src/v2/components/checkbox-v2.tsx` (+65, -0)
- `packages/ui/src/v2/components/dialog-v2.css` (+150, -0)
- `packages/ui/src/v2/components/dialog-v2.stories.tsx` (+174, -0)
- `packages/ui/src/v2/components/dialog-v2.tsx` (+77, -0)
- `packages/ui/src/v2/components/diff-changes-v2.css` (+25, -0)
- `packages/ui/src/v2/components/diff-changes-v2.stories.tsx` (+60, -0)
- `packages/ui/src/v2/components/diff-changes-v2.tsx` (+28, -0)
- `packages/ui/src/v2/components/field-v2.css` (+96, -0)
- `packages/ui/src/v2/components/field-v2.stories.tsx` (+135, -0)
- `packages/ui/src/v2/components/field-v2.tsx` (+265, -0)
- `packages/ui/src/v2/components/icon-button-v2.css` (+146, -0)
- `packages/ui/src/v2/components/icon-button-v2.stories.tsx` (+105, -0)
- `packages/ui/src/v2/components/icon-button-v2.tsx` (+37, -0)
- `packages/ui/src/v2/components/icon.tsx` (+97, -0)
- `packages/ui/src/v2/components/inline-input-v2.css` (+219, -0)
- `packages/ui/src/v2/components/inline-input-v2.stories.tsx` (+141, -0)
- `packages/ui/src/v2/components/inline-input-v2.tsx` (+90, -0)
- `packages/ui/src/v2/components/keybind-v2.css` (+73, -0)
- `packages/ui/src/v2/components/keybind-v2.stories.tsx` (+82, -0)
- `packages/ui/src/v2/components/keybind-v2.tsx` (+30, -0)
- `packages/ui/src/v2/components/line-comment-v2.css` (+205, -0)
- `packages/ui/src/v2/components/line-comment-v2.stories.tsx` (+88, -0)
- `packages/ui/src/v2/components/line-comment-v2.tsx` (+155, -0)
- `packages/ui/src/v2/components/menu-v2.css` (+186, -0)
- `packages/ui/src/v2/components/menu-v2.stories.tsx` (+216, -0)
- `packages/ui/src/v2/components/menu-v2.tsx` (+225, -0)
- `packages/ui/src/v2/components/radio-v2.css` (+202, -0)
- `packages/ui/src/v2/components/radio-v2.stories.tsx` (+92, -0)
- `packages/ui/src/v2/components/radio-v2.tsx` (+72, -0)
- `packages/ui/src/v2/components/segmented-control-v2.css` (+81, -0)
- `packages/ui/src/v2/components/segmented-control-v2.stories.tsx` (+107, -0)
- `packages/ui/src/v2/components/segmented-control-v2.tsx` (+208, -0)
- `packages/ui/src/v2/components/select-v2.css` (+196, -0)
- `packages/ui/src/v2/components/select-v2.stories.tsx` (+174, -0)
- `packages/ui/src/v2/components/select-v2.tsx` (+196, -0)
- `packages/ui/src/v2/components/switch-v2.css` (+150, -0)
- `packages/ui/src/v2/components/switch-v2.stories.tsx` (+64, -0)
- `packages/ui/src/v2/components/switch-v2.tsx` (+28, -0)
- `packages/ui/src/v2/components/tabs-v2.css` (+223, -0)
- `packages/ui/src/v2/components/tabs-v2.stories.tsx` (+168, -0)
- `packages/ui/src/v2/components/tabs-v2.tsx` (+147, -0)
- `packages/ui/src/v2/components/text-input-v2.css` (+145, -0)
- `packages/ui/src/v2/components/text-input-v2.stories.tsx` (+141, -0)
- `packages/ui/src/v2/components/text-input-v2.tsx` (+67, -0)
- `packages/ui/src/v2/components/text-shimmer-v2.css` (+125, -0)
- `packages/ui/src/v2/components/text-shimmer-v2.stories.tsx` (+70, -0)
- `packages/ui/src/v2/components/text-shimmer-v2.tsx` (+63, -0)
- `packages/ui/src/v2/components/textarea-v2.css` (+78, -0)
- `packages/ui/src/v2/components/textarea-v2.stories.tsx` (+111, -0)
- `packages/ui/src/v2/components/textarea-v2.tsx` (+31, -0)
- `packages/ui/src/v2/components/toast-v2.css` (+201, -0)
- `packages/ui/src/v2/components/toast-v2.stories.tsx` (+151, -0)
- `packages/ui/src/v2/components/toast-v2.tsx` (+144, -0)
- `packages/ui/src/v2/components/tool-error-card-v2.css` (+201, -0)
- `packages/ui/src/v2/components/tool-error-card-v2.stories.tsx` (+91, -0)
- `packages/ui/src/v2/components/tool-error-card-v2.tsx` (+166, -0)
- `packages/ui/src/v2/components/tooltip-v2.css` (+54, -0)
- `packages/ui/src/v2/components/tooltip-v2.stories.tsx` (+91, -0)
- `packages/ui/src/v2/components/tooltip-v2.tsx` (+146, -0)
- `packages/ui/src/v2/components/wordmark-v2.tsx` (+92, -0)
- `packages/ui/src/v2/styles/colors.css` (+171, -0)
- `packages/ui/src/v2/styles/tailwind.css` (+2, -0)
- `packages/ui/src/v2/styles/theme.css` (+374, -0)
- `perf/test-suite.md` (+145, -0)
- `screenshot-uk.png` (+-, --)
- `script/check-opencode-promise-facades.ts` (+2, -7)
- `script/extract-source-links.ts` (+2, -1)
- `script/upgrade-opentui.ts` (+123, -14)
- `script/upstream/package.json` (+1, -1)
- `specs/storage/effect-sqlite-package.md` (+145, -0)
- `specs/v2/instructions.md` (+121, -0)
- `specs/v2/provider-model.md` (+48, -8)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 8b3273507..6a9be3c50 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.46",
+  "version": "7.3.49",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -67,7 +67,7 @@
     "@aws-sdk/credential-providers": "3.993.0",
     "@openrouter/ai-sdk-provider": "2.9.0",
     "ai-gateway-provider": "3.1.2",
-    "gitlab-ai-provider": "6.6.0",
+    "gitlab-ai-provider": "6.7.0",
     "google-auth-library": "10.5.0",
     "immer": "11.1.4",
     "venice-ai-sdk-provider": "2.0.1"
```

#### packages/core/src/account.ts
```diff
diff --git a/packages/core/src/account.ts b/packages/core/src/account.ts
new file mode 100644
index 000000000..2d7290864
--- /dev/null
+++ b/packages/core/src/account.ts
@@ -0,0 +1,331 @@
+import path from "path"
+import { Effect, Layer, Option, Schema, Context, SynchronizedRef } from "effect"
+import { Identifier } from "./util/identifier"
+import { NonNegativeInt, withStatics } from "./schema"
+import { Global } from "./global"
+import { AppFileSystem } from "./filesystem"
+import { EventV2 } from "./event"
+
+export const ID = Schema.String.pipe(
+  Schema.brand("AccountV2.ID"),
+  withStatics((schema) => ({ create: () => schema.make("acc_" + Identifier.ascending()) })),
+)
+export type ID = typeof ID.Type
+
+export const ServiceID = Schema.String.pipe(Schema.brand("ServiceID"))
+export type ServiceID = typeof ServiceID.Type
+
+export class OAuthCredential extends Schema.Class<OAuthCredential>("AccountV2.OAuthCredential")({
+  type: Schema.Literal("oauth"),
+  refresh: Schema.String,
+  access: Schema.String,
+  expires: NonNegativeInt,
+  accountId: Schema.optional(Schema.String), // kilocode_change - preserve Kilo organization during v1 migration
+}) {}
+
+export class ApiKeyCredential extends Schema.Class<ApiKeyCredential>("AccountV2.ApiKeyCredential")({
+  type: Schema.Literal("api"),
+  key: Schema.String,
+  metadata: Schema.optional(Schema.Record(Schema.String, Schema.String)),
+}) {}
+
+export const Credential = Schema.Union([OAuthCredential, ApiKeyCredential])
+  .pipe(Schema.toTaggedUnion("type"))
+  .annotate({
+    identifier: "AccountV2.Credential",
+  })
+export type Credential = Schema.Schema.Type<typeof Credential>
+
+export class Info extends Schema.Class<Info>("AccountV2.Info")({
+  id: ID,
+  serviceID: ServiceID,
+  description: Schema.String,
+  credential: Credential,
+}) {}
```

#### packages/core/src/agent.ts
```diff
diff --git a/packages/core/src/agent.ts b/packages/core/src/agent.ts
new file mode 100644
index 000000000..7f4456c59
--- /dev/null
+++ b/packages/core/src/agent.ts
@@ -0,0 +1,147 @@
+export * as AgentV2 from "./agent"
+
+import { Context, Effect, HashMap, Layer, Option, Order, pipe, Schema, Array } from "effect"
+import { produce, type Draft } from "immer"
+import { ModelV2 } from "./model"
+import { PermissionV2 } from "./permission"
+import { PluginV2 } from "./plugin"
+import { ProviderV2 } from "./provider"
+
+export const ID = Schema.String.pipe(Schema.brand("AgentV2.ID"))
+export type ID = typeof ID.Type
+
+export const Mode = Schema.Literals(["subagent", "primary", "all"]).annotate({ identifier: "AgentV2.Mode" })
+export type Mode = typeof Mode.Type
+
+export const Info = Schema.Struct({
+  name: ID,
+  description: Schema.optional(Schema.String),
+  mode: Mode,
+  hidden: Schema.Boolean.pipe(Schema.optional),
+  color: Schema.String.pipe(Schema.optional),
+  permission: PermissionV2.Ruleset,
+  model: ModelV2.Ref.pipe(Schema.optional),
+  system: Schema.String.pipe(Schema.optional),
+  options: ProviderV2.Options.pipe(Schema.optional),
+  steps: Schema.Int.pipe(Schema.optional),
+}).annotate({ identifier: "AgentV2.Info" })
+export type Info = typeof Info.Type
+
+export class NotFoundError extends Schema.TaggedErrorClass<NotFoundError>()("AgentV2.NotFound", {
+  agent: ID,
+}) {}
+
+export class InvalidDefaultError extends Schema.TaggedErrorClass<InvalidDefaultError>()("AgentV2.InvalidDefault", {
+  agent: ID,
+  reason: Schema.Literals(["missing", "subagent", "hidden"]),
+}) {}
+
+export class NoDefaultError extends Schema.TaggedErrorClass<NoDefaultError>()("AgentV2.NoDefault", {}) {}
+
+export interface Interface {
+  readonly get: (agent: ID) => Effect.Effect<Info, NotFoundError>
+  readonly list: () => Effect.Effect<Info[]>
+  readonly update: (agent: ID, fn: (agent: Draft<Info>) => void) => Effect.Effect<void>
```

#### packages/core/src/auth.ts
```diff
diff --git a/packages/core/src/auth.ts b/packages/core/src/auth.ts
deleted file mode 100644
index 971b23203..000000000
--- a/packages/core/src/auth.ts
+++ /dev/null
@@ -1,265 +0,0 @@
-import path from "path"
-import { Effect, Layer, Option, Schema, Context, SynchronizedRef } from "effect"
-import { Identifier } from "./util/identifier"
-import { NonNegativeInt, withStatics } from "./schema"
-import { Global } from "./global"
-import { AppFileSystem } from "./filesystem"
-
-export const OAUTH_DUMMY_KEY = "opencode-oauth-dummy-key"
-
-const AccountID = Schema.String.pipe(
-  Schema.brand("AccountID"),
-  withStatics((schema) => ({ create: () => schema.make("acc_" + Identifier.ascending()) })),
-)
-export type AccountID = typeof AccountID.Type
-
-export const ServiceID = Schema.String.pipe(Schema.brand("ServiceID"))
-export type ServiceID = typeof ServiceID.Type
-
-export class OAuthCredential extends Schema.Class<OAuthCredential>("AuthV2.OAuthCredential")({
-  type: Schema.Literal("oauth"),
-  refresh: Schema.String,
-  access: Schema.String,
-  expires: NonNegativeInt,
-  accountId: Schema.optional(Schema.String), // kilocode_change - preserve Kilo organization during v1 migration
-}) {}
-
-export class ApiKeyCredential extends Schema.Class<ApiKeyCredential>("AuthV2.ApiKeyCredential")({
-  type: Schema.Literal("api"),
-  key: Schema.String,
-  metadata: Schema.optional(Schema.Record(Schema.String, Schema.String)),
-}) {}
-
-export const Credential = Schema.Union([OAuthCredential, ApiKeyCredential])
-  .pipe(Schema.toTaggedUnion("type"))
-  .annotate({
-    identifier: "AuthV2.Credential",
-  })
-export type Credential = Schema.Schema.Type<typeof Credential>
-
-export class Account extends Schema.Class<Account>("AuthV2.Account")({
-  id: AccountID,
-  serviceID: ServiceID,
-  description: Schema.String,
-  credential: Credential,
```

#### packages/core/src/catalog.ts
```diff
diff --git a/packages/core/src/catalog.ts b/packages/core/src/catalog.ts
index d27f17bfb..2bbd7bc49 100644
--- a/packages/core/src/catalog.ts
+++ b/packages/core/src/catalog.ts
@@ -1,6 +1,6 @@
 export * as Catalog from "./catalog"
 
-import { Context, Effect, HashMap, Layer, Option, Order, pipe, Schema, Array } from "effect"
+import { Context, Effect, HashMap, Layer, Option, Order, pipe, Schema, Array, Scope, Stream } from "effect"
 import { produce, type Draft } from "immer"
 import { ModelV2 } from "./model"
 import { PluginV2 } from "./plugin"
@@ -8,9 +8,9 @@ import { ProviderV2 } from "./provider"
 import { Location } from "./location"
 import { EventV2 } from "./event"
 
-type ProviderRecord = {
+export type ProviderRecord = {
   provider: ProviderV2.Info
-  models: HashMap.HashMap<ModelV2.ID, ModelV2.Info>
+  models: Map<ModelV2.ID, ModelV2.Info>
 }
 
 export class ProviderNotFoundError extends Schema.TaggedErrorClass<ProviderNotFoundError>()(
@@ -34,10 +34,26 @@ export const Event = {
   }),
 }
 
+export type Context = {
+  data: readonly ProviderRecord[]
+  updateProvider: (providerID: ProviderV2.ID, fn: (provider: Draft<ProviderV2.Info>) => void) => void
+  updateModel: (providerID: ProviderV2.ID, modelID: ModelV2.ID, fn: (model: Draft<ModelV2.Info>) => void) => void
+  provider: {
+    update: (providerID: ProviderV2.ID, fn: (provider: Draft<ProviderV2.Info>) => void) => void
+    remove: (providerID: ProviderV2.ID) => void
+  }
+  model: {
+    update: (providerID: ProviderV2.ID, modelID: ModelV2.ID, fn: (model: Draft<ModelV2.Info>) => void) => void
+    remove: (providerID: ProviderV2.ID, modelID: ModelV2.ID) => void
+  }
+}
+
+export type Loader = (update: (ctx: Context) => void) => Effect.Effect<void>
+
 export interface Interface {
+  readonly loader: () => Effect.Effect<Loader, never, Scope.Scope>
   readonly provider: {
     readonly get: (providerID: ProviderV2.ID) => Effect.Effect<ProviderV2.Info, ProviderNotFoundError>
-    readonly update: (providerID: ProviderV2.ID, fn: (provider: Draft<ProviderV2.Info>) => void) => Effect.Effect<void>
     readonly all: () => Effect.Effect<ProviderV2.Info[]>
```


*... and more files (showing first 5)*

## opencode Changes (ec50db3..355a0bc)

### Commits

- 355a0bc - chore: generate (opencode-agent[bot], 2026-06-18)
- 2892e97 - fix(tui): gate background shortcut by capability (#32837) (Aiden Cline, 2026-06-18)
- 62c746f - zen: budget (Frank, 2026-06-18)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
(no changes)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `packages/console/app/src/routes/zen/util/handler.ts` (+0, -3)
- `packages/console/app/src/routes/zen/util/providerBudgetTracker.ts` (+9, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+15, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+5, -0)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+4, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+43, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+34, -0)
- `packages/sdk/openapi.json` (+64, -0)
- `packages/tui/src/context/sync.tsx` (+19, -4)
- `packages/tui/src/routes/session/index.tsx` (+21, -16)
- `packages/tui/test/fixture/tui-sdk.ts` (+1, -0)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/account.ts
- `src/core/` - review core changes from packages/core/src/agent.ts
- `src/core/` - review core changes from packages/core/src/auth.ts
- `src/core/` - review core changes from packages/core/src/catalog.ts
- `src/core/` - review core changes from packages/core/src/event.ts
- `src/core/` - review core changes from packages/core/src/flag/flag.ts
- `src/core/` - review core changes from packages/core/src/location-layer.ts
- `src/core/` - review core changes from packages/core/src/models-snapshot.d.ts
- `src/core/` - review core changes from packages/core/src/models-snapshot.js
- `src/core/` - review core changes from packages/core/src/permission.ts
- `src/core/` - review core changes from packages/core/src/plugin.ts
- `src/core/` - review core changes from packages/core/src/plugin/account.ts
- `src/core/` - review core changes from packages/core/src/plugin/auth.ts
- `src/core/` - review core changes from packages/core/src/plugin/boot.ts
- `src/core/` - review core changes from packages/core/src/plugin/env.ts
- `src/core/` - review core changes from packages/core/src/plugin/models-dev.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/amazon-bedrock.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/anthropic.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/azure.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cerebras.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cloudflare-workers-ai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/github-copilot.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/google-vertex.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/kilo.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/llmgateway.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/nvidia.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/opencode.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openrouter.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/vercel.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/zenmux.ts
- `src/core/` - review core changes from packages/core/src/provider.ts
- `src/core/` - review core changes from packages/core/src/util/error.ts
- `src/core/` - review core changes from packages/core/src/util/wildcard.ts
- `src/core/` - review core changes from packages/core/src/{models.ts => models-dev.ts}
- `src/core/` - review core changes from packages/core/test/account.test.ts
- `src/core/` - review core changes from packages/core/test/catalog.test.ts
- `src/core/` - review core changes from packages/core/test/effect/cross-spawn-spawner.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/account-auth-v2-migration.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/provider-isolation.test.ts
- `src/core/` - review core changes from packages/core/test/models.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-amazon-bedrock.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-anthropic.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-azure-cognitive-services.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-azure.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cerebras.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-github-copilot.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-gitlab.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-google-vertex-anthropic.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-google-vertex.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-helper.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-kilo.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-llmgateway.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-nvidia.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-openai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-opencode.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-openrouter.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-vercel.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-zenmux.test.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/rule.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/evaluate.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/next.always-rules.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/next.reply-http.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/next.reply-routing.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/permission/next.test.ts
- `src/tool/glob.test.ts` - update based on kilocode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/grep.test.ts` - update based on kilocode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/read.test.ts` - update based on kilocode packages/opencode/test/tool/read.test.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/repo_clone.test.ts` - update based on kilocode packages/opencode/test/tool/repo_clone.test.ts changes
- `src/tool/repo_clone.ts` - update based on kilocode packages/opencode/src/tool/repo_clone.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/skill.test.ts` - update based on kilocode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.ts` - update based on kilocode packages/opencode/src/tool/skill.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/tool-define.test.ts` - update based on kilocode packages/opencode/test/tool/tool-define.test.ts changes
- `src/tool/tool.ts` - update based on kilocode packages/opencode/src/tool/tool.ts changes
- `src/tool/warpgrep.ts` - update based on kilocode packages/opencode/src/tool/warpgrep.ts changes
- `src/tool/write.test.ts` - update based on kilocode packages/opencode/test/tool/write.test.ts changes

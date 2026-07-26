# Upstream Changes Report
Generated: 2026-07-26 08:26:38

## Summary
- kilocode: 1 commits, 6 files changed
- opencode: 2 commits, 34 files changed

## kilocode Changes (eab61d853..a19d44c3e)

### Commits

- a19d44c3e - Advertise the instance from enableRemote and report attention status on the heartbeat (#12532) (Igor Šćekić, 2026-07-25)

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
- `packages/opencode/src/cli/cmd/remote.ts` (+5, -23)
- `packages/opencode/src/kilo-sessions/instance-advertisement.ts` (+21, -0)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+53, -6)
- `packages/opencode/test/kilocode/cli/cmd/remote.test.ts` (+2, -1)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+385, -23)
- `script/check-opencode-promise-facades.ts` (+7, -2)

### Key Diffs

(no key diffs to show)

## opencode Changes (2b2b69d..7534d23)

### Commits

- 7534d23 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-25)
- 0a6637e - chore(app): vendor v2 client snapshot (#38818) (Brendan Allan, 2026-07-25)

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
- `bun.lock` (+4, -4)
- `nix/hashes.json` (+4, -4)
- `packages/app/e2e/regression/review-state-persistence.spec.ts` (+7, -9)
- `packages/app/e2e/regression/review-terminal-stacked.spec.ts` (+22, -24)
- `packages/app/e2e/regression/terminal-tab-switch.spec.ts` (+1, -1)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/components/dialog-select-directory-v2.tsx` (+8, -1)
- `packages/app/src/components/dialog-select-directory.tsx` (+7, -2)
- `packages/app/src/components/edit-project.ts` (+17, -6)
- `packages/app/src/components/prompt-input.tsx` (+1, -1)
- `packages/app/src/components/settings-general.tsx` (+2, -1)
- `packages/app/src/components/settings-v2/general.tsx` (+2, -1)
- `packages/app/src/components/terminal.tsx` (+8, -14)
- `packages/app/src/context/directory-sync.ts` (+2, -1)
- `packages/app/src/context/global-sync/bootstrap.test.ts` (+5, -3)
- `packages/app/src/context/global-sync/bootstrap.ts` (+26, -21)
- `packages/app/src/context/global-sync/event-reducer.ts` (+13, -13)
- `packages/app/src/context/layout.tsx` (+16, -10)
- `packages/app/src/context/server-session-v2-reducer.test.ts` (+1, -1)
- `packages/app/src/context/server-session-v2-reducer.ts` (+14, -7)
- `packages/app/src/context/server-session.test.ts` (+4, -1)
- `packages/app/src/context/server-session.ts` (+8, -5)
- `packages/app/src/context/server-sync.test.ts` (+3, -1)
- `packages/app/src/context/server-sync.tsx` (+3, -2)
- `packages/app/src/pages/home/home-sessions-controller.tsx` (+7, -1)
- `packages/app/src/pages/layout.tsx` (+27, -11)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+2, -1)
- `packages/app/src/utils/server-compat.test.ts` (+15, -9)
- `packages/app/src/utils/server-compat.ts` (+33, -33)
- `packages/app/src/utils/session-message.test.ts` (+2, -2)
- `packages/app/src/utils/session-message.ts` (+6, -3)
- `packages/app/vendor/opencode-ai-client-1.17.13-v2.tgz` (+-, --)
- `packages/app/vendor/opencode-ai-client-1.17.13.tgz` (+-, --)
- `packages/session-ui/package.json` (+1, -1)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually

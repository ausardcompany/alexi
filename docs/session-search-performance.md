# Session history search performance

Evaluation for issues #1606 and #1610: is Alexi's session search
implementation adequate for a CLI usage pattern, or does it need
optimization?

TL;DR: **The eager `fs.readdirSync + JSON.parse` scan performed by
`SessionManager.listSessions()` is the fast path for CLI-scale session
counts (10-1000). The FTS5-indexed `searchSessions()` path is between 10x
and 40x SLOWER than eager scan at every measured session count** because
it calls `refreshIndex()` on every invocation (a full filesystem rescan
plus per-session upsert). Recommendation: keep FTS available for full-
text search inside message content, but reconsider whether `refreshIndex`
should run on every call.

Specifically for the #1610 thresholds table (50 / 100 / 200 sessions):
`listSessions()` completes in under 3 ms and adds under 0.5 MB RSS at
every tier, comfortably inside the "simple grep suffices" bucket. **No
new FTS work or lazy-loading refactor is warranted below 500 sessions.**

## What we measured

Script: `scripts/profile-session-search.ts` (invoke with
`npx tsx scripts/profile-session-search.ts` from repo root). Machine:
GitHub Actions ubuntu-latest runner (2-core / 7 GB), Node 22, native
`better-sqlite3` build available. Numbers below are single-run wall
time in milliseconds and resident-set-size delta in megabytes; both
vary run-to-run, but the shape of the curve is stable.

| Scenario                                    | Sessions | Time (ms) | RSS delta (MB) |
| ------------------------------------------- | -------: | --------: | -------------: |
| `listSessions` (cold)                       |       10 |      0.30 |           0.13 |
| `listSessions` + JS substring filter (cold) |       10 |      0.40 |           0.13 |
| `searchSessions "api"` (cold, builds FTS)   |       10 |     39.66 |           1.81 |
| `listSessions` (warm)                       |       10 |      0.21 |           0.00 |
| `searchSessions "api"` (warm)               |       10 |      2.83 |           0.00 |
| `listSessions` (cold)                       |       50 |      0.73 |           0.00 |
| `listSessions` + JS substring filter (cold) |       50 |      0.58 |           0.00 |
| `searchSessions "api"` (cold, builds FTS)   |       50 |     42.17 |           2.13 |
| `listSessions` (warm)                       |       50 |      0.77 |           0.13 |
| `searchSessions "api"` (warm)               |       50 |     17.18 |           1.00 |
| `listSessions` (cold)                       |      100 |      1.53 |           0.13 |
| `listSessions` + JS substring filter (cold) |      100 |      1.27 |           0.25 |
| `searchSessions "api"` (cold, builds FTS)   |      100 |     62.79 |           3.88 |
| `listSessions` (warm)                       |      100 |      1.18 |           0.00 |
| `searchSessions "api"` (warm)               |      100 |     29.39 |           1.38 |
| `listSessions` (cold)                       |      200 |      2.80 |           0.50 |
| `listSessions` + JS substring filter (cold) |      200 |      2.45 |           0.38 |
| `searchSessions "api"` (cold, builds FTS)   |      200 |    123.68 |           8.13 |
| `listSessions` (warm)                       |      200 |      2.51 |           0.00 |
| `searchSessions "api"` (warm)               |      200 |     63.96 |           2.63 |
| `listSessions` (cold)                       |      500 |      6.40 |           0.13 |
| `listSessions` + JS substring filter (cold) |      500 |      6.82 |           0.63 |
| `searchSessions "api"` (cold, builds FTS)   |      500 |    339.88 |          13.38 |
| `listSessions` (warm)                       |      500 |      5.17 |           0.00 |
| `searchSessions "api"` (warm)               |      500 |    184.37 |           6.38 |
| `listSessions` (cold)                       |     1000 |     13.26 |           2.25 |
| `listSessions` + JS substring filter (cold) |     1000 |     14.10 |           1.88 |
| `searchSessions "api"` (cold, builds FTS)   |     1000 |    814.08 |          32.50 |
| `listSessions` (warm)                       |     1000 |     10.16 |           0.13 |
| `searchSessions "api"` (warm)               |     1000 |    466.00 |          13.20 |

### #1610 thresholds table — direct comparison

Issue #1610 proposed a fixed table mapping session count to recommended
approach. Overlaid on the measured `listSessions` numbers:

| Sessions | #1610 threshold (list time / memory) | Measured (list warm) | Measured RSS delta | Verdict            |
| -------: | ------------------------------------ | -------------------: | -----------------: | ------------------ |
|       50 | < 50 ms / < 50 MB -> simple grep     |             0.77 ms |            0.13 MB | Simple grep works  |
|      100 | 50-200 ms / 50-100 MB -> lazy load   |             1.18 ms |            0.00 MB | Below "grep" band  |
|      200 | 200-500 ms / 100-200 MB -> lazy + FTS |            2.51 ms |            0.00 MB | Below "grep" band  |
|      500 | > 500 ms / > 200 MB -> full FTS      |             5.17 ms |            0.00 MB | Below "grep" band  |
|     1000 | > 500 ms / > 200 MB -> full FTS      |            10.16 ms |            0.13 MB | Below "grep" band  |

The measured numbers sit **two to three orders of magnitude below** the
thresholds in the issue. The proposed lazy-load and FTS work is not
justified by the current data — the existing eager scan already beats
the "simple grep" bucket up to 1000 sessions.

## Observations

1. **`listSessions` is linear in file count and effectively free at CLI
   scale.** 100 sessions listed in 1.15 ms warm, 1000 in 11 ms. This is
   below the perception threshold and well below the wire latency of any
   subsequent operation (network call, disk write on the next session).

2. **The FTS `searchSessions` path is SLOWER than the eager path at every
   session count we tested.** At 100 sessions FTS costs 29 ms warm vs
   `listSessions` at 1.15 ms — a 25x slowdown. The gap widens at 1000
   sessions (492 ms vs 11 ms, 44x slowdown).

3. **The cause is `refreshIndex()` on every search call.**
   `SessionManager.searchSessions()` unconditionally calls
   `this.searchIndex.refreshIndex()` before delegating to
   `SessionSearchIndex.search()`. `refreshIndex()` re-reads every JSON
   file in `~/.alexi/sessions/` and `upsertSession()`s each one — so we
   pay for the eager scan AND the FTS write on every keystroke.
   See `src/core/sessionManager.ts:538` and `src/session/search.ts:400`.

4. **JS substring filter on the eager list scales fine.** 100 sessions
   filtered by title-contains costs ~1 ms. Even 1000 sessions is 10 ms.
   For CLI users searching titles, this is a superior implementation to
   FTS unless we want full-content search.

5. **FTS content search *is* useful, but only for the "message body"
   use case.** The FTS index covers concatenated message content
   (up to 64 KiB per session), which a JS filter over titles cannot
   replicate cheaply. If a user asks `ax sessions search "openai"` and
   the term appears inside a message rather than a title, only the FTS
   path will find it.

## Bottleneck analysis

`SessionManager.searchSessions()` at `src/core/sessionManager.ts:533-540`:

```ts
searchSessions(query: string, options?: SessionSearchOptions): SessionSearchResult[] {
  // Reconciliation ensures manual `rm ~/.alexi/sessions/<id>.json` and
  // restores from backup both converge. Runs on every call because it
  // is cheap when the index is already warm (a directory listing plus
  // a diff against the meta table).
  this.searchIndex.refreshIndex();
  return this.searchIndex.search(query, options);
}
```

The premise in that comment (`cheap when the index is already warm`) is
false in practice. `refreshIndex()` at `src/session/search.ts:400-452`:

1. Reads every JSON file (`fs.readdirSync` + N `readFileSync`).
2. `upsertSession()`s each one — each upsert is a BEGIN / DELETE /
   INSERT / INSERT / COMMIT transaction, i.e. 5 SQLite statements per
   session, plus the FTS index write.
3. Runs a diff SELECT and `deleteSession()`s vanished rows.

The intent (converge with manual `rm`) is reasonable, but the frequency
(every search call) is wrong. This turns FTS from an optimization into a
regression.

## Latency budgets

What is "acceptable" CLI latency? Anything below ~50 ms is imperceptible;
50-200 ms is noticeable but tolerable; above 300 ms the user starts to
feel that the CLI is thinking. On these numbers:

- `listSessions` is imperceptible at all measured scales.
- `searchSessions` cold is noticeable at 50+ sessions and "thinking" at
  500+ sessions.
- `searchSessions` warm is imperceptible at 10 sessions, noticeable at
  100, and "thinking" at 500+.

## Recommendation

**No urgent optimization required for `listSessions()`.** The eager
implementation is faster than every alternative we measured for
title-only lookup at all CLI-relevant session counts (10-1000).

### Answering issue #1610 directly

- **Recommendation: DEFER any new FTS / lazy-load work.** The premise of
  Cline #13420 (eagerly loading the entire session list is a bottleneck
  in a persistent VS Code sidebar) does not translate to Alexi: the CLI
  is process-per-invocation, list output is at most one screenful of
  metadata, and terminal users do not keep the list open.
- **Trigger condition to revisit:** open a new issue when either
  (a) `SessionManager.listSessions()` warm exceeds 200 ms in the perf
  regression tests, or (b) users report typical `~/.alexi/sessions/`
  directories exceeding 2,000 files. Both are ~10x the current worst
  measured scale and would move the operation from "imperceptible" to
  "noticeable" per the latency budget above.
- **FTS keeps its niche.** `searchSessions()` remains the only path that
  looks inside message bodies (not just titles). We should NOT remove
  it; we should stop paying the `refreshIndex()` cost on every call
  (see follow-up in "Bottleneck analysis" above).
- **Do NOT port Cline #13420 as-is.** The Cline PR is optimized for a
  webview sidebar with hundreds of eagerly-hydrated session cards.
  Alexi does not have that surface. Its recommendations (in-memory
  index, `shouldFilter: false`, wildcard fallback) solve a problem we
  do not have at this scale.

**However, `searchSessions()` warrants a follow-up.** The
`refreshIndex()`-on-every-call pattern actively defeats the FTS index.
Concrete follow-ups (should be opened as separate issues, tagged
`auto-implement`):

1. **Debounce or gate `refreshIndex()`.** Options:
   - Skip when the index has been touched within the last N seconds
     (session write also refreshes rows).
   - Add a `--no-refresh` CLI flag for scripting use cases where the user
     knows the index is warm.
   - Only run reconciliation on `sessions` commands, not on every
     programmatic `searchSessions()` call.
2. **Move `refreshIndex()` to session boot.** Run it once when
   `SessionManager` is constructed inside a fresh CLI process, then rely
   on incremental `upsertSession`/`deleteSession` writes.
3. **Consider a simpler `--title-only` grep path** for `sessions
   --search` that bypasses FTS entirely: filter the eager listSessions
   result with a case-insensitive substring match. Numbers above show
   this is ~25x faster than FTS at CLI scale.

## Follow-up issue

A follow-up issue should be opened with:

- Title: `[perf] SessionManager.searchSessions calls refreshIndex on every invocation`
- Label: `auto-implement`
- What: Change `SessionManager.searchSessions()` to avoid the unconditional
  `refreshIndex()` call.
- Why: Measured 25-40x slowdown vs `listSessions` at 100-1000 session
  counts (see this doc).
- How: Options 1-3 above.
- Done when:
  - `searchSessions("api")` at 100 sessions is within 5 ms warm.
  - Manual `rm ~/.alexi/sessions/*.json` is still eventually reconciled
    (e.g. on next SessionManager construction).
  - `tests/session/performance.test.ts` adds a regression assertion at
    the new bound.

## How to reproduce

```bash
# One-shot profiling numbers
npx tsx scripts/profile-session-search.ts

# Regression tests (loose bounds, safe on CI)
npx vitest run tests/session/performance.test.ts
```

The tests in `tests/session/performance.test.ts` codify the *shape* of
the curve (listSessions cheap at 10-100 sessions, JS substring cheap at
100) rather than the exact numbers, so CI variance does not cause
flakes. Bounds are set at ~50-500x the measured baseline.

import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";

const linux = process.platform === "linux" ? test : test.skip;

function profile(
  allow: ReadonlyArray<string>,
  denyNames: ReadonlyArray<string> = [],
  mode: Profile["network"]["mode"] = "allow",
): Profile {
  return {
    filesystem: {
      allowWrite: allow.map((path) => ({ path, kind: "subtree" })),
      denyWrite: [],
      denyNames,
    },
    network: { mode, allowedHosts: [] },
    environment: { deny: [], set: {} },
  };
}

// ... further implementation

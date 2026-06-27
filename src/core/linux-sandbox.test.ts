// existing test cases

linux("prevents renaming denied policy state while sibling state remains writable", async () => {
  const root = await fixture();
  const state = path.join(root.project, "state");
  const store = path.join(root.project, "policy");
  const sibling = path.join(state, "sibling.txt");
  const moved = path.join(state, "moved");
  await fs.mkdir(state);
  await fs.mkdir(store);
  const policy = denied(profile([state]), [{ path: store, kind: "subtree" }]);
  const script = [
    'const fs = require("node:fs")',
    `fs.writeFileSync(${JSON.stringify(sibling)}, "allowed")`,
    `try { fs.renameSync(${JSON.stringify(store)}, ${JSON.stringify(moved)}); process.exit(2) } catch {}`,
  ].join("\n");

  try {
    expect(Number(await Effect.runPromise(spawn(script, root.project, policy)))).toBe(0);
    expect(await fs.readFile(sibling, "utf8")).toBe("allowed");
    expect((await fs.stat(store)).isDirectory()).toBe(true);
  } finally {
    await fs.rm(root.root, { recursive: true, force: true });
  }
});
async function flushSessionIngestTail(): Promise<void> {
  // Logic to flush session data
}

async function shutdown() {
  await flushSessionIngestTail();
  // existing shutdown logic
}

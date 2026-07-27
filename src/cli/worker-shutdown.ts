async function flushSessionIngestTail(): Promise<void> {
  // Logic to flush session data
}

export async function shutdown() {
  await flushSessionIngestTail();
  // existing shutdown logic
}

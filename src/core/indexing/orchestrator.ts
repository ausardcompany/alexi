if (mode === "incremental" && result.stats.processed === 0 && batchErrors.length === 0) {
  await this.vectorStore.markIndexingComplete();
}
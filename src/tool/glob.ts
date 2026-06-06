// refined glob logic
function searchFiles(pattern: string): Promise<string[]> {
  return new Promise((resolve) => {
    // Simplified search logic
    resolve(['file1.txt', 'file2.txt']);
  });
}
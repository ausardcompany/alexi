// updated grep logic
function grepFiles(pattern: string, files: string[]): Promise<string[]> {
  return new Promise((resolve) => {
    // Simplified grep logic
    resolve(files.filter(file => file.includes(pattern)));
  });
}
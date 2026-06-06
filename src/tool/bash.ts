// refined bash tool protocol
function executeBashCommand(command: string): Promise<string> {
  // Simplified execution logic
  return new Promise((resolve, reject) => {
    if (command.includes('rm ')) {
      reject('Command not allowed');
    } else {
      resolve(`Executed: ${command}`);
    }
  });
}

export function cancel(sessionID: string) {
  // Updated to handle sessions without active tails
  if (!activeTails.has(sessionID)) {
    return; // Early exit if no active tails
  }
  // Rest of the cancel logic
}

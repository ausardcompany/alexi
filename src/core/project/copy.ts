Effect.forEach(strategies(), (strategy) =>
  strategy
    .list(sourceDirectory)
    .pipe(Effect.catchTag('ProjectCopy.DirectoryUnavailableError', () => Effect.succeed([])))
);

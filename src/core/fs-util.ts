import { fs, Effect } from 'somewhere';

yield *
  fs.makeDirectory(path, { recursive: true }).pipe(
    Effect.catchIf(
      (error) => error.reason._tag === 'AlreadyExists',
      (error) =>
        isDir(path).pipe(Effect.flatMap((exists) => (exists ? Effect.void : Effect.fail(error))))
    )
  );

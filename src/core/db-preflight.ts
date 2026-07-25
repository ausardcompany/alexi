export * as DbPreflight from './db-preflight';

import { accessSync, chmodSync, constants, statSync } from 'fs';
// other imports...

export function assertWritable(filename: string, trusted: string = Global.Path.data) {
  if (!filename || filename === ':memory:' || filename.startsWith('file:')) return;
  // logic for checking writability...
}

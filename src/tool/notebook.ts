import * as path from "path";
import { Readable } from "stream";
import * as Encoding from "../encoding";

export function isFile(filepath: string) {
  return path.extname(filepath).toLowerCase() === ".ipynb";
}

export async function open(filepath: string): Promise<Readable> {
  const raw = (await Encoding.read(filepath)).text;
  // parsing logic
}

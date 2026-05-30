import mammoth from "mammoth";
import * as path from "path";
import { Readable } from "stream";

export function accepts(filepath: string) {
  return path.extname(filepath).toLowerCase() === ".docx";
}

export async function open(filepath: string) {
  const result = await mammoth.extractRawText({ path: filepath });
  // Handle extraction and warnings
}

import dotenv from "dotenv"

dotenv.config()

export function env(key: string): string | undefined {
  const v = process.env[key]
  if (typeof v !== "string") return undefined
  const t = v.trim()
  return t.length ? t : undefined
}

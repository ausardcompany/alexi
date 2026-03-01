/**
 * Session Sharing System
 * Enables sharing of conversation sessions via export/import functionality
 * Supports JSON and Markdown formats with secret redaction
 */

import { z } from "zod"
import * as fs from "fs/promises"
import * as path from "path"
import { createHash, randomUUID } from "crypto"
import { defineEvent } from "../bus/index.js"
import { SessionManager, type Session, type Message } from "../core/sessionManager.js"

// ============ Types & Interfaces ============

/**
 * Options for creating a share package
 */
export interface ShareOptions {
  /** Include system prompt in the share (default: false) */
  includeSystemPrompt?: boolean
  /** Redact potential secrets from content (default: true) */
  redactSecrets?: boolean
  /** Remove identifiable information (default: false) */
  anonymize?: boolean
  /** Output format for the share */
  format?: "json" | "markdown"
}

/**
 * Shared message format
 */
export interface SharedMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: number
}

/**
 * Package structure for shared sessions
 */
export interface SharePackage {
  /** Version of the share format */
  version: string
  /** Timestamp when the share was created */
  created: number
  /** Metadata about the shared session */
  metadata: {
    title?: string
    messageCount: number
    modelUsed?: string
  }
  /** Messages in the session */
  messages: SharedMessage[]
  /** Checksum for integrity verification */
  checksum: string
}

/**
 * Result of a share operation
 */
export interface ShareResult {
  /** Whether the operation was successful */
  success: boolean
  /** Unique identifier for this share */
  shareId?: string
  /** Base64 encoded share data */
  shareData?: string
  /** URL for sharing (placeholder for future enhancement) */
  shareUrl?: string
  /** Path to exported file if exported to file */
  filePath?: string
  /** Error message if operation failed */
  error?: string
}

/**
 * Result of an import operation
 */
export interface ImportResult {
  /** Whether the import was successful */
  success: boolean
  /** ID of the imported session */
  sessionId?: string
  /** Number of messages imported */
  messageCount?: number
  /** Error message if import failed */
  error?: string
}

// ============ Schemas ============

/**
 * Schema for validating shared messages
 */
export const SharedMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.number().optional(),
})

/**
 * Schema for validating share packages
 */
export const SharePackageSchema = z.object({
  version: z.string(),
  created: z.number(),
  metadata: z.object({
    title: z.string().optional(),
    messageCount: z.number(),
    modelUsed: z.string().optional(),
  }),
  messages: z.array(SharedMessageSchema),
  checksum: z.string(),
})

// ============ Events ============

/**
 * Event emitted when a session is shared
 */
export const SessionShared = defineEvent(
  "session.shared",
  z.object({
    sessionId: z.string(),
    shareId: z.string(),
    format: z.string(),
    timestamp: z.number(),
  })
)

/**
 * Event emitted when a session is imported
 */
export const SessionImported = defineEvent(
  "session.imported",
  z.object({
    sessionId: z.string(),
    sourceShareId: z.string().optional(),
    messageCount: z.number(),
    timestamp: z.number(),
  })
)

// ============ Constants ============

/** Current share format version */
const SHARE_FORMAT_VERSION = "1.0.0"

/**
 * Patterns to detect and redact secrets in content
 */
const SECRET_PATTERNS: RegExp[] = [
  // API keys
  /api[_-]?key["\s:=]+["']?[\w-]+["']?/gi,
  // Passwords
  /password["\s:=]+["']?[^"'\s]+["']?/gi,
  // Tokens
  /token["\s:=]+["']?[\w-]+["']?/gi,
  // Secrets
  /secret["\s:=]+["']?[^"'\s]+["']?/gi,
  // Bearer tokens
  /Bearer\s+[\w-_.]+/gi,
  // Private keys
  /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----[\s\S]*?-----END\s+(RSA\s+)?PRIVATE\s+KEY-----/gi,
  // AWS credentials
  /AKIA[0-9A-Z]{16}/gi,
  /aws[_-]?secret[_-]?access[_-]?key["\s:=]+["']?[^"'\s]+["']?/gi,
  // GitHub tokens
  /gh[pousr]_[A-Za-z0-9_]+/gi,
  // Generic secrets in env vars
  /[A-Z_]+_SECRET["\s:=]+["']?[^"'\s]+["']?/gi,
  /[A-Z_]+_KEY["\s:=]+["']?[^"'\s]+["']?/gi,
  // Connection strings
  /mongodb(\+srv)?:\/\/[^\s"']+/gi,
  /postgres(ql)?:\/\/[^\s"']+/gi,
  /mysql:\/\/[^\s"']+/gi,
  // JWT tokens (simple detection)
  /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
]

/** Placeholder text for redacted secrets */
const REDACTED_PLACEHOLDER = "[REDACTED]"

/** Placeholder for anonymized user references */
const ANONYMIZED_USER = "User"

// ============ Utility Functions ============

/**
 * Redact secrets from content using predefined patterns
 * @param content - Content to redact secrets from
 * @returns Content with secrets replaced by placeholder
 */
export function redactSecrets(content: string): string {
  let redacted = content

  for (const pattern of SECRET_PATTERNS) {
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0
    redacted = redacted.replace(pattern, REDACTED_PLACEHOLDER)
  }

  return redacted
}

/**
 * Anonymize content by removing identifiable information
 * @param content - Content to anonymize
 * @returns Anonymized content
 */
export function anonymizeContent(content: string): string {
  let anonymized = content

  // Remove email addresses
  anonymized = anonymized.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    "[EMAIL]"
  )

  // Remove file paths that look like user directories
  anonymized = anonymized.replace(
    /\/(?:Users|home)\/[^\/\s]+/g,
    "/[USER_HOME]"
  )

  // Remove Windows user paths
  anonymized = anonymized.replace(
    /C:\\Users\\[^\\\s]+/gi,
    "C:\\[USER_HOME]"
  )

  // Remove IP addresses
  anonymized = anonymized.replace(
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    "[IP_ADDRESS]"
  )

  return anonymized
}

/**
 * Generate a SHA-256 checksum for a share package (excluding the checksum field)
 * @param data - Share package to generate checksum for
 * @returns Hexadecimal checksum string
 */
export function generateChecksum(data: Omit<SharePackage, "checksum">): string {
  const hashContent = JSON.stringify({
    version: data.version,
    created: data.created,
    metadata: data.metadata,
    messages: data.messages,
  })

  return createHash("sha256").update(hashContent).digest("hex")
}

/**
 * Verify the checksum of a share package
 * @param data - Share package to verify
 * @returns true if checksum is valid, false otherwise
 */
export function verifyChecksum(data: SharePackage): boolean {
  const expectedChecksum = generateChecksum({
    version: data.version,
    created: data.created,
    metadata: data.metadata,
    messages: data.messages,
  })

  return data.checksum === expectedChecksum
}

/**
 * Encode share package to Base64 string
 * @param data - Share package to encode
 * @returns Base64 encoded string
 */
export function encodeShareData(data: SharePackage): string {
  const jsonString = JSON.stringify(data)
  return Buffer.from(jsonString, "utf-8").toString("base64")
}

/**
 * Decode Base64 string to share package
 * @param encoded - Base64 encoded string
 * @returns Decoded and validated share package
 * @throws Error if decoding or validation fails
 */
export function decodeShareData(encoded: string): SharePackage {
  try {
    const jsonString = Buffer.from(encoded, "base64").toString("utf-8")
    const parsed = JSON.parse(jsonString)
    return SharePackageSchema.parse(parsed)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`Failed to decode share data: ${message}`)
  }
}

/**
 * Convert session messages to shared message format
 * @param messages - Session messages to convert
 * @param options - Share options for processing
 * @returns Array of shared messages
 */
function convertMessages(
  messages: Message[],
  options: ShareOptions
): SharedMessage[] {
  const result: SharedMessage[] = []

  for (const msg of messages) {
    // Skip system messages if not included
    if (msg.role === "system" && !options.includeSystemPrompt) {
      continue
    }

    let content = msg.content

    // Apply redaction if enabled
    if (options.redactSecrets !== false) {
      content = redactSecrets(content)
    }

    // Apply anonymization if enabled
    if (options.anonymize) {
      content = anonymizeContent(content)
    }

    result.push({
      role: msg.role,
      content,
      timestamp: msg.timestamp,
    })
  }

  return result
}

/**
 * Convert share package to markdown format
 * @param pkg - Share package to convert
 * @returns Markdown string representation
 */
export function packageToMarkdown(pkg: SharePackage): string {
  const lines: string[] = []

  // Header
  lines.push(`# ${pkg.metadata.title || "Shared Conversation"}`)
  lines.push("")
  lines.push(`**Share ID:** ${pkg.checksum.slice(0, 8)}`)
  lines.push(`**Created:** ${new Date(pkg.created).toISOString()}`)
  lines.push(`**Messages:** ${pkg.metadata.messageCount}`)
  if (pkg.metadata.modelUsed) {
    lines.push(`**Model:** ${pkg.metadata.modelUsed}`)
  }
  lines.push("")
  lines.push("---")
  lines.push("")

  // Messages
  for (const msg of pkg.messages) {
    const roleLabel =
      msg.role === "user"
        ? "**User**"
        : msg.role === "assistant"
        ? "**Assistant**"
        : "**System**"

    const timestamp = msg.timestamp
      ? ` _(${new Date(msg.timestamp).toLocaleString()})_`
      : ""

    lines.push(`### ${roleLabel}${timestamp}`)
    lines.push("")
    lines.push(msg.content)
    lines.push("")
  }

  // Footer
  lines.push("---")
  lines.push("")
  lines.push(`_Exported with Alexi v${SHARE_FORMAT_VERSION}_`)

  return lines.join("\n")
}

// ============ ShareManager Class ============

/**
 * Manages session sharing operations
 *
 * @example
 * ```ts
 * const manager = getShareManager()
 *
 * // Create a share
 * const result = await manager.createShare("session-123", {
 *   redactSecrets: true,
 *   format: "json"
 * })
 *
 * if (result.success) {
 *   console.log("Share data:", result.shareData)
 * }
 *
 * // Import a share
 * const importResult = await manager.importShare(result.shareData!)
 * console.log("Imported session:", importResult.sessionId)
 * ```
 */
export class ShareManager {
  private sessionManager: SessionManager

  /**
   * Create a new ShareManager instance
   * @param sessionManager - Optional SessionManager instance (creates new if not provided)
   */
  constructor(sessionManager?: SessionManager) {
    this.sessionManager = sessionManager || new SessionManager()
  }

  /**
   * Create a shareable package of a session
   * @param sessionId - ID of the session to share
   * @param options - Options for creating the share
   * @returns ShareResult with share data
   */
  async createShare(
    sessionId: string,
    options: ShareOptions = {}
  ): Promise<ShareResult> {
    try {
      // Load the session
      const session = this.sessionManager.loadSession(sessionId)

      if (!session) {
        return {
          success: false,
          error: `Session not found: ${sessionId}`,
        }
      }

      // Create the share package
      const pkg = this.createPackageFromSession(session, options)

      // Generate share ID
      const shareId = randomUUID()

      // Encode based on format
      const format = options.format || "json"
      let shareData: string

      if (format === "markdown") {
        shareData = Buffer.from(packageToMarkdown(pkg), "utf-8").toString(
          "base64"
        )
      } else {
        shareData = encodeShareData(pkg)
      }

      // Publish event
      SessionShared.publish({
        sessionId,
        shareId,
        format,
        timestamp: Date.now(),
      })

      return {
        success: true,
        shareId,
        shareData,
        // Placeholder for future URL sharing enhancement
        shareUrl: undefined,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        success: false,
        error: `Failed to create share: ${message}`,
      }
    }
  }

  /**
   * Import a shared session
   * @param shareData - Base64 encoded share data or SharePackage object
   * @returns ImportResult with new session ID
   */
  async importShare(
    shareData: string | SharePackage
  ): Promise<ImportResult> {
    try {
      // Decode share data if string
      const pkg: SharePackage =
        typeof shareData === "string"
          ? decodeShareData(shareData)
          : shareData

      // Verify checksum
      if (!verifyChecksum(pkg)) {
        return {
          success: false,
          error: "Invalid share data: checksum verification failed",
        }
      }

      // Create new session
      const session = this.sessionManager.createSession(pkg.metadata.modelUsed)

      // Add messages to session
      for (const msg of pkg.messages) {
        this.sessionManager.addMessage(msg.role, msg.content)
      }

      // Publish event
      SessionImported.publish({
        sessionId: session.metadata.id,
        sourceShareId: pkg.checksum.slice(0, 8),
        messageCount: pkg.messages.length,
        timestamp: Date.now(),
      })

      return {
        success: true,
        sessionId: session.metadata.id,
        messageCount: pkg.messages.length,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        success: false,
        error: `Failed to import share: ${message}`,
      }
    }
  }

  /**
   * Export a session to a local file
   * @param sessionId - ID of the session to export
   * @param outputPath - Path to write the export file
   * @param options - Options for creating the export
   * @returns Path to the exported file
   */
  async exportToFile(
    sessionId: string,
    outputPath: string,
    options: ShareOptions = {}
  ): Promise<string> {
    // Load the session
    const session = this.sessionManager.loadSession(sessionId)

    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }

    // Create the share package
    const pkg = this.createPackageFromSession(session, options)

    // Determine format from file extension or options
    const format =
      options.format ||
      (outputPath.endsWith(".md") || outputPath.endsWith(".markdown")
        ? "markdown"
        : "json")

    // Generate content
    let content: string
    if (format === "markdown") {
      content = packageToMarkdown(pkg)
    } else {
      content = JSON.stringify(pkg, null, 2)
    }

    // Resolve path
    const resolvedPath = path.resolve(outputPath)
    const dir = path.dirname(resolvedPath)

    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true })

    // Write file
    await fs.writeFile(resolvedPath, content, "utf-8")

    // Publish event
    SessionShared.publish({
      sessionId,
      shareId: pkg.checksum.slice(0, 8),
      format,
      timestamp: Date.now(),
    })

    return resolvedPath
  }

  /**
   * Import a session from a local file
   * @param filePath - Path to the share file
   * @returns ImportResult with new session ID
   */
  async importFromFile(filePath: string): Promise<ImportResult> {
    try {
      const resolvedPath = path.resolve(filePath)

      // Read file
      const content = await fs.readFile(resolvedPath, "utf-8")

      // Determine format from file extension
      const isMarkdown =
        filePath.endsWith(".md") || filePath.endsWith(".markdown")

      if (isMarkdown) {
        // Markdown import is not fully supported - return error
        return {
          success: false,
          error:
            "Markdown import is not supported. Please use JSON format for imports.",
        }
      }

      // Parse JSON
      const parsed = JSON.parse(content)
      const pkg = SharePackageSchema.parse(parsed)

      // Import using the standard method
      return this.importShare(pkg)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        success: false,
        error: `Failed to import from file: ${message}`,
      }
    }
  }

  /**
   * Create a SharePackage from a session
   * @param session - Session to create package from
   * @param options - Options for creating the package
   * @returns SharePackage
   */
  private createPackageFromSession(
    session: Session,
    options: ShareOptions
  ): SharePackage {
    // Convert messages with options applied
    const messages = convertMessages(session.messages, options)

    // Create package without checksum first
    const pkgData = {
      version: SHARE_FORMAT_VERSION,
      created: Date.now(),
      metadata: {
        title: options.anonymize ? "Shared Conversation" : session.metadata.title,
        messageCount: messages.length,
        modelUsed: session.metadata.modelId,
      },
      messages,
    }

    // Generate and add checksum
    const checksum = generateChecksum(pkgData)

    return {
      ...pkgData,
      checksum,
    }
  }
}

// ============ Singleton Instance ============

let shareManagerInstance: ShareManager | null = null

/**
 * Get the singleton ShareManager instance
 * @param sessionManager - Optional SessionManager instance for initialization
 * @returns The global ShareManager instance
 */
export function getShareManager(sessionManager?: SessionManager): ShareManager {
  if (!shareManagerInstance) {
    shareManagerInstance = new ShareManager(sessionManager)
  }
  return shareManagerInstance
}

/**
 * Reset the singleton ShareManager instance
 * Useful for testing
 */
export function resetShareManager(): void {
  shareManagerInstance = null
}

// ============ Global Helper Functions ============

/**
 * Share a session (convenience function)
 * @param sessionId - ID of the session to share
 * @param options - Options for creating the share
 * @returns ShareResult
 */
export async function shareSession(
  sessionId: string,
  options?: ShareOptions
): Promise<ShareResult> {
  return getShareManager().createShare(sessionId, options)
}

/**
 * Import a shared session (convenience function)
 * @param shareData - Base64 encoded share data
 * @returns ImportResult
 */
export async function importSession(
  shareData: string
): Promise<ImportResult> {
  return getShareManager().importShare(shareData)
}

/**
 * Export a session to a file (convenience function)
 * @param sessionId - ID of the session to export
 * @param outputPath - Path to write the export file
 * @param options - Options for creating the export
 * @returns Path to the exported file
 */
export async function exportSessionToFile(
  sessionId: string,
  outputPath: string,
  options?: ShareOptions
): Promise<string> {
  return getShareManager().exportToFile(sessionId, outputPath, options)
}

/**
 * Import a session from a file (convenience function)
 * @param filePath - Path to the share file
 * @returns ImportResult
 */
export async function importSessionFromFile(
  filePath: string
): Promise<ImportResult> {
  return getShareManager().importFromFile(filePath)
}

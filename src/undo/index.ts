/**
 * Undo/Redo System
 * Tracks file states per message/operation and supports undo/redo operations
 * Inspired by kilocode/opencode undo patterns
 */

import { z } from "zod"
import { nanoid } from "nanoid"
import * as fs from "fs/promises"
import * as path from "path"
import { defineEvent } from "../bus/index.js"

// ============ Schemas ============

/**
 * Schema for a single file state snapshot
 */
export const FileStateSchema = z.object({
  /** Absolute path to the file */
  path: z.string(),
  /** File content before modification, null means file didn't exist */
  content: z.string().nullable(),
  /** Timestamp when the state was captured */
  timestamp: z.number(),
})

/**
 * Schema for an undo operation entry
 */
export const UndoEntrySchema = z.object({
  /** Unique identifier for this undo entry */
  id: z.string(),
  /** Associated message/operation ID */
  messageId: z.string(),
  /** Array of file states captured before the operation */
  files: z.array(FileStateSchema),
  /** Description of the operation */
  description: z.string().optional(),
  /** Timestamp when the entry was created */
  createdAt: z.number(),
})

/**
 * Schema for undo/redo result
 */
export const UndoResultSchema = z.object({
  /** Whether the operation was successful */
  success: z.boolean(),
  /** List of restored file paths */
  restoredFiles: z.array(z.string()),
  /** Error message if operation failed */
  error: z.string().optional(),
})

// ============ Types ============

/**
 * Represents the state of a file at a specific point in time
 */
export type FileState = z.infer<typeof FileStateSchema>

/**
 * Represents an entry in the undo/redo stack
 */
export type UndoEntry = z.infer<typeof UndoEntrySchema>

/**
 * Result of an undo/redo operation
 */
export type UndoResult = z.infer<typeof UndoResultSchema>

/**
 * Information about current undo/redo stack sizes
 */
export interface StackInfo {
  undoCount: number
  redoCount: number
}

/**
 * Options for UndoManager initialization
 */
export interface UndoManagerOptions {
  /** Maximum number of undo entries to keep (default: 100) */
  maxHistorySize?: number
  /** Whether to persist history to disk (default: false) */
  persistToDisk?: boolean
  /** Directory for persistence storage */
  persistenceDir?: string
}

// ============ Events ============

/**
 * Event published when file state is captured before modification
 */
export const FileStateCapture = defineEvent(
  "undo.state.captured",
  z.object({
    /** The undo entry ID */
    entryId: z.string(),
    /** Associated message/operation ID */
    messageId: z.string(),
    /** Number of files captured */
    fileCount: z.number(),
    /** Paths of captured files */
    filePaths: z.array(z.string()),
    /** Timestamp */
    timestamp: z.number(),
  })
)

/**
 * Event published when an undo operation is performed
 */
export const UndoPerformed = defineEvent(
  "undo.performed",
  z.object({
    /** The undo entry ID that was restored */
    entryId: z.string(),
    /** Associated message/operation ID */
    messageId: z.string(),
    /** Whether the undo was successful */
    success: z.boolean(),
    /** List of restored file paths */
    restoredFiles: z.array(z.string()),
    /** Error message if failed */
    error: z.string().optional(),
    /** Timestamp */
    timestamp: z.number(),
  })
)

/**
 * Event published when a redo operation is performed
 */
export const RedoPerformed = defineEvent(
  "undo.redo.performed",
  z.object({
    /** The redo entry ID that was restored */
    entryId: z.string(),
    /** Associated message/operation ID */
    messageId: z.string(),
    /** Whether the redo was successful */
    success: z.boolean(),
    /** List of restored file paths */
    restoredFiles: z.array(z.string()),
    /** Error message if failed */
    error: z.string().optional(),
    /** Timestamp */
    timestamp: z.number(),
  })
)

// ============ Utility Functions ============

/**
 * Capture the current state of a file
 * @param filePath - Absolute path to the file
 * @returns FileState object with current content or null if file doesn't exist
 */
export async function captureFileState(filePath: string): Promise<FileState> {
  const absolutePath = path.resolve(filePath)
  const timestamp = Date.now()

  try {
    const content = await fs.readFile(absolutePath, "utf-8")
    return {
      path: absolutePath,
      content,
      timestamp,
    }
  } catch (err) {
    const error = err as NodeJS.ErrnoException
    // File doesn't exist - record as null content
    if (error.code === "ENOENT") {
      return {
        path: absolutePath,
        content: null,
        timestamp,
      }
    }
    // Other errors (permission denied, etc.) - throw
    throw new Error(`Failed to capture file state: ${error.message}`)
  }
}

/**
 * Capture states of multiple files
 * @param filePaths - Array of absolute file paths
 * @returns Array of FileState objects
 */
export async function captureMultipleFileStates(
  filePaths: string[]
): Promise<FileState[]> {
  return Promise.all(filePaths.map((fp) => captureFileState(fp)))
}

/**
 * Restore a file to a previous state
 * @param state - FileState to restore
 */
export async function restoreFileState(state: FileState): Promise<void> {
  const absolutePath = path.resolve(state.path)

  if (state.content === null) {
    // File didn't exist before - delete it
    try {
      await fs.unlink(absolutePath)
    } catch (err) {
      const error = err as NodeJS.ErrnoException
      // Ignore if file already doesn't exist
      if (error.code !== "ENOENT") {
        throw new Error(`Failed to delete file: ${error.message}`)
      }
    }
  } else {
    // Restore file content
    try {
      // Ensure parent directory exists
      const dir = path.dirname(absolutePath)
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(absolutePath, state.content, "utf-8")
    } catch (err) {
      const error = err as NodeJS.ErrnoException
      throw new Error(`Failed to restore file: ${error.message}`)
    }
  }
}

/**
 * Restore multiple files to previous states
 * @param states - Array of FileState objects to restore
 * @returns Array of successfully restored file paths
 */
export async function restoreMultipleFileStates(
  states: FileState[]
): Promise<string[]> {
  const restored: string[] = []
  
  for (const state of states) {
    try {
      await restoreFileState(state)
      restored.push(state.path)
    } catch (err) {
      // Continue with other files even if one fails
      console.error(`Failed to restore ${state.path}:`, err)
    }
  }
  
  return restored
}

// ============ UndoManager Class ============

/**
 * Manages undo/redo operations for file modifications
 */
export class UndoManager {
  private undoStack: UndoEntry[] = []
  private redoStack: UndoEntry[] = []
  private options: Required<UndoManagerOptions>

  /**
   * Create a new UndoManager instance
   * @param options - Configuration options
   */
  constructor(options: UndoManagerOptions = {}) {
    this.options = {
      maxHistorySize: options.maxHistorySize ?? 100,
      persistToDisk: options.persistToDisk ?? false,
      persistenceDir: options.persistenceDir ?? ".alexi-undo",
    }
  }

  /**
   * Push a new state to the undo stack (called before file modifications)
   * @param messageId - ID of the message/operation associated with this state
   * @param files - Array of FileState objects to store
   * @param description - Optional description of the operation
   * @returns The created undo entry ID
   */
  pushState(
    messageId: string,
    files: FileState[],
    description?: string
  ): string {
    const entry: UndoEntry = {
      id: nanoid(),
      messageId,
      files,
      description,
      createdAt: Date.now(),
    }

    // Clear redo stack when new changes are made
    this.redoStack = []

    // Add to undo stack
    this.undoStack.push(entry)

    // Trim history if exceeds max size
    while (this.undoStack.length > this.options.maxHistorySize) {
      this.undoStack.shift()
    }

    // Publish event
    FileStateCapture.publish({
      entryId: entry.id,
      messageId,
      fileCount: files.length,
      filePaths: files.map((f) => f.path),
      timestamp: Date.now(),
    })

    // Persist if enabled
    if (this.options.persistToDisk) {
      this.persistAsync().catch((err) => {
        console.error("Failed to persist undo history:", err)
      })
    }

    return entry.id
  }

  /**
   * Undo the last operation, restoring files to previous state
   * @returns UndoResult with success status and restored files
   */
  async undo(): Promise<UndoResult> {
    if (this.undoStack.length === 0) {
      return {
        success: false,
        restoredFiles: [],
        error: "Nothing to undo",
      }
    }

    const entry = this.undoStack.pop()!
    
    // Capture current state before undoing (for redo)
    const currentStates = await this.captureCurrentStatesForEntry(entry)
    
    try {
      // Restore files
      const restoredFiles = await restoreMultipleFileStates(entry.files)

      // Push to redo stack with current state
      const redoEntry: UndoEntry = {
        id: nanoid(),
        messageId: entry.messageId,
        files: currentStates,
        description: entry.description,
        createdAt: Date.now(),
      }
      this.redoStack.push(redoEntry)

      const result: UndoResult = {
        success: true,
        restoredFiles,
      }

      // Publish event
      UndoPerformed.publish({
        entryId: entry.id,
        messageId: entry.messageId,
        success: true,
        restoredFiles,
        timestamp: Date.now(),
      })

      // Persist if enabled
      if (this.options.persistToDisk) {
        this.persistAsync().catch((err) => {
          console.error("Failed to persist undo history:", err)
        })
      }

      return result
    } catch (err) {
      // Restore the entry to the undo stack on failure
      this.undoStack.push(entry)

      const errorMsg = err instanceof Error ? err.message : String(err)
      const result: UndoResult = {
        success: false,
        restoredFiles: [],
        error: errorMsg,
      }

      // Publish event
      UndoPerformed.publish({
        entryId: entry.id,
        messageId: entry.messageId,
        success: false,
        restoredFiles: [],
        error: errorMsg,
        timestamp: Date.now(),
      })

      return result
    }
  }

  /**
   * Redo a previously undone operation
   * @returns UndoResult with success status and restored files
   */
  async redo(): Promise<UndoResult> {
    if (this.redoStack.length === 0) {
      return {
        success: false,
        restoredFiles: [],
        error: "Nothing to redo",
      }
    }

    const entry = this.redoStack.pop()!
    
    // Capture current state before redoing (for undo)
    const currentStates = await this.captureCurrentStatesForEntry(entry)

    try {
      // Restore files
      const restoredFiles = await restoreMultipleFileStates(entry.files)

      // Push to undo stack with current state
      const undoEntry: UndoEntry = {
        id: nanoid(),
        messageId: entry.messageId,
        files: currentStates,
        description: entry.description,
        createdAt: Date.now(),
      }
      this.undoStack.push(undoEntry)

      const result: UndoResult = {
        success: true,
        restoredFiles,
      }

      // Publish event
      RedoPerformed.publish({
        entryId: entry.id,
        messageId: entry.messageId,
        success: true,
        restoredFiles,
        timestamp: Date.now(),
      })

      // Persist if enabled
      if (this.options.persistToDisk) {
        this.persistAsync().catch((err) => {
          console.error("Failed to persist undo history:", err)
        })
      }

      return result
    } catch (err) {
      // Restore the entry to the redo stack on failure
      this.redoStack.push(entry)

      const errorMsg = err instanceof Error ? err.message : String(err)
      const result: UndoResult = {
        success: false,
        restoredFiles: [],
        error: errorMsg,
      }

      // Publish event
      RedoPerformed.publish({
        entryId: entry.id,
        messageId: entry.messageId,
        success: false,
        restoredFiles: [],
        error: errorMsg,
        timestamp: Date.now(),
      })

      return result
    }
  }

  /**
   * Get current undo/redo stack sizes
   * @returns StackInfo with undoCount and redoCount
   */
  getStackInfo(): StackInfo {
    return {
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length,
    }
  }

  /**
   * Check if undo is available
   * @returns true if there are entries to undo
   */
  canUndo(): boolean {
    return this.undoStack.length > 0
  }

  /**
   * Check if redo is available
   * @returns true if there are entries to redo
   */
  canRedo(): boolean {
    return this.redoStack.length > 0
  }

  /**
   * Get the most recent undo entry without removing it
   * @returns The most recent UndoEntry or undefined if stack is empty
   */
  peekUndo(): UndoEntry | undefined {
    return this.undoStack[this.undoStack.length - 1]
  }

  /**
   * Get the most recent redo entry without removing it
   * @returns The most recent redo UndoEntry or undefined if stack is empty
   */
  peekRedo(): UndoEntry | undefined {
    return this.redoStack[this.redoStack.length - 1]
  }

  /**
   * Get all undo entries (for display purposes)
   * @returns Copy of the undo stack
   */
  getUndoHistory(): UndoEntry[] {
    return [...this.undoStack]
  }

  /**
   * Get all redo entries (for display purposes)
   * @returns Copy of the redo stack
   */
  getRedoHistory(): UndoEntry[] {
    return [...this.redoStack]
  }

  /**
   * Clear all undo/redo history
   */
  clear(): void {
    this.undoStack = []
    this.redoStack = []

    // Persist if enabled
    if (this.options.persistToDisk) {
      this.persistAsync().catch((err) => {
        console.error("Failed to persist undo history:", err)
      })
    }
  }

  /**
   * Capture current file states for an entry's file paths
   * @param entry - UndoEntry to get file paths from
   * @returns Array of current FileState objects
   */
  private async captureCurrentStatesForEntry(
    entry: UndoEntry
  ): Promise<FileState[]> {
    const filePaths = entry.files.map((f) => f.path)
    return captureMultipleFileStates(filePaths)
  }

  /**
   * Persist undo/redo history to disk asynchronously
   */
  private async persistAsync(): Promise<void> {
    const persistDir = path.resolve(this.options.persistenceDir)
    
    try {
      await fs.mkdir(persistDir, { recursive: true })
      
      const data = {
        undoStack: this.undoStack,
        redoStack: this.redoStack,
        timestamp: Date.now(),
      }
      
      const filePath = path.join(persistDir, "undo-history.json")
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
    } catch (err) {
      console.error("Failed to persist undo history:", err)
    }
  }

  /**
   * Load undo/redo history from disk
   * @returns Promise that resolves when loading is complete
   */
  async loadFromDisk(): Promise<void> {
    if (!this.options.persistToDisk) {
      return
    }

    const filePath = path.join(
      path.resolve(this.options.persistenceDir),
      "undo-history.json"
    )

    try {
      const content = await fs.readFile(filePath, "utf-8")
      const data = JSON.parse(content)
      
      // Validate loaded data
      if (Array.isArray(data.undoStack)) {
        this.undoStack = data.undoStack.filter((entry: unknown) => {
          try {
            UndoEntrySchema.parse(entry)
            return true
          } catch {
            return false
          }
        })
      }
      
      if (Array.isArray(data.redoStack)) {
        this.redoStack = data.redoStack.filter((entry: unknown) => {
          try {
            UndoEntrySchema.parse(entry)
            return true
          } catch {
            return false
          }
        })
      }
    } catch (err) {
      const error = err as NodeJS.ErrnoException
      // Ignore if file doesn't exist
      if (error.code !== "ENOENT") {
        console.error("Failed to load undo history:", error)
      }
    }
  }
}

// ============ Global Instance ============

let globalUndoManager: UndoManager | null = null

/**
 * Get the global UndoManager instance
 * @param options - Optional configuration for initialization
 * @returns The global UndoManager instance
 */
export function getUndoManager(options?: UndoManagerOptions): UndoManager {
  if (!globalUndoManager) {
    globalUndoManager = new UndoManager(options)
  }
  return globalUndoManager
}

/**
 * Set the global UndoManager instance
 * @param manager - UndoManager instance to use globally
 */
export function setUndoManager(manager: UndoManager): void {
  globalUndoManager = manager
}

/**
 * Reset the global UndoManager instance
 * Useful for testing
 */
export function resetUndoManager(): void {
  globalUndoManager = null
}

// ============ Helper Functions for Integration ============

/**
 * Create an undo checkpoint before modifying files
 * Captures current state of specified files and pushes to undo stack
 * @param messageId - ID of the message/operation
 * @param filePaths - Array of file paths that will be modified
 * @param description - Optional description of the operation
 * @returns The created undo entry ID
 */
export async function createUndoCheckpoint(
  messageId: string,
  filePaths: string[],
  description?: string
): Promise<string> {
  const manager = getUndoManager()
  const states = await captureMultipleFileStates(filePaths)
  return manager.pushState(messageId, states, description)
}

/**
 * Perform undo using the global manager
 * @returns UndoResult
 */
export async function performUndo(): Promise<UndoResult> {
  return getUndoManager().undo()
}

/**
 * Perform redo using the global manager
 * @returns UndoResult
 */
export async function performRedo(): Promise<UndoResult> {
  return getUndoManager().redo()
}

/**
 * Get stack info from the global manager
 * @returns StackInfo
 */
export function getUndoStackInfo(): StackInfo {
  return getUndoManager().getStackInfo()
}

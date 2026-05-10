/**
 * Attachment Configuration
 * Configuration for handling image attachments with size and quality constraints
 * From PR #26401
 */

import { z } from 'zod';

export const AttachmentConfigSchema = z.object({
  image: z
    .object({
      maxWidth: z.number().positive().optional(),
      maxHeight: z.number().positive().optional(),
      maxSizeBytes: z.number().positive().optional(),
      autoResize: z.boolean().optional(),
      quality: z.number().min(0).max(100).optional(),
    })
    .optional(),
});

export type AttachmentConfig = z.infer<typeof AttachmentConfigSchema>;

export const DEFAULT_ATTACHMENT_CONFIG: AttachmentConfig = {
  image: {
    maxWidth: 2048,
    maxHeight: 2048,
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    autoResize: true,
    quality: 85,
  },
};

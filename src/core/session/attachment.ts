/**
 * Attachment classification and normalization.
 *
 * Backports upstream opencode commits 225c393f4, cf720c9b3, 27eeb1420,
 * 51a361ee6, 6d3d87fef, 969c9dbd6 from
 * `packages/opencode/src/kilocode/session/attachment.ts` and
 * `packages/opencode/src/image/image.ts`, which fix two tightly-coupled
 * bugs that bite under SAP AI Core:
 *
 * 1. A rejected attachment (e.g., SVG not accepted as an image by the
 *    model gateway) silently discarded the whole prompt. The caller lost
 *    the user's text too.
 * 2. SVGs should be sent as text attachments, not images — SAP AI Core
 *    model gateways frequently reject `image/svg+xml` as an image part.
 *
 * The upstream shape is preserved: callers normalize per-attachment,
 * collect rejections, and surface them as non-fatal warnings while still
 * sending the text prompt + whatever attachments were accepted.
 */

export type AttachmentKind = 'image' | 'text' | 'unsupported';

export interface RawAttachment {
  path?: string;
  url?: string;
  mimeType?: string;
  bytes?: Uint8Array;
}

export interface NormalizedAttachment {
  kind: AttachmentKind;
  mimeType: string;
  content: Uint8Array | string;
  // Set when we had to downgrade (e.g., svg → text) so the caller can note it.
  downgradedFrom?: AttachmentKind;
}

const SVG_MIME = 'image/svg+xml';

export function classifyAttachment(a: RawAttachment): AttachmentKind {
  const mt = (a.mimeType ?? '').toLowerCase();
  if (!mt) {
    return 'unsupported';
  }
  if (mt === SVG_MIME) {
    return 'text'; // SVGs ride as text
  }
  if (mt.startsWith('image/')) {
    return 'image';
  }
  if (mt.startsWith('text/')) {
    return 'text';
  }
  return 'unsupported';
}

export function normalizeAttachment(a: RawAttachment): NormalizedAttachment | null {
  const kind = classifyAttachment(a);
  if (kind === 'unsupported') {
    return null;
  }

  // SVG: treat as text, keep bytes decoded as utf-8.
  if ((a.mimeType ?? '').toLowerCase() === SVG_MIME) {
    const text = a.bytes ? new TextDecoder('utf-8').decode(a.bytes) : '';
    return {
      kind: 'text',
      mimeType: SVG_MIME,
      content: text,
      downgradedFrom: 'image',
    };
  }

  return {
    kind,
    mimeType: a.mimeType ?? 'application/octet-stream',
    content: a.bytes ?? '',
  };
}

/**
 * Result of folding a batch of raw attachments through
 * {@link normalizeAttachment}. `rejected` captures per-attachment reasons
 * so the caller can surface a non-fatal warning without discarding the
 * user's text prompt. See upstream `session/prompt.ts` build logic.
 */
export interface AttachmentBuildResult {
  attachments: NormalizedAttachment[];
  rejected: { source: string; reason: string }[];
}

/**
 * Normalize a batch of attachments, collecting rejections instead of
 * throwing on the first unsupported MIME type. The caller is expected to
 * forward `attachments` to the model and surface `rejected` as a warning
 * to the user.
 */
export function buildAttachments(raw: RawAttachment[]): AttachmentBuildResult {
  const attachments: NormalizedAttachment[] = [];
  const rejected: { source: string; reason: string }[] = [];
  for (const r of raw) {
    const n = normalizeAttachment(r);
    if (n === null) {
      rejected.push({
        source: r.path ?? r.url ?? '<inline>',
        reason: `Unsupported MIME type: ${r.mimeType ?? '<none>'}`,
      });
      continue;
    }
    attachments.push(n);
  }
  return { attachments, rejected };
}

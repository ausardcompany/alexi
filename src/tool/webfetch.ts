if (isIconMimeType(mime)) throw new Error(`Unsupported image format: ${mime}`)
if (isImageAttachment(mime)) {
  const base64Content = Buffer.from(arrayBuffer).toString("base64")
  return {
    // updated logic
  }
}

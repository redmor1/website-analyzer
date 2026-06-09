export function getSafeFilename(inputUrl: string, tool: string): string {
  try {
    const parsedUrl = new URL(inputUrl)
    const safeFilename = parsedUrl.hostname
    return `${safeFilename}-${tool}.json`
  } catch (error) {
    console.error(error)
    throw new Error(`Invalid URL provided ${inputUrl}`, { cause: error })
  }
}

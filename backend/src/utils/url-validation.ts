import dns from "node:dns/promises"

import { hostSchema } from "../schemas/schemas.js"

export async function validateTargetUrl(inputUrl: string): Promise<string> {
  const parsedUrl = new URL(inputUrl)

  // Validate for command injection
  hostSchema.parse(parsedUrl.host)

  // Resolve DNS to prevent SSRF
  try {
    const { address } = await dns.lookup(parsedUrl.hostname)

    if (isPrivateIP(address)) {
      throw new Error(
        "Scanning internal or private IP addresses is not permitted.",
      )
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("not permitted")) {
      throw error
    }
    throw new Error(`DNS resolution failed for ${parsedUrl.hostname}`, {
      cause: error,
    })
  }

  // Return the original URL if all checks pass
  return inputUrl
}

function isPrivateIP(ip: string): boolean {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) ||
    ip.startsWith("169.254.")
  )
}

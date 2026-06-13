import path from "node:path"

import { config } from "../../config.js"
import { spawnPromise } from "../../utils/exec.js"
import { getSafeFilename } from "../../utils/filenames.js"

export async function runWapitiScan(url: string) {
  try {
    const safeFileName = getSafeFilename(url, "wapiti")

    // Define hosts and container paths
    const hostFolder = config.reportFilePath
    const containerFolder = "/app/reports"

    const commandArguments = [
      "run",
      "--rm",
      "--mount",
      `type=bind,source=${hostFolder},target=${containerFolder}`,
      "wapiti-local:latest",
      "-u",
      url,
      "-f",
      "json",
      "-o",
      `${containerFolder}/${safeFileName}`,
    ]

    console.log(`Starting Wapiti scan for: ${url}`)

    await spawnPromise("docker", commandArguments)

    console.log(
      `Scan complete. JSON saved to ${path.join(hostFolder, safeFileName)}`,
    )
  } catch (error) {
    console.error("Wapiti scan failed:", error)
  }
}

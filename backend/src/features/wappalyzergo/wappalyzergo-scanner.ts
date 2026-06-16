import path from "node:path"

import { config } from "../../config.js"
import { spawnPromise } from "../../utils/exec.js"
import { getSafeFilename } from "../../utils/filenames.js"

export async function runWappalyzergoScan(url: string) {
  try {
    const JsonFilename = getSafeFilename(url, "wappalyzergo")
    const hostFolder = config.reportFilePath
    const containerFolder = "/app/reports"

    const commandArguments = [
      "run",
      "--rm",
      "--mount",
      `type=bind,source=${hostFolder},target=${containerFolder}`,
      "wappalyzergo-local:latest",
      "-target",
      url,
      "-json",
      "-output",
      `${containerFolder}/${JsonFilename}`,
    ]

    console.log(`Starting wappalyzergo scan for: ${url}`)

    try {
      await spawnPromise("docker", commandArguments)
    } catch (error) {
      console.error("Wappalyzergo scan failed:", error)
      throw error
    }

    console.log(
      `Scan complete. Wappalyzergo JSON saved to ${path.join(hostFolder, JsonFilename)}`,
    )
  } catch (error) {
    console.error("Wappalyzergo setup failed:", error)
  }
}

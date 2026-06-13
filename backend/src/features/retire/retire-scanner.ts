import path from "node:path"

import { config } from "../../config.js"
import { spawnPromise } from "../../utils/exec.js"
import { getSafeFilename } from "../../utils/filenames.js"

export async function runRetireScan(url: string) {
  try {
    const safeFileName = getSafeFilename(url, "retire")

    const hostFolder = config.reportFilePath
    // const filePath = path.resolve(config.reportFilePath, safeFileName)

    // Container path for linux (forward slashes)
    const containerFolder = "/app/reports"

    // TODO: check if pull=always could lead to vulnerabilities
    const commandArguments = [
      "run",
      "--rm",
      "--mount",
      `type=bind,source=${hostFolder},target=${containerFolder}`,
      "ghcr.io/redmor1/retire-site-scanner-modified:latest",
      "--sbom-file",
      `${containerFolder}/${safeFileName}`,
      url,
    ]

    console.log(`Starting Retire scan for: ${url}`)

    await spawnPromise("docker", commandArguments)
    console.log(
      `Scan complete. JSON saved to ${path.join(hostFolder, safeFileName)}`,
    )
  } catch (error) {
    console.log(error)
    // TODO: implement some sort of logging system
  }
}

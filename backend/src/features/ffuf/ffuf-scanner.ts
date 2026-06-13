import path from "node:path"

import { config } from "../../config.js"
import { spawnPromise } from "../../utils/exec.js"
import { getSafeFilename } from "../../utils/filenames.js"

export async function runFfufScan(url: string, wordlistName: "common.txt") {
  try {
    const safeFileName = getSafeFilename(url, "ffuf")

    // ffuf requires the exact keyword 'FUZZ' where the payload should be injected.
    // Ensures there is exactly one slash between the domain and FUZZ.
    const targetUrl = url.endsWith("/") ? `${url}FUZZ` : `${url}/FUZZ`

    // Host paths
    const hostFolder = config.reportFilePath
    const hostWordlistsFolder = path.resolve("./src/features/ffuf/wordlists")

    // Docker container paths
    const containerFolder = "/app/reports"
    const containerWordlistsFolder = "/wordlists"

    const commandArguments = [
      "run",
      "--rm",
      "--mount",
      `type=bind,source=${hostFolder},target=${containerFolder}`,
      "--mount",
      `type=bind,source=${hostWordlistsFolder},target=${containerWordlistsFolder}`,
      "ffuf-local:latest",
      "-w",
      `${containerWordlistsFolder}/${wordlistName}`,
      "-u",
      targetUrl,
      "-of",
      "json",
      "-o",
      `${containerFolder}/${safeFileName}`,
      "-ac", // Automatically calibrate filtering to drop false positives
      "-noninteractive",
    ]

    console.log(`Starting ffuf scan for: ${targetUrl} using ${wordlistName}`)

    await spawnPromise("docker", commandArguments)

    console.log(
      `Scan complete. JSON saved to ${path.join(hostFolder, safeFileName)}`,
    )
  } catch (error) {
    console.error("ffuf scan failed:", error)
  }
}

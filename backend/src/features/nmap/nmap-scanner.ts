import path from "node:path"

import { config } from "../../config.js"
import { execPromise } from "../../utils/exec.js"
import { getSafeFilename } from "../../utils/filenames.js"

export async function runNmapScan(url: string) {
  try {
    // 1. Nmap requires a raw hostname or IP. Extract it from the URL.
    let targetHost = url
    try {
      targetHost = new URL(url).hostname
    } catch (error) {
      console.error(error)
      // If URL parsing fails, assume the user already passed a raw domain or IP
    }

    // 2. Define the XML output file
    const safeFileName = getSafeFilename(url, "nmap")

    // 3. Define Host and Container Paths
    const hostFolder = config.reportFilePath
    const containerFolder = "/app/reports"

    // 4. Construct the Docker command
    const command = `docker run --rm \
      --mount type=bind,source="${hostFolder}",target=${containerFolder} \
      nmap-local:latest \
      -sV -F --min-rate 300 \
      -oX ${containerFolder}/${safeFileName} \
      ${targetHost}`

    console.log(`Starting nmap scan for: ${targetHost}`)

    // 5. Execute the command
    const { stdout, stderr } = await execPromise(command, {
      maxBuffer: 1024 * 1024 * 10,
    })

    console.log(
      `Scan complete. XML saved to ${path.join(hostFolder, safeFileName)}`,
    )
  } catch (error) {
    console.error("Nmap scan failed:", error)
  }
}

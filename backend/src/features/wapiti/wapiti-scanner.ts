import path from "node:path"

import { config } from "../../config.js"
import { execPromise } from "../../utils/exec.js"
import { getSafeFilename } from "../../utils/filenames.js"

export async function runWapitiScan(url: string) {
  try {
    const safeFileName = getSafeFilename(url, "wapiti")

    // Define hosts and container paths
    const hostFolder = config.reportFilePath
    const containerFolder = "/app/reports"

    // Docker stuff + bind mount
    const command = `docker run --rm \
      --mount type=bind,source="${hostFolder}",target=${containerFolder} \
      wapiti-local:latest -u ${url} --max-links-per-page 50 --tasks 4 --max-links-per-page 50  -f json  -o ${containerFolder}/${safeFileName}`

    console.log(`Starting Wapiti scan for: ${url}`)

    const { stdout, stderr } = await execPromise(command, {
      maxBuffer: 1024 * 1024 * 20, // Increased buffer: Wapiti prints extensive crawling logs
    })

    console.log(
      `Scan complete. JSON saved to ${path.join(hostFolder, safeFileName)}`,
    )
  } catch (error) {
    console.error("Wapiti scan failed:", error)
  }
}

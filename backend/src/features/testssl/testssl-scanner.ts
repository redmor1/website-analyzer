import path from "node:path"

import { config } from "../../config.js"
import { execPromise } from "../../utils/exec.js"
import { getSafeFilename } from "../../utils/filenames.js"

export async function runTestSslScan(url: string) {
  // KEEP IN MIND
  // VPS Execution Time: testssl.sh tests hundreds of distinct cipher combinations and handshake protocols manually. Because of this, it can take 2 to 4 minutes to complete a full run against a single target.
  // Ensure your overall API timeout settings in your Node.js application account for this duration.

  try {
    // Extract raw hostname from the URL
    let targetHost = url
    try {
      targetHost = new URL(url).hostname
    } catch (error) {
      console.error(error)
      // Fallback if the user input is already a raw domain
    }

    const safeFileName = getSafeFilename(url, "testssl")

    // Define Host and Container Paths
    const hostFolder = config.reportFilePath
    const containerFolder = "/app/reports"

    // Construct the Docker command
    // --jsonfile tells testssl to log output in structured JSON to our mounted folder
    // --warnings off prevents terminal formatting data from muddying logs
    const command = `docker run --rm \
      --mount type=bind,source="${hostFolder}",target=${containerFolder} \
      testssl-local:latest \
      --warnings off \
      --jsonfile ${containerFolder}/${safeFileName} \
      ${targetHost}`

    console.log(`Starting TLS/SSL audit for: ${targetHost}`)

    // Execute the command
    const { stdout, stderr } = await execPromise(command, {
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer for verbose cipher readouts
    })

    console.log(
      `Scan complete. JSON saved to ${path.join(hostFolder, safeFileName)}`,
    )
  } catch (error) {
    console.error("testssl.sh scan failed:", error)
  }
}

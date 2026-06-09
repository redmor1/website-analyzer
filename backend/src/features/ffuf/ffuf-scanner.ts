import path from "node:path"

import { config } from "../../config.js"
import { execPromise } from "../../utils/exec.js"

export async function runFfufScan(url: string, wordlistName: "common.txt") {
  try {
    const safeFileName = `${encodeURIComponent(url)}-ffuf.json`

    // ffuf requires the exact keyword 'FUZZ' where the payload should be injected.
    // Ensure there is exactly one slash between the domain and FUZZ.
    const targetUrl = url.endsWith("/") ? `${url}FUZZ` : `${url}/FUZZ`

    // 2. Define Host Paths
    const hostFolder = config.reportFilePath
    const hostWordlistsFolder = path.resolve("./features/ffuf/wordlists")

    // Docker container paths
    const containerFolder = "/app/reports"
    const containerWordlistsFolder = "/wordlists"

    // 4. Construct the Docker command
    // Using the official Docker Hub image for ffuf
    const command = `docker run --rm \
      --mount type=bind,source="${hostFolder}",target=${containerFolder} \
      --mount type=bind,source="${hostWordlistsFolder}",target=${containerWordlistsFolder} \
      ffuf-local:latest \
      -w ${containerWordlistsFolder}/${wordlistName} \
      -u ${targetUrl} \
      -of json -o ${containerFolder}/${safeFileName} \
      -noninteractive`

    console.log(`Starting ffuf scan for: ${targetUrl} using ${wordlistName}`)

    // 5. Execute the command
    const { stderr, stdout } = await execPromise(command, {
      maxBuffer: 1024 * 1024 * 10,
    })

    console.log(
      `Scan complete. JSON saved to ${path.join(hostFolder, safeFileName)}`,
    )
  } catch (error) {
    console.error("ffuf scan failed:", error)
  }
}

import { readFile } from "node:fs/promises"
import path from "node:path"

import { config } from "../../config.js"
import { execPromise } from "../../utils/exec.js"

export async function runRetireScan(url: string) {
  try {
    const safeFileName = `${encodeURIComponent(url)}-retire.json`

    const hostFolder = config.reportFilePath
    const filePath = path.resolve(config.reportFilePath, safeFileName)

    // Container path for linux (forward slashes)
    const containerFolder = "/app/reports"

    // TODO: Hardcoded image value, figure out way to import it dynamically
    const command = `docker run --rm --mount type=bind,source=${hostFolder},target=${containerFolder} sha256:18e1c99d1a39f698d04505eb274dea01ffd4b0910f21a9f347f02838892bbd7c --sbom-file ${containerFolder}/${safeFileName} ${url}`

    console.log(`Starting Retire scan for: ${url}`)

    // Increase maxBuffer in case the JSON is large
    const { stdout } = await execPromise(command, {
      maxBuffer: 1024 * 1024 * 10,
    })
    console.log(
      `Scan complete. JSON saved to ${path.join(hostFolder, safeFileName)}`,
    )

    const report = await readFile(filePath, "utf8")
    return JSON.parse(report)
  } catch (error) {
    console.log(error)
    // TODO: implement some sort of logging system
  }
}

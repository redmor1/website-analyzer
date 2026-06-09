import path from "node:path"

import { config } from "../../config.js"
import { execPromise } from "../../utils/exec.js"
import { getSafeFilename } from "../../utils/filenames.js"

export async function runNucleiScan(url: string, cacheTemplates: boolean) {
  try {
    const safeFileName = getSafeFilename(url, "nuclei")

    const hostFolder = config.reportFilePath
    const containerFolder = "/app/reports"

    // Start with the mandatory report output mount
    let mountFlags = `--mount type=bind,source="${hostFolder}",target=${containerFolder}`

    // Conditionally add the template cache mount based on the toggle
    if (cacheTemplates) {
      const templatesHostFolder = path.resolve("./nuclei-templates")
      const containerTemplatesFolder = "/root/nuclei-templates"
      mountFlags += ` --mount type=bind,source="${templatesHostFolder}",target=${containerTemplatesFolder}`
    }

    // Docker command + bind mount + template caching (so it doesn't hit github rate-limit downloading over and over)
    const command = `docker run --rm ${mountFlags} projectdiscovery/nuclei:latest -u ${url} -je ${containerFolder}/${safeFileName} -silent`

    console.log(
      `Starting Nuclei scan for: ${url} [Cache Templates: ${String(cacheTemplates)}]`,
    )

    const { stdout, stderr } = await execPromise(command, {
      maxBuffer: 1024 * 1024 * 10,
    })

    console.log(
      `Scan complete. JSON saved to ${path.join(hostFolder, safeFileName)}`,
    )
  } catch (error) {
    console.error("Nuclei scan failed:", error)
  }
}

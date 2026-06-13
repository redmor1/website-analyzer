import path from "node:path"

import { config } from "../../config.js"
import { spawnPromise } from "../../utils/exec.js"
import { getSafeFilename } from "../../utils/filenames.js"

export async function runNucleiScan(url: string, cacheTemplates: boolean) {
  try {
    const safeFileName = getSafeFilename(url, "nuclei")

    const hostFolder = config.reportFilePath
    const containerFolder = "/app/reports"

    const commandArguments = [
      "run",
      "--rm",
      "--mount",
      `type=bind,source=${hostFolder},target=${containerFolder}`,
    ]

    // Conditionally add the template cache mount based on the toggle
    if (cacheTemplates) {
      const templatesHostFolder = path.resolve("./nuclei-templates")
      const containerTemplatesFolder = "/root/nuclei-templates"

      commandArguments.push(
        "--mount",
        `type=bind,source=${templatesHostFolder},target=${containerTemplatesFolder}`,
      )
    }

    // Add the target image and the application-specific arguments
    commandArguments.push(
      "projectdiscovery/nuclei:latest",
      "-u",
      url,
      "-je",
      `${containerFolder}/${safeFileName}`,
      "-silent",
    )

    console.log(
      `Starting Nuclei scan for: ${url} [Cache Templates: ${String(cacheTemplates)}]`,
    )
    // Assuming spawnPromise takes (command, args, options)
    await spawnPromise("docker", commandArguments)

    console.log(
      `Scan complete. JSON saved to ${path.join(hostFolder, safeFileName)}`,
    )
  } catch (error) {
    console.error("Nuclei scan failed:", error)
  }
}

import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { config } from "../../config.js"
import { spawnPromise } from "../../utils/exec.js"
import { getSafeFilename } from "../../utils/filenames.js"

export async function runObservatoryScan(url: string) {
  try {
    let targetHost = url
    try {
      targetHost = new URL(url).hostname
    } catch (error) {
      console.error(error)
    }

    const JsonFilename = getSafeFilename(url, "observatory")
    const hostFolder = config.reportFilePath
    const containerFolder = "/app/reports"

    const finalJsonFilePath = path.join(hostFolder, JsonFilename)

    const commandArguments = [
      "run",
      "--rm",
      "--mount",
      `type=bind,source=${hostFolder},target=${containerFolder}`,
      "observatory-local:latest",

      `mdn-http-observatory-scan ${targetHost} > ${containerFolder}/${JsonFilename} || true`,
    ]

    console.log(`Starting observatory scan for: ${targetHost}`)

    try {
      await spawnPromise("docker", commandArguments)

      // Read and re-parse to ensure valid JSON, stripping any potential CLI warnings printed before the '{'
      const rawData = await readFile(finalJsonFilePath, "utf8")
      const jsonStart = rawData.indexOf("{")
      const cleanJson = rawData.slice(jsonStart)

      const jsonObject = JSON.parse(cleanJson) as Record<string, unknown>
      await writeFile(finalJsonFilePath, JSON.stringify(jsonObject))
    } catch (error) {
      console.error("Observatory scan failed:", error)
      throw error
    }

    console.log(`Scan complete. Observatory JSON saved to ${finalJsonFilePath}`)
  } catch (error) {
    console.error("Observatory setup failed:", error)
  }
}

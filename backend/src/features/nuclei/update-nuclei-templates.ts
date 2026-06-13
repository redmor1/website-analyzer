import { config } from "../../config.js"
import { spawnPromise } from "../../utils/exec.js"

export async function updateNucleiTemplates() {
  const templatesHostFolder = config.nucleiTemplatesPath
  const containerTemplatesFolder = "/root/nuclei-templates"

  const commandArguments = [
    "run",
    "--rm",
    "--mount",
    `type=bind,source=${templatesHostFolder},target=${containerTemplatesFolder}`,
    "projectdiscovery/nuclei:latest",
    "-ut", // -ut for updating templates
  ]

  await spawnPromise("docker", commandArguments)
  console.log("Nuclei templates updated successfully.")
}

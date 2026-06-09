import { config } from "../../config.js"
import { execPromise } from "../../utils/exec.js"

export async function updateNucleiTemplates() {
  const templatesHostFolder = config.nucleiTemplatesPath
  const containerTemplatesFolder = "/root/nuclei-templates"

  // Notice we use '-ut' (update templates) instead of '-u' (URL)
  const command = `docker run --rm \
    --mount type=bind,source="${templatesHostFolder}",target=${containerTemplatesFolder} \
    projectdiscovery/nuclei:latest -ut`

  await execPromise(command)
  console.log("Nuclei templates updated successfully.")
}

import path from "node:path"
import { z } from "zod"

// validating env variables
const environmentSchema = z.object({
  NUCLEI_TEMPLATES_PATH: z
    .string()
    .min(1, "NUCLEI_TEMPLATES_PATH is required in .env")
    .transform((value) => path.resolve(process.cwd(), value)),
  REPORT_FILE_PATH: z
    .string()
    .min(1, "REPORT_FILE_PATH is required in .env")
    .transform((value) => path.resolve(process.cwd(), value)),
})

// parsing them
const environmentVariables = environmentSchema.parse(process.env)

export const config = {
  nucleiTemplatesPath: environmentVariables.NUCLEI_TEMPLATES_PATH,
  reportFilePath: environmentVariables.REPORT_FILE_PATH,
}

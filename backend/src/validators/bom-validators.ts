import z from "zod"

import type { CycloneDXSoftwareBillOfMaterialsStandard } from "../types/cyclone-types.js"

import cycloneDxSchema from "../schemas/bom-1.4.schema-modified.json" with { type: "json" }

type ZodJsonSchema = Parameters<typeof z.fromJSONSchema>[0]

// TODO: check since this is exporting types, maybe it sohuld go to types folder? instead of validators? research how to section these out
// NOTE: fromJSONSchema is highly experimental as of v4, so liable to break when updating zod
export const bomValidator = z.fromJSONSchema(
  cycloneDxSchema as ZodJsonSchema,
) as z.ZodType<CycloneDXSoftwareBillOfMaterialsStandard>

export type CycloneDxBom = z.infer<typeof bomValidator>

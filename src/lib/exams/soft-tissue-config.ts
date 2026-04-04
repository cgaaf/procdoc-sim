import type { ExamConfig } from "$lib/types/exam-config";
import { softTissueProcdocDefinition } from "$lib/data/procdoc-definitions";
import { buildSoftTissueNote } from "$lib/logic/note-assembler";

export const softTissueConfig: ExamConfig = {
  type: "soft_tissue",
  slug: "soft-tissue",
  displayName: "Soft Tissue",
  definition: softTissueProcdocDefinition,
  templateParts: [],
  buildNote: buildSoftTissueNote,
  showRepeatProcedure: true,
  interpretation: { kind: "none" },
  presets: [],
};

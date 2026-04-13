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
  interpretation: { kind: "buttons", macroId: "st_interp", options: ["Normal", "Abscess identified", "Cellulitis without abscess", "Foreign body identified", "Indeterminate"] },
  presets: [
    {
      label: "Normal",
      apply: (state) => {
        state.macroSelections.setIfEmpty("st_collection", "No fluid collection");
        state.macroSelections.setIfEmpty("st_foreign_body", "Not visualized");
        state.macroSelections.setIfEmpty("st_cobblestone", "Absent");
        state.macroSelections.setIfEmpty("st_interp", "Normal");
      },
    },
    {
      label: "Abscess",
      apply: (state) => {
        state.macroSelections.setIfEmpty("st_collection", "Present - drainable");
        state.macroSelections.setIfEmpty("st_cobblestone", "Present");
        state.macroSelections.setIfEmpty("st_interp", "Abscess identified");
      },
    },
    {
      label: "Cellulitis",
      apply: (state) => {
        state.macroSelections.setIfEmpty("st_collection", "No fluid collection");
        state.macroSelections.setIfEmpty("st_cobblestone", "Present");
        state.macroSelections.setIfEmpty("st_interp", "Cellulitis without abscess");
      },
    },
  ],
};

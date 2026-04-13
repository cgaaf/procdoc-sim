import type { ExamConfig } from "$lib/types/exam-config";
import { gallbladderProcdocDefinition } from "$lib/data/procdoc-definitions";
import { buildGallbladderNote } from "$lib/logic/note-assembler";

export const gallbladderConfig: ExamConfig = {
  type: "gallbladder",
  slug: "gallbladder",
  displayName: "Gallbladder",
  definition: gallbladderProcdocDefinition,
  templateParts: [],
  buildNote: buildGallbladderNote,
  showRepeatProcedure: true,
  interpretation: { kind: "buttons", macroId: "gb_interp", options: ["Normal", "Cholelithiasis without cholecystitis", "Acute cholecystitis", "Indeterminate"] },
  presets: [
    {
      label: "Normal",
      apply: (state) => {
        state.macroSelections.setIfEmpty("gb_stones", "No stones");
        state.macroSelections.setIfEmpty("gb_wall", "Normal (≤3 mm)");
        state.macroSelections.setIfEmpty("gb_fluid", "Absent");
        state.macroSelections.setIfEmpty("gb_murphys", "Negative");
        state.macroSelections.setIfEmpty("gb_cbd", "Normal (≤6 mm)");
        state.macroSelections.setIfEmpty("gb_interp", "Normal");
      },
    },
    {
      label: "Cholelithiasis",
      apply: (state) => {
        state.macroSelections.setIfEmpty("gb_stones", "Present");
        state.macroSelections.setIfEmpty("gb_wall", "Normal (≤3 mm)");
        state.macroSelections.setIfEmpty("gb_fluid", "Absent");
        state.macroSelections.setIfEmpty("gb_murphys", "Negative");
        state.macroSelections.setIfEmpty("gb_interp", "Cholelithiasis without cholecystitis");
      },
    },
    {
      label: "Cholecystitis",
      apply: (state) => {
        state.macroSelections.setIfEmpty("gb_stones", "Present");
        state.macroSelections.setIfEmpty("gb_wall", "Thickened (>3 mm)");
        state.macroSelections.setIfEmpty("gb_fluid", "Present");
        state.macroSelections.setIfEmpty("gb_murphys", "Positive");
        state.macroSelections.setIfEmpty("gb_interp", "Acute cholecystitis");
      },
    },
  ],
};

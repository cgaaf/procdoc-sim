import type { ExamConfig } from "$lib/types/exam-config";
import { obstetricProcdocDefinition } from "$lib/data/procdoc-definitions";
import { buildObstetricNote } from "$lib/logic/note-assembler";

export const obstetricConfig: ExamConfig = {
  type: "obstetric",
  slug: "obstetric",
  displayName: "OB/Pelvic",
  definition: obstetricProcdocDefinition,
  templateParts: [],
  buildNote: buildObstetricNote,
  showRepeatProcedure: true,
  interpretation: { kind: "buttons", macroId: "ob_interp", options: ["IUP confirmed", "No IUP identified", "Ectopic pregnancy concern", "Indeterminate"] },
  presets: [
    {
      label: "IUP Confirmed",
      apply: (state) => {
        state.macroSelections.setIfEmpty("ob_iup", "Definite IUP");
        state.macroSelections.setIfEmpty("ob_fhr", "Present");
        state.macroSelections.setIfEmpty("ob_number", "Singleton");
        state.macroSelections.setIfEmpty("ob_free_fluid", "Absent");
        state.macroSelections.setIfEmpty("ob_adnexal", "Not visualized");
        state.macroSelections.setIfEmpty("ob_interp", "IUP confirmed");
      },
    },
    {
      label: "No IUP",
      apply: (state) => {
        state.macroSelections.setIfEmpty("ob_iup", "No IUP visualized");
        state.macroSelections.setIfEmpty("ob_adnexal", "Not visualized");
        state.macroSelections.setIfEmpty("ob_free_fluid", "Absent");
        state.macroSelections.setIfEmpty("ob_interp", "No IUP identified");
      },
    },
    {
      label: "Ectopic Concern",
      apply: (state) => {
        state.macroSelections.setIfEmpty("ob_iup", "No IUP visualized");
        state.macroSelections.setIfEmpty("ob_interp", "Ectopic pregnancy concern");
      },
    },
  ],
};

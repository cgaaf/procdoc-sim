import type { ExamConfig } from "$lib/types/exam-config";
import type { ExamState } from "$lib/state/exam-state.svelte";
import { dvtProcdocDefinition } from "$lib/data/procdoc-definitions";
import { dvtTemplate } from "$lib/data/template-data";
import { parseTemplate } from "$lib/logic/template-parser";
import { buildDvtNote } from "$lib/logic/note-assembler";

const DVT_LEFT_VESSEL_IDS = ["dvt_cfv_left", "dvt_sfj_left", "dvt_pop_left"];
const DVT_RIGHT_VESSEL_IDS = ["dvt_cfv_right", "dvt_sfj_right", "dvt_pop_right"];
const DVT_ALL_VESSEL_IDS = [...DVT_LEFT_VESSEL_IDS, ...DVT_RIGHT_VESSEL_IDS];

function updateDvtInterpretation(state: ExamState) {
  const documented = DVT_ALL_VESSEL_IDS.map((id) => state.macroSelections.get(id)).filter(
    (v): v is string => v != null && v !== "Not obtained",
  );

  if (documented.length === 0) {
    state.macroSelections.set("dvt_interp", null);
    return;
  }

  if (
    documented.some((v) => v === "Clot seen within the vein" || v === "Incompletely compressible")
  ) {
    state.macroSelections.set("dvt_interp", "Positive for DVT");
  } else if (documented.every((v) => v === "Completely compressible")) {
    state.macroSelections.set("dvt_interp", "Negative for DVT");
  } else {
    state.macroSelections.set("dvt_interp", null);
  }
}

export const dvtConfig: ExamConfig = {
  type: "dvt",
  slug: "dvt",
  displayName: "DVT",
  definition: dvtProcdocDefinition,
  templateParts: parseTemplate(dvtTemplate),
  buildNote: buildDvtNote,
  showRepeatProcedure: false,
  interpretation: { kind: "buttons", macroId: "dvt_interp", options: ["Negative for DVT", "Positive for DVT", "Indeterminate"] },
  presets: [
    {
      label: "Normal Left",
      apply: (state) => {
        for (const id of DVT_LEFT_VESSEL_IDS) {
          state.macroSelections.setIfEmpty(id, "Completely compressible");
        }
        updateDvtInterpretation(state);
      },
    },
    {
      label: "Normal Right",
      apply: (state) => {
        for (const id of DVT_RIGHT_VESSEL_IDS) {
          state.macroSelections.setIfEmpty(id, "Completely compressible");
        }
        updateDvtInterpretation(state);
      },
    },
    {
      label: "Normal Bilateral",
      apply: (state) => {
        for (const id of DVT_ALL_VESSEL_IDS) {
          state.macroSelections.setIfEmpty(id, "Completely compressible");
        }
        updateDvtInterpretation(state);
      },
    },
  ],
  onMacroChange: (macroId, state) => {
    if (macroId !== "dvt_interp") updateDvtInterpretation(state);
  },
};

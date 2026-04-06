import type { ExamConfig } from "$lib/types/exam-config";
import type { ExamState } from "$lib/state/exam-state.svelte";
import { echolungProcdocDefinition } from "$lib/data/procdoc-definitions";
import { buildEchoLungNote } from "$lib/logic/note-assembler";

function onMacroChange(macroId: string, state: ExamState) {
  // Clear conditional fields when pericardium is no longer "Present"
  if (macroId === "echo_pericardium") {
    const pericardium = state.macroSelections.get("echo_pericardium");
    if (pericardium !== "Present") {
      state.macroSelections.set("echo_pericardium_size", null);
      state.macroSelections.setComment("echo_pericardium_size", "");
      state.macroSelections.set("echo_tamponade", null);
    }
  }
}

export const echolungConfig: ExamConfig = {
  type: "echolung",
  slug: "cardiac-lung",
  displayName: "Cardiac/Lung",
  definition: echolungProcdocDefinition,
  templateParts: [],
  buildNote: buildEchoLungNote,
  showRepeatProcedure: true,
  interpretation: {
    kind: "buttonsMulti",
    macroId: "echo_interp",
    options: [
      "Normal cardiac and lung exam",
      "Reduced LV systolic function",
      "RV dilation/strain",
      "Pericardial effusion",
      "Cardiac tamponade",
      "Cardiac standstill",
      "Pulmonary edema",
      "Pleural effusion",
      "Pneumothorax",
      "Consolidation",
      "Volume depletion",
      "Volume overload",
      "Indeterminate",
    ],
    exclusiveOptions: new Set([
      "Normal cardiac and lung exam",
      "Cardiac standstill",
      "Indeterminate",
    ]),
  },
  presets: [],
  onMacroChange,
};

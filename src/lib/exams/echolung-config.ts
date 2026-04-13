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
  presets: [
    {
      label: "Normal Cardiac",
      apply: (state) => {
        state.macroSelections.setIfEmpty("echo_cardiac_activity", "Present");
        state.macroSelections.setIfEmpty("echo_lv", "Normal");
        state.macroSelections.setIfEmpty("echo_rv", "Normal");
        state.macroSelections.setIfEmpty("echo_pericardium", "Absent");
        state.macroSelections.setIfEmpty("echo_ivc", "Normal");
        state.macroSelections.setMultiIfEmpty(
          "echo_cardiac_views",
          new Set(["Parasternal Long", "Apical 4-Chamber", "Subxiphoid", "IVC"]),
        );
      },
    },
    {
      label: "Normal Lung",
      apply: (state) => {
        state.macroSelections.setIfEmpty("echo_lung_sliding_left", "Present");
        state.macroSelections.setMultiIfEmpty("echo_lung_left", new Set(["A-lines (normal)"]));
        state.macroSelections.setIfEmpty("echo_lung_sliding_right", "Present");
        state.macroSelections.setMultiIfEmpty("echo_lung_right", new Set(["A-lines (normal)"]));
      },
    },
    {
      label: "Normal Cardiac & Lung",
      apply: (state) => {
        state.macroSelections.setIfEmpty("echo_cardiac_activity", "Present");
        state.macroSelections.setIfEmpty("echo_lv", "Normal");
        state.macroSelections.setIfEmpty("echo_rv", "Normal");
        state.macroSelections.setIfEmpty("echo_pericardium", "Absent");
        state.macroSelections.setIfEmpty("echo_ivc", "Normal");
        state.macroSelections.setMultiIfEmpty(
          "echo_cardiac_views",
          new Set(["Parasternal Long", "Apical 4-Chamber", "Subxiphoid", "IVC"]),
        );
        state.macroSelections.setIfEmpty("echo_lung_sliding_left", "Present");
        state.macroSelections.setMultiIfEmpty("echo_lung_left", new Set(["A-lines (normal)"]));
        state.macroSelections.setIfEmpty("echo_lung_sliding_right", "Present");
        state.macroSelections.setMultiIfEmpty("echo_lung_right", new Set(["A-lines (normal)"]));
        state.macroSelections.setMultiIfEmpty(
          "echo_interp",
          new Set(["Normal cardiac and lung exam"]),
        );
      },
    },
    {
      label: "Pulmonary Edema",
      apply: (state) => {
        state.macroSelections.setMultiIfEmpty("echo_lung_left", new Set(["B-lines (≥3 per field)"]));
        state.macroSelections.setMultiIfEmpty(
          "echo_lung_right",
          new Set(["B-lines (≥3 per field)"]),
        );
        state.macroSelections.setMultiIfEmpty("echo_interp", new Set(["Pulmonary edema"]));
      },
    },
    {
      label: "Reduced LV",
      apply: (state) => {
        state.macroSelections.setIfEmpty("echo_lv", "Reduced");
        state.macroSelections.setMultiIfEmpty(
          "echo_interp",
          new Set(["Reduced LV systolic function"]),
        );
      },
    },
  ],
  onMacroChange,
};

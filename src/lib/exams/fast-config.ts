import type { ExamConfig } from "$lib/types/exam-config";
import type { ExamState } from "$lib/state/exam-state.svelte";
import { fastProcdocDefinition } from "$lib/data/procdoc-definitions";
import { fastTemplate } from "$lib/data/template-data";
import { parseTemplate } from "$lib/logic/template-parser";
import { buildFastNote } from "$lib/logic/note-assembler";

// ─── FAST interpretation helpers ──────────────────────────────────

function hasAnyPositiveFinding(state: ExamState): boolean {
  const m3 = state.macroSelections.get("macro_3");
  const m3b = state.macroSelections.get("macro_3b");
  if (m3 === "Positive" || m3b === "Positive") return true;

  const m4 = state.macroSelections.get("macro_4");
  const m5 = state.macroSelections.get("macro_5");
  const m6 = state.macroSelections.get("macro_6");
  if (m4 === "Positive" || m5 === "Positive" || m6 === "Positive") return true;

  const left = state.macroSelections.getMulti("macro_7_left");
  const right = state.macroSelections.getMulti("macro_7_right");
  if (
    left.has("Pneumothorax") ||
    left.has("Hemothorax") ||
    right.has("Pneumothorax") ||
    right.has("Hemothorax")
  ) {
    return true;
  }

  return false;
}

function hasAnyIndeterminateFinding(state: ExamState): boolean {
  for (const id of ["macro_3", "macro_3b", "macro_4", "macro_5", "macro_6"]) {
    if (state.macroSelections.get(id) === "Indeterminate") return true;
  }
  if (state.macroSelections.getMulti("macro_7_left").has("Indeterminate")) return true;
  if (state.macroSelections.getMulti("macro_7_right").has("Indeterminate")) return true;
  return false;
}

function isCardiacNegative(state: ExamState): boolean {
  const m3 = state.macroSelections.get("macro_3");
  const m3b = state.macroSelections.get("macro_3b");
  return m3 === "Negative" || m3b === "Negative";
}

function isAbdominalAllNegative(state: ExamState): boolean {
  return (
    state.macroSelections.get("macro_4") === "Negative" &&
    state.macroSelections.get("macro_5") === "Negative" &&
    state.macroSelections.get("macro_6") === "Negative"
  );
}

function isLungAllNegative(state: ExamState): boolean {
  const left = state.macroSelections.getMulti("macro_7_left");
  const right = state.macroSelections.getMulti("macro_7_right");
  return (
    left.size === 1 &&
    left.has("Normal Lung Slide") &&
    right.size === 1 &&
    right.has("Normal Lung Slide")
  );
}

function updateFastInterpretation(state: ExamState) {
  if (hasAnyPositiveFinding(state)) {
    state.macroSelections.set("macro_8", "Positive FAST");
  } else if (hasAnyIndeterminateFinding(state)) {
    state.macroSelections.set("macro_8", "Indeterminate FAST");
  } else if (
    isCardiacNegative(state) &&
    isAbdominalAllNegative(state) &&
    isLungAllNegative(state)
  ) {
    state.macroSelections.set("macro_8", "E-FAST Negative x 5");
  } else if (isCardiacNegative(state) && isAbdominalAllNegative(state)) {
    state.macroSelections.set("macro_8", "FAST Negative x 4");
  } else {
    state.macroSelections.set("macro_8", null);
  }
}

function syncViewsFromFindings(state: ExamState) {
  const left = state.macroSelections.getMulti("macro_7_left");
  const right = state.macroSelections.getMulti("macro_7_right");
  const hasLungs = left.size > 0 || right.size > 0;

  if (hasLungs) {
    state.macroSelections.set("macro_1", "All E FAST Views");
    state.macroSelections.set("macro_2", "Was");
  } else {
    state.macroSelections.set("macro_1", "All FAST Views");
    state.macroSelections.set("macro_2", "was NOT");
  }
}

// ─── Override presets (overwrite) ─────────────────────────────────

function applyNegativeFAST4(state: ExamState) {
  state.macroSelections.set("macro_3", "Negative");
  state.macroSelections.set("macro_4", "Negative");
  state.macroSelections.set("macro_5", "Negative");
  state.macroSelections.set("macro_6", "Negative");
  updateFastInterpretation(state);
  syncViewsFromFindings(state);
}

function applyNegativeEFAST5(state: ExamState) {
  state.macroSelections.set("macro_3", "Negative");
  state.macroSelections.set("macro_4", "Negative");
  state.macroSelections.set("macro_5", "Negative");
  state.macroSelections.set("macro_6", "Negative");
  state.macroSelections.setMulti("macro_7_left", new Set(["Normal Lung Slide"]));
  state.macroSelections.setMulti("macro_7_right", new Set(["Normal Lung Slide"]));
  updateFastInterpretation(state);
  syncViewsFromFindings(state);
}

// ─── Config ───────────────────────────────────────────────────────

export const fastConfig: ExamConfig = {
  type: "fast",
  slug: "fast",
  displayName: "FAST",
  definition: fastProcdocDefinition,
  templateParts: parseTemplate(fastTemplate),
  buildNote: buildFastNote,
  showRepeatProcedure: true,
  interpretation: {
    kind: "fast",
    applyNegativeFAST4,
    applyNegativeEFAST5,
  },
  presets: [
    {
      label: "Normal Cardiac",
      apply: (state) => {
        state.macroSelections.setIfEmpty("macro_3", "Negative");
        updateFastInterpretation(state);
        syncViewsFromFindings(state);
      },
    },
    {
      label: "Normal Lung",
      apply: (state) => {
        state.macroSelections.setMultiIfEmpty("macro_7_left", new Set(["Normal Lung Slide"]));
        state.macroSelections.setMultiIfEmpty("macro_7_right", new Set(["Normal Lung Slide"]));
        updateFastInterpretation(state);
        syncViewsFromFindings(state);
      },
    },
    {
      label: "Normal Abdomen",
      apply: (state) => {
        state.macroSelections.setIfEmpty("macro_4", "Negative");
        state.macroSelections.setIfEmpty("macro_5", "Negative");
        state.macroSelections.setIfEmpty("macro_6", "Negative");
        updateFastInterpretation(state);
        syncViewsFromFindings(state);
      },
    },
    {
      label: "Normal FAST",
      apply: (state) => {
        state.macroSelections.setIfEmpty("macro_3", "Negative");
        state.macroSelections.setIfEmpty("macro_4", "Negative");
        state.macroSelections.setIfEmpty("macro_5", "Negative");
        state.macroSelections.setIfEmpty("macro_6", "Negative");
        updateFastInterpretation(state);
        syncViewsFromFindings(state);
      },
    },
    {
      label: "Normal E-FAST",
      apply: (state) => {
        state.macroSelections.setIfEmpty("macro_3", "Negative");
        state.macroSelections.setIfEmpty("macro_4", "Negative");
        state.macroSelections.setIfEmpty("macro_5", "Negative");
        state.macroSelections.setIfEmpty("macro_6", "Negative");
        state.macroSelections.setMultiIfEmpty("macro_7_left", new Set(["Normal Lung Slide"]));
        state.macroSelections.setMultiIfEmpty("macro_7_right", new Set(["Normal Lung Slide"]));
        updateFastInterpretation(state);
        syncViewsFromFindings(state);
      },
    },
  ],
  onMacroChange: (macroId, state) => {
    if (macroId !== "macro_8") updateFastInterpretation(state);
    syncViewsFromFindings(state);
  },
};

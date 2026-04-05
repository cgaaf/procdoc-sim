import type { ExamConfig } from "$lib/types/exam-config";
import { echolungProcdocDefinition } from "$lib/data/procdoc-definitions";
import { buildEchoLungNote } from "$lib/logic/note-assembler";

export const echolungConfig: ExamConfig = {
  type: "echolung",
  slug: "cardiac-lung",
  displayName: "Cardiac/Lung",
  definition: echolungProcdocDefinition,
  templateParts: [],
  buildNote: buildEchoLungNote,
  showRepeatProcedure: true,
  interpretation: { kind: "buttons", macroId: "echo_interp", options: ["Normal", "Abnormal cardiac findings", "Abnormal lung findings", "Indeterminate"] },
  presets: [],
};

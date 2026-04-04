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
  interpretation: { kind: "none" },
  presets: [],
};
